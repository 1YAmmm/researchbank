import { account } from "../lib/appwrite.js";
import { getAllPublishDocs } from "../controllers/adminPublishDocsController.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 🔐 Get current logged-in user
    const user = await account.get();

    // 🏷️ Check label
    if (!user.labels || !user.labels.includes("admin")) {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Optional: attach user
    req.user = user;

    // 🚀 Allowed
    return getAllPublishDocs(req, res);
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
