import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://demax:456test@cluster0.r0leldp.mongodb.net/blog-app');
    console.log("DB Connected");
}