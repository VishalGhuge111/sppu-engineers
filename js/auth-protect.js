/**
 * @fileoverview
 * This script provides client-side authentication protection for admin pages.
 * It checks if the current user is logged in and matches a predefined admin email.
 * Unauthorized users are redirected to the login page.
 */

// --- Firebase Imports ---
// Using specific imports for better tree-shaking and clarity.
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- Configuration Constants ---
// Centralizing configurable values for easy modification.
const CONFIG = {
  // Replace with your actual admin email.
  // IMPORTANT: Client-side checks are NOT secure alone.
  // Always validate access on the server for sensitive operations.
  ADMIN_EMAIL: "sppuengineers.site@gmail.com",
  LOGIN_REDIRECT_PATH: "/admin/login.html",
  ACCESS_DENIED_MESSAGE: "Access denied. Please login as admin.",
};

// --- Firebase Initialization ---
const auth = getAuth();

// --- Authentication State Observer ---
/**
 * Observes Firebase authentication state changes.
 * If the user is not logged in or their email does not match the admin email,
 * they are redirected to the login page.
 */
onAuthStateChanged(auth, (user) => {
  // Check if a user is logged in AND if their email matches the admin email.
  // Using a guard clause for cleaner logic.
  if (!user || user.email !== CONFIG.ADMIN_EMAIL) {
    console.warn("🚫 Unauthorized access attempt or non-admin user detected.");
    alert(CONFIG.ACCESS_DENIED_MESSAGE);
    window.location.href = CONFIG.LOGIN_REDIRECT_PATH; // Redirect to login
  } else {
    console.log("✅ Admin access granted for:", user.email);
    // You might want to hide a loading spinner or show the content here
    // if your page initially hides content until authentication is verified.
  }
});

// --- Logout Functionality ---
/**
 * Logs out the current Firebase user and redirects them to the login page.
 * This function is made globally accessible for use in HTML (e.g., via an onclick attribute).
 */
export function logout() {
  signOut(auth)
    .then(() => {
      console.log("➡️ User logged out. Redirecting to login.");
      window.location.href = CONFIG.LOGIN_REDIRECT_PATH;
    })
    .catch((error) => {
      console.error("❌ Error during logout:", error);
      alert("Logout failed: " + error.message);
      // Optionally, still redirect even if signOut fails, depending on desired UX.
      window.location.href = CONFIG.LOGIN_REDIRECT_PATH;
    });
}

// Attach the logout function to the window object so it can be called directly from HTML
// (e.g., <button onclick="logout()">Logout</button>).
// This is a common pattern when you want a simple global function.
// For more complex SPAs, consider integrating it directly into your component's event handlers.
window.logout = logout;