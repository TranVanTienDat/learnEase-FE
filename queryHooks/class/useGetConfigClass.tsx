import commonSettingRequest from "@/apiRequest/commonSetting";
import useUserDetailStore from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";

const useGetConfigClass = () => {
  const userDetail = useUserDetailStore((state) => state.user);
  return useQuery({
    queryKey: ["class-configs"],
    queryFn: async () => {
      if (userDetail?.id) {
        return commonSettingRequest.getList(userDetail.id);
      }
    },
    enabled: !!userDetail?.id,
  });
};

export default useGetConfigClass;