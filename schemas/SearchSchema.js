import mongoose from "mongoose";
import { SearchSchema } from "../models/SearchModels.js";
export const Search = mongoose.model("Search", SearchSchema);