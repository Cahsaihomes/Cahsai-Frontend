import { publicAxios, privateAxios } from "./axiosInstance";

// Types for comment data
export interface User {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  parentId?: number;
  content: string;
  likeCount: number;
  isPrivate: boolean;
  isRead: boolean;
  readByUsers: number[];
  likedBy: number[];
  hasUserLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies: Comment[];
  commentCount?: number;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
  isPrivate?: boolean;
}

export interface CommentResponse {
  success: boolean;
  data: Comment | Comment[];
  message?: string;
}

export interface LikeResponse {
  success: boolean;
  data: {
    commentId: number;
    likeCount: number;
    hasUserLiked: boolean;
    action?: 'liked' | 'unliked';
  };
  message?: string;
}

// API service functions
export const commentService = {
  // Get all comments for a post
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    try {
      console.log('Fetching comments for postId:', postId);
      const response = await publicAxios.get<CommentResponse>(`/post-comments/${postId}`);
      console.log('Comments API response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Create a new comment
  createComment: async (postId: number, data: CreateCommentRequest): Promise<Comment> => {
    try {
      const response = await privateAxios.post<CommentResponse>(`/post-comments/create/${postId}`, data);
      if (response.data.success && !Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error('Failed to create comment');
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Reply to a comment
  replyToComment: async (commentId: number, data: CreateCommentRequest): Promise<Comment> => {
    try {
      const response = await privateAxios.post<CommentResponse>(`/post-comments/reply/${commentId}`, data);
      if (response.data.success && !Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error('Failed to reply to comment');
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },

  // Like a comment (toggle behavior)
  likeComment: async (commentId: number): Promise<{ commentId: number; likeCount: number; hasUserLiked: boolean; action?: string }> => {
    try {
      const response = await privateAxios.post<LikeResponse>(`/post-comments/like/${commentId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to like comment');
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },

  // Unlike a comment
  unlikeComment: async (commentId: number): Promise<{ commentId: number; likeCount: number; hasUserLiked: boolean }> => {
    try {
      const response = await privateAxios.post<LikeResponse>(`/post-comments/unlike/${commentId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to unlike comment');
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  },

  // Mark comment as read
  markCommentAsRead: async (commentId: number): Promise<{ commentId: number; readByUsers: number[] }> => {
    try {
      const response = await privateAxios.post(`/post-comments/read/${commentId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to mark comment as read');
    } catch (error) {
      console.error('Error marking comment as read:', error);
      throw error;
    }
  },
};