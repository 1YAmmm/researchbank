import { ID } from "node-appwrite";
import { account } from "../utils/appwrite.js";

export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1️⃣ Create the user
    const user = await account.create(ID.unique(), email, password, fullname);

    // 2️⃣ Login the user
    await account.createSession(email, password);

    // 3️⃣ Send verification email
    // Do NOT pass user.$id — just the redirect URL
    await account.createVerification(
      "https://researchbank-eta.vercel.app/pages/verified-account.html"
    );

    // 4️⃣ Logout
    await account.deleteSession("current");

    res.status(201).json({
      message: "User registered, verification email sent, and logged out",
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Appwrite error:", error);
    return res.status(error.code || 500).json({
      message: error.message || "Registration failed",
    });
  }
};
