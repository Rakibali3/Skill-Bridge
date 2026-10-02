import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../API/axios";

// Fetch notifications
async function fetchNotifications(page = 0, size = 20) {
    const response = await api.get("/notifications", {
        params: { page, size },
    });

    return response.data;
}

// Fetch unread notification count
async function fetchUnreadCount() {
    const response = await api.get("/notifications/unread-count");

    // Supports either a raw number or { unreadCount: number }
    return typeof response.data === "number"
        ? response.data
        : response.data.unreadCount ?? response.data.count ?? 0;
}

// Fetch notification list
export function useNotifications(page = 0, size = 20) {
    return useQuery({
        queryKey: ["notifications", page, size],
        queryFn: () => fetchNotifications(page, size),
    });
}

// Fetch unread count and refresh periodically
export function useUnreadNotificationCount() {
    return useQuery({
        queryKey: ["notification-unread-count"],
        queryFn: fetchUnreadCount,
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });
}

// Mark one notification as read
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId) => {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({
                queryKey: ["notification-unread-count"],
            });
        },
    });
}

// Mark all notifications as read
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.patch("/notifications/read-all");
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({
                queryKey: ["notification-unread-count"],
            });
        },
    });
}
