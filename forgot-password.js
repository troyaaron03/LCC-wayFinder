import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDuxFyTm3pYIsrO5i5ivTKZyM4SZYnpqM",
  authDomain: "campus-navigation-system-4292f.firebaseapp.com",
  projectId: "campus-navigation-system-4292f",
  storageBucket: "campus-navigation-system-4292f.firebasestorage.app",
  messagingSenderId: "1007485437799",
  appId: "1:1007485437799:web:d157f9c9ac7ff46d2591c2",
  measurementId: "G-RT9C1JGB58"
};

const auth = getAuth(initializeApp(firebaseConfig));
const form = document.getElementById("resetForm");
const emailInput = document.getElementById("email");
const submitButton = form.querySelector("button[type='submit']");
const message = document.getElementById("msg");

function setMessage(text, state = "error") {
  message.textContent = text;
  message.dataset.state = state;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  submitButton.disabled = true;
  setMessage("Sending reset link…", "success");
  try {
    await sendPasswordResetEmail(auth, email);
    setMessage("If an account exists with this email, a password reset link has been sent.", "success");
  } catch (error) {
    console.error("Password reset request failed:", error);
    if (error.code === "auth/user-not-found") {
      setMessage("If an account exists with this email, a password reset link has been sent.", "success");
    } else if (error.code === "auth/invalid-email") {
      setMessage("Enter a valid campus email address.");
    } else if (error.code === "auth/too-many-requests") {
      setMessage("Too many reset requests. Please wait a while and try again.");
    } else {
      setMessage("Could not send a password reset email. Please try again later.");
    }
  } finally {
    submitButton.disabled = false;
  }
});
