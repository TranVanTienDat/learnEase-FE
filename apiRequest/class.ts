import { StudentType } from "@/apiRequest/students";
import { SemesterEnum } from "@/constants/statistical";
import http from "@/lib/http";
import { TeachersType, TeacherType } from "@/types";
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
  seasons: { id: string; name: string }[];
};

const classRequest = {
  getList: async (pr?: any) => {
    const params = {
      ["populate[students][count]"]: true,
      ["populate[teacher]"]: true,
      ["populate[assistantTeachers]"]: true,
      ["sort[id]"]: "asc",
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    return await http.get<any>(`/classes?${paramsString}`);
  },
  getListClass: async (pr?: any) => {
    const params = {
      ["populate[students][count]"]: true,
      ["populate[teacher]"]: true,
      ["sort[id]"]: "desc",
      ["pagination[pageSize]"]: 25,
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    return await http.get<any>(`/classes?${paramsString}`);
  },

  getListClassGroup: async (pr?: any) => {
    const params = {
      ["populate[students][count]"]: true,
      ["populate[assistantTeachers]"]: true,
      ["sort[id]"]: "desc",
      ["pagination[pageSize]"]: 25,
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    return await http.get<any>(`/classes?${paramsString}`);
  },

  getDetail: async (IdClass: string, pr?: any) => {
    try {
      const params = {
        "populate[evaluations][populate][image]": true,
        "populate[students][populate][position]": true,
        "populate[students][populate][avatar]": true,
        "populate[students][populate][point]": true,
        ...pr,
      };
      const paramsString = QueryString.stringify(params);
      const res = await http.get<{ data: DetailClassType }>(
        `/classes/${IdClass}?${paramsString}`
      );
      if (res.status === 200) return res.payload.data;
    } catch (error) {
      console.log(error);
    }
  },
  getDetailWithPhone: async (IdClass: string, pr?: any) => {
    try {
      const params = {
        "populate[evaluations][populate][image]": true,
        "populate[students][populate][position]": true,
        "populate[students][populate][avatar]": true,
        "populate[students][populate][point]": true,
        ...pr,
      };
      const paramsString = QueryString.stringify(params);
      const res = await http.get<{ data: DetailClassType }>(
        `/v2/classes/${IdClass}?${paramsString}`
      );
      if (res.status === 200) return res.payload.data;
    } catch (error) {
      console.log(error);
    }
  },
  getListSubject: async (pr?: any) => {
    const params = {
      ["pagination[pageSize]"]: 1000,
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    const res = await http.get<any>(`/subjects?${paramsString}`);
    if (res.status === 200) return res.payload.data || null;
  },
  getClassGrandingBreakdown: async (classId: string, pr?: any) => {
    const params = {
      "filters[class][id][$eq]": classId,
      ["populate[subject]"]: true,
      ["populate[class]"]: true,
      ["populate[grandingBreakdown]"]: true,
      ["sort[id]"]: "asc",
      ["pagination[pageSize]"]: 1000,
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    const res = await http.get<any>(
      `/class-granding-breakdowns?${paramsString}`
    );
    if (res.status === 200) return res.payload.data || null;
  },
  getClassSubjectGrandingBreakdown: async (id: string | number, pr?: any) => {
    const params = {
      ["populate[subject]"]: true,
      ["populate[class]"]: true,
      ["populate[grandingBreakdown]"]: true,
      ["sort[id]"]: "asc",
      ["pagination[pageSize]"]: 1000,
      ...pr,
    };
    const paramsString = QueryString.stringify(params);
    const res = await http.get<any>(
      `/class-granding-breakdowns/${id}?${paramsString}`
    );
    if (res.status === 200) return res.payload.data || null;
  },
  updateSubject: async ({ id, data }: { id: string | number; data: any }) =>
    http.put<any>(`/class-granding-breakdowns/${id}`, data),
  updateClassSubject: ({ id, data }: { id: string; data: any }) =>
    http.put<any>(`/classes/${id}`, data),

  getCalendar: () => http.get<any>("/v2/users/calendars"),
  createClass: (data: any) => http.post<any>("/v2/classes", data),
  disconnectClass: (IdClass: string) =>
    http.patch<any>(`/v2/classes/${IdClass}/disconnect`, {}),
  importCreateClass: (data: any) => http.post<any>("/v2/classes/import", data),
  uploadFile: (data: any) => http.post<any>("/upload", data),
  deleteClass: (IdClass: string) => http.delete<any>(`/classes/${IdClass}`),
  updateClass: ({ id, data }: { id: string; data: any }) =>
    http.patch<any>(`/v2/classes/${id}`, data),
  getUserByUid: async (uid: string, userId: string) => {
    try {
      const params = {
        "filters[uid][$eq]": uid,
        "populate[avatar]": true,
        "populate[role]": true,
        "filters[role][name][$eq]": "Teacher",
        "filters[$and][1][id][$ne]": userId,
      };
      const paramsString = QueryString.stringify(params);
      const res = await http.get<any>(`/users?${paramsString}`);
      if (res.status === 200) return res.payload.data;
    } catch (error) {
      console.log(error);
    }
  },
  getAttendance: async (id: string, date?: string) => {
    return await http.get<any>(
      `/v2/classes/${id}/attendance${date ? `?date=${date}` : ""}`
    );
  },
  createAttendance: async (id: string) =>
    http.post<any>(`/v2/classes/${id}/attendance`, {}),
  getStatisticalStudyPoint: async (
    id: string,
    semester: SemesterEnum,
    year: number
  ) => {
    return await http.get<any>(
      `/v2/transcripts/class/${id}?year=${year}&semester=${semester}`
    );
  },
  updateTableDiagramClass: async (
    id: string,
    classroomLayoutId: number,
    row: number,
    column: number
  ) => {
    try {
      const params = {
        classroomLayout: {
          id: classroomLayoutId,
          column: column,
          row: row,
        },
      };
      return await http.put<any>(`/classes/${id}`, params);
    } catch (error) {}
  },

  updateBoardClass: async (
    id: string,
    classroomLayoutId: number,
    boardPosition: "Below" | "Above"
  ) => {
    try {
      const params = {
        classroomLayout: {
          id: classroomLayoutId,
          boardPosition,
        },
      };
      return await http.put<any>(`/classes/${id}`, params);
    } catch (error) {}
  },

  getStatisticalAttendance: async (
    id: string,
    dateStart: string,
    dateEnd: string
  ) => {
    const params = {
      ["populate[students][populate][avatar]"]: true,
      ["populate[students][populate][point]"]: true,
      ["populate[students][populate][dailyRecords][filters][date][$gte]"]:
        dateStart,
      ["populate[students][populate][dailyRecords][filters][date][$lte]"]:
        dateEnd,
      ["populate[students][populate][dailyRecords][sort][date]"]: "asc",
    };
    const paramsString = QueryString.stringify(params);
    return await http.get<any>(`/classes/${id}?${paramsString}`);
  },

  CreateCourseByClassId: async ({ data }: { data: any }) =>
    http.post<any>(`/seasons`, data),

  getCourseByClassId: async (id: number | string) => {
    const params = {
      "filters[class][id][$eq]": id,
      "populate[class]": true,
    };
    const paramsString = QueryString.stringify(params);
    const res = await http.get<any>(`/seasons?${paramsString}`);
    if (res.status === 200) return res.payload.data || null;
  },

  updateCourseByClassId: async ({
    id,
    data,
  }: {
    id: string | number;
    data: any;
  }) => http.put<any>(`/seasons/${id}`, data),

  deleteCourse: async (id: number | string) =>
    http.delete<any>(`/seasons/${id}`),
};

export default classRequest;
