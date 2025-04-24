import pointsRequest from "@/apiRequest/points";
import { PointIUpdateParamsType } from "@/types/points";
import { useMutation } from "@tanstack/react-query";

const useUpdatePoint = () => {
  return useMutation({
    mutationFn: async (params: PointIUpdateParamsType) => {
      return await pointsRequest.updatePoint(params);
    },
  });
};

export default useUpdatePoint;
