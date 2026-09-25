import { useQuery } from "@tanstack/react-query";
import api from "../../API/axios";

export function useChatHistory(exchangeId) {

    return useQuery({

        queryKey: ["chat", exchangeId],

        queryFn: async () => {

            const { data } = await api.get(
                `/chat/exchange/${exchangeId}`
            );

            return data;
        },

        enabled: Boolean(exchangeId),

    });
}