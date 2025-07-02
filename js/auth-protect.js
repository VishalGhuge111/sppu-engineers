/**
 * @fileoverview
 * This script protects admin pages by checking Firebase Auth status.
 * If not logged in as admin, user is redirected silently to the login page.
 */

// --- Firebase Imports ---
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- Configurable Constants ---
const CONFIG = {
  ADMIN_EMAIL: "sppuengineers.site@gmail.com",
  LOGIN_REDIRECT_PATH: "/admin/login.html",
};

// --- Firebase Initialization ---
const auth = getAuth();

// --- Authentication Check ---
onAuthStateChanged(auth, (user) => {
  const blocker = document.getElementById("auth-blocker"); // Full-screen blocker element

  if (!user || user.email !== CONFIG.ADMIN_EMAIL) {
    console.warn("🚫 Unauthorized access or non-admin user.");

    // Don't show alert – just redirect quietly
    window.location.href = CONFIG.LOGIN_REDIRECT_PATH;
  } else {
    console.log("✅ Admin access granted:", user.email);

    // Hide the blocker to show admin content
    if (blocker) blocker.style.display = "none";
  }
});

// --- Logout Functionality ---
export function logout() {
  signOut(auth)
    .then(() => {
      console.log("➡️ User logged out. Redirecting to login.");
      window.location.href = CONFIG.LOGIN_REDIRECT_PATH;
    })
    .catch((error) => {
      console.error("❌ Logout error:", error);
      window.location.href = CONFIG.LOGIN_REDIRECT_PATH;
    });
}

window.logout = logout;
