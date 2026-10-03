import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const TOKEN_EXPIRY = "1h"; // can be adjusted as needed
const TOKEN_MAX_AGE_MS = 60 * 60 * 1000; // keep in sync with TOKEN_EXPIRY

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isProduction = process.env.NODE_ENV === "production";

// In production the frontend (Vercel) and this API are different sites, so the
// cookie must be SameSite=None — which browsers only accept together with
// Secure. Locally both run on localhost, which counts as the same site, so Lax
// works and does not require HTTPS.
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
};

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

// The token is handed to the browser as a cookie and never appears in the
// response body, so it is never reachable from JavaScript.
const sendAuthCookie = (res, userId) =>
  res.cookie("token", generateToken(userId), {
    ...cookieOptions,
    maxAge: TOKEN_MAX_AGE_MS,
  });

// Shape sent to the client. Never includes the password hash.
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    sendAuthCookie(res, user._id);

    return res.status(201).json({   //// 2xx status codes indicate success.
      message: "Signup successful",  // 201 specifically means "Created"
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Accounts created through Google sign-in have no password hash
    if (!user.password) {
      return res
        .status(401)
        .json({ message: "This account uses Google sign-in. Please continue with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendAuthCookie(res, user._id);

    return res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GOOGLE LOGIN
 * The browser sends the ID token Google issued it ("credential").
 * We verify that token here, then issue OUR OWN app JWT — set as exactly the
 * same cookie /login sets, so every protected route keeps working unchanged.
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    let payload;
    try {
      // Checks Google's signature, the issuer, the expiry, and that the token
      // was issued for THIS app (aud === our client id). A token minted for
      // some other site is rejected here.
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: "Invalid Google credential" });
    }

    const { email, email_verified, name, sub: googleId } = payload;

    // An unverified Google email must never be able to claim an existing account
    if (!email || !email_verified) {
      return res.status(401).json({ message: "Google account email is not verified" });
    }

    // Email is unique in the schema, so matching on it is what prevents duplicates
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email,
        email,
        password: null, // Google-only account: no password to compare against
        googleId,
      });
    } else if (!user.googleId) {
      // Existing password account signing in with Google for the first time
      user.googleId = googleId;
      await user.save();
    }

    sendAuthCookie(res, user._id);

    return res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// An httpOnly cookie cannot be removed by client-side code, so logging out has
// to be a request the server answers by expiring it.
export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out" });
};

// req.user is set by ensureAuthenticated and already excludes the password
export const getMe = (req, res) => {
  return res.status(200).json({ user: publicUser(req.user) });
};
