import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { defaultRoomCoordinates } from "./campus-locations.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDuxFyTm3pYIsrO5i5ivTKZyM4SZYnpqM",
  authDomain: "campus-navigation-system-4292f.firebaseapp.com",
  projectId: "campus-navigation-system-4292f",
  storageBucket: "campus-navigation-system-4292f.firebasestorage.app",
  messagingSenderId: "1007485437799",
  appId: "1:1007485437799:web:d157f9c9ac7ff46d2591c2",
  measurementId: "G-RT9C1JGB58"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const modal = $("modal");
const form = $("form");
const title = $("title");
let currentUserAccounts = [];
let managerRole = "";
let visitReportRows = [];
let feedbackReportRows = [];
let reportGeneratorName = "";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  try {
    const profile = await getDoc(doc(db, "users", user.uid));
    if (!profile.exists() || !["admin", "superadmin"].includes(profile.data().role)) {
      alert("Admin access required.");
      await signOut(auth);
      location.href = "index.html";
      return;
    }
    if (profile.data().isActive === false) {
      await signOut(auth);
      location.href = "index.html?account=deactivated";
      return;
    }
    managerRole = profile.data().role;
    reportGeneratorName = profile.data().displayName ||
      profile.data().fullName ||
      profile.data().name ||
      user.displayName ||
      user.email ||
      "Admin account";
    $("users").querySelector("p").textContent =
      "Update eligible account roles, or deactivate/reactivate access to Campus Wayfinder.";
    loadFaculty();
    loadRooms();
    loadQrCodes();
    loadFeedback();
    loadTransactions();
    loadUserAccounts();
  } catch (error) {
    console.error(error);
    alert("Could not verify your admin profile. Check your Firestore rules.");
  }
});

$("logout").onclick = () => signOut(auth).then(() => location.href = "index.html");
$("close").onclick = () => modal.classList.add("hidden");
$("addFaculty").onclick = () => faculty();
$("addRoom").onclick = () => room();
$("addQrCode").onclick = () => qrCode();
$("refreshFeedback").onclick = () => loadFeedback();
$("downloadFeedbackReport").onclick = downloadFeedbackReport;
$("refreshTransactions").onclick = () => loadTransactions();
$("downloadVisitReport").onclick = downloadVisitReport;
$("refreshUsers").onclick = () => loadUserAccounts();

document.querySelectorAll(".admin-nav button").forEach((button) => {
  button.onclick = () => {
    showTab(button.dataset.tab);
  };
});

