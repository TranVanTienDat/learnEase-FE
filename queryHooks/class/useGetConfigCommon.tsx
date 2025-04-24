import commonSettingRequest from "@/apiRequest/commonSetting";
import useUserDetailStore from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";

const useGetConfigCommon = () => {
  const userDetail = useUserDetailStore((state) => state.user);
  return useQuery({
    queryKey: ["common-configs"],
    queryFn: async () => {
      if (userDetail?.id) {
        return commonSettingRequest.getExtraPointImages();
      }
    },
    enabled: !!userDetail?.id,
  });
};

export default useGetConfigCommon;