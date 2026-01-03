import { User } from "../schemas/AuthSchema.js";
import jwt from "jsonwebtoken";
import { ExpressError } from "../middlewares/ExpressError.js"
const genToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email, roles: user.roles },
        process.env.JWT_SECRET || "image",
        { expiresIn: "1d" }
    );
}
const isProd = process.env.NODE_ENV === "production";
export const register = async (req, res, next) => {
    console.log("register starts")
    const { name, email, password } = req.body;
    console.log("register: name: ", name, "email: ", email, "password: ", password)
    const existingUser = await User.findOne({ email });
    console.log("existingUser: ", existingUser)
    if (existingUser) return next(new ExpressError(404, "User Already exist"));
    const user = await User.create({ name, email, password });
    console.log("user created: ", user)
    const token = genToken(user);
    res.cookie("cookie", token, { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" })
        .status(201).json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email, roles: user.roles } });
}
export const login = async (req, res, next) => {
    console.log("login starts")
    const { email, password } = req.body;
    // console.log("email: ", email, "password: ", password)
    const user = await User.findOne({ email });
    // console.log("user: ", user)
    if (!user) return next(new ExpressError(404, "User not found"));
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ExpressError(404, "Invalid credentials"))
    const token = genToken(user);
    // console.log("user logged in: ", user)
    res.status(200).cookie("cookie", token, { httpOnly: true })
        .status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
        });
};
export const currentUser = async (req, res, next) => {
    const user = await user.findById(req.user._id)
    if (!user) return next(new ExpressError(404, "User not found"));
    console.log("user found: ", user)
    res.json(user)
}
export const logout = async (req, res, next) => {
    res.clearCookie("cookie", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" })
    res.status(200).json({ message: "Logout successful" });
}