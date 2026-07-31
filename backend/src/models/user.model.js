import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      trim: true,
      default: ""
    },
    avatarPublicId: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin"
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
