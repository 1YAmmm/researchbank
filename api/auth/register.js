import { registerUser } from "../../controllers/authController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await registerUser(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
