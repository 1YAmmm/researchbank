// Modal & Panels
const modal = document.getElementById("auth-modal");
const loginPanel = document.getElementById("login-panel");
const registerPanel = document.getElementById("register-panel");

// Modal Control Buttons
const closeBtn = document.getElementById("close-modal");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");

// Optional: Buttons outside modal to open it
const openLoginBtn = document.getElementById("login-button");
const openRegisterBtn = document.getElementById("register-button");

// Function to open modal with a specific panel
function openModal(panel = "login") {
  modal.classList.remove("opacity-0", "pointer-events-none");

  if (panel === "login") {
    loginPanel.classList.remove("hidden");
    registerPanel.classList.add("hidden");
  } else if (panel === "register") {
    registerPanel.classList.remove("hidden");
    loginPanel.classList.add("hidden");
  }
}

// Function to close modal
function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
}

// Event listeners
closeBtn.addEventListener("click", closeModal);

// Switch between panels inside modal
switchToRegister.addEventListener("click", () => openModal("register"));
switchToLogin.addEventListener("click", () => openModal("login"));

// Open modal from external buttons (if they exist)
openLoginBtn?.addEventListener("click", () => openModal("login"));
openRegisterBtn?.addEventListener("click", () => openModal("register"));

// Close modal when clicking backdrop
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
