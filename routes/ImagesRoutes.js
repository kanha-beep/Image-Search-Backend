import express from "express"
// /api /images
import { VerifyAuth } from "../middlewares/VerifyAuth.js"
import uploads from "../middlewares/multer.js"
import { allImages, newImage, singleImages, updateImages, deleteImages, topSearchImages, userHistory } from "../controllers/ImagesController.js"
import { WrapAsync } from "../middlewares/WrapAsync.js"

const route = express.Router()
route.get("/top-searches", VerifyAuth, WrapAsync(topSearchImages))
route.get("/",VerifyAuth, WrapAsync(allImages))
route.get("/history", VerifyAuth, WrapAsync(userHistory));
route.post("/new", VerifyAuth, uploads.single("image"), WrapAsync(newImage))
route.get("/:id", VerifyAuth, WrapAsync(singleImages))
route.patch("/:id", VerifyAuth, uploads.single("image"), WrapAsync(updateImages))
route.delete("/:id", VerifyAuth, WrapAsync(deleteImages))
export default route