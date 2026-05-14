"use client"

import { useState } from "react"
import axios from "axios"
import Sidebar from "@/components/Sidebar"
import { Users, UserPlus } from "lucide-react"
import { useUser } from "@clerk/nextjs";
import { FreindId } from "../actions/getFreindId";
import { useRouter } from "next/navigation";

export default function NewChatPage() {
    const [username, setUsername] = useState("")
    const [isError, setIsError] = useState(false)
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    const handelClick = async () => {
        if (!username) return;
        const id = await FreindId(username)
        if (id.clerkId == user?.id) {
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
            }, 3000)
            return
        }
        const res = await axios.post("http://localhost:8080/api/create-conversation", {
            user1: user?.id,
            user2: id.clerkId
        })
        if (res.status) {
            setIsError(false)
        }
        router.push(`/`)
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex items-center justify-center bg-[#0e0e0e] z-10 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="w-full max-w-md p-8 relative z-20">
                    <div className="bg-[#141414] flex gap-4 flex-col border border-white/5 rounded-3xl p-8 shadow-2xl">

                        <h1 className="text-3xl font-bold flex gap-2 text-white tracking-tight mb-2">New Conversation <Users /></h1>
                        <p className="text-gray-400 mb-8">Enter your friend's ID or username to start chatting.</p>


                        <div className="flex gap-4 flex-col">
                            <label className="block text-sm font-medium text-gray-300">Your Username: {user?.username}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter friend's username"
                                    className="w-full bg-[#080808] border border-white/10 rounded-xl p-10 py-3.5 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                />
                                {isError && <h3 style={{ color: "#FF1B48" }}>you can create chat with you</h3>}
                            </div>

                            <div onClick={handelClick} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                                <UserPlus size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
