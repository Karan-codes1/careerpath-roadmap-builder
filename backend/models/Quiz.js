// models/Quiz.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // Roadmap reference 
    roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },

    // Optional Milestone reference
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone" },

    // Questions array
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },

        // Short, static explanation
        explanation: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
