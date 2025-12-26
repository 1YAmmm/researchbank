document.addEventListener("DOMContentLoaded", () => {
  const client = new appwrite.Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("64a8f3b1c1f11b2f6d98");

  const account = new appwrite.Account(client);

  const logemail = document.getElementById("login-email");
  const logpassword = document.getElementById("login-password");
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = logemail.value.trim();
    const password = logpassword.value;

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      await account.createEmailSession(email, password);
      await account.createVerification(
        "https://researchbank-eta.vercel.app/pages/verified-account.html"
      );
      alert("Verification email sent!");
      await account.deleteSession("current");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
});
