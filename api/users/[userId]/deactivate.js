import { deactivateUser } from "../../controllers/getUserController.js";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    return deactivateUser(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
