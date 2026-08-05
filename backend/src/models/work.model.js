import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    period: {
      type: String,
      trim: true,
      default: ""
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    highlights: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value);
        },
        message: "Highlights must be an array."
      }
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

workSchema.index({ status: 1, order: 1, createdAt: -1 });

const Work = mongoose.model("Work", workSchema);

export default Work;
