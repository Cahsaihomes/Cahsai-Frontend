"use client";

import { useState } from "react";
import {
  Search,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import type { Notification } from "../../app/services/notification.service";
import { commentService } from "../../app/services/comment.service";

export default function NotificationList() {
  const [activeTab, setActiveTab] = useState<"All" | "Unread" | "Read">("All");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  } = useNotifications(20, false); // Always fetch all notifications, filter on frontend

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !notification.isRead;
    if (activeTab === "Read") return notification.isRead;
    return true;
  });

  const handleReply = async (notification: Notification) => {
    if (!replyContent.trim() || !notification.postId || !notification.commentId) {
      return;
    }

    setIsSubmittingReply(true);
    try {
      await commentService.replyToComment(notification.commentId, {
        content: replyContent,
        isPrivate: false
      });
      
      setReplyContent("");
      setReplyingTo(null);
      
      // Mark notification as read after replying
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="max-w-full bg-white rounded-md mx-auto p-4 sm:p-5 md:p-6">
      {/* Heading */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-gray-100 rounded-lg p-1 w-full sm:w-fit">
          {["All", "Unread", "Read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading && filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading notifications...</div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No notifications found</div>
            <p className="text-sm text-gray-400">
              {activeTab === "Unread" ? "You're all caught up!" : "No notifications to display"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 sm:p-4 rounded-lg border ${
                !notification.isRead
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              } shadow-sm transition hover:shadow-md`}
            >
              {/* Profile Row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full overflow-hidden">
                    {notification.fromUser.profilePicture ? (
                      <img
                        src={notification.fromUser.profilePicture}
                        alt={notification.fromUser.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                        {notification.fromUser.fullname?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {notification.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatTimeAgo(notification.createdAt)} • {notification.isRead ? "Read" : "Unread"}
                  </p>
                </div>
              </div>

              {/* Comment Preview */}
              {notification.metadata?.commentPreview && (
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 italic">
                      "{notification.metadata.commentPreview}"
                    </p>
                  </div>
                </div>
              )}

              {/* Message Box */}
              <div className="relative mb-5">
                <p className="text-sm sm:text-base border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-700 leading-relaxed">
                  {notification.message}
                </p>

                {/* Action Buttons */}
                <div className="absolute -bottom-2 right-3 flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Mark Read
                    </button>
                  )}
                  
                  {(notification.type === "comment" || notification.type === "reply") && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === notification.id ? null : notification.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 rounded-md text-xs font-medium hover:bg-gray-100 transition-all shadow-sm border border-gray-200"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Reply
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === notification.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReply(notification)}
                      disabled={!replyContent.trim() || isSubmittingReply}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && filteredNotifications.length > 0 && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
