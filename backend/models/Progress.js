import mongoose from "mongoose";
const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
  milestonesStatus: [
    {
      milestone: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone", required: true },
      status: { 
        type: String, 
        enum: ["not_started", "in_progress", "completed"],
        default: "not_started"
      }
    }
  ],
}, { timestamps: true });


export default mongoose.model("Progress", progressSchema);