function showTab(tabId) {
  document.querySelectorAll(".admin-nav button").forEach((button) => {
    const active = button.dataset.tab === tabId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  document.querySelectorAll(".admin-main > section").forEach((section) => {
    section.classList.toggle("active", section.id === tabId);
  });
}

async function loadUserAccounts() {
  const list = $("userList");
  list.innerHTML = '<p class="empty-state">Loading account profiles…</p>';
  $("refreshUsers").disabled = true;
  try {
    const profiles = await getDocs(collection(db, "users"));
    currentUserAccounts = profiles.docs.map((profile) => {
      const data = profile.data();
      return {
        uid: profile.id,
        email: data.email || "",
        role: ["student", "visitor", "faculty", "admin", "superadmin"].includes(data.role)
          ? data.role
          : "student",
        studentNumber: data.studentNumber || "",
        isActive: data.isActive !== false
      };
    });
    renderUserAccounts();
  } catch (error) {
    console.error("Could not load account profiles from Firestore:", error);
    list.innerHTML = `<p class="error-text">Could not load account profiles. Check your Firestore rules and try refreshing. ${esc(error.message)}</p>`;
  } finally {
    $("refreshUsers").disabled = false;
  }
}

function renderUserAccounts() {
  const list = $("userList");
  if (!currentUserAccounts.length) {
    list.innerHTML = '<p class="empty-state">No registered user accounts were found.</p>';
    return;
  }

  const currentUid = auth.currentUser?.uid;
  list.innerHTML = currentUserAccounts.map((account) => {
    const isSuperadmin = account.role === "superadmin";
    const canManage = account.uid !== currentUid && !isSuperadmin &&
      (managerRole === "superadmin" ||
        ["student", "visitor", "faculty"].includes(account.role));
    const roles = managerRole === "superadmin"
      ? ["student", "visitor", "faculty", "admin"]
      : ["student", "visitor", "faculty"];
    return `<article class="account-row" role="listitem">
      <div class="account-identity">
        <span class="account-avatar" aria-hidden="true">${esc((account.email || "?").charAt(0).toUpperCase())}</span>
        <div class="account-identity-copy">
          <h3>${esc(account.email || "Email unavailable")}</h3>
          <span>${esc(account.studentNumber ? `Student number ${account.studentNumber}` : "No student number linked")}</span>
        </div>
      </div>
      <span class="account-role-badge">${esc(account.role)}</span>
      <span class="account-status ${account.isActive ? "active" : "inactive"}">${account.isActive ? "Active" : "Deactivated"}</span>
      <div class="account-management">
      ${canManage ? `<form class="account-role-form" data-user-id="${esc(account.uid)}">
        <label for="role-${esc(account.uid)}">Account role</label>
        <div class="account-controls">
          <select id="role-${esc(account.uid)}" name="role">
            ${roles.map((role) => `<option value="${role}" ${role === account.role ? "selected" : ""}>${role}</option>`).join("")}
          </select>
          <button type="submit" class="save-role-button">Save role</button>
        </div>
        <p class="account-action-message" role="status" aria-live="polite"></p>
      </form>
      <button type="button" class="toggle-account-button ${account.isActive ? "deactivate" : "reactivate"}" data-user-id="${esc(account.uid)}">${account.isActive ? "Deactivate" : "Reactivate"}</button>` : `<p class="user-account-readonly">${account.uid === currentUid ? "Your own account is protected." : isSuperadmin ? "Superadmin account is protected." : "Only a superadmin can manage this account."}</p>`}
      </div>
    </article>`;
  }).join("");

  list.querySelectorAll(".account-role-form").forEach((roleForm) => {
    roleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = roleForm.dataset.userId;
      const account = currentUserAccounts.find((item) => item.uid === userId);
      const role = roleForm.elements.role.value;
      const button = roleForm.querySelector("button");
      const message = roleForm.querySelector(".account-action-message");
      if (!account || role === account.role) {
        message.textContent = "Choose a different role first.";
        return;
      }

      button.disabled = true;
      message.textContent = "Saving role…";
      try {
        await updateDoc(doc(db, "users", userId), { role });
        message.textContent = "Role updated.";
        await loadUserAccounts();
      } catch (error) {
        console.error("Could not update account role:", error);
        message.textContent = error.code === "permission-denied"
          ? "Your account cannot assign that role."
          : `Could not update role: ${error.message}`;
        button.disabled = false;
      }
    });
  });

  list.querySelectorAll(".toggle-account-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.userId;
      const account = currentUserAccounts.find((item) => item.uid === userId);
      if (!account) return;
      const nextActive = !account.isActive;
      const action = nextActive ? "reactivate" : "deactivate";
      if (!confirm(`Are you sure you want to ${action} ${account.email || "this account"}?`)) {
        return;
      }

      button.disabled = true;
      const message = button.previousElementSibling?.querySelector(".account-action-message");
      if (message) message.textContent = `${action === "deactivate" ? "Deactivating" : "Reactivating"} account…`;
      try {
        await updateDoc(doc(db, "users", userId), { isActive: nextActive });
        await loadUserAccounts();
      } catch (error) {
        console.error(`Could not ${action} user account:`, error);
        if (message) {
          message.textContent = error.code === "permission-denied"
            ? "Your account cannot change this account's status."
            : `Could not ${action} account: ${error.message}`;
        }
        button.disabled = false;
      }
    });
  });
}

document.querySelectorAll("[data-quick-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.quickAction;
    if (action === "addFaculty") faculty();
    else if (action === "addRoom") room();
    else if (action === "addQrCode") qrCode();
  });
});

function setCount(elementId, count) {
  $(elementId).textContent = String(count);
}

function emptyState(icon, heading, description, actionId, actionLabel) {
  return `<div class="empty-panel"><span class="empty-icon" aria-hidden="true">${icon}</span>
    <h2>${heading}</h2><p>${description}</p>
    <button type="button" id="${actionId}">${actionLabel}</button></div>`;
}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function val(id) {
  return $(id).value.trim();
}

