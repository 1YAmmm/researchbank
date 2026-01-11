import { account } from "./lib/appwrite.js";

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     FORGOT PASSWORD (SEND RECOVERY EMAIL)
  ========================================================= */

  const loginEmail = document.getElementById("login-email");
  const forgotPasswordButton = document.getElementById(
    "forgot-password-button"
  );

  if (forgotPasswordButton && loginEmail) {
    forgotPasswordButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = loginEmail.value.trim();
      if (!email) {
        alert("Please enter your email address.");
        return;
      }

      try {
        forgotPasswordButton.disabled = true;
        forgotPasswordButton.textContent = "Sending...";

        await account.createRecovery(
          email,
          "https://researchbank-eta.vercel.app/reset-password.html"
        );

        alert("Password reset email sent! Please check your inbox.");
        loginEmail.value = "";
      } catch (err) {
        console.error("Forgot password error:", err);
        alert(err.message || "Failed to send password reset email.");
      } finally {
        forgotPasswordButton.disabled = false;
        forgotPasswordButton.textContent = "Forgot Password";
      }
    });
  }

  /* =========================================================
     RESET PASSWORD PAGE
  ========================================================= */

  const form = document.getElementById("reset-form");
  if (!form) return; // Not on reset page

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");

  const statusText = document.getElementById("status-text");
  const statusIcon = document.getElementById("status-icon");
  const actionButton = document.getElementById("action-button");

  function setStatus(type, message) {
    statusText.textContent = message;

    const icons = {
      idle: "lock",
      loading: "loader",
      success: "check-circle",
      error: "x-circle",
    };

    statusIcon.setAttribute("data-lucide", icons[type]);
    lucide.createIcons();
  }

  // Invalid or expired link
  if (!userId || !secret) {
    setStatus("error", "Invalid or expired reset link.");
    form.classList.add("hidden");
    return;
  }

  setStatus("idle", "Enter your new password below.");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setStatus("loading", "Resetting password...");

      await account.updateRecovery(userId, secret, password, confirm);

      setStatus("success", "Your password has been reset successfully!");
      form.classList.add("hidden");

      if (actionButton) {
        actionButton.classList.remove("hidden");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setStatus(
        "error",
        err.message || "Password reset failed. Please try again."
      );
    }
  });
});
