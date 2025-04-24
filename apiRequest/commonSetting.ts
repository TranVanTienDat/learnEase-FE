import http from "@/lib/http";

const commonSettingRequest = {
  getList: (userId: number | string) =>
    http.get<any>(
      `/users/${userId}?populate[evaluations][populate][image]=true`
    ),
  getExtraPointImages: () =>
    http.get<any>(`/config?populate[defaultEvaluations][populate][image]=true`),
  getImages: (filters: string) => http.get<any>(`/upload/files?${filters}`),
  update: (userId: number, evaluations: any) =>
    http.put<any>(`/users/${userId}`, {
      evaluations,
    }),
};

export default commonSettingRequest;
