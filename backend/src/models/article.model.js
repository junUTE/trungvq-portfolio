import mongoose from "mongoose";

import { slugify } from "../utils/slugify.js";

const articleSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    readTime: {
      type: String,
      required: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true,
      trim: true
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
    this.slug = slugify(this.title);
  }

  next();
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
