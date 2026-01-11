import { users } from "../utils/appwrite.js";

// =====================
// GET ALL USERS
// =====================
export const getAllUsers = async (req, res) => {
  try {
    const response = await users.list();

    const formattedUsers = response.users.map((user) => ({
      id: user.$id,
      name: user.name || "No name",
      email: user.email,
      status: user.status, // <-- Use Appwrite's built-in status
      labels: user.labels || [],
      createdAt: user.$createdAt,
    }));

    return res.status(200).json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// =====================
// ACTIVATE USER
// ===================== 
export const activateUser = async (req, res) => {
  const { userId } = req.query; // use query for Next.js API routes
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    // Use Appwrite's built-in updateStatus
    const updatedUser = await users.updateStatus(userId, true); // true = activate

    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      status: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Activate user error:", error); // check this in server logs
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      code: error.code || "UNKNOWN_ERROR",
      type: error.type || "AppwriteError",
    });
  }
};

// =====================
// DEACTIVATE USER
// =====================

export const deactivateUser = async (req, res) => {
  const { userId } = req.query; // still using query

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    // Check if user exists
    await users.get(userId);

    // Delete all sessions for this user → forces logout
    await users.deleteSessions(userId);

    // Deactivate user
    const updatedUser = await users.updateStatus(userId, false);

    return res.status(200).json({
      success: true,
      message: "User deactivated and logged out successfully",
      status: false,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Appwrite deactivate error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      code: error.code || "UNKNOWN_ERROR",
      type: error.type || "AppwriteError",
    });
  }
};



