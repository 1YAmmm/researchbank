import { account } from "../utils/appwrite.js"; // Make sure this points to your initialized Appwrite client

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1️⃣ Login the user (create email session)
    const session = await account.createEmailSession(email, password);

    // 2️⃣ Get user info
    const user = await account.get();

    // 3️⃣ Send verification email if not verified
    // if (!user.emailVerification) {
    //   await account.createVerification(
    //     "https://researchbank-eta.vercel.app/pages/verified-account.html"
    //   );
    // }

    res.status(200).json({
      message: "Login successful! Verification email sent if needed.",
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(error.code || 500).json({
      message: error.message || "Login failed",
    });
  }
};
