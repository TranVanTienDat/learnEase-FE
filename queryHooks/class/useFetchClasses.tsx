import classRequest from "@/apiRequest/class";
import useUserDetailStore from "@/stores/user-store";
import { useInfiniteQuery } from "@tanstack/react-query";

const useFetchClasses = () => {
  const userDetail = useUserDetailStore((state) => state.user);
  const fetchClasses = async ({ pageParam = 1 }) => {
    const res = await classRequest.getListClassGroup({
      "filters[teacher][id][$eq]": userDetail?.id,
      "pagination[page]": pageParam,
    });
    const { page, pageCount } = res?.payload?.meta?.pagination || {};
    return {
      data: res.payload.data || [],
      nextCursor: page < pageCount ? page + 1 : null,
    };
  };
  return useInfiniteQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    enabled: !!userDetail?.id,
  });
};

export default useFetchClasses;
