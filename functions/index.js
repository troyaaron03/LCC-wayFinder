const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { defineString } = require("firebase-functions/params");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const db = getFirestore();
const webApiKey = defineString("FIREBASE_WEB_API_KEY");

exports.signInWithStudentNumber = onCall(async (request) => {
  const studentNumber = String(request.data?.studentNumber || "").trim();
  const password = request.data?.password;
  if (!/^\d{8}$/.test(studentNumber) || typeof password !== "string" || !password) {
    throw new HttpsError("invalid-argument", "Enter a valid student number and password.");
  }

  const mapping = await db.collection("studentNumbers").doc(studentNumber).get();
  const userId = mapping.exists ? mapping.data().userId : "";
  let email = `unknown-${studentNumber}@invalid.invalid`;

  if (typeof userId === "string" && userId) {
    const profile = await db.collection("users").doc(userId).get();
    const profileData = profile.exists ? profile.data() : null;
    if (profileData?.role === "student" &&
        profileData.studentNumber === studentNumber &&
        typeof profileData.email === "string") {
      email = profileData.email;
    }
  }

  let response;
  try {
    response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(webApiKey.value())}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );
  } catch (error) {
    console.error("Firebase password verification request failed:", error);
    throw new HttpsError("unavailable", "Sign-in is temporarily unavailable.");
  }

  if (!response.ok) {
    throw new HttpsError("unauthenticated", "Incorrect student number or password.");
  }

  const authData = await response.json();
  if (!userId || authData.localId !== userId) {
    throw new HttpsError("unauthenticated", "Incorrect student number or password.");
  }

  const customToken = await getAuth().createCustomToken(userId, {
    studentNumberLogin: true
  });
  return { customToken };
});

exports.completeStudentNumberSetup = onCall(async (request) => {
  const studentNumber = String(request.data?.studentNumber || "").trim();
  const userId = request.auth?.uid;
  if (!userId || !/^\d{8}$/.test(studentNumber)) {
    throw new HttpsError("invalid-argument", "Enter a valid 8-digit student number.");
  }

  const authUser = await getAuth().getUser(userId);
  if (!authUser.email) {
    throw new HttpsError("failed-precondition", "This account needs an email address before setup.");
  }

  const userRef = db.collection("users").doc(userId);
  const numberRef = db.collection("studentNumbers").doc(studentNumber);
  await db.runTransaction(async (transaction) => {
    const [profile, numberRecord] = await Promise.all([
      transaction.get(userRef),
      transaction.get(numberRef)
    ]);

    if (numberRecord.exists && numberRecord.data().userId !== userId) {
      throw new HttpsError("already-exists", "That student number is linked to another account.");
    }

    if (profile.exists) {
      const profileData = profile.data();
      if (profileData.role !== "student" ||
          (profileData.studentNumber && profileData.studentNumber !== studentNumber)) {
        throw new HttpsError("failed-precondition", "This account cannot be linked to that student number.");
      }
      if (!profileData.studentNumber) {
        transaction.update(userRef, { studentNumber });
      }
    } else {
      transaction.set(userRef, {
        email: authUser.email,
        role: "student",
        studentNumber,
        createdAt: new Date()
      });
    }

    if (!numberRecord.exists) {
      transaction.set(numberRef, { userId });
    }
  });

  return { studentNumber };
});

async function getAccountManagerRole(userId) {
  if (!userId) {
    throw new HttpsError("unauthenticated", "Sign in before managing user accounts.");
  }
  const profile = await db.collection("users").doc(userId).get();
  const role = profile.exists ? profile.data().role : "";
  if (role !== "admin" && role !== "superadmin") {
    throw new HttpsError("permission-denied", "Administrator access is required.");
  }
  return role;
}

function getAuthAdminError(error, action) {
  if (error.code === "auth/insufficient-permission") {
    return new HttpsError(
      "failed-precondition",
      `The Cloud Functions runtime service account needs the Firebase Authentication Admin role (roles/firebaseauth.admin) to ${action}. Grant the role in Google Cloud IAM, then redeploy the functions.`
    );
  }
  if (error.code === "auth/user-not-found") {
    return new HttpsError("not-found", "This Firebase Authentication account no longer exists. Refresh the account list.");
  }
  console.error(`Firebase Authentication ${action} failed:`, error);
  return new HttpsError("internal", `Could not ${action}. Check the Cloud Functions logs.`);
}

exports.listUserAccounts = onCall(async (request) => {
  await getAccountManagerRole(request.auth?.uid);
  const pageToken = typeof request.data?.pageToken === "string" ? request.data.pageToken : undefined;
  let result;
  try {
    result = await getAuth().listUsers(100, pageToken);
  } catch (error) {
    throw getAuthAdminError(error, "list Firebase Authentication accounts");
  }

  try {
    const profiles = await db.getAll(...result.users.map((user) => db.collection("users").doc(user.uid)));

    return {
      accounts: result.users.map((user, index) => {
        const profile = profiles[index];
        return {
          uid: user.uid,
          email: user.email || "",
          role: profile?.exists && ["student", "visitor", "faculty", "admin", "superadmin"].includes(profile.data().role)
            ? profile.data().role
            : "student",
          studentNumber: profile?.exists ? profile.data().studentNumber || "" : ""
        };
      }),
      nextPageToken: result.pageToken || null
    };
  } catch (error) {
    console.error("Could not load account profiles:", error);
    throw new HttpsError("internal", "Could not load account profiles from Firestore.");
  }
});