// Free alternative to Firebase Storage: resize/compress the image in the browser
// and store it as a data URL in Firestore. Keep it under ~650 KB to stay safely
// below Firestore's 1 MiB document limit.
async function imageFileToDataUrl(file) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("The original image must be 10 MB or smaller.");

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1200;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // JPEG gives much smaller Firestore documents for photographs/floor plans.
  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  while (dataUrl.length > 650000 && quality > 0.45) {
    quality -= 0.07;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrl.length > 700000) {
    throw new Error("This image is still too large after compression. Please choose a smaller image.");
  }

  return dataUrl;
}

function showImagePreview(inputId, previewId) {
  const input = $(inputId);
  const preview = $(previewId);
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) {
      preview.innerHTML = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      preview.innerHTML = '<span class="error-text">Please select an image file.</span>';
      input.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      preview.innerHTML = '<span class="error-text">Original image must be 10 MB or smaller.</span>';
      input.value = "";
      return;
    }
    preview.innerHTML = "<span>Preparing preview...</span>";
    try {
      const dataUrl = await imageFileToDataUrl(file);
      preview.innerHTML = `<img src="${dataUrl}" alt="Selected image preview">`;
    } catch (error) {
      preview.innerHTML = `<span class="error-text">${esc(error.message)}</span>`;
      input.value = "";
    }
  });
}

