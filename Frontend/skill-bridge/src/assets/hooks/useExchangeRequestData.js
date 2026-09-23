import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";


// Send request
export function useSendExchangeRequest() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (receiverId) => {

            const { data } = await api.post(
                "/exchange-requests",
                {
                    receiverId,
                }
            );

            return data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests", "sent"],
            });

        },

    });
}


// Get sent requests
export function useSentExchangeRequests() {

    return useQuery({

        queryKey: ["exchange-requests", "sent"],

        queryFn: async () => {

            const { data } = await api.get(
                "/exchange-requests/sent"
            );

            return data;
        },

    });
}

export function useReceivedExchangeRequests() {
    return useQuery({
        queryKey: ["exchange-requests", "received"],
        queryFn: async () => {
            const { data } = await api.get("/exchange-requests/received");
            return data;
        },
        refetchInterval: 30000, 
    });
}


// Accept a received request
export function useAcceptExchangeRequest() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (requestId) => {

            const { data } = await api.post(
                `/exchange-requests/${requestId}/accept`
            );

            return data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests", "received"],
            });

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests", "sent"],
            });

        },

    });
}


// Reject a received request
export function useRejectExchangeRequest() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (requestId) => {

            const { data } = await api.post(
                `/exchange-requests/${requestId}/reject`
            );

            return data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests", "received"],
            });

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests", "sent"],
            });

        },

    });
}

export function useAllExchangeRequests() {
    return useQuery({
        queryKey: ["exchange-requests", "all"],
        queryFn: async () => {
            const [sentResponse, receivedResponse] = await Promise.all([
                api.get("/exchange-requests/sent"),
                api.get("/exchange-requests/received"),
            ]);

            return {
                sent: sentResponse.data,
                received: receivedResponse.data,
            };
        },
    });
}