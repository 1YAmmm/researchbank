const regFullname = document.getElementById("reg-fullname");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regButton = document.getElementById("reg-button");

const FUNCTION_ID = "694b9f32a914b043f01b";
const FUNCTION_ENDPOINT = `https://fra.cloud.appwrite.io/v1/functions/${FUNCTION_ID}/executions`;

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = regFullname.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    regButton.disabled = true;

    try {
      const response = await fetch(FUNCTION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment the next line if your function requires an API key
          // "X-Appwrite-Key": "YOUR_FUNCTION_API_KEY"
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`User "${result.user.name}" registered successfully!`);
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
    } finally {
      regButton.disabled = false;
    }
  });
