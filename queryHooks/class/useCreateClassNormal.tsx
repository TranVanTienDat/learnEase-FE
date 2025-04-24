import classRequest from "@/apiRequest/class";
import { useMutation } from "@tanstack/react-query";

const useCreateClassNormal = () => {
  return useMutation({
    mutationFn: async (params: any) => {
      return await classRequest.createClass(params);
    },
  });
};

export default useCreateClassNormal;
