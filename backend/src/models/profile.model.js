import mongoose from "mongoose";

const introSegmentSchema = new mongoose.Schema(
  {
    text: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    tone: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    _id: false
  }
);

const profileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      trim: true
    },
    heroTitle: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    brandInitials: {
      type: String,
      required: true,
      trim: true
    },
    headerAvatarUrl: {
      type: String,
      trim: true,
      default: ""
    },
    introSegments: {
      type: [introSegmentSchema],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Intro segments must contain at least one item."
      }
    },
    goalDescription: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    githubUrl: {
      type: String,
      trim: true,
      default: ""
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
