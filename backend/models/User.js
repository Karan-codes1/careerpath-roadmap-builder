import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String ,default: null}, // null for Google users,
    bookmarkedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    completedResoures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
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
