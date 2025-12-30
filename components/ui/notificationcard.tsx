"use client";

import React from "react";
import {
  ThumbsUp,
  MessageCircle,
  Download,
  Play,
  Bell,
  Heart,
} from "lucide-react";

interface VideoAttachment {
  title: string;
  size: string;
  thumbnail: string;
}

interface NotificationProps {
  agentName: string;
  timeAgo: string;
  message: string;
  isOnline?: boolean;
  videoAttachments?: VideoAttachment[];
  hasReacted?: boolean;
  reactionCount?: number;
  onReply?: () => void;
}

const NotificationCard: React.FC<NotificationProps> = ({
  agentName,
  timeAgo,
  message,
  isOnline = false,
  videoAttachments = [],
  hasReacted = false,
  reactionCount = 1,
  onReply,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm max-w-full">
      {/* Agent Header */}
      <div className="flex items-center mb-3">
        <div className="relative mr-3">
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
            {agentName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">{timeAgo} • Unread</p>
        </div>
      </div>

      {/* Message Box */}
      <div className="relative mb-5">
        <p className="text-sm border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-700 leading-relaxed">
          {message}
        </p>

        {/* Like & Reply */}
        <div className="absolute -bottom-2 right-3 flex items-center gap-2">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
              hasReacted
                ? "bg-blue-50 text-blue-600"
                : "bg-white text-gray-500 hover:bg-gray-50 shadow-sm border border-gray-200"
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            {reactionCount > 0 && reactionCount}
          </button>
          <button
            onClick={onReply}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 rounded-md text-xs font-medium hover:bg-gray-100 transition-all shadow-sm border border-gray-200"
          >
            <MessageCircle className="w-3 h-3" />
            Reply
          </button>
        </div>
      </div>

      {/* Video Attachments */}
      {videoAttachments.length > 0 && (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-4 overflow-x-auto pb-2">
          {videoAttachments.map((video, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center sm:flex-row flex-col sm:items-center gap-3 bg-gray-50 rounded-lg p-3 w-full sm:w-auto"
            >
              <div className="w-full sm:w-16 h-28 sm:h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full sm:w-auto text-center sm:text-left">
                <div className="flex justify-between sm:items-center gap-2 sm:gap-4">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {video.title}
                  </p>
                  <button className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
                    <Download className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{video.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section: Price Drop */}
      <div className="mt-5">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          A home you saved just had a price drop!
        </h4>
        <p className="text-sm border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-700 mb-3">
          Lorem Ipsum is simply dummy text of the printing and
        </p>

        {/* Video Preview Box */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm max-w-full">
          <img
            src={
              videoAttachments[0]?.thumbnail ||
              "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
            }
            alt="House Video"
            className="w-full sm:w-24 h-40 sm:h-16 rounded-lg object-cover"
          />
          <div className="flex justify-between items-center w-full gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {videoAttachments[0]?.title || "House Video"}
              </p>
              <p className="text-xs text-gray-500">
                {videoAttachments[0]?.size || "51 MB"}
              </p>
            </div>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tour Updates */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-yellow-500" />
          <h4 className="text-sm font-medium text-gray-900">Tour Updates</h4>
        </div>
        <div className="bg-gray-50 border border-gray-300 p-3 rounded-lg text-sm text-gray-700 shadow-sm space-y-1">
          <p>Your tour with [Agent Name] is confirmed for Saturday at 2 PM</p>
          <p>
            Your tour for [Property Address] starts in 1 hour — directions
            inside
          </p>
        </div>
      </div>

      {/* Dream Drop Section */}
      <div className="mt-6 space-y-6">
        {[
          {
            title:
              "A new Dream Drop is live near your area — tap to watch.",
            icon: <Play className="w-4 h-4 text-gray-600" />,
          },
          {
            title: (
              <>
                <Heart fill="black" className="w-4 h-4 inline-block mr-1" />
                Your favorite agent just posted a new Clipp!
              </>
            ),
            icon: <Play className="w-4 h-4 text-gray-600" />,
          },
        ].map((section, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-gray-900 mb-2">
              {section.title}
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm max-w-full">
              <img
                src={
                  videoAttachments[0]?.thumbnail ||
                  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                }
                alt="House Video"
                className="w-full sm:w-24 h-40 sm:h-16 rounded-lg object-cover"
              />
              <div className="flex justify-between items-center w-full gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {videoAttachments[0]?.title || "House Video"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {videoAttachments[0]?.size || "51 MB"}
                  </p>
                </div>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  {section.icon}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCard;
