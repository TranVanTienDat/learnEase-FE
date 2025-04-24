import classRequest from "@/apiRequest/class";
import useUserDetailStore from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";

export default function useGetClasses() {
  const userDetail = useUserDetailStore((state) => state.user);
  return useQuery({
    queryKey: ["givePointClasses"],
    queryFn: async () => {
      if (userDetail?.id) {
        const res = await classRequest.getList();
        return res.payload.data;
      }
      return [];
    },
    enabled: !!userDetail?.id,
  });
}
