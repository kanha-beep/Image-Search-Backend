import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import {ExpressError} from "../middlewares/ExpressError.js"
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = crypto.randomBytes(8).toString("hex") + ext;
        cb(null, unique);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new ExpressError(401, "Only image files are allowed"), false);
};
const limits = { fileSize: 5 * 1024 * 1024 };

export const uploads = multer({ storage, fileFilter, limits });