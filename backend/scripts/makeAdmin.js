// Promote (or demote) an account.
//
//   node scripts/makeAdmin.js you@example.com          -> role: "admin"
//   node scripts/makeAdmin.js you@example.com user     -> role: "user"
//
// Run from the backend folder so .env (mongoUrl) is picked up.
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const [email, role = "admin"] = process.argv.slice(2);

if (!email || !["admin", "user"].includes(role)) {
  console.error("Usage: node scripts/makeAdmin.js <email> [admin|user]");
  process.exit(1);
}

if (!process.env.mongoUrl) {
  console.error("mongoUrl is not set. Run this from the backend folder, next to .env");
  process.exit(1);
}

await mongoose.connect(process.env.mongoUrl);

const user = await User.findOneAndUpdate({ email }, { role }, { new: true, runValidators: true });

if (!user) {
  console.error(`No account found with email ${email}`);
} else {
  console.log(`${user.email} now has role "${user.role}"`);
}

await mongoose.disconnect();
process.exit(user ? 0 : 1);
