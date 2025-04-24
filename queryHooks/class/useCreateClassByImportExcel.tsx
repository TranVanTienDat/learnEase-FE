import classRequest from "@/apiRequest/class";
import { useMutation } from "@tanstack/react-query";

const useCreateClassByImportExcel = () => {
  return useMutation({
    mutationFn: async (params: {
      name: string;
      fullName?: string;
      seasonDuration: string;
      excelId: string;
    }) => {
      return await classRequest.importCreateClass(params);
    },
  });
};

export default useCreateClassByImportExcel;
