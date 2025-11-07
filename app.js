import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoutes from "./routes/AuthRoutes.js"
import ImagesRoutes from "./routes/ImagesRoutes.js"
import { connectDB } from "./db.js"
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
connectDB()
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", AuthRoutes)
app.use("/api/images", ImagesRoutes)
app.use((error, req, res, next) => {
    const { status = 500, msg = "kuch to hua" } = error;
    res.status(status).json({ msg })
})

export default app;
