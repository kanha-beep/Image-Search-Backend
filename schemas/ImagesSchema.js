import mongoose from "mongoose";
import { imageSchema } from "../models/ImagesModels.js";
export const Image = mongoose.model("Image", imageSchema);