"use client";
import { FC } from "react";
import { X } from "lucide-react";
import ListingCard from "@/components/ui/listing-card";
import { Post } from "@/app/Utils/post-types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  post: Post[] | undefined;
  isLoading: boolean;
}

const ListingPanel: FC<Props> = ({ isOpen, onClose, post, isLoading }) => {
  if (!isOpen) return null;
  const promotedPosts = post?.filter((post) => post.isPromoted) || [];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div className="relative w-[320px] h-full bg-white shadow-xl p-4 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Prefer for you</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Property List */}

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-[#6C806F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : promotedPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">No promoted posts found.</p>
          ) : (
            promotedPosts.map((post) => (
              <ListingCard
                key={post.id}
                imageUrl={post.images?.[0] || "/images/Frame.png"}
                price={`$${post.price}`}
                isPromoted={post.isPromoted}
                rating={4.5}
                reviews={156}
                tags={post.tags || []}
                // details="Modern • 3BR • 2BA • 1,800 sq ft"
                details={`${post.bedrooms} BR • ${
                  post.bathrooms
                } BA • ${"—"} sq ft`}
                bedrooms={String(post.bedrooms)}
                bathrooms={String(post.bathrooms)}
                location={`${post.city}, ${post.location}`}
                area="1800 sqft"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPanel;
