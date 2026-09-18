import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";

export function useSkillsData() {
  return useQuery({
    queryKey: ["skills"],

    queryFn: async () => {
      const { data } = await api.get("/skills");

      return data;
    },
  });
}


export function useTeachingSkills() {
  return useQuery({
    queryKey: ["skills", "teaching"],

    queryFn: async () => {
      const { data } = await api.get("/skills/teaching");

      return data;
    },
  });
}

export function useLearningSkills() {
  return useQuery({
    queryKey: ["skills", "learning"],

    queryFn: async () => {
      const { data } = await api.get("/skills/learning");

      return data;
    },
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillData) => {
      const { data } = await api.post("/skills", skillData);

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, skillData }) => {
      const { data } = await api.put(
        `/skills/${id}`,
        skillData
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/skills/${id}`);

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },
  });
}