"use client";
import classRequest from "@/apiRequest/class";
import { StudentType } from "@/apiRequest/students";
import { useQuery } from "@tanstack/react-query";

const useGetStudentGivePoint = (id: string) => {
  return useQuery({
    queryKey: ["givePointStudents", id],
    queryFn: async () => {
      return await classRequest.getDetail(id, {
        "populate[students][populate][dailyRecords]": true,
      });
    },
    enabled: !!id,
  });
};

export default useGetStudentGivePoint;
