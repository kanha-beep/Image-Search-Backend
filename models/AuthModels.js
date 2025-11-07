import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});
authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12);
    next()
})
authSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}