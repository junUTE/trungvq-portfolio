import mongoose from "mongoose";

let hasConnected = false;

export async function connectToDatabase() {
  if (hasConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(mongoUri);
  hasConnected = true;

  return mongoose.connection;
}