exports.setUserAccountRole = onCall(async (request) => {
  const actorId = request.auth?.uid;
  const managerRole = await getAccountManagerRole(actorId);
  const targetId = String(request.data?.userId || "");
  const nextRole = String(request.data?.role || "");
  if (!targetId || !["admin", "superadmin", "student", "visitor", "faculty"].includes(nextRole)) {
    throw new HttpsError("invalid-argument", "Choose a valid user account and role.");
  }
  if (targetId === actorId) {
    throw new HttpsError("failed-precondition", "You cannot change your own account role.");
  }
  if (managerRole !== "superadmin" && !["student", "visitor", "faculty"].includes(nextRole)) {
    throw new HttpsError("permission-denied", "Only a superadmin can assign admin or superadmin roles.");
  }

  const targetAuth = await getAuth().getUser(targetId);
  const targetRef = db.collection("users").doc(targetId);
  await db.runTransaction(async (transaction) => {
    const profile = await transaction.get(targetRef);
    const numberRef = profile.data()?.studentNumber
      ? db.collection("studentNumbers").doc(profile.data().studentNumber)
      : null;
    const numberRecord = numberRef ? await transaction.get(numberRef) : null;
    if (profile.data()?.role === "superadmin" && nextRole !== "superadmin") {
      const superadmins = await transaction.get(
        db.collection("users").where("role", "==", "superadmin")
      );
      if (superadmins.size <= 1) {
        throw new HttpsError("failed-precondition", "The last superadmin account cannot be demoted.");
      }
    }

    if (!profile.exists) {
      transaction.set(targetRef, {
        email: targetAuth.email || "",
        role: nextRole,
        createdAt: new Date()
      });
    } else {
      const changes = { role: nextRole, email: targetAuth.email || profile.data().email || "" };
      if (nextRole !== "student") changes.studentNumber = FieldValue.delete();
      transaction.update(targetRef, changes);
    }

    if (nextRole !== "student" && numberRef && numberRecord?.exists) {
      if (numberRecord.data().userId === targetId) {
        transaction.delete(numberRef);
      }
    }
  });

  return { userId: targetId, role: nextRole };
});

exports.deleteUserAccount = onCall(async (request) => {
  const actorId = request.auth?.uid;
  await getAccountManagerRole(actorId);
  const targetId = String(request.data?.userId || "");
  if (!targetId) {
    throw new HttpsError("invalid-argument", "Choose a user account to delete.");
  }
  if (targetId === actorId) {
    throw new HttpsError("failed-precondition", "You cannot delete your own account.");
  }

  try {
    await getAuth().getUser(targetId);
  } catch (error) {
    throw getAuthAdminError(error, "delete Firebase Authentication accounts");
  }
  const actorRef = db.collection("users").doc(actorId);
  const userRef = db.collection("users").doc(targetId);
  let deletedProfile = null;
  let deletedStudentNumbers = [];

  await db.runTransaction(async (transaction) => {
    const [actorProfile, profile] = await Promise.all([
      transaction.get(actorRef),
      transaction.get(userRef)
    ]);
    const currentManagerRole = actorProfile.exists ? actorProfile.data().role : "";
    if (!["admin", "superadmin"].includes(currentManagerRole)) {
      throw new HttpsError("permission-denied", "Administrator access is required.");
    }

    const profileData = profile.exists ? profile.data() : null;
    const targetRole = profileData?.role || "student";
    if (currentManagerRole !== "superadmin" &&
        ["admin", "superadmin"].includes(targetRole)) {
      throw new HttpsError("permission-denied", "Only a superadmin can delete admin or superadmin accounts.");
    }

    if (targetRole === "superadmin") {
      const superadmins = await transaction.get(
        db.collection("users").where("role", "==", "superadmin")
      );
      if (superadmins.size <= 1) {
        throw new HttpsError("failed-precondition", "The last superadmin account cannot be deleted.");
      }
    }

    const numberRecords = await transaction.get(
      db.collection("studentNumbers").where("userId", "==", targetId)
    );

    if (profile.exists) {
      deletedProfile = profileData;
      transaction.delete(userRef);
    }
    deletedStudentNumbers = numberRecords.docs.map((numberRecord) => ({
      number: numberRecord.id,
      data: numberRecord.data()
    }));
    numberRecords.docs.forEach((numberRecord) => transaction.delete(numberRecord.ref));
  });

  try {
    await getAuth().deleteUser(targetId);
  } catch (error) {
    try {
      await db.runTransaction(async (transaction) => {
        if (deletedProfile) transaction.set(userRef, deletedProfile);
        deletedStudentNumbers.forEach(({ number, data }) => {
          transaction.set(db.collection("studentNumbers").doc(number), data);
        });
      });
    } catch (rollbackError) {
      console.error("Could not restore account data after account deletion failed:", rollbackError);
      throw new HttpsError("internal", "Account deletion failed and profile data could not be restored. Contact support.");
    }
    throw getAuthAdminError(error, "delete Firebase Authentication accounts");
  }

  return { userId: targetId };
});
