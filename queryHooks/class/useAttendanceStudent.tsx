import commonSettingRequest from "@/apiRequest/commonSetting";
import studentRequest from "@/apiRequest/students";
import useUserDetailStore from "@/stores/user-store";
import { IFeature } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const useAttendanceStudent = () => {
  return useMutation({
    mutationFn: async ({
      recordId,
      params,
    }: {
      recordId: string;
      params: { attendance: boolean };
    }) => {
      return await studentRequest.attendanceStudent(recordId, params);
    },
  });
};

export default useAttendanceStudent;
