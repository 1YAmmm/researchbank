import { databases, storage } from "../utils/appwrite.js";
import { Query } from "appwrite";

const DATABASE_ID = "69525e230018d989fc0b";
const COLLECTION_ID = "publishdocs";
const BUCKET_ID = "6952637b00002e00f85d";

export const getAllPublishDocs = async (req, res) => {
  try {
    // 📄 Fetch documents (max 100 for admin)
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ]);

    // 📦 Fetch files (max 100)
    const files = await storage.listFiles(BUCKET_ID, [Query.limit(100)]);

    return res.status(200).json({
      success: true,
      documents: docs.documents,
      totalDocuments: docs.total,
      files: files.files,
      totalFiles: files.total,
    });
  } catch (error) {
    console.error("ADMIN FETCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
