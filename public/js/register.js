// ------------------- DOM Elements -------------------
const regFullname = document.getElementById("reg-fullname");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regButton = document.getElementById("reg-button");

// ------------------- Appwrite Function Endpoint -------------------
const FUNCTION_ID = "694a94b05aa5f757ce9d";
const FUNCTION_ENDPOINT = `https://fra.cloud.appwrite.io/v1/functions/${FUNCTION_ID}/executions`;

// ------------------- Event Listener -------------------
regButton.addEventListener("click", async (e) => {
  e.preventDefault();
  await registerUser();
});

// ------------------- Register Function -------------------
async function registerUser() {
  const name = regFullname.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(FUNCTION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert(`User "${result.user.name}" registered successfully!`);
      // Clear form
      regFullname.value = "";
      regEmail.value = "";
      regPassword.value = "";
    } else {
      alert(`Error: ${result.error}`);
      console.error(result.error);
    }
  } catch (err) {
    console.error("Function call failed:", err);
    alert("Network or server error.");
  }
}
