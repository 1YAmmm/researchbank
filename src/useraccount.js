import { account } from "./lib/appwrite.js";

// Function to get the current user and display their name
async function getCurrentUser() {
  try {
    const user = await account.get();
    const userAccountElem = document.getElementById("user-account");
    if (userAccountElem) {
      userAccountElem.textContent = user.name || "User";
    }
    console.log("Current user:", user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Optional: redirect to login if not logged in
    window.location.href = "/index.html"; // redirect to login page
  }
}

// Function to logout the user
async function logoutUser() {
  try {
    await account.deleteSession("current"); // logs out the current session
    alert("You have been logged out.");
    window.location.href = "/index.html"; // redirect to login page
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Logout failed. Please try again.");
  }
}

// Attach logout function to button
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", logoutUser);
}

// Run on page load
getCurrentUser();
