import studentRequest, { StudentParamsType } from "@/apiRequest/students";
import { useMutation } from "@tanstack/react-query";

const useCreateStudent = () => {
  return useMutation({
    mutationFn: async (params: StudentParamsType) => {
      return await studentRequest.addStudent(params);
    },
  });
};

export default useCreateStudent;
