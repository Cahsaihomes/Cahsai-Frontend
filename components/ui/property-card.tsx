"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bed,
  Bath,
  Ruler,
  MapPin,
  Bookmark,
  X,
  ThumbsUp,
  Loader2,
  Send,
  Reply,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComments } from "@/hooks/useComments";
import { Comment } from "@/app/services/comment.service";

type Variant = "Cahsai Creator" | "Cahsai Agent" | "sponsored";

export interface PropertyCardProps {
  id: string | number;
  imageUrl: string;
  name: string;
  title: string;
  blurb?: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  likes: number;
  comments: number;
  shares: number;
  variant: Variant;
  profile?: string;
  first_name?: string;
  last_name?: string;
  onOpenFullStory?: () => void;
  onBookTour?: () => void;
  onToggleSave: () => void;
  isLike?: boolean;
  video: string;
  listing_type?: "FOR_SALE" | "FOR_RENT" | "STAY";
  topBadgeText?: string;
  monthly_rent?: number;
  amenities?: string[];
  pet_policy?: string;
  parking?: string;
  furnished?: boolean;
  postId: number;
  currentUserId?: number;
  postOwnerId?: number;
}

export default function PropertyCard(props: PropertyCardProps) {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyPrivacy, setReplyPrivacy] = useState("Public");
  const commentsListRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const {
    imageUrl,
    name,
    title,
    blurb,
    location,
    beds,
    baths,
    area,
    likes,
    comments,
    shares,
    variant,
    profile,
    first_name,
    last_name,
    isLike,
    video,
    id,
    onToggleSave,
    onBookTour,
    listing_type = "FOR_SALE",
    topBadgeText,
    monthly_rent,
    amenities = [],
    pet_policy,
    parking,
    furnished,
    postId,
    currentUserId,
    postOwnerId,
  } = props;

  const {
    comments: commentsList,
    loading,
    submitting,
    createComment,
    replyToComment,
    likeComment,
  } = useComments(postId);

  const isCreator = variant === "Cahsai Creator";
  const isAgent = variant === "Cahsai Agent";
  const isSponsored = variant === "sponsored";
  const isRental = listing_type === "FOR_RENT";
  const isStay = listing_type === "STAY";
  const displayPrice =
    isRental || isStay
      ? `$${monthly_rent || area} / ${isStay ? "night" : "month"}`
      : null;
  const displayAmenities = amenities.slice(0, 3);

  // Check if current user is the post owner
  const isOwnPost = Boolean(currentUserId && postOwnerId && currentUserId === postOwnerId);

  // Sort comments: latest first (by creation date descending)
  const sortedComments = [...commentsList].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Filter comments based on privacy
  const visibleComments = sortedComments.filter((comment) => {
    // If it's a public comment, everyone can see it
    if (!comment.isPrivate) return true;
    
    // If it's a private comment, only show to:
    // 1. The post owner (postOwnerId)
    // 2. The comment author (comment.user.id)
    if (comment.isPrivate) {
      const isCommentAuthor = currentUserId && comment.user?.id === currentUserId;
      const isPostOwner = currentUserId && currentUserId === postOwnerId;
      return isCommentAuthor || isPostOwner;
    }
    
    return false;
  });

  // Focus input when comments open
  useEffect(() => {
    if (showComments && !isOwnPost && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 300);
    }
  }, [showComments, isOwnPost]);

  const handleAddComment = async () => {
    if (!newComment.trim() || isOwnPost || submitting) return;

    try {
      const commentData = {
        content: newComment.trim(),
        isPrivate: privacy === "Private",
      };

      await createComment(commentData);
      setNewComment("");
      setPrivacy("Public");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReply = async (parentCommentId: number) => {
    if (!replyText.trim() || isOwnPost || submitting) return;

    try {
      const replyData = {
        content: replyText.trim(),
        isPrivate: replyPrivacy === "Private",
      };

      await replyToComment(parentCommentId, replyData);
      setReplyText("");
      setReplyPrivacy("Public");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (submitting) return;
    await likeComment(commentId);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setReplyingTo(null);
    setReplyText("");
    setReplyPrivacy("Public");
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const getDisplayName = (user: Comment["user"]) => {
    if (!user) return "Anonymous";
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.user_name || "Anonymous";
  };

  const getAvatarUrl = (user: Comment["user"]) => {
    if (!user || !user.avatarUrl) return "/images/avatar.jpg";
    return user.avatarUrl;
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isCommentOwner = currentUserId && comment.user?.id === currentUserId;
    
    // Filter replies based on privacy
    const visibleReplies = comment.replies?.filter((reply) => {
      if (!reply.isPrivate) return true;
      
      if (reply.isPrivate) {
        const isReplyAuthor = currentUserId && reply.user?.id === currentUserId;
        const isPostOwner = currentUserId && currentUserId === postOwnerId;
        return isReplyAuthor || isPostOwner;
      }
      
      return false;
    }) || [];

    // Sort replies: latest first
    const sortedReplies = [...visibleReplies].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-6 sm:ml-8 mt-2" : "mt-3"} bg-white/5 backdrop-blur-sm rounded-lg p-3 transition-all hover:bg-white/10`}
      >
        <div className="flex gap-2">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarImage src={getAvatarUrl(comment.user)} alt={getDisplayName(comment.user)} />
            <AvatarFallback className="text-xs bg-[#6F8375] text-white">
              {getDisplayName(comment.user)
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-xs sm:text-sm">
                {getDisplayName(comment.user)}
              </span>
              {isCommentOwner && (
                <span className="text-[9px] sm:text-[10px] bg-[#6F8375] px-1.5 py-0.5 rounded text-white">
                  You
                </span>
              )}
              <span className="text-white/60 text-[10px] sm:text-xs">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.isPrivate && (
                <span className="text-[9px] sm:text-[10px] bg-amber-600/80 px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                  <Lock size={10} />
                  Private
                </span>
              )}
            </div>

            <p className="text-white/90 text-xs sm:text-sm mt-1 break-words leading-relaxed">
              {comment.content}
            </p>

            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              <button
                onClick={() => handleLikeComment(comment.id)}
                disabled={submitting}
                className={`flex items-center gap-1 text-xs transition-all ${
                  comment.hasUserLiked
                    ? "text-red-400 scale-105"
                    : "text-white/70 hover:text-white hover:scale-105"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ThumbsUp
                  size={13}
                  className={`${comment.hasUserLiked ? "fill-current" : ""} transition-transform`}
                />
                <span className="font-medium">{comment.likeCount || 0}</span>
              </button>

              {/* Disable reply for: own comments, replies to replies, own post */}
              {!isReply && !isCommentOwner && !isOwnPost && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  disabled={submitting}
                  className={`flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Reply size={13} />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Reply to ${getDisplayName(comment.user)}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !submitting && !isOwnPost) {
                        handleReply(comment.id);
                      }
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pr-24 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent transition-all"
                    disabled={submitting || isOwnPost}
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      value={replyPrivacy}
                      onValueChange={setReplyPrivacy}
                      disabled={submitting || isOwnPost}
                    >
                      <SelectTrigger className="w-16 sm:w-20 h-6 sm:h-7 text-[9px] sm:text-[10px] bg-transparent border-0 text-white hover:bg-white/10 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReply(comment.id)}
                    disabled={submitting || !replyText.trim() || isOwnPost}
                    size="sm"
                    className="h-7 px-3 text-xs bg-[#6F8375] hover:bg-[#5b6c62] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Posting...
                      </>
                    ) : (
                      "Reply"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                      setReplyPrivacy("Public");
                    }}
                    size="sm"
                    variant="ghost"
                    disabled={submitting}
                    className="h-7 px-3 text-xs text-white hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {sortedReplies.length > 0 && (
              <div className="mt-2 space-y-2">
                {sortedReplies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-sm">
      {/* Video Container */}
      <div className="relative h-[560px] w-full">
        <video
          src={video}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* {(isRental || isStay) && (
          <div className="absolute top-3 left-3 z-20 bg-[#6F8375] text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
            {isRental ? "FOR RENT" : "SHORT-TERM STAY"}
          </div>
        )} */}
        {/* Top Badge - FOR RENT/STAY or Custom Badge */}
{topBadgeText && (
  <div className="absolute top-3 left-3 z-20 bg-[#D4EDDA] text-[#28A745] px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
    {topBadgeText}
  </div>
)}

{/* Fallback to listing type badge if no topBadgeText */}
{!topBadgeText && (isRental || isStay) && (
  <div className="absolute top-3 left-3 z-20 bg-[#6F8375] text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
    {isRental ? "FOR RENT" : "SHORT-TERM STAY"}
  </div>
)}

        {/* Action buttons */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          <IconPill
            onClick={onToggleSave}
            icon={
              <Heart
                size={18}
                fill={isLike ? "red" : "currentColor"}
                color={isLike ? "red" : undefined}
              />
            }
            count={likes}
          />

          <IconPill
            onClick={() => setShowComments(!showComments)}
            icon={<MessageCircle size={18} fill={showComments ? "currentColor" : "none"} />}
            count={comments}
            active={showComments}
          />

          <IconPill
            icon={<Share2 size={18} fill="currentColor" />}
            count={shares}
          />
        </div>

        {!isSponsored && (
          <>
            <div className="absolute left-4 bottom-32 z-20 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border-2 border-white/50">
                  <AvatarImage src={profile} alt={name} />
                  <AvatarFallback className="bg-[#6F8375] text-white text-xs">
                    {`${first_name?.charAt(0) || ""}${last_name?.charAt(0) || ""}`}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
                  onClick={() => {
                    router.push(
                      `/buyerdashboard/agent-creator-profile?id=${id}`
                    );
                  }}
                >
                  <div className="text-white text-sm font-medium drop-shadow-lg">
                    {name}
                  </div>
                </button>
              </div>
            </div>

            {(isRental || isStay) && displayPrice && (
              <div className="absolute left-4 bottom-[168px] z-20 text-white">
                <div className="text-2xl font-bold drop-shadow-lg">
                  {displayPrice}
                </div>
              </div>
            )}

            {(isRental || isStay) && displayAmenities.length > 0 && (
              <div className="absolute left-4 bottom-36 z-20 flex flex-wrap gap-2">
                {displayAmenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium shadow"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}

            <div className="absolute left-4 right-4 bottom-28 text-white z-20">
              <div className="text-sm font-medium drop-shadow-lg">{title}</div>
              {(isRental || isStay) && (
                <div className="text-xs opacity-90 mt-1 drop-shadow">
                  Managed by {name}
                </div>
              )}
            </div>
          </>
        )}

        {!isSponsored && (
          <div className="absolute left-4 bottom-20 flex items-center gap-4 text-white/95 text-xs z-20">
            <Meta icon={<Bed size={14} />} label={`${beds}BR`} />
            <Meta icon={<Bath size={14} />} label={`${baths}BA`} />
            <Meta icon={<Ruler size={14} />} label={`${area} sq ft`} />
          </div>
        )}

        {!isSponsored && (
          <div className="absolute left-0 right-0 bottom-8 flex items-center justify-between gap-3 px-3 z-20">
            <div className="text-white text-xs flex items-center gap-1 drop-shadow-lg">
              <MapPin size={14} />
              <span className="truncate max-w-[150px] sm:max-w-none">{location}</span>
            </div>

            {isCreator && (
              <Link href="/buyerdashboard/moodboards">
                <Button
                  size="sm"
                  className="rounded-md bg-[#6F8375] hover:bg-[#5b6c62] shadow-lg transition-all hover:scale-105"
                >
                  <Bookmark className="w-4 h-4 mr-2" /> Dreamboard
                </Button>
              </Link>
            )}

            {isAgent && (
              <div className="flex gap-2">
                {(isRental || isStay) && (
                  <Button
                    onClick={onBookTour}
                    size="sm"
                    variant="secondary"
                    className="rounded-md text-white bg-[#5a6b60] hover:bg-[#4a5b50] shadow-lg transition-all hover:scale-105"
                  >
                    Apply Now
                  </Button>
                )}
                <Button
                  onClick={onBookTour}
                  size="sm"
                  variant="secondary"
                  className="rounded-md text-white bg-[#6F8375] hover:bg-[#5b6c62] shadow-lg transition-all hover:scale-105"
                >
                  {isRental || isStay ? "Schedule Tour" : "Book Tour"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Comments Slide-up Panel */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/90 to-black/85 backdrop-blur-xl rounded-t-3xl transition-all duration-300 ease-out border-t border-white/10 ${
            showComments
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
          style={{
            maxHeight: showComments ? "75%" : "0%",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
            <h3 className="text-white font-semibold text-sm sm:text-base">
              Comments {visibleComments.length > 0 && `(${visibleComments.length})`}
            </h3>
            <button
              onClick={handleCloseComments}
              className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              aria-label="Close comments"
            >
              <X size={20} />
            </button>
          </div>

          {/* Comments List - Scrollable with fixed height */}
          <div 
            ref={commentsListRef}
            className="overflow-y-auto px-3 sm:px-4 pb-2 custom-scrollbar" 
            style={{ 
              height: isOwnPost ? "calc(75vh - 60px)" : "calc(75vh - 130px)",
              maxHeight: isOwnPost ? "calc(75vh - 60px)" : "calc(75vh - 130px)",
            }}
          >
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                <span className="text-white/60 text-sm">Loading comments...</span>
              </div>
            ) : visibleComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">
                  {isOwnPost 
                    ? "You cannot comment on your own post" 
                    : "No comments yet. Be the first to comment!"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {visibleComments.map((comment) => renderComment(comment))}
              </div>
            )}
          </div>

          {/* Comment Input - Fixed at bottom */}
          {!isOwnPost && (
            <div className="sticky bottom-0 left-0 right-0 px-3 sm:px-4 py-3 bg-black/95 backdrop-blur-md border-t border-white/10">
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <input
                    ref={commentInputRef}
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !submitting) {
                        handleAddComment();
                      }
                    }}
                    maxLength={500}
                    className="w-full bg-white/10 border border-white/20 rounded-full pl-4 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#6F8375] focus:border-transparent transition-all"
                    disabled={submitting}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      value={privacy}
                      onValueChange={setPrivacy}
                      disabled={submitting}
                    >
                      <SelectTrigger className="w-16 sm:w-20 h-6 sm:h-7 text-[9px] sm:text-[10px] bg-transparent border-0 text-white hover:bg-white/10 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  size="icon"
                  className="rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-[#6F8375] hover:bg-[#5b6c62] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  aria-label="Send comment"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
              {newComment.length > 450 && (
                <p className="text-white/50 text-[10px] mt-1 text-right">
                  {500 - newComment.length} characters remaining
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Variant Badge */}
      {!isSponsored && (
        <span
          className={[
            "absolute bottom-3 left-3 rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide shadow-lg z-10",
            isAgent
              ? "bg-[#FFFFFF33] text-[#EDC800]"
              : "bg-[#FFFFFF33] text-black",
          ].join(" ")}
        >
          {isCreator ? "Cahsai Creator" : "Cahsai Agent"}
        </span>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(111, 131, 117, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(111, 131, 117, 0.8);
        }
      `}</style>
    </Card>
  );
}

function IconPill({
  icon,
  count,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={onClick}
        className={`cursor-pointer grid h-10 w-10 place-items-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${
          active 
            ? "bg-[#6F8375] text-white" 
            : "bg-[#D5D7DA80] text-white hover:bg-[#D5D7DAA0]"
        }`}
      >
        {icon}
      </div>
      <span className="mt-1 text-[12px] text-white font-medium drop-shadow-lg">{count}</span>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 drop-shadow-lg">
      {icon}
      {label}
    </span>
  );
}