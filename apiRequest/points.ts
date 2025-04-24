import { StudentType } from "@/apiRequest/students";
import { SemesterEnum } from "@/constants/statistical";
import http from "@/lib/http";
import { TeachersType, TeacherType } from "@/types";
import { PointIUpdateParamsType } from "@/types/points";
import QueryString from "qs";

export type DetailClassType = {
  id: string;
  fullName: string;
  name: string;
  students: StudentType[];
  teacher: TeacherType;
  assistantTeachers: TeachersType;
  attendanceMarkedToday: boolean;
  evaluations: any[];
  classroomLayout?: {
    id: number;
    row: number;
    column: number;
    boardPosition: "Below" | "Above";
  };
  subjects: any[];
  grandingBreakdowns: any[];
};

const pointsRequest = {
  getList: async (classId: string, seasonId: string) => {
    return await http.get<any>(
      `/v2/points/class/${classId}?seasonId=${seasonId}`
    );
  },
  updatePoint: async (params: PointIUpdateParamsType) => {
    return await http.post<any>(`/v2/points`, { data: params });
  },
};

export default pointsRequest;
