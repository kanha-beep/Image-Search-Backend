import mongoose from "mongoose";
import { authSchema } from "../models/AuthModels.js";
export const User = mongoose.model("User", authSchema);