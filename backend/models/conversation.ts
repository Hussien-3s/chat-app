import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: String,
                required: true,
            },
        ],
        lastMessage: {
            text: String,
            senderId: String,
            seen: { type: Boolean, default: false },
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;