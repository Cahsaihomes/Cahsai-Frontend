import { useState, useEffect } from 'react';
import { commentService, Comment, CreateCommentRequest } from '@/app/services/comment.service';
import { toast } from '@/hooks/use-toast';

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create comment
  const createComment = async (data: CreateCommentRequest) => {
    try {
      setSubmitting(true);
      await commentService.createComment(postId, data);
      
      // Refresh comments to get updated data
      await fetchComments();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // Reply to comment
  const replyToComment = async (commentId: number, data: CreateCommentRequest) => {
    try {
      setSubmitting(true);
      await commentService.replyToComment(commentId, data);
      
      // Refresh comments to get updated data
      await fetchComments();
      
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      console.error('Error replying to comment:', error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to find a comment by ID recursively
  const findCommentById = (comments: Comment[], commentId: number): Comment | null => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = findCommentById(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to recursively update comment likes with new structure
  const updateCommentLikesNew = (
    comments: Comment[], 
    commentId: number, 
    updateFn: (comment: Comment) => { likeCount: number; hasUserLiked: boolean }
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        const updates = updateFn(comment);
        return { ...comment, ...updates };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLikesNew(comment.replies, commentId, updateFn)
        };
      }
      return comment;
    });
  };

  // Like comment with optimistic update (toggle behavior)
  const likeComment = async (commentId: number) => {
    // Get current like status for optimistic update
    const currentComment = findCommentById(comments, commentId);
    const wasLiked = currentComment?.hasUserLiked || false;
    
    try {
      // Optimistic update - toggle the current state
      setComments(prevComments => 
        updateCommentLikesNew(prevComments, commentId, (comment) => ({
          likeCount: wasLiked ? comment.likeCount - 1 : comment.likeCount + 1,
          hasUserLiked: !wasLiked
        }))
      );

      const result = await commentService.likeComment(commentId);
      
      // Update with actual result from server
      setComments(prevComments => 
        updateCommentLikesNew(prevComments, result.commentId, () => ({
          likeCount: result.likeCount,
          hasUserLiked: result.hasUserLiked
        }))
      );
      
      const action = result.action || (result.hasUserLiked ? 'liked' : 'unliked');
      toast({
        title: "Success",
        description: `Comment ${action}!`,
      });
    } catch (error) {
      console.error('Error toggling comment like:', error);
      
      // Revert optimistic update on error
      setComments(prevComments => 
        updateCommentLikesNew(prevComments, commentId, (comment) => ({
          likeCount: wasLiked ? comment.likeCount + 1 : comment.likeCount - 1,
          hasUserLiked: wasLiked
        }))
      );
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  // Helper function to recursively update like count in nested comments
  const updateCommentLikes = (
    comments: Comment[], 
    commentId: number, 
    updateFn: (current: number) => number
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likeCount: updateFn(comment.likeCount) };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLikes(comment.replies, commentId, updateFn)
        };
      }
      return comment;
    });
  };

  // Fetch comments on mount
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    submitting,
    createComment,
    replyToComment,
    likeComment,
    refetchComments: fetchComments,
  };
};