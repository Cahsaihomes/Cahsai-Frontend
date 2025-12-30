"use client";

import { MapPin, Clock, User, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ActiveLeadCardProps {
  leadId: string;
  name: string;
  status?: string;
  price: string;
  address: string;
  date: string;
  time: string;
  timeAgo: string;
  timer: string; // ✅ Added timer prop
  onStatusChange?: (status: string) => void;
  onViewDetails: () => void;
  onCallBuyer: () => void;
}

const statusColors: Record<string, string> = {
  "New lead": "bg-[#E8F2FF] text-[#2F80ED]",
  "Awaiting Call": "bg-[#E8F4FF] text-[#2D9CDB]",
  "Confirmed Claimed": "bg-[#E6F4EA] text-[#219653]",
  "Needs Follow-up": "bg-[#F0EBFF] text-[#9B51E0]",
  "Unresponsive": "bg-[#FFF4EC] text-[#EB5757]",
};

const statusOptions = [
  "New lead",
  "Awaiting Call",
  "Confirmed Claimed",
  "Needs Follow-up",
  "Unresponsive",
];

export default function ActiveLeadCard({
  leadId,
  name,
  status: initialStatus,
  price,
  address,
  date,
  time,
  timeAgo,
  timer,
  onStatusChange,
  onViewDetails,
  onCallBuyer,
}: ActiveLeadCardProps) {
  const [status, setStatus] = useState(initialStatus || "New lead");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Update local status when prop changes
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const handleSelectStatus = (option: string) => {
    setStatus(option);
    setMenuOpen(false);
    
    // Call parent handler
    if (onStatusChange) {
      onStatusChange(option);
    }
  };

  const isExpired = timer === "Expired" || timer === "00:00";

  return (
    <div className="relative border border-gray-200 rounded-lg p-4 w-full shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Timer Badge - Fixed positioning */}
      <div className="absolute -top-2 -right-2 z-10">
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${
          isExpired 
            ? "bg-gray-500 text-white" 
            : "bg-[#6F8375] text-white"
        }`}>
          {isExpired ? "Expired" : `${timer} left`}
        </div>
      </div>

      {/* Name + Status + Menu */}
      <div className="flex items-start justify-between mb-2 pr-16">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 min-w-0">
          <User size={14} className="flex-shrink-0" />
          <span className="truncate">{name}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0" ref={menuRef}>
          {status && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                statusColors[status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </span>
          )}

          {/* Three dots menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Status menu"
              type="button"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectStatus(option)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        status === option ? "bg-gray-50 font-medium" : ""
                      }`}
                      type="button"
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          statusColors[option]?.split(" ")[0] || "bg-gray-300"
                        }`}
                      />
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price */}
      <p className="text-gray-900 font-semibold text-base mb-3">{price}</p>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-2">
        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">{address}</span>
      </div>

      {/* Date + Time */}
      <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="flex-shrink-0" />
          <span>
            {date}, {time}
          </span>
        </div>
        <span className="text-gray-400 whitespace-nowrap text-xs">{timeAgo}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-md hover:bg-gray-50 transition-colors font-medium"
          type="button"
        >
          View Details
        </button>
        <button
          onClick={onCallBuyer}
          className="flex-1 bg-[#6F8375] text-white text-sm py-2 rounded-md hover:bg-[#5a6b60] transition-colors font-medium"
          type="button"
        >
          Call Buyer
        </button>
      </div>
    </div>
  );
}