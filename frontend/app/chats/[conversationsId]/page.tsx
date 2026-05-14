import Sidebar from "@/components/Sidebar"
import ChatCard from "@/components/chatCard"
import ChatArea from "@/components/ChatArea"
import { currentUser } from "@clerk/nextjs/server";
import { Search } from "lucide-react"
import API from "@/config/axiosConfig"

async function getChats(id: string) {
    const response = await API.get(`/get-conversations/${id}`)
    return response.data
}

async function getMessages(id: string) {
    const response = await API.get(`/get-messages/${id}`)
    return response.data
}

async function getUsername(id: string) {
    const response = await API.get(`/get-user-by-id/${id}`)
    return response.data
}

export default async function Home({ params }: { params: { conversationsId: string } }) {
    const { conversationsId } = await params;
    const messages = await getMessages(conversationsId)
    const user = await currentUser();
    const chats = await getChats(user?.id!)
    const friendId = chats[0]?.participants?.filter((participant: any) => participant !== user?.id)[0]
    const friendReq = await getUsername(friendId)
    const friendName = friendReq?.name
    const mapChats = chats?.map((chat: any) => (
        <ChatCard key={chat._id} name={friendName} senderId={chat.lastMessage.senderId} lastMessage={chat.lastMessage.text} time={chat.createdAt} active={true} conversationId={chat._id} unread={chat.lastMessage.seen} />
    ))

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />

            <div className="w-[350px] flex flex-col border-r border-white/5 bg-[#0e0e0e] z-10">
                <div className="p-6 pb-2">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
                    {mapChats}
                </div>
            </div>

            <ChatArea allow={false} messages={messages} senderId={user?.id || "undefined"} name={friendName} online={"Online"} messageRequest={conversationsId} />
        </div>
    );
}
