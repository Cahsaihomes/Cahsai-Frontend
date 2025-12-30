"use client";

import { useState } from "react";
import { MapPin, Eye, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";


interface PromotionSuccessModalProps {
  onClose: () => void;
  post?: any;
  selectedTags?: string[];
  fee?: string;
}

export default function PromotionSuccessModal({
  onClose,
  post,
  selectedTags = [],
  fee = ""
}: PromotionSuccessModalProps) {

  return (
    <div className="fixed bg-black/70 backdrop-blur-sm inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center mx-4 sm:mx-0">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/checkmark-2.png"
            alt="Success"
            width={64}
            height={64}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Video Promoted Successful
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Your video has been successfully promoted, reaching the right audience
          to boost visibility, engagement, and growth.
        </p>

        {/* Post Details */}
        <div className="border rounded-lg p-4 mt-6 text-left">
          <h3 className="text-sm font-medium text-gray-800 mb-3">
            Post Details
          </h3>

          <p className="flex items-center text-gray-700 text-sm mb-2">
            <MapPin size={16} className="mr-2" />
            {post?.location || "-"}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Eye size={16} /> <span>{typeof post?.views === "number" ? post.views.toLocaleString() : "0"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark size={16} /> <span>{post?.saves || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 size={16} /> <span>{post?.shares || 0}</span>
            </div>
          </div>

          {/* Clickable Tags */}
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.length > 0
                ? selectedTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-lg border bg-[#5A6B61] border-[#5A6B61] text-white"
                    >
                      {tag}
                    </span>
                  ))
                : <span className="text-xs text-gray-500">No tags selected</span>}
            </div>
          </div>

          {/* Fee */}
          <div className="inline-block text-green-700 bg-[#ECFDF5] rounded-md px-2 py-1 font-semibold">
            {fee ? `$${fee}` : ""}
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#6F8375] text-white py-2 rounded-md hover:bg-green-800 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
