import classRequest from "@/apiRequest/class";
import studentRequest from "@/apiRequest/students";
import { GivePointParamsType } from "@/types/giveModal";
import { useMutation } from "@tanstack/react-query";

const useDeleteSubject = () => {
  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: { subjects: (number | string)[] };
    }) => {
      return await classRequest.updateClassSubject({
        id: classId,
        data,
      });
    },
  });
};

export default useDeleteSubject;
