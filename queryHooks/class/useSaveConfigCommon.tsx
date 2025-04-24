import commonSettingRequest from "@/apiRequest/commonSetting";
import useUserDetailStore from "@/stores/user-store";
import { IFeature } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const useSaveConfigCommon = () => {
  const userDetail = useUserDetailStore((state) => state.user);
  return useMutation({
    mutationFn: async (evaluations: IFeature[]) => {
      if (userDetail?.id)
        return await commonSettingRequest.update(userDetail.id, evaluations);
    },
  });
};

export default useSaveConfigCommon;
