import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
const MONGOOSE = process.env.MONGO_URI
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGOOSE)
        console.log("mongoose connected")
    } catch (e) {
        console.log("mongoose error: ", process.env.MONGO_URI, e)
    }
}