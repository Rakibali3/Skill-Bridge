import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";


// ===============================
// GET TASKS FOR EXCHANGE
// ===============================
export function useExchangeTasks(exchangeId) {
    return useQuery({
        queryKey: ["tasks", exchangeId],
        queryFn: async () => {
            const { data } = await api.get(
                `/tasks/exchange/${exchangeId}`
            );

            return data;
        },
        enabled: Boolean(exchangeId),
    });
}


// ===============================
// CREATE TASK
// ===============================
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskData) => {
            const { data } = await api.post(
                "/tasks",
                taskData
            );

            return data;
        },

        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks",],
            });
        },
    });
}


// ===============================
// SUBMIT TASK
// ===============================
export function useSubmitTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, submissionData }) => {
            const { data } = await api.post(
                `/tasks/${taskId}/submit`,
                submissionData
            );

            return data;
        },

        onSuccess: async () => {
             queryClient.invalidateQueries({
                queryKey: ["tasks",],
            });
        },
    });
}


// ===============================
// COMPLETE TASK
// ===============================
export function useCompleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId) => {
            const { data } = await api.post(
                `/tasks/${taskId}/complete`
            );

            return data;
        },

        onSuccess: async () => {
            // Immediately fetch fresh task data
              queryClient.invalidateQueries({
                queryKey: ["tasks",],
            });
        },
    });
}


export function useTasksByUser(userId) {
  return useQuery({
    queryKey: ["tasks", "user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/user/${userId}`);
      return data;
    },
    enabled: Boolean(userId),
  });
}