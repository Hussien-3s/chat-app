import express from 'express'
import Conversation from '../models/conversation';
import Message from '../models/message';
import User from '../models/user';

const postRouter = express.Router()

postRouter.post("/send-message", async (req, res) => {
    const { conversationId, senderId, message } = req.body;

    try {
        const newMessage = new Message({
            conversationId,
            senderId,
            message
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

postRouter.post('/user-create', async (req, res) => {
    const { data, type } = req.body;

    if (type === 'user.created') {
        const clerkId = data.id;
        const email = data.email_addresses[0]?.email_address
        const fullName = data.username;

        const newUser = new User({
            clerkId,
            email,
            name: fullName,
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

postRouter.post("/create-conversation", async (req, res) => {
    const { user1, user2 } = req.body;

    if (user1 === user2) {
        return res.status(400).json({ message: "User1 and User2 cannot be the same" });
    }

    const conversation = await Conversation.findOne({
        participants: { $all: [user1, user2] }
    });

    if (conversation) {
        return res.status(400).json({ message: "Conversation already exists" });
    }

    try {
        const newConversation = new Conversation({
            participants: [user1, user2],
            lastMessage: {
                text: "",
                senderId: "",
                seen: false
            }
        });

        await newConversation.save();
        res.status(201).json({ message: "Conversation created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



export default postRouter;