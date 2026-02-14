import { ExpressError } from "../middlewares/ExpressError.js";
import { Image } from "../schemas/ImagesSchema.js"
import { Search } from "../schemas/SearchSchema.js"
import cloudinary from "../config/cloudinary.js"
export const newImage = async (req, res, next) => {
    console.log("files recd: ", req.file);
    // console.log("user: ", req.user)
    const { title } = req.body;
    let imageUrl = null;
    console.log("Image upload starts");
    if (req.file) {
        // console.log("1")
        // const b64 = Buffer.from(req.file.buffer).toString("base64");
        // console.log("2")
        // const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        // console.log("3")
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            console.log("resilt: ", result)
            imageUrl = result.secure_url;
            console.log("Image uploaded successfully:", imageUrl);
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return next(new ExpressError("Error uploading image", 500));
        }

    }
    const image = await Image.create({ title: title, imageUrl: imageUrl, user: req.user._id })
    if (!image) return next(new ExpressError(401, "No image uploaded"));
    // console.log("image uploaded: ", image);
    res.json(image)
}
export const allImages = async (req, res, next) => {
    console.log('search', req.query.search)
    const search = req.query.search
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" }
    // console.log("query", query)
    const images = await Image.find(query).populate("user");
    // console.log("all images: ", images);
    // console.log("test :", req.user._id)
    if (search) {
        await Search.findOneAndUpdate(
            { term: search },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        )
        // await Search.deleteMany()
        const save = await Search.create({
            term: search,
            user: req.user?._id,
        });
        // console.log("search save: ", save)
    }
    // console.log("search valuyes: ", images)
    if (!images) return next(new ExpressError(401, "No image is there to show"))
    res.json(images)
}
export const singleImages = async (req, res, next) => {
    // console.log("single starts", req.params.id)
    const images = await Image.findById(req.params.id).populate("user");
    // console.log("single image: ", images)
    if (!images) return next(new ExpressError(401, "No single image found"));
    res.json(images)
}
export const updateImages = async (req, res, next) => {
    const { id } = req.params;
    // console.log("update image data: ", req.file);
    const images = await Image.findById(id)
    if (!images) return next(new ExpressError(402, "no image to update"))
    // console.log('got image to update: ', images)
    // const updated = await Image.findByIdAndUpdate(
    //     id,
    //     { imageUrl: req.file.filename },
    //     { new: true }
    // );
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            images.imageUrl = result.secure_url;
        }
        await images.save();
    // console.log("image updated: ", updated)
    res.json(updated);
}
export const deleteImages = async (req, res, next) => {
    console.log('delete starts')
    const images = await Image.findByIdAndDelete(req.params.id);
    if (!images) return next(new ExpressError(401, "no image to delete"))
    console.log("image deleted: ", images)
}
export const topSearchImages = async (req, res, next) => {
    // console.log("setart")
    const topSearch = await Search.aggregate([
        { $group: { _id: "$term", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { term: "$_id", count: 1, _id: 0 } }
    ]);
    // console.log("top serched: ", topSearch)
    if (!topSearch.length) return next(new ExpressError(404, "No top search image"))
    res.json(topSearch)
}
export const userHistory = async (req, res, next) => {
    const history = await Search.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);
    res.json(history);
};