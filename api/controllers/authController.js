import { ID } from "node-appwrite";
import { account, users } from "../utils/appwrite.js";

export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const response = await account.create(
      ID.unique(),
      email,
      password,
      fullname
    );

    await users.createVerification(
      response.$id, // user ID from account.create
      "https://researchbank-eta.vercel.app/pages/verified-account.html"
    );

    res.status(201).json({
      message: "User created successfully. Verification email sent",
      user: {
        id: response.$id,
        email: response.email,
        name: response.name,
      },
    });
  } catch (error) {
    console.error("Appwrite error:", error);

    return res.status(error.code || 500).json({
      message: error.message || "Registration failed",
    });
  }
};
