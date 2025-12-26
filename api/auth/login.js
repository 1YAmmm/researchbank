import { loginUser } from "../controllers/loginController.js"; // adjust path if needed

export default async function handler(req, res) {
  if (req.method === "POST") {
    await loginUser(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
