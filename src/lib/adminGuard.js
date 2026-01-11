import { account } from "./appwrite.js";

async function protectAdminPage() {
  try {
    // Get current user session
    const session = await account.get();

    // Check admin labels stored at root level
    const labels = session?.labels || [];

    // Check if user is admin
    if (!labels.includes("admin")) {
      // Not an admin → redirect to main page
      window.location.href = "/index.html";
      return;
    }

    // Admin stays on page
    console.log("Admin access granted");

  } catch (err) {
    console.error("Error checking admin access:", err);
    // Not logged in → redirect to main page
    window.location.href = "/index.html";
  }
}

// Call the function
protectAdminPage();
