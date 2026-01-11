import { getAllUsers } from "../controllers/getUserController.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAllUsers(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
