import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String ,default: null}, // null for Google users,
    googleId: { type: String, default: null }, // Google's stable user id ("sub" claim)
    // What this account is allowed to do. Only ever changed directly in the
    // database (or with scripts/makeAdmin.js) — never from a request body.
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bookmarkedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    completedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    // In User schema
    quizProgress: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
        score: { type: Number, required: true }, // number of correct answers
        totalQuestions: { type: Number, required: true },
        lastAttempted: { type: Date, default: Date.now }
      }
    ]

  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
