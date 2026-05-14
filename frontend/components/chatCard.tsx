"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs";
import { io } from "socket.io-client";
import { FreindName } from "@/app/actions/getFreindId";
import Link from "next/link"

const socket = io("http://localhost:8080");

export default function ChatCard({
    name,
    lastMessage,
    time,
    unread = 0,
    active = false,
    conversationId,
    senderId
}: {
    name: string,
    lastMessage: string,
    time: string,
    unread?: number,
    active?: boolean,
    conversationId: string,
    senderId: any
}) {
    const [currentLastMessage, setCurrentLastMessage] = useState(lastMessage)
    const [sender, setSender] = useState("You")
    const { user } = useUser();

    console.log("senderId :", senderId)
    console.log("userId :", user?.id)

    useEffect(() => {
        const updateSender = async () => {
            const friendData = await FreindName(senderId);
            if (user?.id === senderId) {
                setSender("You");
            } else {
                if (friendData) {
                    setSender(friendData.name);
                }
            }
        };

        updateSender();
    }, [user?.id, senderId])


    useEffect(() => {
        socket.on("update_chat_list", (newData) => {
            const updateSender = async () => {
                if (newData.conversationId === conversationId) {
                    setCurrentLastMessage(newData.message);
                    if (newData.senderId === user?.id) {
                        setSender("You")
                    } else {
                        const friendData = await FreindName(newData.sender);
                        if (friendData) {
                            setSender(friendData.name);
                        }
                    }
                }
            };

            updateSender();
        });

        return () => {
            socket.off("update_chat_list");
        };
    }, [conversationId]);

    return (
        <Link href={`/chats/${conversationId}`}>
            <div className={`flex items-center p-3 gap-3 cursor-pointer rounded-xl transition-all duration-200 group ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                <div className="relative">
                    <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                            {name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0e0e0e] rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm font-semibold truncate ${active ? 'text-white' : 'text-gray-200'}`}>
                            {name}
                        </h3>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {time}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400 truncate pr-2">
                            {sender}: {currentLastMessage}
                        </p>
                        {unread > 0 && (
                            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                {unread}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
