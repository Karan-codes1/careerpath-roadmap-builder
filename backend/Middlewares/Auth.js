import { getToken } from "next-auth/jwt";
import User from "../models/User.js";

const ensureAuthenticated = async (req, res, next) => {
  try {
    // 🔐 Read NextAuth session from cookies
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // token.email comes from Google / Credentials
    const user = await User.findOne({ email: token.email }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Auth failed" });
  }
};

export default ensureAuthenticated;
