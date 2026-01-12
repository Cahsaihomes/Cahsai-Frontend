"use client";

import ChatReply from "@/components/ui/chatreply";
import NotificationCard from "@/components/ui/notificationcard";
import React, { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux";

interface NotificationData {
  id: number;
  agentName: string;
  timeAgo: string;
  message: string;
  isOnline: boolean;
  videoAttachments: Array<{
    title: string;
    size: string;
    thumbnail: string;
  }>;
  hasReacted: boolean;
  reactionCount: number;
  fromUser?: {
    id: number;
    fullname: string;
    profilePicture?: string;
  };
  createdAt?: string;
}

const ChatNotification = () => {
  const [showReply, setShowReply] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { joinNotificationRoom, onNewNotification } = useSocket();
  const user = useSelector((state: RootState) => state.auth.user);

  // Join notification room and listen for new notifications
  useEffect(() => {
    if (!user?.id) return;

    // Join notification room for this user
    joinNotificationRoom(user.id);

    // Set up listener for new notifications
    const handleNewNotification = (notification: any) => {
      const timeAgo = notification.createdAt
        ? new Date(notification.createdAt).toLocaleTimeString()
        : "Just now";

      const newNotification: NotificationData = {
        id: notification.id,
        agentName: notification.fromUser?.fullname || "Agent",
        timeAgo: timeAgo,
        message: notification.message,
        isOnline: true,
        videoAttachments: [],
        hasReacted: false,
        reactionCount: 0,
        fromUser: notification.fromUser,
        createdAt: notification.createdAt,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    onNewNotification(handleNewNotification);

    return () => {
      // Cleanup
    };
  }, [user?.id, joinNotificationRoom, onNewNotification]);

  return (
    <div className="w-full">
      <div
        className="
          bg-white 
          border border-[#D5D7DA] 
          rounded-[12px] 
          shadow-sm 
          relative 
          p-3 sm:p-4 md:p-6 
          mb-4 
          max-w-full
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            Notifications
          </h1>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                agentName={notification.agentName}
                timeAgo={notification.timeAgo}
                message={notification.message}
                isOnline={notification.isOnline}
                videoAttachments={notification.videoAttachments}
                hasReacted={notification.hasReacted}
                reactionCount={notification.reactionCount}
                onReply={() => setShowReply(true)}
              />
            ))
          )}
        </div>

        {/* Chat Reply Modal */}
        {showReply && <ChatReply onClose={() => setShowReply(false)} />}
      </div>
    </div>
  );
};

export default ChatNotification;
