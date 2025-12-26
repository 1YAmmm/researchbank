import { ID } from "node-appwrite";
import { account } from "../utils/appwrite.js";

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

    res.status(201).json({
      message: "User created successfully",
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
