"use client";

import React from "react";

export default function CreatorNotifications() {
  const notifications = [
    {
      title: "Post Published",
      items: ["Your new Clipp is live!"],
    },
    {
      title: "Payouts/Performance",
      items: ["You’ve earned $__ from engagement this week."],
    },
    {
      title: "Engagement Updates",
      items: ["Your Clipp hit 5,000 views!"],
    },
  ];

  const miscMessages = [
    "Your last post made 300 buyers stop scrolling — ready for your next drop?",
    "New trends in your city are heating up. Want to ride the wave?",
  ];

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-8 rounded-md">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
        Notifications
      </h1>

      <div className="space-y-6">
        {/* Normal Sections */}
        {notifications.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="space-y-3 bg-blue-50 p-6 sm:p-8 rounded-lg"
          >
            {/* Section Title */}
            {section.title && (
              <h2 className="text-sm sm:text-base font-medium text-gray-800">
                {section.title}
              </h2>
            )}

            {/* Messages */}
            {section.items.map((msg, msgIndex) => (
              <div
                key={msgIndex}
                className="text-sm sm:text-base p-3 sm:p-4 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm"
              >
                {msg}
              </div>
            ))}
          </div>
        ))}

        {/* Last Two Blue Boxes */}
        {miscMessages.map((msg, index) => (
          <div
            key={index}
            className="bg-blue-50 text-black text-sm sm:text-base p-4 sm:p-6 rounded-lg"
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
