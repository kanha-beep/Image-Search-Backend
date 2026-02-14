if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv");
    dotenv.config();
}
import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js"
import ImagesRoutes from "./routes/ImagesRoutes.js"
import { connectDB } from "./db.js"
import cookieParser from "cookie-parser";
const app = express();
const allowedOrigins = process.env.FRONT_URL.split(",")
// console.log(allowedOrigins)
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
connectDB()
app.set("trust proxy", 1);
app.use(cookieParser())
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", AuthRoutes)
app.use("/api/images", ImagesRoutes)
app.use((error, req, res, next) => {
    const { status = 500, msg = "kuch to hua" } = error;
    res.status(status).json({ msg })
})

export default app;
