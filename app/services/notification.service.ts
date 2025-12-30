import { privateAxios } from "./axiosInstance";

export interface Notification {
  id: number;
  userId: number;
  fromUserId: number;
  type: "comment" | "reply" | "like" | "follow" | "system";
  title: string;
  message: string;
  isRead: boolean;
  postId?: number;
  commentId?: number;
  metadata?: {
    postTitle?: string;
    commentPreview?: string;
    replyPreview?: string;
    commenterName?: string;
    commenterAvatar?: string;
    replierName?: string;
    replierAvatar?: string;
    parentCommentPreview?: string;
  };
  fromUser: {
    id: number;
    fullname: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

class NotificationService {
  
  // Get user notifications
  async getNotifications(
    page: number = 1, 
    limit: number = 20, 
    unreadOnly: boolean = false
  ): Promise<NotificationResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString()
      });

      const response = await privateAxios.get(`/notifications?${params}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await privateAxios.get("/notifications/unread-count");
      return response.data.data.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response = await privateAxios.patch(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await privateAxios.patch("/notifications/mark-all-read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await privateAxios.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}

export default new NotificationService();