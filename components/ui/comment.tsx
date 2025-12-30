  "use client";

  import { useState } from "react";
  import Image from "next/image";
  import { ThumbsUp, Loader2, Reply } from "lucide-react";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { Comment } from "@/app/services/comment.service";
  import { useComments } from "@/hooks/useComments";

  interface CommentsSectionProps {
    postId: number;
  }

  export default function CommentsSection({ postId }: CommentsSectionProps) {
    const [newComment, setNewComment] = useState("");
    const [privacy, setPrivacy] = useState("Public");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyPrivacy, setReplyPrivacy] = useState("Public");
    
    const {
      comments,
      loading,
      submitting,
      createComment,
      replyToComment,
      likeComment,
    } = useComments(postId);

    const handleAddComment = async () => {
      if (!newComment.trim()) return;
      
      try {
        const commentData = {
          content: newComment,
          isPrivate: privacy === "Private",
        };
        
        await createComment(commentData);
        setNewComment("");
        setPrivacy("Public");
      } catch (error) {
        // Error handling is done in the hook
      }
    };

    const handleReply = async (parentCommentId: number) => {
      if (!replyText.trim()) return;
      
      try {
        const replyData = {
          content: replyText,
          isPrivate: replyPrivacy === "Private",
        };
        
        await replyToComment(parentCommentId, replyData);
        setReplyText("");
        setReplyPrivacy("Public");
        setReplyingTo(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    };

    const handleLikeComment = async (commentId: number) => {
      await likeComment(commentId);
    };

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
      const now = new Date();
      const commentDate = new Date(dateString);
      const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    // Get display name for user
    const getDisplayName = (user: Comment['user']) => {
      if (!user) return "Anonymous";
      if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      return user.user_name || "Anonymous";
    };

    // Get avatar URL
    const getAvatarUrl = (user: Comment['user']) => {
      if (!user || !user.avatarUrl) return "/images/avatar.jpg";
      return user.avatarUrl;
    };

    // Render a single comment (recursive for replies)
    const renderComment = (comment: Comment, isReply = false) => (
      <div key={comment.id}>
        <Card className={`p-4 flex flex-col sm:flex-row gap-3 ${isReply ? 'ml-6 mt-2' : ''}`}>
          <div className="flex-shrink-0">
            <Image
              src={getAvatarUrl(comment.user)}
              alt={getDisplayName(comment.user)}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {getDisplayName(comment.user)}
              </span>
              <span className="text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.isPrivate && (
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Private</span>
              )}
            </div>
            <p className="text-sm text-gray-700 mt-1 leading-snug">
              {comment.content}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1 border border-gray-300 rounded-md text-gray-600 px-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 px-2 transition-colors ${
                    comment.hasUserLiked 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp 
                    size={16} 
                    className={comment.hasUserLiked ? 'fill-current' : ''}
                  />
                  <span className="text-xs">{comment.likeCount}</span>
                </Button>
              </div>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2 text-gray-600 hover:text-blue-700"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <Reply size={16} />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
            </div>
            
            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !submitting) {
                          handleReply(comment.id);
                        }
                      }}
                      className="w-full border rounded-md px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                      disabled={submitting}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Select value={replyPrivacy} onValueChange={setReplyPrivacy} disabled={submitting}>
                        <SelectTrigger className="w-[100px] h-[32px] text-xs border-0 bg-transparent shadow-none focus:ring-0">
                          <SelectValue placeholder="Privacy" />
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
                      className="bg-[#6F8375] text-white hover:bg-[#5b6c62] text-sm px-4 py-1"
                      disabled={submitting || !replyText.trim()}
                      size="sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Replying...
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
                      variant="outline"
                      size="sm"
                      className="text-sm px-4 py-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map(reply => renderComment(reply, true))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );

    return (
      <div className="w-[620px] md:w-[520px] mx-auto bg-white p-2 sm:p-6 shadow-sm">
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading comments...</span>
          </div>
        ) : (
          <>
            {/* Comments list */}
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map(comment => renderComment(comment))
              )}
            </div>

            {/* Write Comment Section */}
            <div className="border-t pt-4">
              <div className="flex flex-col gap-3 w-full">
                {/* Input with privacy select inside */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !submitting) {
                        handleAddComment();
                      }
                    }}
                    className="w-full border rounded-md px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F8375]"
                    disabled={submitting}
                  />

                  {/* Privacy dropdown inside input (right side) */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select value={privacy} onValueChange={setPrivacy} disabled={submitting}>
                      <SelectTrigger className="w-[100px] h-[32px] text-xs border-0 bg-transparent shadow-none focus:ring-0">
                        <SelectValue placeholder="Privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Comment button below input */}
                <Button
                  onClick={handleAddComment}
                  className="w-full bg-[#6F8375] text-white hover:bg-[#5b6c62]"
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Comment"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
