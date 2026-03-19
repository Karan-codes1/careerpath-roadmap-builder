import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['video', 'article', 'book', 'course'], 
      required: true 
    },
    milestone: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Milestone', 
      required: true 
    },
    description: { type: String, trim: true }, // Short description of the resource
    duration: { type: String }, // e.g., "2h 30m" or "45m"
    author: { type: String, trim: true }, // e.g., "Traversy Media", "freeCodeCamp"
    tags: [{ type: String, trim: true }], // e.g., ["React", "frontend", "beginner"]
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
      // ✅ NEW FIELDS
    step: { type: Number, required: true }, // Determines the order of appearance
    isOptional: { type: Boolean, default: false } // Whether it's core or extra
  },
  { timestamps: true }
);

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default Resource;
