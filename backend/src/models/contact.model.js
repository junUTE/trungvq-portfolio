import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },
    status: {
      type: String,
      enum: ["unread", "replied"],
      default: "unread"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    repliedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

contactSchema.index({ status: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
