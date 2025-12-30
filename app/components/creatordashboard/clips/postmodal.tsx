"use client";

import { useState } from "react";
import { X, Eye, MapPin, Bookmark, Share2, Flame } from "lucide-react";

import Image from "next/image";

import PromotionSuccessModal from "@/app/components/creatordashboard/clips/successmodal";
import { updatePromoteStatusService } from "@/app/services/create.post.service";
import { toast } from "sonner";

interface BoostPostModalProps {
  isOpen: boolean;
  post?: any;
  onClose: () => void;
  onBoostSuccess?: () => void;
  fetchPosts?: () => void;
}

export default function BoostPostModal({
  isOpen,
  onClose,
  post,
  fetchPosts,
}: BoostPostModalProps) {
  const [weekFee, setWeekFee] = useState<string>("");
  const [monthFee, setMonthFee] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [error, setError] = useState("");

  if (!isOpen && !showSuccess) return null;

  const allTags = post?.tags || [
    "Home Office",
    "Hardwood Floors",
    "Fireplace",
    "Smart Home Features",
    "Washing Machine Access",
    "Mini Fridge",
    "Shared Kitchen Access",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <PromotionSuccessModal
          onClose={() => {
            setShowSuccess(false);
            onClose(); // also close parent modal after success
          }}
          post={post}
          selectedTags={selectedTags}
          fee={weekFee || monthFee}
        />
      )}

      {/* Boost Modal */}
      {isOpen && !showSuccess && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative mt-12 mb-12 mx-4 sm:mx-0">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">Boost Post</h2>

            {/* Fees */}
            <div className="space-y-3 mb-6">
              <span className="block text-gray-800 font-medium">
                Set Boost Fees
              </span>
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-700">
                  Per Week Fee
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border rounded p-2 text-left"
                  value={weekFee}
                  onChange={(e) => setWeekFee(e.target.value)}
                  placeholder="Enter week fee"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Per Month Fee
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border rounded p-2 text-left"
                  value={monthFee}
                  onChange={(e) => setMonthFee(e.target.value)}
                  placeholder="Enter month fee"
                />
              </div>
            </div>

            {/* Post Details */}
            <div className="mb-6 border-t pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">
                Post Details
              </h3>
              <p className="text-gray-800 text-sm mb-3 flex items-center gap-2">
                <MapPin size={16} />
                {post?.location || "-"}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-800 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <Eye size={16} />{" "}
                  {typeof post?.views === "number"
                    ? post.views.toLocaleString()
                    : "0"}
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark size={16} /> {post?.saves || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={16} /> {post?.shares || 0}
                </span>
              </div>

              {/* Tags */}
              <h3 className="text-sm font-medium text-gray-800 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag: string) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs rounded-lg border transition ${
                        isSelected
                          ? "bg-[#5A6B61] border-[#5A6B61] text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4 mb-6">
              {/* Name on card + Expiry */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Name on card</label>
                  <input
                    type="text"
                    placeholder="Olivia Rhye"
                    className="w-full border rounded-lg p-2 mt-1"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Expiry</label>
                  <input
                    type="text"
                    placeholder="06 / 2024"
                    className="w-full border rounded-lg p-2 mt-1"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
              </div>

              {/* Select Card + CVV */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Select a card</label>
                  <div className="relative w-full">
                    <Image
                      src="/images/payment-icon.png"
                      alt="Visa"
                      width={40}
                      height={24}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      placeholder="Card number"
                      className="w-full border rounded-lg p-2 pl-14 mt-1"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">CVV</label>
                  <input
                    type="text"
                    placeholder="***"
                    className="w-full border rounded-lg p-2 mt-1"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            {/* {error && (
              <div className="text-red-600 text-sm mb-2 text-center">
                {error}
              </div>
            )} */}
            <button
              className="w-full bg-gradient-to-r from-[#69AD7D] to-[#3D6E4B] flex items-center justify-center text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 transition"
              onClick={async () => {
                if (!cardName || !cardExpiry || !cardNumber || !cardCVV) {
                  setError("Please fill in all card details.");
                  toast.error("Please fill in all card details.");
                  return;
                }
                if (!post?.id) {
                  setError("Post data is missing.");
                  toast.error("Post data is missing.");
                  return;
                }
                setError("");
                try {
                  await updatePromoteStatusService(post.id);
                  toast.success("Post Promoted Successfully!");
                  fetchPosts?.();
                  setShowSuccess(true);
                } catch (err: any) {
                  setError(
                    err?.response?.data?.message || "Failed to promote post."
                  );
                  toast.error("Failed to promote post.");
                } finally {
                  // fetchPosts();
                }
              }}
            >
              <Flame className="h-6 w-8 mr-1" /> <span>Post Boost</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
