"use client";
import classRequest from "@/apiRequest/class";
import { useQuery } from "@tanstack/react-query";

const useGetClassInfo = (id: string) => {
  return useQuery({
    queryKey: ["class-info", id],
    queryFn: async () => {
      if (id) {
        return classRequest.getDetail(id);
      }
    },
    enabled: !!id,
  });
};

export default useGetClassInfo;
