"use client";

import { Clock, MapPin, User } from "lucide-react";

interface FallbackLeadCardProps {
  name: string;
  price: string;
  address: string;
  date: string;
  time: string;
  timer: string;
  dateTime: string;
  claimPrice: string;
  onCancel: () => void;
  onClaim: () => void;
  claimLoading?: boolean;
}

export default function FallbackLeadCard({
  name,
  price,
  address,
  date,
  time,
  timer,
  claimPrice,
  onCancel,
  onClaim,
  claimLoading = false,
}: FallbackLeadCardProps) {
  const isExpired = timer === "Expired" || timer.includes("00:00");

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow relative">
      {/* Timer Badge */}
      <span
        className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full font-semibold ${
          isExpired
            ? "text-gray-500 bg-gray-100"
            : "text-red-600 bg-red-50"
        }`}
      >
        {timer}
      </span>

      {/* Name */}
      <div className="flex items-center gap-2 mb-1 pr-20">
        <User size={16} className="text-gray-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
      </div>

      {/* Price */}
      <p className="text-base font-semibold text-gray-900 mb-3">{price}</p>

      {/* Address */}
      <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">{address}</span>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Clock size={14} className="flex-shrink-0" />
        <span>
          {date}, {time}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          disabled={claimLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClaim}
          className={`flex-1 bg-[#6F8375] text-white rounded-lg py-2 text-sm hover:bg-[#5a6b60] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            claimLoading ? "opacity-60" : ""
          }`}
          disabled={claimLoading || isExpired}
        >
          {claimLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Claiming...
            </span>
          ) : isExpired ? (
            "Expired"
          ) : (
            `Claim Now${claimPrice ? ` ${claimPrice}` : ""}`
          )}
        </button>
      </div>
    </div>
  );
}