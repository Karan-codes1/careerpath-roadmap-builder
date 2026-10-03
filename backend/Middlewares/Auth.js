import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ensureAuthenticated = async (req, res, next) => {
  // 1. The browser attaches this cookie automatically. It is httpOnly, so no
  //    script on the page — ours or an injected one — can read it.
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)  // 4xx codes indicate client errors, and 401 specifically means "Unauthorized"
      .json({ message: "Unauthorized: no session cookie" });
  }

  try {
    // 2. Verify the signature and expiry using our secret.
    //    Throws if the token was tampered with or has expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. The user id comes from the *verified* payload, never from the client directly
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user no longer exists" });
    }

    // 4. Hand the user to every downstream controller as req.user
    req.user = user; //I have authenticated this request and found the 
                     //corresponding user. I'll attach that user to the request 
                     // so every function that runs after me can access it.
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

// Authorization: runs AFTER ensureAuthenticated, so req.user is already the
// verified, freshly-loaded user. Authentication answers "who are you?";
// this answers "are you allowed to do this?".
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    // 403 Forbidden: we know who you are, you just don't have permission.
    // (401 would mean "we don't know who you are".)
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  next();
};

export default ensureAuthenticated;
