import mongoose from "mongoose";

import { slugify } from "../utils/slugify.js";

const articleSchema = new mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    readTime: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    excerpt: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    tone: {
      type: String,
      trim: true,
      default: "from-slate-200 to-slate-100"
    },
    publishedAt: {
      type: Date,
      default: Date.now
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

articleSchema.index({ status: 1, order: 1, publishedAt: -1 });

articleSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(typeof this.title === "string" ? this.title : this.title?.vi || this.title?.en || "");
  }

  next();
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
