const modal = document.getElementById("auth-modal");
const loginBtn = document.getElementById("login-button");
const registerBtn = document.getElementById("register-button");
const closeBtn = document.getElementById("close-modal");

const loginPanel = document.getElementById("login-panel");
const registerPanel = document.getElementById("register-panel");

const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");

function openModal(panel) {
  modal.classList.remove("opacity-0", "pointer-events-none");

  if (panel === "login") {
    loginPanel.classList.remove("hidden");
    registerPanel.classList.add("hidden");
  } else {
    registerPanel.classList.remove("hidden");
    loginPanel.classList.add("hidden");
  }
}

function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
}

// Open Login
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal("login");
});

// Open Register
registerBtn.addEventListener("click", () => {
  openModal("register");
});

// Close Modal
closeBtn.addEventListener("click", closeModal);

// Switch Panels
switchToRegister.addEventListener("click", () => {
  openModal("register");
});

switchToLogin.addEventListener("click", () => {
  openModal("login");
});

// Close when clicking backdrop
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
