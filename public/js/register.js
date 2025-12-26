const regFullname = document.getElementById("reg-fullname");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regButton = document.getElementById("reg-button");

const BACKEND_URL = "/api/auth";

async function registerUser(data) {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to register user");
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
}

regButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullname = regFullname.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();

  if (!fullname || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  const result = await registerUser({ fullname, email, password });

  if (result.error) {
    alert(`Error: ${result.error}`);
  } else {
    alert("Registration successful!");
    regFullname.value = "";
    regEmail.value = "";
    regPassword.value = "";
  }
});
