"use client"

import { MessageSquare, Users, Phone, Settings } from "lucide-react"
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton, } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItem = ({ icon: Icon, active = false, href }: { icon: any, active?: boolean, href?: string }) => {
    const content = (
        <div className="relative flex items-center justify-center group w-full">
            {active && (
                <div className="absolute -left-1 w-2 h-10 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            )}
            <div className={`p-3.5 cursor-pointer rounded-2xl transition-all duration-300 ${active ? 'bg-gray-100 text-white shadow-lg shadow-blue-500/30 scale-120' : 'text-gray-400 hover:bg-white/5 hover:text-white hover:scale-105'}`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            </div>
        </div>
    );
    return href ? <Link href={href} className="w-full flex justify-center">{content}</Link> : content;
}

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 flex flex-col items-center py-8 gap-8 border-r border-white/5 bg-[#080808] z-20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 mb-2 relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                A
            </div>

            <div className="flex flex-col gap-6 flex-1 w-full px-2">
                <NavItem icon={MessageSquare} active={pathname === '/' || pathname?.startsWith('/chats')} href="/" />
                <NavItem icon={Users} active={pathname === '/new-chat'} href="/new-chat" />
            </div>

            <div className="flex flex-col gap-6 items-center justify-center w-full px-2">
                <NavItem icon={Settings} active={pathname === '/settings'} />
                <div className="mt-2 flex items-center flex-col justify-center">
                    <ClerkProvider>
                        <header className="flex justify-center flex-col items-center p-4 gap-4 h-16">
                            <Show when="signed-out">
                                <SignInButton>
                                    <button className="bg-white/10 text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer hover:bg-white/20 transition-all">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </Show>
                            <Show when="signed-in">
                                <div className="ring-2 ring-white/10 rounded-full p-0.5 shadow-lg transition-transform hover:scale-105">
                                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
                                </div>
                            </Show>
                        </header>
                    </ClerkProvider>
                </div>
            </div>
        </aside>
    )
}
