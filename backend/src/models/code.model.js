import mongoose from "mongoose";

const codeTagSchema = new mongoose.Schema(
  {
    label: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator(value) {
          return typeof value === "string" || (value && typeof value === "object");
        },
        message: "Tag label must be a string or localized object."
      }
    },
    color: {
      type: String,
      trim: true,
      default: "bg-slate-500"
    }
  },
  {
    _id: false
  }
);

const codeSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    repositoryUrl: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [codeTagSchema],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value);
        },
        message: "Tags must be an array."
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

codeSchema.index({ status: 1, order: 1, createdAt: -1 });

const Code = mongoose.model("Code", codeSchema);

export default Code;
