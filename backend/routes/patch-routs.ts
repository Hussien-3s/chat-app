import express from 'express'
import Conversation from '../models/conversation';
import Message from '../models/message';

const patchRouter = express.Router()

patchRouter.patch('/update-last-message/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;
    const findLastMessage = await Message.findOne({ conversationId: conversationId });
    const lastMessage = findLastMessage?.message;
    const senderId = findLastMessage?.senderId;

    try {
        const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: {
                text: lastMessage,
                senderId: senderId,
            }
        }, { new: true })

        res.status(200).json(updatedConversation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default patchRouter;