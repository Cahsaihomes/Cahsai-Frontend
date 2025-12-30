"use client";

import ChatReply from "@/components/ui/chatreply";
import NotificationCard from "@/components/ui/notificationcard";
import React, { useState } from "react";

const ChatNotification = () => {
  const [showReply, setShowReply] = useState(false);

  const notifications = [
    {
      agentName: "Agent name",
      timeAgo: "2 hours ago",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      isOnline: true,
      videoAttachments: [
        {
          title: "House Video",
          size: "1.2 MB",
          thumbnail:
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
        },
        {
          title: "Kitchen Video",
          size: "900 KB",
          thumbnail:
            "https://images.pexels.com/photos/279618/pexels-photo-279618.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
        },
        {
          title: "Bedroom Video",
          size: "1.1 MB",
          thumbnail:
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
        },
      ],
      hasReacted: true,
      reactionCount: 1,
    },
  ];

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
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              agentName={notification.agentName}
              timeAgo={notification.timeAgo}
              message={notification.message}
              isOnline={notification.isOnline}
              videoAttachments={notification.videoAttachments}
              hasReacted={notification.hasReacted}
              reactionCount={notification.reactionCount}
              onReply={() => setShowReply(true)}
            />
          ))}
        </div>

        {/* Chat Reply Modal */}
        {showReply && <ChatReply onClose={() => setShowReply(false)} />}
      </div>
    </div>
  );
};

export default ChatNotification;
