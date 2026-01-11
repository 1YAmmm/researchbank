import { account } from "./appwrite.js";

let sessionValid = true; // Track if we already alerted

// Check every 5 seconds if session is still valid
setInterval(async () => {
  try {
    await account.get();
    // Session is valid
    sessionValid = true; // reset if previously invalid
  } catch (error) {
    // Only alert once
    if (sessionValid) {
      console.warn("Session invalid or user deactivated:", error);
      alert("Your account has been deactivated. Redirecting to login.");
      window.location.href = "/index.html"; // redirect to login
      sessionValid = false; // prevent further alerts
    }
  }
}, 5000);
