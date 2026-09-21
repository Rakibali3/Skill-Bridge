import { useQuery } from "@tanstack/react-query";
import api from "../../API/axios";

export function useMatchingData() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await api.get("/matches");
      return data;
    },
     refetchOnMount: "always",
  });
}