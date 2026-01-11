import { account } from "./lib/appwrite.js";

/* =========================================================
   GET CURRENT USER & POPULATE ACCOUNT SETTINGS
========================================================= */
async function getCurrentUser() {
  try {
    const user = await account.get();

    // ================= DISPLAY USER NAME (HEADER / NAV) =================
    const userAccountElem = document.getElementById("user-account");
    if (userAccountElem) {
      userAccountElem.textContent = user.name || "User";
    }

    // ================= POPULATE ACCOUNT SETTINGS FORM =================
    const nameInput = document.querySelector(
      '#account-panel input[type="text"]'
    );
    const emailInput = document.querySelector(
      '#account-panel input[type="email"]'
    );

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";

    console.log("Current user:", user);
  } catch (error) {
    console.error("Error fetching current user:", error);

    // Redirect to login if not authenticated
    window.location.href = "/index.html";
  }
}

/* =========================================================
   LOGOUT USER
========================================================= */
async function logoutUser() {
  try {
    await account.deleteSession("current");
    alert("You have been logged out.");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout failed. Please try again.");
  }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  getCurrentUser();

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});
