import studentRequest from "@/apiRequest/students";
import { useQuery } from "@tanstack/react-query";

const useGetImages = () => {
  return useQuery({
    queryKey: ["images-library"],
    queryFn: async () => studentRequest.getImageLibrary(),
  });
};

export default useGetImages;
