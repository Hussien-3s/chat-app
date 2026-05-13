import express from 'express'
import Conversation from '../models/conversation';
import Message from '../models/message';
import User from '../models/user';

const getRouter = express.Router()

getRouter.get('/get-conversations/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

getRouter.get('/get-username/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({
            name: username
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

getRouter.get('/get-user-by-id/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({
            clerkId: id
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


getRouter.get('/get-messages/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        const messages = await Message.find({
            conversationId: conversationId
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getRouter;