function faculty(data = {}, id = null) {
  title.textContent = id ? "Edit Faculty" : "Add Faculty";
  form.innerHTML = `
    <label>Faculty Name *</label>
    <input id="name" required value="${esc(data.name)}">
    <label>Description</label>
    <textarea id="description">${esc(data.description)}</textarea>
    <label>Office / Location</label>
    <input id="location" value="${esc(data.location)}">
    <label>Latitude (optional)</label>
    <input id="latitude" type="number" step="any" min="-90" max="90"
      value="${esc(data.latitude ?? "")}" placeholder="e.g. 14.5995">
    <label>Longitude (optional)</label>
    <input id="longitude" type="number" step="any" min="-180" max="180"
      value="${esc(data.longitude ?? "")}" placeholder="e.g. 120.9842">
    <small class="hint">Enter both coordinates to add this faculty location to the map and enable camera guidance.</small>
    <label>Contact</label>
    <input id="contact" value="${esc(data.contact)}">
    <label>Office Hours</label>
    <input id="hours" placeholder="08:00 AM - 05:00 PM" value="${esc(data.hours)}">
    <label>Faculty Image</label>
    <input id="imageFile" type="file" accept="image/*">
    <div id="imagePreview" class="image-preview">
      ${data.image ? `<img src="${esc(data.image)}" alt="Current faculty image">` : ""}
    </div>
    <small class="hint">Select an image for this faculty.</small>
    <label>Image URL (optional)</label>
    <input id="imageUrl" placeholder="Optional direct image URL" value="${esc(data.image && !data.image.startsWith("data:") ? data.image : "")}">
    <button class="save" id="saveFaculty" type="submit">Save Faculty</button>
  `;
  showImagePreview("imageFile", "imagePreview");

  form.onsubmit = async (event) => {
    event.preventDefault();
    const saveButton = $("saveFaculty");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    try {
      const file = $("imageFile").files?.[0];
      let image = data.image || "";
      const typedUrl = val("imageUrl");
      if (file) image = await imageFileToDataUrl(file);
      else if (typedUrl) image = typedUrl;

      const latitudeValue = val("latitude");
      const longitudeValue = val("longitude");
      if (Boolean(latitudeValue) !== Boolean(longitudeValue)) {
        throw new Error("Enter both latitude and longitude, or leave both blank.");
      }
      const latitude = latitudeValue ? Number(latitudeValue) : null;
      const longitude = longitudeValue ? Number(longitudeValue) : null;
      if ((latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
          (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
        throw new Error("Enter valid coordinates: latitude -90 to 90 and longitude -180 to 180.");
      }
      const record = {
        name: val("name"),
        description: val("description"),
        location: val("location"),
        latitude,
        longitude,
        contact: val("contact"),
        hours: val("hours"),
        image,
        updatedAt: new Date().toISOString()
      };
      if (id) await updateDoc(doc(db, "faculties", id), record);
      else await addDoc(collection(db, "faculties"), record);
      modal.classList.add("hidden");
      await loadFaculty();
    } catch (error) {
      console.error(error);
      alert(`Could not save faculty: ${error.message}`);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save Faculty";
    }
  };
  modal.classList.remove("hidden");
}

function room(data = {}, id = null) {
  let defaultCoordinates = defaultRoomCoordinates(data);
  title.textContent = id ? "Edit Room" : "Add Room";
  form.innerHTML = `
    <label>Room Number *</label>
    <input id="roomNumber" required value="${esc(data.roomNumber)}">
    <label>Building</label>
    <input id="building" value="${esc(data.building)}">
    <label>Floor</label>
    <input id="floor" value="${esc(data.floor)}">
    <label>Latitude (optional)</label>
    <input id="latitude" type="number" step="any" min="-90" max="90"
      value="${esc(data.latitude ?? defaultCoordinates?.latitude ?? "")}" placeholder="e.g. 14.5995">
    <label>Longitude (optional)</label>
    <input id="longitude" type="number" step="any" min="-180" max="180"
      value="${esc(data.longitude ?? defaultCoordinates?.longitude ?? "")}" placeholder="e.g. 120.9842">
    <small class="hint">Add both coordinates to enable GPS distance and Google Maps directions for students. The Computer Lab default is 14.803056, 121.069722; verify its pin is at the correct entrance.</small>
    <label>Room Type</label>
    <input id="roomType" placeholder="Classroom, Laboratory, Office, etc." value="${esc(data.roomType)}">
    <label>Description</label>
    <textarea id="description">${esc(data.description)}</textarea>
    <label>Room / Floor Plan Image</label>
    <input id="mapFile" type="file" accept="image/*">
    <div id="mapPreview" class="image-preview">
      ${data.mapUrl ? `<img src="${esc(data.mapUrl)}" alt="Current room map">` : ""}
    </div>
    <small class="hint">Choose a room photo, floor plan, or map image. It will be automatically resized and compressed.</small>
    <label>Image URL (optional)</label>
    <input id="mapUrl" placeholder="Optional direct image URL" value="${esc(data.mapUrl && !data.mapUrl.startsWith("data:") ? data.mapUrl : "")}">
    <label>Direct Map URL (optional)</label>
    <input id="mapLink" placeholder="Google Maps, campus map page, etc." value="${esc(data.mapLink)}">
    <button class="save" id="saveRoom" type="submit">Save Room</button>
  `;
  ["roomNumber", "building", "roomType"].forEach((fieldId) => {
    $(fieldId).addEventListener("input", () => {
      const latitude = $("latitude");
      const longitude = $("longitude");
      const fieldsAreBlank = !latitude.value.trim() && !longitude.value.trim();
      const fieldsContainPreviousDefault = defaultCoordinates &&
        Number(latitude.value) === defaultCoordinates.latitude &&
        Number(longitude.value) === defaultCoordinates.longitude;
      if (!fieldsAreBlank && !fieldsContainPreviousDefault) return;

      defaultCoordinates = defaultRoomCoordinates({
        roomNumber: val("roomNumber"),
        building: val("building"),
        roomType: val("roomType")
      });
      latitude.value = defaultCoordinates ? String(defaultCoordinates.latitude) : "";
      longitude.value = defaultCoordinates ? String(defaultCoordinates.longitude) : "";
    });
  });
  showImagePreview("mapFile", "mapPreview");

  form.onsubmit = async (event) => {
    event.preventDefault();
    const saveButton = $("saveRoom");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    try {
      const file = $("mapFile").files?.[0];
      let mapUrl = data.mapUrl || "";
      const typedUrl = val("mapUrl");
      if (file) mapUrl = await imageFileToDataUrl(file);
      else if (typedUrl) mapUrl = typedUrl;

      const latitudeValue = val("latitude");
      const longitudeValue = val("longitude");
      if (Boolean(latitudeValue) !== Boolean(longitudeValue)) {
        throw new Error("Enter both latitude and longitude, or leave both blank.");
      }
      const latitude = latitudeValue ? Number(latitudeValue) : null;
      const longitude = longitudeValue ? Number(longitudeValue) : null;
      if ((latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
          (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
        throw new Error("Enter valid coordinates: latitude -90 to 90 and longitude -180 to 180.");
      }
      const record = {
        roomNumber: val("roomNumber"),
        building: val("building"),
        floor: val("floor"),
        latitude,
        longitude,
        roomType: val("roomType"),
        description: val("description"),
        mapUrl,
        mapLink: val("mapLink"),
        updatedAt: new Date().toISOString()
      };
      if (id) await updateDoc(doc(db, "rooms", id), record);
      else await addDoc(collection(db, "rooms"), record);
      modal.classList.add("hidden");
      await loadRooms();
    } catch (error) {
      console.error(error);
      alert(`Could not save room: ${error.message}`);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save Room";
    }
  };
  modal.classList.remove("hidden");
}

async function loadFaculty() {
  try {
    const snapshot = await getDocs(collection(db, "faculties"));
    setCount("facultyCount", snapshot.size);
    $("facultyList").innerHTML = "";
    if (snapshot.empty) {
      $("facultyList").innerHTML = emptyState(
        "▦",
        "No faculties yet",
        "Add a faculty to share office locations, contact information, and hours with students.",
        "emptyAddFaculty",
        "Add your first faculty"
      );
      $("emptyAddFaculty").onclick = () => faculty();
      return;
    }
    snapshot.forEach((item) => {
      const data = item.data();
      $("facultyList").innerHTML += `
        <article class="card">
          ${data.image ? `<img class="card-image" src="${esc(data.image)}" alt="${esc(data.name)}">` : ""}
          <h3>${esc(data.name)}</h3>
          <p>${esc(data.description || "No description.")}</p>
          <p><b>Location:</b> ${esc(data.location || "-")}<br><b>Coordinates:</b> ${data.latitude != null && data.longitude != null ? `${esc(data.latitude)}, ${esc(data.longitude)}` : "Not set"}<br><b>Contact:</b> ${esc(data.contact || "-")}<br><b>Hours:</b> ${esc(data.hours || "-")}</p>
          <div class="actions">
            <button class="edit" data-edit-faculty="${item.id}">Edit</button>
            <button class="delete" data-delete-faculty="${item.id}">Delete</button>
          </div>
        </article>`;
    });
    document.querySelectorAll("[data-edit-faculty]").forEach((button) => {
      button.onclick = async () => {
        const item = await getDoc(doc(db, "faculties", button.dataset.editFaculty));
        if (item.exists()) faculty(item.data(), item.id);
      };
    });
    document.querySelectorAll("[data-delete-faculty]").forEach((button) => {
      button.onclick = async () => {
        if (!confirm("Delete this faculty?")) return;
        await deleteDoc(doc(db, "faculties", button.dataset.deleteFaculty));
        loadFaculty();
      };
    });
  } catch (error) {
    console.error(error);
    $("facultyList").innerHTML = `<p class="error-text">Could not load faculties: ${esc(error.message)}</p>`;
  }
}

async function loadRooms() {
  try {
    const snapshot = await getDocs(collection(db, "rooms"));
    setCount("roomCount", snapshot.size);
    $("roomList").innerHTML = "";
    if (snapshot.empty) {
      $("roomList").innerHTML = emptyState(
        "⌖",
        "No rooms yet",
        "Add room details and coordinates to help students find their destination.",
        "emptyAddRoom",
        "Add your first room"
      );
      $("emptyAddRoom").onclick = () => room();
      return;
    }
    snapshot.forEach((item) => {
      const data = item.data();
      $("roomList").innerHTML += `
        <article class="card">
          ${data.mapUrl ? `<img class="card-image" src="${esc(data.mapUrl)}" alt="Room ${esc(data.roomNumber)}">` : ""}
          <h3>Room ${esc(data.roomNumber)}</h3>
          <p><b>Building:</b> ${esc(data.building || "-")}<br><b>Floor:</b> ${esc(data.floor || "-")}<br><b>Type:</b> ${esc(data.roomType || "-")}<br><b>Coordinates:</b> ${data.latitude != null && data.longitude != null ? `${esc(data.latitude)}, ${esc(data.longitude)}` : "Not set"}</p>
          <p>${esc(data.description || "No description.")}</p>
          <div class="actions">
            <button class="edit" data-edit-room="${item.id}">Edit</button>
            <button class="delete" data-delete-room="${item.id}">Delete</button>
          </div>
        </article>`;
    });
    document.querySelectorAll("[data-edit-room]").forEach((button) => {
      button.onclick = async () => {
        const item = await getDoc(doc(db, "rooms", button.dataset.editRoom));
        if (item.exists()) room(item.data(), item.id);
      };
    });
    document.querySelectorAll("[data-delete-room]").forEach((button) => {
      button.onclick = async () => {
        if (!confirm("Delete this room?")) return;
        await deleteDoc(doc(db, "rooms", button.dataset.deleteRoom));
        loadRooms();
      };
    });
  } catch (error) {
    console.error(error);
    $("roomList").innerHTML = `<p class="error-text">Could not load rooms: ${esc(error.message)}</p>`;
  }
}

function qrCode(data = {}, id = null) {
  title.textContent = id ? "Edit QR guide" : "Add QR guide";
  const destination = data.targetUrl || data.pdfLink || "";

  form.innerHTML = `
    <label>Guide name *</label>
    <input id="qrName" required
      value="${esc(data.name || "")}"
      placeholder="Example: Building A — 2nd Floor">
    <label>Destination URL *</label>
    <input id="qrTargetUrl" type="url" required
      value="${esc(destination)}"
      placeholder="https://example.edu/campus-map">
    <small class="hint">A QR code is generated automatically for this link. Use a public HTTPS link for best results.</small>
    <div class="qr-preview"><div class="qr-preview-code" id="qrPreview"></div><p id="qrPreviewMessage" role="status">Enter a valid destination to preview its QR code.</p></div>
    <button class="save" type="submit">Save QR guide</button>
  `;

  const previewQr = () => {
    const preview = $("qrPreview");
    const message = $("qrPreviewMessage");
    const link = val("qrTargetUrl");
    preview.replaceChildren();
    if (!link) {
      message.textContent = "Enter a destination URL to preview its QR code.";
      return;
    }
    if (!isValidWebLink(link)) {
      message.textContent = "Use a complete HTTP or HTTPS destination URL.";
      return;
    }
    if (!window.QRCode) {
      message.textContent = "QR preview library could not load. The destination can still be saved.";
      return;
    }
    new window.QRCode(preview, {
      text: link,
      width: 108,
      height: 108,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M
    });
    message.textContent = "This code opens the destination shown above.";
  };
  $("qrTargetUrl").addEventListener("input", previewQr);
  previewQr();

  form.onsubmit = async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Saving…";

    try {
      const targetUrl = val("qrTargetUrl");
      if (!isValidWebLink(targetUrl)) {
        throw new Error("Please enter a valid HTTP or HTTPS destination URL.");
      }

      const record = {
        name: val("qrName").trim(),
        targetUrl,
        pdfLink: targetUrl
      };

      if (id) {
        await updateDoc(doc(db, "qrCodes", id), record);
      } else {
        await addDoc(collection(db, "qrCodes"), record);
      }

      modal.classList.add("hidden");
      await loadQrCodes();
    } catch (error) {
      console.error(error);
      alert("Could not save the QR guide: " + error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Save QR guide";
    }
  };

  modal.classList.remove("hidden");
}

function isValidWebLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function loadQrCodes() {
  const list = $("qrCodeList");
  list.innerHTML = "<p>Loading QR codes...</p>";

  try {
    const snapshot = await getDocs(collection(db, "qrCodes"));
    setCount("qrCount", snapshot.size);
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = emptyState(
        "▧",
        "No QR guides yet",
        "Create a scannable link to a campus map, floor plan, or helpful resource.",
        "emptyAddQrCode",
        "Create your first QR guide"
      );
      $("emptyAddQrCode").onclick = () => qrCode();
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();
      const target = data.targetUrl || data.pdfLink || "";
      const safeTarget = isValidWebLink(target) ? target : "";

      list.innerHTML += `
        <article class="card">
          <div class="qr-preview"><div class="qr-preview-code" id="admin-qr-${esc(item.id)}"></div>
            <p>${esc(target || "No destination link")}</p></div>
          <h3>${esc(data.name)}</h3>
          ${safeTarget ? `<p><a href="${esc(safeTarget)}" target="_blank" rel="noopener noreferrer">Open destination</a></p>` : '<p class="error-text">Destination URL is invalid.</p>'}

          <div class="actions">
            <button class="edit"
              data-edit-qr="${item.id}">Edit</button>

            <button class="delete"
              data-delete-qr="${item.id}">Delete</button>
          </div>
        </article>
          `;
    });

    if (window.QRCode) {
      snapshot.forEach((item) => {
        const target = item.data().targetUrl || item.data().pdfLink || "";
        if (!isValidWebLink(target)) return;
        const container = $(`admin-qr-${item.id}`);
        if (container) {
          new window.QRCode(container, {
            text: target,
            width: 108,
            height: 108,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.M
          });
        }
      });
    }

    document.querySelectorAll("[data-edit-qr]").forEach((button) => {
      button.onclick = async () => {
        const item = await getDoc(
          doc(db, "qrCodes", button.dataset.editQr)
        );

        if (item.exists()) {
          qrCode(item.data(), item.id);
        }
      };
    });

    document.querySelectorAll("[data-delete-qr]").forEach((button) => {
      button.onclick = async () => {
        if (!confirm("Delete this QR code?")) return;

        await deleteDoc(doc(db, "qrCodes", button.dataset.deleteQr));
        await loadQrCodes();
      };
    });
  } catch (error) {
    console.error(error);
    list.innerHTML =
      `<p class="error-text">Could not load QR codes: ${esc(error.message)}</p>`;
  }
}

async function loadFeedback() {
  const list = $("feedbackList");
  list.innerHTML = "<p>Loading student feedback...</p>";
  $("downloadFeedbackReport").disabled = true;
  feedbackReportRows = [];

  try {
    const feedbackQuery = query(
      collection(db, "feedback"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(feedbackQuery);
    setCount("feedbackCount", snapshot.size);

    if (snapshot.empty) {
      setCount("feedbackCount", 0);
      list.innerHTML = emptyState(
        "✳",
        "No feedback yet",
        "Student ratings and suggestions will appear here when they are submitted.",
        "emptyRefreshFeedback",
        "Refresh feedback"
      );
      $("emptyRefreshFeedback").onclick = () => loadFeedback();
      return;
    }

    const feedbackRows = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        data,
        rating: Math.max(0, Math.min(5, Math.round(Number(data.rating) || 0))),
        date: reportDate(data.createdAt)
      };
    });
    feedbackRows.sort((a, b) => b.rating - a.rating ||
      (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
    feedbackReportRows = feedbackRows;
    $("downloadFeedbackReport").disabled = false;
    list.innerHTML = `<table class="report-table">
      <thead><tr><th>Student name / account</th><th>Rating</th><th>Feedback</th><th>Submitted</th></tr></thead>
      <tbody>${feedbackRows.map(({ data, rating, date }) => `<tr>
        <td><span class="report-person">${esc(reportName(data))}</span></td>
        <td><span class="report-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span><span class="report-subtext">${rating}/5 stars</span></td>
        <td class="report-comment">${esc(data.comment || "No comment provided.")}</td>
        <td class="report-date">${esc(date ? date.toLocaleString() : "Date unavailable")}</td>
      </tr>`).join("")}</tbody>
    </table>`;
  } catch (error) {
    console.error("Could not load feedback:", error);
    list.innerHTML = `
      <p class="error-text">
        Could not load feedback: ${esc(error.message)}
      </p>
    `;
  }
}

async function loadTransactions() {
  const list = $("transactionList");
  list.innerHTML = "<p>Loading destination visits...</p>";
  $("downloadVisitReport").disabled = true;
  visitReportRows = [];
  try {
    const snapshot = await getDocs(query(collection(db, "transactions"), orderBy("createdAt", "desc")));
    visitReportRows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    $("downloadVisitReport").disabled = snapshot.empty;
    if (snapshot.empty) {
      list.innerHTML = '<p class="empty-state">No destination visits have been recorded yet.</p>';
      return;
    }

    list.innerHTML = `<table class="report-table">
      <thead><tr><th>Student name / account</th><th>Place</th><th>Student number</th><th>Visit type</th><th>Date</th><th>Time</th></tr></thead>
      <tbody>${visitReportRows.map((data) => {
        const date = reportDate(data.createdAt);
        return `<tr>
          <td><span class="report-person">${esc(reportName(data))}</span></td>
          <td><span class="report-person">${esc(reportPlace(data))}</span><span class="report-subtext">${esc(data.building || data.location || "Campus")}</span></td>
          <td>${esc(data.studentNumber || "Unavailable")}</td>
          <td>${data.method === "camera" ? "Arrival" : "Map directions"}</td>
          <td class="report-date">${esc(date ? date.toLocaleDateString() : "Unavailable")}</td>
          <td class="report-date">${esc(date ? date.toLocaleTimeString() : "Unavailable")}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>`;
  } catch (error) {
    console.error("Could not load destination visits:", error);
    list.innerHTML = `<p class="error-text">Could not load destination visits: ${esc(error.message)}</p>`;
  }
}

function reportDate(value) {
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function reportName(data) {
  return data.studentName || data.name || data.accountName || data.userEmail || data.userId || "Unavailable";
}

function reportPlace(data) {
  const roomNumber = String(data.roomNumber || "");
  const room = roomNumber && /^room\b/i.test(roomNumber) ? roomNumber : `Room ${roomNumber}`;
  return data.destinationName || (roomNumber ? room : "Place unavailable");
}

function downloadVisitReport() {
  if (!visitReportRows.length) return;
  const headers = ["Student name / account", "Student number", "Place", "Building", "Date", "Time", "Visit type"];
  const rows = visitReportRows.map((row) => {
    const date = reportDate(row.createdAt);
    return [
      reportName(row),
      row.studentNumber || "Unavailable",
      reportPlace(row),
      row.building || row.location || "Campus",
      date?.toLocaleDateString() || "Unavailable",
      date?.toLocaleTimeString() || "Unavailable",
      row.method === "camera" ? "Arrival" : "Map directions"
    ];
  });
  openPdfReport("Destination Visits Report", headers, rows, "destination-visits");
}

function downloadFeedbackReport() {
  if (!feedbackReportRows.length) return;
  const headers = ["Student name / account", "Rating", "Feedback", "Submitted"];
  const rows = feedbackReportRows.map(({ data, rating, date }) => [
    reportName(data),
    `${rating}/5 stars`,
    data.comment || "No comment provided.",
    date?.toLocaleString() || "Date unavailable"
  ]);
  openPdfReport("Student Feedback Report", headers, rows, "student-feedback");
}

function openPdfReport(title, headers, rows, filename) {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("The PDF report could not open because pop-ups are blocked. Allow pop-ups for this site and try again.");
    return;
  }
  const generatedAt = new Date().toLocaleString();
  const generatedBy = reportGeneratorName || auth.currentUser?.email || "Admin account";
  const head = headers.map((header) => `<th>${esc(header)}</th>`).join("");
  const body = rows.map((row) =>
    `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`
  ).join("");
  reportWindow.document.open();
  reportWindow.document.write(`<!doctype html>
    <html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(filename)}-${new Date().toISOString().slice(0, 10)}</title>
    <style>
      *{box-sizing:border-box}body{margin:0;padding:32px;color:#24364a;font-family:Arial,sans-serif}
      .report-heading{margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #164d8f}
      .brand{margin:0 0 9px;color:#52677b;font-size:10px;font-weight:650;letter-spacing:.08em;text-transform:uppercase}
      h1{margin:0 0 7px;font-size:24px} .meta{margin:3px 0 0;color:#627181;font-size:11px}
      table{width:100%;border-collapse:collapse;font-size:10px;table-layout:auto}
      th,td{padding:9px 8px;border:1px solid #d9e0e5;text-align:left;vertical-align:top;overflow-wrap:anywhere}
      th{background:#edf3f8;color:#28445e;font-size:9px;text-transform:uppercase;letter-spacing:.04em}
      tbody tr:nth-child(even){background:#f8fafb}
      @page{size:landscape;margin:14mm}
      @media print{body{padding:0}thead{display:table-header-group}tr{break-inside:avoid}}
    </style></head><body>
    <header class="report-heading"><p class="brand">Campus Wayfinder · Administration</p>
    <h1>${esc(title)}</h1><p class="meta"><strong>Generated by:</strong> ${esc(generatedBy)}</p>
    <p class="meta"><strong>Generated on:</strong> ${esc(generatedAt)} · ${rows.length} records</p></header>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    </body></html>`);
  reportWindow.document.close();
  let printStarted = false;
  const startPrint = () => {
    if (printStarted) return;
    printStarted = true;
    if (reportWindow.closed) return;
    reportWindow.focus();
    reportWindow.print();
  };
  setTimeout(startPrint, 100);
}
