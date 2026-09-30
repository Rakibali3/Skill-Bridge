import { useQuery } from "@tanstack/react-query";
import api from "../../API/axios";

export function useGlobalSearch(query) {
    const searchQuery = query.trim();

    return useQuery({
        queryKey: ["global-search", searchQuery],

        queryFn: async () => {
            const { data } = await api.get(
                `/search?q=${encodeURIComponent(searchQuery)}`
            );

            return data;
        },

        enabled: searchQuery.length >= 2,

        staleTime: 30 * 1000,
    });
}