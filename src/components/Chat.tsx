import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { SearchIcon, Send, Paperclip, Image as ImageIcon, File } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { chatService, ChatRoom, Message } from "../services/chatService";
import { useAppSelector } from "../store/hooks";
import { apiClient } from "../services/apiClient";
import { format } from "date-fns";

export default function Chat() {
    const { user } = useAppSelector((state) => state.auth);
    const [conversations, setConversations] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Socket.IO hook
    const {
        socket,
        isConnected,
        joinRoom,
        leaveRoom,
        sendMessage,
        startTyping,
        stopTyping,
        markMessagesAsRead,
        updateOnlineStatus,
    } = useSocket();

    // Load chat rooms on component mount
    useEffect(() => {
        loadChatRooms();
    }, []);

    // Update online status when component mounts/unmounts
    useEffect(() => {
        updateOnlineStatus(true);
        
        return () => {
            updateOnlineStatus(false);
        };
    }, [updateOnlineStatus]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for new messages
        socket.on('new_message', (data) => {
            if (data.roomId === selectedRoom?.room_id) {
                const newMessage: Message = {
                    id: Date.now(), // Temporary ID for real-time messages
                    message: data.message,
                    message_type: data.messageType,
                    sender_id: data.senderId,
                    sender_name: data.senderName,
                    sender_avatar: data.senderAvatar,
                    is_sender: data.senderId === user?.id,
                    file_path: data.fileData?.file_path,
                    file_name: data.fileData?.file_name,
                    file_size: data.fileData?.file_size,
                    file_type: data.fileData?.file_type,
                    file_url: data.fileData?.file_url,
                    is_read: false,
                    created_at: data.timestamp,
                };
                
                setMessages(prev => [...prev, newMessage]);
                
                // Mark as read if it's not from current user
                if (data.senderId !== user?.id) {
                    markMessagesAsRead(data.roomId, [newMessage.id]);
                }
            }
            
            // Update conversation list
            loadChatRooms();
        });

        // Listen for typing indicators
        socket.on('user_typing', (data) => {
            if (data.roomId === selectedRoom?.room_id) {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    if (data.isTyping) {
                        newSet.add(data.userName);
                    } else {
                        newSet.delete(data.userName);
                    }
                    return newSet;
                });
            }
        });

        // Listen for read receipts
        socket.on('messages_read', (data) => {
            if (data.roomId === selectedRoom?.room_id) {
                setMessages(prev => 
                    prev.map(msg => 
                        data.messageIds.includes(msg.id) 
                            ? { ...msg, is_read: true, read_at: data.timestamp }
                            : msg
                    )
                );
            }
        });

        return () => {
            socket.off('new_message');
            socket.off('user_typing');
            socket.off('messages_read');
        };
    }, [socket, selectedRoom, user, markMessagesAsRead]);

    // Load chat rooms from API
    const loadChatRooms = async () => {
        try {
            console.log('Loading chat rooms...');
            console.log('Current auth state:', { isAuthenticated: !!user, token: !!localStorage.getItem('token') });
            
            // First test the authentication using apiClient
            try {
                const testResponse = await apiClient.get('/test-auth');
                console.log('Auth test successful:', testResponse.data);
            } catch (error) {
                console.log('Auth test failed:', error);
            }
            
            const rooms = await chatService.getChatRooms();
            console.log('Chat rooms loaded:', rooms);
            setConversations(rooms);
            
            // Select first room if none selected
            if (!selectedRoom && rooms.length > 0) {
                handleConversationSelect(rooms[0]);
            }
        } catch (error) {
            console.error('Error loading chat rooms:', error);
            // If it's an auth error, the apiClient will handle the redirect
        }
    };

    // Load messages for a specific room
    const loadMessages = async (roomId: string) => {
        try {
            setIsLoading(true);
            const response = await chatService.getMessages(roomId);
            setMessages(response.messages);
            
            // Join the room for real-time updates
            joinRoom(roomId);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle conversation selection
    const handleConversationSelect = async (room: ChatRoom) => {
        // Leave previous room
        if (selectedRoom) {
            leaveRoom(selectedRoom.room_id);
        }
        
        setSelectedRoom(room);
        setSidebarOpen(false);
        
        // Load messages for the selected room
        await loadMessages(room.room_id);
        
        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Handle sending message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom || (!input.trim() && !selectedFile)) return;

        try {
            if (selectedFile) {
                await sendMessage(selectedRoom.room_id, input, selectedFile);
                setSelectedFile(null);
                setFilePreview(null);
            } else {
                await sendMessage(selectedRoom.room_id, input);
            }
            
            setInput("");
            
            // Focus input after sending
            setTimeout(() => inputRef.current?.focus(), 100);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Handle typing events
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        
        if (selectedRoom) {
            if (e.target.value.length > 0) {
                startTyping(selectedRoom.room_id);
            } else {
                stopTyping(selectedRoom.room_id);
            }
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    // Render message content based on type
    const renderMessageContent = (message: Message) => {
        if (message.message_type === 'image') {
            return (
                <div className="space-y-2">
                    <img
                        src={message.file_url}
                        alt={message.file_name}
                        className="max-w-full max-h-64 rounded-lg"
                    />
                    {message.message && (
                        <p className="text-sm">{message.message}</p>
                    )}
                </div>
            );
        } else if (message.message_type === 'file') {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <File className="w-5 h-5 text-gray-500" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{message.file_name}</p>
                            <p className="text-xs text-gray-500">{message.formatted_file_size}</p>
                        </div>
                        <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                            Download
                        </a>
                    </div>
                    {message.message && (
                        <p className="text-sm">{message.message}</p>
                    )}
                </div>
            );
        }
        
        return <p>{message.message}</p>;
    };

    return (
        <div className="w-full h-[92vh] flex flex-col bg-background">
            {/* Mobile Header - Only show when sidebar is closed */}
            {!sidebarOpen && selectedRoom && (
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
                                <AvatarImage src={selectedRoom.other_user.avatar} alt={selectedRoom.other_user.name} />
                                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                    {selectedRoom.other_user.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            {selectedRoom.other_user.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate text-slate-900 dark:text-white">
                                {selectedRoom.other_user.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {selectedRoom.campaign_title}
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
                            ? "fixed inset-0 z-0 translate-x-0 shadow-2xl"
                            : "fixed inset-0 z-0 -translate-x-full md:relative md:translate-x-0"
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
                            {conversations.map((room) => (
                                <button
                                    key={room.id}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-4 text-left transition-all duration-200 w-full rounded-2xl",
                                        "hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.98] touch-manipulation",
                                        "border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                                        selectedRoom?.id === room.id
                                            ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-700 shadow-sm"
                                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                    onClick={() => handleConversationSelect(room)}
                                    aria-current={selectedRoom?.id === room.id}
                                >
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800 shadow-md">
                                            <AvatarImage src={room.other_user.avatar} alt={room.other_user.name} />
                                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                                {room.other_user.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {room.other_user.online && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm truncate">{room.other_user.name}</span>
                                            {room.unread_count > 0 && (
                                                <Badge className="ml-1 h-2 w-2 bg-pink-500 text-white p-0 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate block mt-1 font-medium">
                                            {room.campaign_title}
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate block mt-1">
                                            {room.last_message?.message || 'No messages yet'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                            {room.last_message_at ? format(new Date(room.last_message_at), 'HH:mm') : ''}
                                        </span>
                                        {room.unread_count > 0 && (
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
                    {selectedRoom && (
                        <div className="hidden md:flex items-center gap-4 px-6 py-5 border-b bg-background">
                            <div className="relative">
                                <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800 shadow-lg">
                                    <AvatarImage src={selectedRoom.other_user.avatar} alt={selectedRoom.other_user.name} />
                                    <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                        {selectedRoom.other_user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {selectedRoom.other_user.online && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-lg truncate text-slate-900 dark:text-white">
                                    {selectedRoom.other_user.name}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {selectedRoom.campaign_title}
                                </span>
                            </div>
                            <div className="ml-auto">
                                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <ScrollArea className="flex-1 px-4 py-4 md:py-6 scrollbar-hide-mobile">
                        <div className="space-y-4 md:space-y-5">
                            {isLoading ? (
                                <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                                    <div className="text-6xl mb-6">⏳</div>
                                    <p className="text-lg font-medium mb-2">Loading messages...</p>
                                </div>
                            ) : messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
                                            msg.is_sender ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "rounded-2xl px-5 py-3.5 text-sm shadow-sm break-words",
                                                "max-w-full word-wrap backdrop-blur-sm",
                                                msg.is_sender
                                                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg"
                                                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-md"
                                            )}
                                        >
                                            {renderMessageContent(msg)}
                                        </div>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-1">
                                            {format(new Date(msg.created_at), 'HH:mm')}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                                    <div className="text-6xl mb-6">💬</div>
                                    <p className="text-lg font-medium mb-2">No messages yet</p>
                                    <p className="text-sm">Start a conversation with {selectedRoom?.other_user.name}!</p>
                                </div>
                            )}
                            
                            {/* Typing indicator */}
                            {typingUsers.size > 0 && (
                                <div className="flex items-start">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm shadow-md">
                                        <div className="flex items-center gap-1">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-slate-500 ml-2">
                                                {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                                            </span>
                                        </div>
                                    </div>
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
                        {/* File attachment button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            aria-label="Attach file"
                        >
                            <Paperclip className="w-5 h-5 text-slate-500" />
                        </button>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        
                        <div className="flex-1 min-w-0">
                            {/* File preview */}
                            {selectedFile && (
                                <div className="mb-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" className="w-10 h-10 rounded object-cover" />
                                        ) : (
                                            <File className="w-5 h-5 text-slate-500" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                            }}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            <Input
                                ref={inputRef}
                                className="w-full bg-background border-slate-200 dark:border-slate-700 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200 resize-none rounded-2xl px-4 py-3"
                                placeholder="Type a message..."
                                value={input}
                                onChange={handleInputChange}
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
                            disabled={(!input.trim() && !selectedFile) || !selectedRoom}
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
                    className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
