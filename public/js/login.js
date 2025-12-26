// login.js
import { Client, Account } from "appwrite";

// ------------------- Appwrite Setup -------------------
const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("694caf5700330567cf9b"); // Replace with your project ID

const account = new Account(client);

// ------------------- DOM Elements -------------------
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");

// ------------------- Login Function -------------------
loginButton.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Create session
    await account.createSession(email, password);
    alert("Login successful!");
    window.location.href = "/dashboard.html"; // Redirect after login
  } catch (error) {
    console.error(error);
    alert(error.message || "Login failed!");
  }
});
