import express from "express"
// /api/auth
import { WrapAsync } from "../middlewares/WrapAsync.js"
import { register, login, currentUser, logout } from "../controllers/AuthController.js"
import { VerifyAuth } from "../middlewares/VerifyAuth.js"
const route = express.Router()
route.post("/register", WrapAsync(register))
route.post("/login", WrapAsync(login))
route.get("/me", VerifyAuth, WrapAsync(currentUser))
route.post("/logout", VerifyAuth, WrapAsync(logout))
export default route