import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    duration: { type: String },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed', 'locked'], default: 'not_started' },
  },
  { timestamps: true }
);

export default mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);
