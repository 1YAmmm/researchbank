// register.js
import { Client, Account } from "appwrite";

// ------------------- Appwrite Setup -------------------
const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("694caf5700330567cf9b"); // Replace with your project ID

const account = new Account(client);

// ------------------- DOM Elements -------------------
const regFullname = document.getElementById("reg-fullname");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regButton = document.getElementById("reg-button");

// ------------------- Register Function -------------------
regButton.addEventListener("click", async () => {
  const fullname = regFullname.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value;

  if (!fullname || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Create the user
    const user = await account.create(
      "unique()", // Appwrite generates a unique ID
      email,
      password,
      fullname
    );

    alert(
      "Account created successfully! Please check your email to verify your account."
    );
    window.location.href = "/login.html"; // Redirect to login
  } catch (error) {
    console.error(error);
    alert(error.message || "Registration failed!");
  }
});
