import { useState, useEffect, useCallback } from "react";
import notificationService, { 
  Notification, 
  NotificationResponse 
} from "../app/services/notification.service";
import { toast } from "./use-toast";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../app/redux";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  fetchNotifications: (reset?: boolean) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

export const useNotifications = (
  initialLimit: number = 20,
  unreadOnly: boolean = false
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Get socket context
  const { joinNotificationRoom, onNewNotification, offNewNotification, isConnected } = useSocket();
  
  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Fetch notifications
  const fetchNotifications = useCallback(async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const page = reset ? 1 : currentPage;
      const response: NotificationResponse = await notificationService.getNotifications(
        page,
        initialLimit,
        unreadOnly
      );

      if (reset) {
        setNotifications(response.notifications);
        setCurrentPage(2); // Next page after reset
      } else {
        setNotifications((prev: Notification[]) => [...prev, ...response.notifications]);
        setCurrentPage(page + 1);
      }

      setHasMore(response.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit, unreadOnly]); // Removed currentPage dependency to avoid infinite loops

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchNotifications(false);
  }, [hasMore, isLoading, fetchNotifications]);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to refresh unread count:", err);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications((prev: Notification[]) => 
        prev.map((notification: Notification) => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Refresh unread count
      await refreshUnreadCount();

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark as read";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [refreshUnreadCount]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications((prev: Notification[]) => 
        prev.map((notification: Notification) => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (err) {
      console.error("markAllAsRead failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to mark all as read";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      setNotifications((prev: Notification[]) => 
        prev.filter((notification: Notification) => notification.id !== notificationId)
      );

      // Refresh unread count if deleted notification was unread
      const deletedNotification = notifications.find((n: Notification) => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        await refreshUnreadCount();
      }

      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete notification";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [notifications, refreshUnreadCount]);

  // Initial fetch and unread count
  useEffect(() => {
    fetchNotifications(true);
    refreshUnreadCount();
  }, [unreadOnly, initialLimit]); // Re-fetch when these params change

  // Set up real-time notifications
  useEffect(() => {
    const userId = currentUser?.id;
    if (userId && isConnected) {
      // Join notification room when socket is connected
      joinNotificationRoom(userId);

      // Set up listener for new notifications
      onNewNotification((newNotification) => {
        console.log("New notification received:", newNotification);
        
        // Add the new notification to the top of the list
        setNotifications((prev) => [newNotification as Notification, ...prev]);
        
        // Increment unread count
        setUnreadCount((prev) => prev + 1);
        
        // Show toast notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      });
    }

    // Cleanup
    return () => {
      offNewNotification();
    };
  }, [currentUser?.id, isConnected, joinNotificationRoom, onNewNotification, offNewNotification]);

  // Refresh unread count periodically
  useEffect(() => {
    const interval = setInterval(refreshUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refreshUnreadCount,
  };
};