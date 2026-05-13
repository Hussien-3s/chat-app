import mongoose from "mongoose";

function connectDB() {
    const dbURL = process.env.DATABASE_URL as string;

    mongoose.connect(dbURL).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
    });
}

export default connectDB;