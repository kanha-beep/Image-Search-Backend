import { User } from "../schemas/AuthSchema.js";
import jwt from "jsonwebtoken";
import { ExpressError } from "../middlewares/ExpressError.js"
export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    // console.log("register: name: ", name, "email: ", email, "password: ", password)
    const existingUser = await User.findOne({ email });
    // console.log("existingUser: ", existingUser)
    if (existingUser) return next(new ExpressError(404, "User Already exist"));
    const user = await User.create({ name, email, password });
    // console.log("user created: ", user)
    res.status(201).json({ message: "User registered successfully", user });
}
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    // console.log("email: ", email, "password: ", password)
    const user = await User.findOne({ email });
    // console.log("user: ", user)
    if (!user) return next(new ExpressError(404, "User not found"));
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ExpressError(404, "Invalid credentials"))
    const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET || "image",
        { expiresIn: "1d" }
    );
    // console.log("user logged in: ", user)
    res.status(200).cookie("cookie", token, { httpOnly: true })
        .status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
};
export const currentUser = async (req, res, next) => {
    const user = await user.findById(req.user._id)
    if (!user) return next(new ExpressError(404, "User not found"));
    console.log("user found: ", user)
    res.json(user)
}
