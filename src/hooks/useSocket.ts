import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../store/hooks';
import { apiClient } from '../services/apiClient';

interface Message {
    id?: number;
    message: string;
    message_type: 'text' | 'file' | 'image';
    sender_id: number;
    sender_name: string;
    sender_avatar?: string;
    is_sender: boolean;
    file_path?: string;
    file_name?: string;
    file_size?: string;
    file_type?: string;
    file_url?: string;
    formatted_file_size?: string;
    is_read: boolean;
    created_at: string;
}

interface ChatRoom {
    id: number;
    room_id: string;
    campaign_id: number;
    campaign_title: string;
    other_user: {
        id: number;
        name: string;
        avatar?: string;
        online: boolean;
    };
    last_message?: {
        id: number;
        message: string;
        message_type: string;
        sender_id: number;
        is_sender: boolean;
        created_at: string;
    };
    unread_count: number;
    last_message_at?: string;
}

interface UseSocketReturn {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
    sendMessage: (roomId: string, message: string, file?: File) => void;
    startTyping: (roomId: string) => void;
    stopTyping: (roomId: string) => void;
    markMessagesAsRead: (roomId: string, messageIds: number[]) => void;
    updateOnlineStatus: (isOnline: boolean) => void;
}

export const useSocket = (): UseSocketReturn => {
    const { user } = useAppSelector((state) => state.auth);
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Initialize socket connection
    useEffect(() => {
        if (!user) return;

        const socket = io('http://localhost:3001', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            setIsConnected(true);
            
            // Join with user data
            socket.emit('user_join', {
                userId: user.id,
                userRole: user.role,
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    // Join a chat room
    const joinRoom = useCallback((roomId: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join_room', roomId);
            console.log(`Joined room: ${roomId}`);
        }
    }, [isConnected]);

    // Leave a chat room
    const leaveRoom = useCallback((roomId: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('leave_room', roomId);
            console.log(`Left room: ${roomId}`);
        }
    }, [isConnected]);

    // Send a message
    const sendMessage = useCallback(async (roomId: string, message: string, file?: File) => {
        if (!socketRef.current || !isConnected || !user) return;

        try {
            if (file) {
                // Handle file upload using apiClient
                const formData = new FormData();
                formData.append('room_id', roomId);
                formData.append('file', file);

                const response = await apiClient.post('/chat/messages', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const messageData = response.data.data;
                
                // Emit socket event for real-time delivery
                socketRef.current.emit('send_message', {
                    roomId,
                    message: messageData.message,
                    senderId: messageData.sender_id,
                    senderName: messageData.sender_name,
                    senderAvatar: messageData.sender_avatar,
                    messageType: messageData.message_type,
                    fileData: {
                        file_path: messageData.file_path,
                        file_name: messageData.file_name,
                        file_size: messageData.file_size,
                        file_type: messageData.file_type,
                        file_url: messageData.file_url,
                    },
                });
            } else {
                // Send text message using apiClient
                const response = await apiClient.post('/chat/messages', {
                    room_id: roomId,
                    message,
                });

                const messageData = response.data.data;
                
                // Emit socket event for real-time delivery
                socketRef.current.emit('send_message', {
                    roomId,
                    message: messageData.message,
                    senderId: messageData.sender_id,
                    senderName: messageData.sender_name,
                    senderAvatar: messageData.sender_avatar,
                    messageType: messageData.message_type,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [isConnected, user]);

    // Start typing indicator
    const startTyping = useCallback((roomId: string) => {
        if (socketRef.current && isConnected && user) {
            socketRef.current.emit('typing_start', {
                roomId,
                userId: user.id,
                userName: user.name,
            });
        }
    }, [isConnected, user]);

    // Stop typing indicator
    const stopTyping = useCallback((roomId: string) => {
        if (socketRef.current && isConnected && user) {
            socketRef.current.emit('typing_stop', {
                roomId,
                userId: user.id,
            });
        }
    }, [isConnected, user]);

    // Mark messages as read
    const markMessagesAsRead = useCallback((roomId: string, messageIds: number[]) => {
        if (socketRef.current && isConnected && user) {
            socketRef.current.emit('mark_read', {
                roomId,
                messageIds,
                userId: user.id,
            });
        }
    }, [isConnected, user]);

    // Update online status
    const updateOnlineStatus = useCallback(async (isOnline: true) => {
        if (!user) return;

        try {
            await apiClient.post('/chat/online-status', {
                is_online: isOnline,
                socket_id: socketRef.current?.id || null,
            });
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    }, [user]);

    return {
        socket: socketRef.current,
        isConnected,
        joinRoom,
        leaveRoom,
        sendMessage,
        startTyping,
        stopTyping,
        markMessagesAsRead,
        updateOnlineStatus,
    };
}; 