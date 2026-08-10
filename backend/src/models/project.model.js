import mongoose from "mongoose";

import { slugify } from "../utils/slugify.js";

const projectSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    myRole: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
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
    githubLinkSecondary: {
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
    this.slug = slugify(typeof this.title === "string" ? this.title : this.title?.vi || this.title?.en || "");
  }

  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
