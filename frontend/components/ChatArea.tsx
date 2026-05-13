"use client"

import { MoreVertical, Plus, Smile, Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRef, useState, useEffect } from "react"
import { io } from "socket.io-client";
import axios from "axios"

const Message = ({ content, sent = false, messageRequest }: { content: string, sent?: boolean, messageRequest: string }) => (
    <div className={`flex flex-col ${sent ? 'items-end' : 'items-start'} mb-6`}>
        <div className={`max-w-[70%] px-4 py-2.5 ${sent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
            <p className="text-[14px] leading-relaxed">{content}</p>
        </div>
    </div>
)

const socket = io("http://localhost:8080");

export default function ChatArea({ allow, messages, name, online, messageRequest, senderId }: { allow: boolean, messages: any, name: string, online: string, messageRequest: string, senderId: string }) {
    const [messageInput, setMessageInput] = useState("")
    const [messagesArray, setMessagesArray] = useState(messages)
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!messageRequest) return;

        socket.emit("join_room", messageRequest);

        socket.on("receive_message", (data) => {
            setMessagesArray((prev: any) => [...prev, data])
        });

        return () => {
            socket.off("receive_message");
        };
    }, [messageRequest]);

    const mapMessages = messagesArray.map((message: any, index: number) => (
        <Message messageRequest={messageRequest} key={index} content={message.message} sent={message.senderId === senderId} />
    ))

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesArray]);

    const handelSendMessage = async () => {
        if (messageInput == "") {
            return
        }

        if (senderId === "undefined") {
            return
        }
        await axios.post("http://localhost:8080/api/send-message", {
            conversationId: messageRequest,
            senderId: senderId,
            message: messageInput
        })

        setMessagesArray([...messagesArray, { message: messageInput, senderId: senderId, createdAt: new Date().toISOString() }])
        setMessageInput("")

        socket.emit("send_message", {
            conversationId: messageRequest,
            senderId: senderId,
            message: messageInput
        })

        const updatedConversation = await axios.patch(`http://localhost:8080/api/update-last-message/${messageRequest}`)
        console.log(updatedConversation.data)
    }

    return (
        <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
            <header className="h-20 flex items-center justify-between px-8 glass-header z-10">
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white">{name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-sm font-semibold text-white">{name}</h2>
                        <span className="text-[10px] text-green-500 font-medium">{online}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-gray-400">
                    <MoreVertical size={20} className="cursor-pointer hover:text-white transition-colors" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="flex flex-col">
                    {mapMessages}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 bg-[#121212] border border-white/5 p-2 px-4 rounded-2xl focus-within:border-blue-500/50 transition-all duration-300 shadow-xl">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-200 placeholder:text-gray-500 py-2"
                        value={messageInput}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handelSendMessage()
                            }
                        }}
                        onChange={(e) => {
                            setMessageInput(e.target.value)
                        }}
                    />
                    <div className="flex items-center gap-2">
                        <button onClick={handelSendMessage} disabled={allow} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
