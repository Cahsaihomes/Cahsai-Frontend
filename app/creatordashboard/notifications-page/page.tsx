"use client";

import React, { useEffect, useState } from "react";
import notificationService from "@/app/services/notification.service";
import { Notification } from "@/app/services/notification.service";

export default function CreatorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(1, 20, false);
      setNotifications(response.notifications);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeLabel = (type: string): string => {
    const typeLabels: { [key: string]: string } = {
      comment: "New Comment",
      reply: "New Reply",
      like: "New Like",
      follow: "New Follower",
      system: "System Notification",
    };
    return typeLabels[type] || "Notification";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 sm:px-8 py-8 rounded-md flex items-center justify-center">
        <div className="text-gray-600">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 sm:px-8 py-8 rounded-md">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Notifications
        </h1>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Group notifications by type
  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const type = notification.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    },
    {} as { [key: string]: Notification[] }
  );

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-8 rounded-md">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
        Notifications
      </h1>

      <div className="space-y-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([type, items]) => (
            <div
              key={type}
              className="space-y-3 bg-blue-50 p-6 sm:p-8 rounded-lg"
            >
              {/* Section Title */}
              <h2 className="text-sm sm:text-base font-medium text-gray-800">
                {getNotificationTypeLabel(type)}
              </h2>

              {/* Messages */}
              {items.map((notification) => (
                <div
                  key={notification.id}
                  className={`text-sm sm:text-base p-3 sm:p-4 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm ${
                    !notification.isRead ? "border-blue-400" : ""
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {notification.title}
                  </div>
                  <div className="text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
