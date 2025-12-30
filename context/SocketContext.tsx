import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "../services/socketClient";

interface Message {
  chatId: string;
  senderId: number;
  content: string;
  createdAt?: string;
}

interface NotificationEvent {
  id: number;
  userId: number;
  fromUserId: number;
  type: "comment" | "reply" | "like" | "follow" | "system";
  title: string;
  message: string;
  postId?: number;
  commentId?: number;
  metadata?: any;
  fromUser: {
    id: number;
    fullname: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SocketContextType {
  chatId: string | null;
  messages: Message[];
  createOrGetRoom: (buyerId: number, agentId: number) => void;
  sendMessage: (content: string, senderId: number) => void;
  loading: boolean;
  isConnected: boolean;
  // Notification methods
  joinNotificationRoom: (userId: number) => void;
  onNewNotification: (callback: (notification: NotificationEvent) => void) => void;
  offNewNotification: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);
  const notificationCallbackRef = useRef<((notification: NotificationEvent) => void) | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();

    // Add connection event listeners
    socketRef.current.on("connect", () => {
      console.log("Socket connected successfully");
      setIsConnected(true);
    });

    socketRef.current.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    socketRef.current.on("roomReady", ({ chatId }: { chatId: string }) => {
      setChatId(chatId);
      socketRef.current.emit("joinRoom", { chatId });
      setLoading(false);
    });

    socketRef.current.on("joinedRoom", ({ chatId }: { chatId: string }) => {
      setChatId(chatId);
    });

    socketRef.current.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("history", ({ chatId, messages }: { chatId: string; messages: Message[] }) => {
      setMessages(messages);
    });

    // Listen for new notifications
    socketRef.current.on("newNotification", (notification: NotificationEvent) => {
      console.log("Received new notification:", notification);
      if (notificationCallbackRef.current) {
        notificationCallbackRef.current(notification);
      }
    });

    // Listen for notification room join confirmation
    socketRef.current.on("joinedNotificationRoom", ({ userId, room }: { userId: number; room: string }) => {
      console.log(`Successfully joined notification room for user ${userId}: ${room}`);
    });

    socketRef.current.on("disconnect", () => {
      setChatId(null);
      setMessages([]);
      setIsConnected(false);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const createOrGetRoom = (buyerId: number, agentId: number) => {
    setLoading(true);
    socketRef.current.emit("createOrGetRoom", { buyerId, agentId });
  };

  const sendMessage = (content: string, senderId: number) => {
    if (!chatId) return;
    socketRef.current.emit("sendMessage", { chatId, senderId, content });
  };

  // Notification methods
  const joinNotificationRoom = (userId: number) => {
    if (!socketRef.current || !isConnected) {
      console.warn("Socket not connected, cannot join notification room");
      return;
    }
    console.log("Joining notification room for user:", userId);
    socketRef.current.emit("joinNotificationRoom", { userId });
  };

  const onNewNotification = (callback: (notification: NotificationEvent) => void) => {
    notificationCallbackRef.current = callback;
  };

  const offNewNotification = () => {
    notificationCallbackRef.current = null;
  };

  return (
    <SocketContext.Provider value={{ 
      chatId, 
      messages, 
      createOrGetRoom, 
      sendMessage, 
      loading,
      isConnected,
      joinNotificationRoom,
      onNewNotification,
      offNewNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
};