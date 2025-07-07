import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { SearchIcon, Send } from "lucide-react";

// Placeholder data
const conversations = [
    {
        id: 1,
        name: "Jamie Smith",
        lastMessage: "Absolutely! I live near Santa Monica and can...",
        time: "11:10 AM",
        unread: true,
        online: true,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        campaign: "Summer Product Showcase",
        messages: [
            {
                id: 1,
                sender: "me",
                text:
                    "Hi Jamie! Thanks for applying to our Summer Product Showcase campaign. I loved your portfolio and think you'd be a great fit.",
                time: "10:30 AM",
            },
            {
                id: 2,
                sender: "them",
                text:
                    "Thanks Alex! I'm excited about the opportunity to work with your brand. I've been following SunStyle for a while and love your products.",
                time: "10:45 AM",
            },
            {
                id: 3,
                sender: "me",
                text:
                    "Great to hear! For this campaign, we're looking for beach and outdoor lifestyle shots. Do you think you could shoot at a local beach?",
                time: "11:02 AM",
            },
            {
                id: 4,
                sender: "them",
                text:
                    "Absolutely! I live near Santa Monica and can shoot there. I was thinking of a sunset shoot to get that golden hour look.",
                time: "11:10 AM",
            },
        ],
    },
    {
        id: 2,
        name: "Alex Rodriguez",
        lastMessage: "I can deliver the photos by next Friday. Would...",
        time: "Yesterday",
        unread: false,
        online: false,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        campaign: "Summer Product Showcase",
        messages: [],
    },
    {
        id: 3,
        name: "Sarah Johnson",
        lastMessage: "I understand. Thank you for considering my a...",
        time: "2 days ago",
        unread: false,
        online: true,
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        campaign: "Summer Product Showcase",
        messages: [],
    },
];

export default function Chat() {
    const [selectedId, setSelectedId] = useState(conversations[0].id);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedConversation = conversations.find((c) => c.id === selectedId);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedId, selectedConversation?.messages.length]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && window.innerWidth < 768) {
                const sidebar = document.querySelector('[data-sidebar]');
                const hamburger = document.querySelector('[data-hamburger]');
                if (sidebar && !sidebar.contains(event.target as Node) &&
                    hamburger && !hamburger.contains(event.target as Node)) {
                    setSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Handle escape key to close sidebar
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [sidebarOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            // Add message logic here
            setInput("");
            // Focus input after sending
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleConversationSelect = (id: number) => {
        setSelectedId(id);
        setSidebarOpen(false);
        // Focus input when conversation changes
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <div className="w-full h-[92vh] flex flex-col bg-background">
            {/* Mobile Header - Only show when sidebar is closed */}
            {!sidebarOpen && (
                <div className="md:hidden flex items-center justify-between px-4 py-4 border-b bg-background">
                    <button
                        data-hamburger
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open conversations"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="w-10 h-10 ring-2 ring-white bg-background shadow-lg">
                                <AvatarImage src={selectedConversation?.avatar} alt={selectedConversation?.name} />
                                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                    {selectedConversation?.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            {selectedConversation?.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate text-slate-900 dark:text-white">
                                {selectedConversation?.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {selectedConversation?.campaign}
                            </span>
                        </div>
                    </div>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div
                    data-sidebar
                    className={cn(
                        "flex flex-col w-full max-w-sm border-r bg-background transition-all duration-300 ease-in-out",
                        "md:relative md:translate-x-0 md:shadow-none",
                        sidebarOpen
                            ? "fixed inset-0 z-50 translate-x-0 shadow-2xl"
                            : "fixed inset-0 z-50 -translate-x-full md:relative md:translate-x-0"
                    )}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between gap-2 px-6 py-5 border-b bg-background">
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Messages</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {conversations.length} conversations
                            </span>
                        </div>
                        <button
                            className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close conversations"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-3">
                        <div className="relative">
                            <Input
                                placeholder="Search messages..."
                                className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <ScrollArea className="flex-1 scrollbar-hide-mobile">
                        <nav className="flex flex-col gap-1 p-3">
                            {conversations.map((c) => (
                                <button
                                    key={c.id}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-4 text-left transition-all duration-200 w-full rounded-2xl",
                                        "hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.98] touch-manipulation",
                                        "border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                                        selectedId === c.id
                                            ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-700 shadow-sm"
                                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                    onClick={() => handleConversationSelect(c.id)}
                                    aria-current={selectedId === c.id}
                                >
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800 shadow-md">
                                            <AvatarImage src={c.avatar} alt={c.name} />
                                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                                {c.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {c.online && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm truncate">{c.name}</span>
                                            {c.unread && (
                                                <Badge className="ml-1 h-2 w-2 bg-pink-500 text-white p-0 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate block mt-1 font-medium">
                                            {c.campaign}
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate block mt-1">
                                            {c.lastMessage}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                            {c.time}
                                        </span>
                                        {c.unread && (
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-background min-w-0">
                    {/* Desktop Header */}
                    <div className="hidden md:flex items-center gap-4 px-6 py-5 border-b bg-background">
                        <div className="relative">
                            <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800 shadow-lg">
                                <AvatarImage src={selectedConversation?.avatar} alt={selectedConversation?.name} />
                                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                    {selectedConversation?.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            {selectedConversation?.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-lg truncate text-slate-900 dark:text-white">
                                {selectedConversation?.name}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {selectedConversation?.campaign}
                            </span>
                        </div>
                        <div className="ml-auto">
                            <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                View Details
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 px-4 py-4 md:py-6 scrollbar-hide-mobile">
                        <div className="space-y-4 md:space-y-5">
                            {selectedConversation?.messages.length ? (
                                selectedConversation.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
                                            msg.sender === "me" ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "rounded-2xl px-5 py-3.5 text-sm shadow-sm break-words",
                                                "max-w-full word-wrap backdrop-blur-sm",
                                                msg.sender === "me"
                                                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg"
                                                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-md"
                                            )}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-1">
                                            {msg.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                                    <div className="text-6xl mb-6">💬</div>
                                    <p className="text-lg font-medium mb-2">No messages yet</p>
                                    <p className="text-sm">Start a conversation with {selectedConversation?.name}!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <form
                        className="flex items-end gap-3 px-4 py-4 border-t bg-background"
                        onSubmit={handleSendMessage}
                    >
                        <div className="flex-1 min-w-0">
                            <Input
                                ref={inputRef}
                                className="w-full bg-background border-slate-200 dark:border-slate-700  dark:focus:border-pink-600 transition-all duration-200 resize-none rounded-2xl px-4 py-3"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                autoComplete="off"
                                aria-label="Type a message"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e as any);
                                    }
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!input.trim()}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 h-10 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            <Send />
                            <span className="hidden md:inline font-medium">Send</span>
                        </Button>
                    </form>
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
