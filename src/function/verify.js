import { account } from "../lib/appwrite.js";

const statusTitle = document.getElementById("status-title");
const statusText = document.getElementById("status-text");
const statusIcon = document.getElementById("status-icon");
const actionButton = document.getElementById("action-button");

// Function to show verified UI
function showVerified() {
  statusTitle.textContent = "Email Verified";
  statusText.textContent =
    "Your account has been successfully verified. You can now log in and start using Research Bank.";
  statusIcon.className =
    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600";
  statusIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>`;
  actionButton.style.display = "block";
}

// Function to show not verified UI
function showNotVerified() {
  statusTitle.textContent = "Email Not Verified";
  statusText.textContent =
    "Your email is not verified yet. Please click the verification link in your email and wait a few seconds.";
  statusIcon.className =
    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600";
  statusIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>`;
  actionButton.style.display = "none";
}

// Get URL parameters (userId and secret)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
const secret = urlParams.get("secret");

// Verify email using Appwrite
async function verifyEmail() {
  try {
    if (userId && secret) {
      // Update verification status on Appwrite server
      await account.updateVerification(userId, secret);
    }

    // Now fetch the updated user info
    const user = await account.get();

    if (user.emailVerification) {
      showVerified();
    } else {
      showNotVerified();
      // Optional: keep checking every 5 seconds in case Appwrite takes a moment to process
      const intervalId = setInterval(async () => {
        const refreshedUser = await account.get();
        if (refreshedUser.emailVerification) {
          showVerified();
          clearInterval(intervalId);
        }
      }, 5000);
    }
  } catch (error) {
    console.error("Verification error:", error);
    statusTitle.textContent = "Error";
    statusText.textContent = "Failed to verify your email. Please try again.";
    statusIcon.className =
      "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600";
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>`;
    actionButton.style.display = "none";
  }
}

// Start verification after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  verifyEmail();
});
