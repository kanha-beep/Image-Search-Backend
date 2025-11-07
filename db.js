import mongoose from "mongoose"
const MONGOOSE = process.env.MONGOOSE || "mongodb://127.0.0.1:27017/images"
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGOOSE)
        console.log("mongoose connected")
    } catch (e) {
        console.log("mongoose error")
    }
}