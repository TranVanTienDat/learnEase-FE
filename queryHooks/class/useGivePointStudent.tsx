import studentRequest from "@/apiRequest/students";
import { GivePointParamsType } from "@/types/giveModal";
import { useMutation } from "@tanstack/react-query";

const useGivePointStudent = () => {
  return useMutation({
    mutationFn: async ({
      classId,
      params,
    }: {
      classId: string;
      params: GivePointParamsType;
    }) => {
      return await studentRequest.givePointStudent(classId, params);
    },
  });
};

export default useGivePointStudent;
