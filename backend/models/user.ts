import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

userSchema.index({ conversationId: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);
export default User;