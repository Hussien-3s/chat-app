import Sidebar from "@/components/Sidebar"
import ChatCard from "@/components/chatCard"
import ChatArea from "@/components/ChatArea"
import { currentUser } from "@clerk/nextjs/server";
import API from "@/config/axiosConfig"

interface User {
  id: string
  fullName: string
}

async function getChats(userId: string | undefined) {
  if (!userId) return [];
  const response = await API.get(`/get-conversations/${userId}`)
  return response.data
}

async function getUsername(id: string) {
  const response = await API.get(`/get-user-by-id/${id}`)
  return response.data
}

export default async function Home() {
  const user = await currentUser();
  const chats = await getChats(user?.id)
  const friendId = chats[0]?.participants?.filter((participant: any) => participant !== user?.id)[0]
  const friendReq = await getUsername(friendId)
  const friendName = friendReq?.name
  const mapChats = chats.map((chat: any) => (
    <ChatCard key={chat._id} name={friendName} lastMessage={chat.lastMessage.text} senderId={chat.lastMessage.senderId} time={chat.createdAt} active={true} conversationId={chat._id} unread={chat.lastMessage.seen} />
  ))

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Chat List Sidebar */}
      <div className="w-[350px] flex flex-col border-r border-white/5 bg-[#0e0e0e] z-10">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Message</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          {mapChats}
        </div>
      </div>

      {/* Main Chat Area */}
      <ChatArea senderId={user?.id || "undefined"} allow={true} messages={[]} name={user?.fullName || "User"} online={"Online"} messageRequest={""} />
    </div>
  );
}
