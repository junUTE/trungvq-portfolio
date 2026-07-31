import mongoose from "mongoose";

import { slugify } from "../utils/slugify.js";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value);
        },
        message: "Technologies must be an array."
      }
    },
    githubLink: {
      type: String,
      trim: true,
      default: ""
    },
    demoLink: {
      type: String,
      trim: true,
      default: ""
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    imagePublicId: {
      type: String,
      trim: true,
      default: ""
    },
    featured: {
      type: Boolean,
      default: false
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

projectSchema.index({ status: 1, order: 1, createdAt: -1 });

projectSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }

  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
