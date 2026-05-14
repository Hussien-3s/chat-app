import express from 'express';
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import connectDB from "./config/db";
import getRouter from "./routes/get-routs";
import postRouter from "./routes/post-routs";
import patchRouter from "./routes/patch-routs";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.set("io", io);

app.use(cors());
app.use(express.json());
app.use("/api", getRouter);
app.use("/api", postRouter);
app.use("/api", patchRouter);

io.on("connection", (socket) => {
    console.log("User Connected: " + socket.id);

    socket.on("join_room", (chatId) => {
        socket.join(chatId);
        console.log(`User joined room: ${chatId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.conversationId).emit("receive_message", data);
        io.emit("update_chat_list", data);
    });


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});
