import classRequest from "@/apiRequest/class";
import useUserDetailStore from "@/stores/user-store";
import { useMutation, useQuery } from "@tanstack/react-query";

const useGetTeachers = () => {
  const userDetail = useUserDetailStore((state) => state.user);
  return useMutation({
    mutationFn: async (value: string) => {
      if (userDetail?.id)
        return await classRequest.getUserByUid(value, userDetail.id.toString());
    },
  });
};

export default useGetTeachers;
