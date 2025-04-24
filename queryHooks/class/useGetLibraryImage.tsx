import commonSettingRequest from "@/apiRequest/commonSetting";
import { useQuery } from "@tanstack/react-query";

// const useGetLibraryImage = () => {
//   return useQuery({
//     queryKey: ["images-config"],
//     queryFn: async () => {
//       const res = await commonSettingRequest.getExtraPointImages();
//       const extraPointImages = res.payload?.data?.extraPointImages;
//       if (extraPointImages.length > 0) {
//         const queryStringParams = extraPointImages.reduce(
//           (params: any, value: number, index: number) => {
//             params[`filters[id][$in][${index}]`] = value;
//             return params;
//           },
//           {}
//         );

//         const queryString = Object.keys(queryStringParams)
//           .map((key) => `${key}=${encodeURIComponent(queryStringParams[key])}`)
//           .join("&");
//         return await commonSettingRequest.getImages(queryString);
//       }
//     },
//     refetchOnMount: false,
//   });
// };

// export default useGetLibraryImage;

const useGetLibraryImage = () => {
  return useQuery({
    queryKey: ["images-config"],
    queryFn: async () => {
      const res = await commonSettingRequest.getExtraPointImages();
      console.log("res", res);
      const extraPointImages = res.payload?.data?.extraPointImages || [];
      const minusPointImages = res.payload?.data?.minusPointImages || [];

      let extraPointImagesResult = null;
      let minusPointImagesResult = null;

      if (extraPointImages.length > 0) {
        const extraQueryStringParams = extraPointImages.reduce(
          (params: any, value: number, index: number) => {
            params[`filters[id][$in][${index}]`] = value;
            return params;
          },
          {}
        );

        const extraQueryString = Object.keys(extraQueryStringParams)
          .map(
            (key) => `${key}=${encodeURIComponent(extraQueryStringParams[key])}`
          )
          .join("&");

        extraPointImagesResult = await commonSettingRequest.getImages(
          extraQueryString
        );
      }

      if (minusPointImages.length > 0) {
        const minusQueryStringParams = minusPointImages.reduce(
          (params: any, value: number, index: number) => {
            params[`filters[id][$in][${index}]`] = value;
            return params;
          },
          {}
        );

        const minusQueryString = Object.keys(minusQueryStringParams)
          .map(
            (key) => `${key}=${encodeURIComponent(minusQueryStringParams[key])}`
          )
          .join("&");

        minusPointImagesResult = await commonSettingRequest.getImages(
          minusQueryString
        );
      }

      return {
        extraPointImages: extraPointImagesResult,
        minusPointImages: minusPointImagesResult,
      };
    },
    refetchOnMount: false,
  });
};

export default useGetLibraryImage;
