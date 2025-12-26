import { ID } from "node-appwrite";
import { users } from "../utils/appwrite.js";

export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await users.create(
      ID.unique(),
      email,
      null,
      password,
      fullname
    );

    // ✅ Send verification (ADMIN — no login needed)
    await users.createVerification(
      user.$id,
      "https://researchbank-eta.vercel.app/pages/verified-account.html"
    );

    res.status(201).json({
      message: "User created. Verification email sent.",
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      message: error.message || "Registration failed",
    });
  }
};
