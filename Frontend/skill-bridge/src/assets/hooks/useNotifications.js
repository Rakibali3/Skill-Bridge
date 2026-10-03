import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../API/axios";

async function fetchNotifications(page = 0, size = 20) {
    const response = await api.get("/notifications", {
        params: { page, size },
    });
    return response.data;
}

async function fetchUnreadCount() {
    const response = await api.get("/notifications/unread-count");
    return typeof response.data === "number"
        ? response.data
        : response.data.unreadCount ?? response.data.count ?? 0;
}

export function useNotifications(page = 0, size = 20, enabled = true) {
    return useQuery({
        queryKey: ["notifications", page, size],
        queryFn: () => fetchNotifications(page, size),
        enabled,
    });
}

export function useUnreadNotificationCount() {
    return useQuery({
        queryKey: ["notification-unread-count"],
        queryFn: fetchUnreadCount,
        refetchInterval: 60000,
        refetchIntervalInBackground: false,
    });
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId) => {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );
            return response.data;
        },
        onSuccess: (_, notificationId) => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
            queryClient.invalidateQueries({
                queryKey: ["notification-unread-count"],
                exact: true,
            });
        },
    });
}

export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.patch("/notifications/read-all");
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
            queryClient.setQueryData(
                ["notification-unread-count"],
                0
            );
        },
    });
}
