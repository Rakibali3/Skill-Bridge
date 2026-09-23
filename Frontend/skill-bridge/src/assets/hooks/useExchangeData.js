import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../API/axios";

export function useMyExchanges() {
    return useQuery({
        queryKey: ["exchanges"],

        queryFn: async () => {
            const { data } = await api.get("/exchanges");
            return data;
        },
    });
}

export function useExchange(exchangeId) {
    return useQuery({
        queryKey: ["exchanges", exchangeId],

        queryFn: async () => {
            const { data } = await api.get(`/exchanges/${exchangeId}`);
            return data;
        },

        enabled: Boolean(exchangeId),
    });
}

export function useCreateExchange() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (exchangeData) => {
            const { data } = await api.post(
                "/exchanges",
                exchangeData
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["exchanges"],
            });

            queryClient.invalidateQueries({
                queryKey: ["exchange-requests"],
            });
        },
    });
}