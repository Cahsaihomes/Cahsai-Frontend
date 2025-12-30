"use client";
import React from "react";
import { X, ThumbsUp } from "lucide-react";

interface Message {
  sender: "agent" | "me";
  text: string;
  timestamp?: string;
  unread?: boolean;
}

interface ChatReplyProps {
  onClose: () => void;
}

const ChatReply: React.FC<ChatReplyProps> = ({ onClose }) => {
  const messages: Message[] = [
    {
      sender: "agent",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      timestamp: "12:00 PM",
    },
    {
      sender: "me",
      text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      timestamp: "12:40 PM",
    },
    {
      sender: "agent",
      text: "When an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      timestamp: "12/02/2025 • 02:12 PM",
      unread: true,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">
            Reply to Agent Name
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="px-4 pb-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-1">
              {/* Sender label */}
              {msg.sender === "me" && (
                <div className="text-xs font-medium text-gray-600">Me</div>
              )}
              {msg.sender === "agent" && msg.unread && (
                <div className="text-xs font-medium text-gray-600">
                  Agent Name <span className="font-semibold">• Unread</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`border border-gray-200 rounded p-3 text-sm text-gray-700 ${
                  msg.sender === "me" ? "bg-gray-50" : "bg-white"
                }`}
              >
                {msg.text}
              </div>

              {/* Action buttons */}
              {msg.sender === "agent" && (
                <div className="flex justify-end mt-2">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition">
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              {msg.timestamp && (
                <div className="text-xs text-gray-500 text-right mt-1">
                  {msg.timestamp}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-4 space-y-2 border-t border-gray-100">
          <textarea
            rows={2}
            placeholder="Write Reply"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-200 resize-none"
          />
          <button className="w-full bg-[#6F8375] text-white py-2.5 rounded font-medium hover:bg-[#5c6d62] transition-colors">
            Send
          </button>
          <div className="text-center text-xs text-gray-400 mt-1">
            End-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatReply;
