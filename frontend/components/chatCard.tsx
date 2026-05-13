"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { io } from "socket.io-client";
import Link from "next/link"

const socket = io("http://localhost:8080");

export default function ChatCard({
    name,
    lastMessage,
    time,
    unread = 0,
    active = false,
    conversationId
}: {
    name: string,
    lastMessage: string,
    time: string,
    unread?: number,
    active?: boolean
    conversationId: string
}) {
    const [currentLastMessage, setCurrentLastMessage] = useState(lastMessage)

    useEffect(() => {
        // الاستماع لحدث تحديث القائمة
        socket.on("update_chat_list", (newData) => {
            // ✅ نتأكد إن الرسالة دي تخص المحادثة الحالية فقط
            if (newData.conversationId === conversationId) {
                setCurrentLastMessage(newData.message);
            }
        });

        // تنظيف الـ listener عند مسح المكون
        return () => {
            socket.off("update_chat_list");
        };
    }, [conversationId]); // الـ dependency هنا مهمة

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
                            {currentLastMessage}
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
