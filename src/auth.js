import { account } from "./lib/appwrite.js";
import { ID } from "appwrite";

/* ================= REGISTER ================= */
const regFullname = document.getElementById("reg-fullname");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regButton = document.getElementById("reg-button");

if (regButton) {
  regButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = regFullname.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await account.create(ID.unique(), email, password, name);

      // Auto login after register
      await account.createEmailPasswordSession(email, password);

      window.location.href = "/main.html";
    } catch (error) {
      console.error(error);
      alert(error.message || "Registration failed");
    }
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("login-panel");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  try {
    // 1. Create session
    await account.createEmailPasswordSession(email, password);

    // 2. Try to get user
    let user;
    try {
      user = await account.get();
    } catch {
      // Session exists but user fetch failed
      window.location.href = "/main.html";
      return;
    }

    const labels = user.labels || [];

    // 3. Redirect
    window.location.href = labels.includes("admin")
      ? "/admin.html"
      : "/main.html";

  } catch (error) {
    console.error(error);
    alert(error.message || "Login failed");
  }
});

