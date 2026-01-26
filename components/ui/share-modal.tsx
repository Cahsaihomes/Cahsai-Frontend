"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Facebook,
  MessageCircle,
  Twitter,
  Linkedin,
  Instagram,
  Link as LinkIcon,
  Share2,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateFacebookShareUrl,
  generateTwitterShareUrl,
  generateWhatsAppShareUrl,
  generateLinkedInShareUrl,
  generateInstagramShareMessage,
  copyToClipboard,
  openShareWindow,
  getShareUrl,
} from "@/app/Utils/shareUtils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | string;
  title?: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  price?: string | number;
  beds?: number;
  baths?: number;
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  action: (shareUrl: string, title: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  postId,
  title = "Check this out on Cahsai!",
  description,
  location,
  price,
  beds,
  baths,
}: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shareUrl = getShareUrl(postId);

  const shareOptions: ShareOption[] = [
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 hover:bg-blue-200",
      action: (url, title) => {
        openShareWindow(
          generateFacebookShareUrl({ url, title }),
          "Share on Facebook"
        );
      },
    },
    {
      id: "twitter",
      name: "X",
      icon: <Twitter className="w-6 h-6" />,
      color: "text-gray-900",
      bgColor: "bg-gray-100 hover:bg-gray-200",
      action: (url, title) => {
        openShareWindow(
          generateTwitterShareUrl({ url, title }),
          "Share on Twitter"
        );
      },
    },
    {
      id: "email",
      name: "Email",
      icon: <Mail className="w-6 h-6" />,
      color: "text-gray-600",
      bgColor: "bg-gray-100 hover:bg-gray-200",
      action: (url, title) => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`${title}\n${url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100 hover:bg-green-200",
      action: (url, title) => {
        openShareWindow(
          generateWhatsAppShareUrl({ url, title }),
          "Share on WhatsApp"
        );
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      color: "text-blue-700",
      bgColor: "bg-blue-100 hover:bg-blue-200",
      action: (url, title) => {
        openShareWindow(
          generateLinkedInShareUrl({ url, title }),
          "Share on LinkedIn"
        );
      },
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      color: "text-pink-600",
      bgColor: "bg-pink-100 hover:bg-pink-200",
      action: (url, title) => {
        const message = generateInstagramShareMessage({ url, title });
        copyToClipboard(message);
        toast.success("Message copied! Share it on Instagram");
      },
    },
  ];

  const handleShare = async (option: ShareOption) => {
    setIsLoading(true);
    try {
      await Promise.resolve(option.action(shareUrl, title));
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share");
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-in fade-in zoom-in duration-200 min-h-80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-14">Share</h2>

      

        {/* Platforms Scroll */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 lg:hidden"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Platforms Container - All visible */}
            <div
              ref={scrollContainerRef}
              className="flex gap-8 flex-1 scroll-smooth px-2 overflow-x-auto lg:justify-center lg:overflow-visible"
              style={{ scrollBehavior: "smooth" }}
            >
              {shareOptions.map((option) => (
                <div key={option.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleShare(option)}
                    disabled={isLoading}
                    className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${option.bgColor} ${option.color} hover:scale-110 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {option.icon}
                    </div>
                  </button>
                  <span className="text-xs font-medium text-center whitespace-nowrap text-gray-700">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 lg:hidden"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* URL Preview */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
          <p className="text-xs md:text-sm text-gray-600 font-semibold mb-3">Share Link:</p>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-white border border-gray-300 rounded-md px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 font-mono focus:outline-none focus:border-[#968470]"
            />
            <button
              onClick={async () => {
                const customMessage = `Check out this on Cahsai: ${shareUrl}`;
                const success = await copyToClipboard(customMessage);
                if (success) {
                  toast.success("Copied!");
                }
              }}
              className="px-4 md:px-5 py-2 md:py-3 bg-[#968470] hover:bg-[#7a6d5e] text-white rounded-md transition-colors font-medium text-sm md:text-base flex-shrink-0 whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
