import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator(value) {
          return typeof value === "string" || (value && typeof value === "object");
        },
        message: "Title must be a string or localized object."
      }
    },
    company: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
    },
    period: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    highlights: {
      type: [mongoose.Schema.Types.Mixed],
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
