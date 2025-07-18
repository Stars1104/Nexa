import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { 
    SearchIcon, 
    Send, 
    Paperclip, 
    File, 
    Wifi,
    WifiOff,
    RefreshCw,
    X,
    Check,
    Clock,
    ArrowLeft,
    User,
    Mail,
    Phone,
    Download,
    ExternalLink,
    MoreVertical,
    Eye
} from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { chatService, ChatRoom, Message } from "../../services/chatService";
import { useAppSelector } from "../../store/hooks";
import { format, isToday, isYesterday } from "date-fns";

interface ChatPageProps {
    setComponent?: (component: string) => void;
}

export default function ChatPage({ setComponent }: ChatPageProps) {
    const { user } = useAppSelector((state) => state.auth);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [isCurrentUserTyping, setIsCurrentUserTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Socket.IO hook
    const {
        socket,
        isConnected,
        connectionError,
        joinRoom,
        leaveRoom,
        sendMessage,
        startTyping,
        stopTyping,
        markMessagesAsRead,
        reconnect,
    } = useSocket({ enableNotifications: false, enableChat: true });

    // Component mount/unmount tracking
    useEffect(() => {
        isMountedRef.current = true;
        
        return () => {
            isMountedRef.current = false;
            // Clear any pending timeouts
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        };
    }, []);

    // Load chat rooms on component mount
    useEffect(() => {
        if (isMountedRef.current) {
            loadChatRooms();
        }
        
        // Cleanup function to stop typing indicators when component unmounts
        return () => {
            if (selectedRoom && isCurrentUserTyping) {
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
                setIsCurrentUserTyping(false);
                stopTyping(selectedRoom.room_id);
            }
        };
    }, [selectedRoom]);

    // Clear typing users when room changes
    useEffect(() => {
        setTypingUsers(new Set());
    }, [selectedRoom?.room_id]);

    // Check for selected room from localStorage
    useEffect(() => {
        if (!isMountedRef.current) return;
        
        const selectedRoomId = localStorage.getItem('selectedChatRoom');
        if (selectedRoomId && chatRooms.length > 0) {
            const room = chatRooms.find(r => r.room_id === selectedRoomId);
            if (room) {
                setSelectedRoom(room);
                localStorage.removeItem('selectedChatRoom'); // Clear after use
            }
        }
    }, [chatRooms]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (!isMountedRef.current) return;
        
        // Use requestAnimationFrame to ensure DOM is ready
        const scrollToBottom = () => {
            if (messagesEndRef.current && isMountedRef.current) {
                try {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    console.warn('Error scrolling to bottom:', error);
                }
            }
        };
        
        requestAnimationFrame(scrollToBottom);
    }, [messages]);

    // Join/leave room when selection changes
    useEffect(() => {
        if (!isMountedRef.current) return;
        
        if (selectedRoom) {
            joinRoom(selectedRoom.room_id);
            loadMessages(selectedRoom.room_id);
            
            return () => {
                if (isMountedRef.current) {
                    leaveRoom(selectedRoom.room_id);
                }
            };
        }
    }, [selectedRoom, joinRoom, leaveRoom]);

    // Socket event listeners for real-time updates
    useEffect(() => {
        if (!socket || !isMountedRef.current) return;

        // Listen for new messages from other users
        const handleNewMessage = (data: any) => {
            if (!isMountedRef.current) return;
            
            if (data.roomId === selectedRoom?.room_id) {
                // Only add message if it's from another user (not the current user)
                if (data.senderId !== user?.id) {
                    const newMessage: Message = {
                        id: data.messageId || Date.now(), // Use server ID if available
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
                        created_at: data.timestamp || new Date().toISOString(),
                    };
                    
                    setMessages(prev => [...prev, newMessage]);
                    
                    // Mark as read if it's not from current user
                    markMessagesAsRead(data.roomId, [newMessage.id]);
                }
            }
            
            // Update conversation list
            loadChatRooms();
        };

        // Listen for typing indicators
        const handleUserTyping = (data: any) => {
            if (!isMountedRef.current) return;
            
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
        };

        // Listen for read receipts
        const handleMessagesRead = (data: any) => {
            if (!isMountedRef.current) return;
            
            if (data.roomId === selectedRoom?.room_id) {
                setMessages(prev => 
                    prev.map(msg => 
                        data.messageIds.includes(msg.id) 
                            ? { ...msg, is_read: true, read_at: data.timestamp }
                            : msg
                    )
                );
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('user_typing', handleUserTyping);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            try {
                socket.off('new_message', handleNewMessage);
                socket.off('user_typing', handleUserTyping);
                socket.off('messages_read', handleMessagesRead);
            } catch (error) {
                console.warn('Error removing socket listeners:', error);
            }
        };
    }, [socket, selectedRoom, user, markMessagesAsRead]);

    // Auto-clear typing users after 3 seconds to prevent them from persisting
    useEffect(() => {
        if (typingUsers.size > 0) {
            const timeoutId = setTimeout(() => {
                setTypingUsers(new Set());
            }, 3000); // Clear after 3 seconds

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [typingUsers]);

    // Cleanup typing indicators when component unmounts or user navigates away
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (selectedRoom && isCurrentUserTyping) {
                stopTyping(selectedRoom.room_id);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden && selectedRoom && isCurrentUserTyping) {
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
                setIsCurrentUserTyping(false);
                stopTyping(selectedRoom.room_id);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            // Cleanup typing indicators on unmount
            if (selectedRoom && isCurrentUserTyping) {
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
                setIsCurrentUserTyping(false);
                stopTyping(selectedRoom.room_id);
            }
        };
    }, [selectedRoom, isCurrentUserTyping, stopTyping]);

    const loadChatRooms = async () => {
        if (!isMountedRef.current) return;
        
        try {
            setIsLoading(true);
            const rooms = await chatService.getChatRooms();
            if (isMountedRef.current) {
                setChatRooms(rooms);
                if (rooms.length > 0 && !selectedRoom) {
                    setSelectedRoom(rooms[0]);
                }
            }
        } catch (error) {
            console.error('Error loading chat rooms:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    // Handle conversation selection
    const handleConversationSelect = async (room: ChatRoom) => {
        if (!isMountedRef.current) return;
        
        // Stop typing indicator for previous room
        if (selectedRoom && isCurrentUserTyping) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
            setIsCurrentUserTyping(false);
            stopTyping(selectedRoom.room_id);
        }
        
        // Clear typing users for previous room
        setTypingUsers(new Set());
        
        setSelectedRoom(room);
        
        // Load messages for the selected room
        await loadMessages(room.room_id);
        
        // Focus input
        setTimeout(() => {
            if (inputRef.current && isMountedRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const loadMessages = async (roomId: string) => {
        if (!isMountedRef.current) return;
        
        try {
            const response = await chatService.getMessages(roomId);
            if (isMountedRef.current) {
                setMessages(response.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom || (!input.trim() && !selectedFile)) return;

        try {
            let newMessage: Message;
            
            if (selectedFile) {
                newMessage = await sendMessage(selectedRoom.room_id, input.trim() || selectedFile.name, selectedFile);
                if (isMountedRef.current) {
                    setSelectedFile(null);
                    setFilePreview(null);
                }
            } else {
                newMessage = await sendMessage(selectedRoom.room_id, input.trim());
            }

            if (isMountedRef.current) {
                // Add the message to the UI immediately for better UX
                // The message from the API response is already complete with proper ID
                setMessages(prev => [...prev, newMessage]);
                setInput("");
                
                // Stop typing indicator immediately when message is sent
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
                setIsCurrentUserTyping(false);
                stopTyping(selectedRoom.room_id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isMountedRef.current) return;
        
        setInput(e.target.value);
        
        // Handle typing indicators
        if (selectedRoom) {
            // Clear any existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Start typing indicator immediately when user types
            if (!isCurrentUserTyping) {
                setIsCurrentUserTyping(true);
                startTyping(selectedRoom.room_id);
            }
            
            // Set timeout to stop typing indicator 1 second after user stops typing
            typingTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    stopTyping(selectedRoom.room_id);
                    setIsCurrentUserTyping(false);
                }
            }, 1000); // 1 second delay after stopping
        }
    };

    // Handle when user stops typing (keyup event)
    const handleKeyUp = () => {
        if (!isMountedRef.current || !selectedRoom) return;
        
        // Set a shorter timeout for immediate response when user stops pressing keys
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && isCurrentUserTyping) {
                stopTyping(selectedRoom.room_id);
                setIsCurrentUserTyping(false);
            }
        }, 500); // Shorter timeout for keyup events
    };

    // Handle when input loses focus
    const handleInputBlur = () => {
        if (!isMountedRef.current || !selectedRoom) return;
        
        // Stop typing indicator immediately when input loses focus
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        
        if (isCurrentUserTyping) {
            setIsCurrentUserTyping(false);
            stopTyping(selectedRoom.room_id);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isMountedRef.current) return;
        
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (isMountedRef.current) {
                        setFilePreview(e.target?.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleBackNavigation = () => {
        // Ensure all cleanup is done before navigation
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        
        // Clear any file selections
        setSelectedFile(null);
        setFilePreview(null);
        
        // Navigate back
        setComponent?.("Minhas campanhas");
    };

    const filteredRooms = chatRooms.filter(room =>
        room.other_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.campaign_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'MMM d');
        }
    };

    // File Dropdown Component
    const FileDropdown = ({ message }: { message: Message }) => {
        const dropdownRef = useRef<HTMLDivElement>(null);
        const isOpen = openDropdowns[message.id];
        const [isDownloading, setIsDownloading] = useState(false);

        const toggleDropdown = (e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenDropdowns(prev => ({
                ...prev,
                [message.id]: !prev[message.id]
            }));
        };

        const handleOpen = () => {
            if (message.file_url) {
                window.open(message.file_url, '_blank');
            }
            setOpenDropdowns(prev => ({
                ...prev,
                [message.id]: false
            }));
        };

        const handleDownload = async () => {
            if (message.file_url && !isDownloading) {
                setIsDownloading(true);
                try {
                    // Always try fetch first for better control
                    const response = await fetch(message.file_url, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'same-origin'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const blob = await response.blob();
                    
                    // Create a blob URL
                    const blobUrl = window.URL.createObjectURL(blob);
                    
                    // Create a temporary link element
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = message.file_name || 'download';
                    link.style.display = 'none';
                    
                    // Append to body, click, and remove
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up the blob URL
                    window.URL.revokeObjectURL(blobUrl);
                    
                } catch (error) {
                    console.error('Error downloading file:', error);
                    
                    // Try fallback method for images
                    if (message.message_type === 'image') {
                        try {
                            // For images, try to create a canvas and download
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx?.drawImage(img, 0, 0);
                                
                                canvas.toBlob((blob) => {
                                    if (blob) {
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = message.file_name || 'image.jpg';
                                        link.style.display = 'none';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                    }
                                }, 'image/jpeg', 0.9);
                            };
                            
                            img.onerror = () => {
                                console.error('Image load failed for canvas fallback');
                                alert('Unable to download image. Please try opening it in a new tab and saving manually.');
                            };
                            
                            img.src = message.file_url;
                        } catch (canvasError) {
                            console.error('Canvas fallback failed:', canvasError);
                            alert('Unable to download file. Please try opening it in a new tab and saving manually.');
                        }
                    } else {
                        // For other files, try direct download
                        try {
                            const link = document.createElement('a');
                            link.href = message.file_url;
                            link.download = message.file_name || 'download';
                            link.target = '_blank';
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } catch (fallbackError) {
                            console.error('Fallback download failed:', fallbackError);
                            alert('Unable to download file. Please try opening it in a new tab and saving manually.');
                        }
                    }
                } finally {
                    setIsDownloading(false);
                }
            }
            setOpenDropdowns(prev => ({
                ...prev,
                [message.id]: false
            }));
        };

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setOpenDropdowns(prev => ({
                        ...prev,
                        [message.id]: false
                    }));
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen, message.id]);

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="File options"
                >
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>
                
                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                        <button
                            onClick={handleOpen}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Open
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderMessageContent = (message: Message) => {
        if (message.message_type === 'file') {
            return (
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                            <File className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                {message.file_name}
                            </span>
                            {message.formatted_file_size && (
                                <span className="text-xs text-slate-500">
                                    ({message.formatted_file_size})
                                </span>
                            )}
                        </div>
                        <FileDropdown message={message} />
                    </div>
                    {message.message && message.message !== message.file_name && (
                        <p className="text-sm">{message.message}</p>
                    )}
                </div>
            );
        } else if (message.message_type === 'image') {
            return (
                <div className="space-y-2">
                    {message.file_url && (
                        <div className="relative group">
                            <img
                                src={message.file_url}
                                alt={message.file_name || 'Image'}
                                className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer"
                                onClick={() => window.open(message.file_url, '_blank')}
                            />
                            <div className="absolute top-2 right-2">
                                <FileDropdown message={message} />
                            </div>
                        </div>
                    )}
                    {message.message && (
                        <p className="text-sm">{message.message}</p>
                    )}
                </div>
            );
        }
        
        return <p className="text-sm">{message.message}</p>;
    };

    return (
        <div className="flex h-full bg-background">
            {/* Mobile Hamburger Button */}
            <button
                data-hamburger
                className="md:hidden fixed top-4 left-16 z-50 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open conversations"
            >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div
                    data-sidebar
                    className={cn(
                        "flex flex-col w-full max-w-sm border-r bg-background transition-all duration-300 ease-in-out",
                        "md:relative md:translate-x-0 md:shadow-none",
                        sidebarOpen
                            ? "fixed inset-0 z-40 translate-x-0 shadow-2xl"
                            : "fixed inset-0 z-40 -translate-x-full md:relative md:translate-x-0"
                    )}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between gap-2 px-6 py-5 border-b bg-background">
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Conversas</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {chatRooms.length} conversas
                                </span>
                                {connectionError && (
                                    <div className="flex items-center gap-1 text-red-500">
                                        <WifiOff className="w-3 h-3" />
                                        <span className="text-xs">Offline</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {connectionError && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={reconnect}
                                className="p-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        )}
                        <button
                            className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close conversations"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-3">
                        <div className="relative">
                            <Input
                                placeholder="Buscar conversas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : filteredRooms.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    <div className="text-4xl mb-2">💬</div>
                                    <p className="text-sm">Nenhuma conversa encontrada</p>
                                </div>
                            ) : (
                                filteredRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2",
                                            selectedRoom?.id === room.id
                                                ? "bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={`http://localhost:8000${room.other_user.avatar}`} />
                                            <AvatarFallback className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400">
                                                {room.other_user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                                    {room.other_user.name}
                                                </h3>
                                                {room.last_message_at && (
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {formatMessageTime(room.last_message_at)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                                {room.campaign_title}
                                            </p>
                                            {room.last_message && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {room.last_message.is_sender ? "Você: " : ""}
                                                    {room.last_message.message}
                                                </p>
                                            )}
                                        </div>
                                        {room.unread_count > 0 && (
                                            <Badge className="ml-auto bg-pink-500 text-white text-xs">
                                                {room.unread_count}
                                            </Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedRoom ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b bg-background">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={`http://localhost:8000${selectedRoom.other_user.avatar}`} />
                                        <AvatarFallback className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400">
                                            {selectedRoom.other_user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-slate-900 dark:text-white">
                                            {selectedRoom.other_user.name}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {selectedRoom.campaign_title}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isConnected ? (
                                        <div className="flex items-center gap-1 text-green-500">
                                            <Wifi className="w-4 h-4" />
                                            <span className="text-xs">Online</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-500">
                                            <WifiOff className="w-4 h-4" />
                                            <span className="text-xs">Offline</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex gap-3",
                                                message.is_sender ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {!message.is_sender && (
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={`http://localhost:8000${selectedRoom.other_user.avatar}`} />
                                                    <AvatarFallback className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 text-xs">
                                                        {selectedRoom.other_user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div
                                                className={cn(
                                                    "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                                                    message.is_sender
                                                        ? "bg-pink-500 text-white"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                                )}
                                            >
                                                {renderMessageContent(message)}
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs opacity-70">
                                                        {formatMessageTime(message.created_at)}
                                                    </span>
                                                    {message.is_sender && (
                                                        <div className="flex items-center gap-1">
                                                            {message.is_read ? (
                                                                <div className="flex items-center gap-0.5">
                                                                    <Check className="w-3 h-3" />
                                                                    <Check className="w-3 h-3 -ml-1" />
                                                                </div>
                                                            ) : (
                                                                <Clock className="w-3 h-3" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
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

                                {/* File preview */}
                                {selectedFile && (
                                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" className="w-8 h-8 rounded object-cover" />
                                        ) : (
                                            <File className="w-8 h-8 text-slate-500" />
                                        )}
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            {selectedFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                            }}
                                            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                <div className="flex-1 relative">
                                    <Input
                                        ref={inputRef}
                                        className="w-full bg-background border-slate-200 dark:border-slate-700 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200 resize-none rounded-2xl px-4 py-3"
                                        placeholder="Digite uma mensagem..."
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
                                        onKeyUp={handleKeyUp}
                                        onBlur={handleInputBlur}
                                    />
                                    
                                    {/* Typing Indicator */}
                                    {typingUsers.size > 0 && (
                                        <div className="absolute -top-8 left-0 right-0 flex items-center gap-2 px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                                    {Array.from(typingUsers).length === 1 
                                                        ? `${Array.from(typingUsers)[0]} está digitando...`
                                                        : `${Array.from(typingUsers).join(', ')} estão digitando...`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={(!input.trim() && !selectedFile) || !selectedRoom}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 h-10 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl"
                                >
                                    <Send />
                                    <span className="hidden md:inline font-medium">Enviar</span>
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-slate-500 dark:text-slate-400">
                                <div className="text-6xl mb-6">💬</div>
                                <p className="text-lg font-medium mb-2">Selecione uma conversa</p>
                                <p className="text-sm">Escolha uma conversa da barra lateral para começar a conversar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
} 