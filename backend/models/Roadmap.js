import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },

    icon: { type: String, required: true, trim: true }, // e.g., 'book', 'brain', 'code'
    duration: { type: String, required: true }, // e.g., '4 weeks', '10 hours'
    difficulty: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced'], 
      default: 'Beginner' 
    },
    learners: { type: Number, default: 0 },

    completionRate: { type: Number, default: 0 }, // 0 to 100 percent

    skills: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
  },
  { timestamps: true }
);

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
