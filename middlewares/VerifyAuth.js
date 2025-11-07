import jwt from "jsonwebtoken";
import { ExpressError } from "./ExpressError.js";
export const VerifyAuth = (req, res, next) => {
    try {
        const token = req.cookies.cookie;
        // console.log("token: ", token)
        if (!token) return next(new ExpressError(401, "no token"))
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "image")
        req.user = decoded;
        next()
    } catch (e) {
        next(new ExpressError(403, "Invalid token"))
    }

}