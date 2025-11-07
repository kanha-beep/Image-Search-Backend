import mongoose from "mongoose";

export const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  imageUrl: {
    type: String
  },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });