import http from "@/lib/http";
import { SaveAttendanceParamsType } from "@/types/attendance";
import { GivePointParamsType } from "@/types/giveModal";
import { TrackingStudentType } from "@/types/learning-tracking";
import { formatDate } from "date-fns";
import QueryString from "qs";

export type StudentType = {
  id: number;
  fullName: string;
  nickname: string;
  gender: boolean;
  point: {
    extraPoint: number;
    minusPoint: number;
  };
  avatar: {
    url: string;
    id: string;
  };
  parentPhone: string;
  parentName?: string;
  group: string;
  isCheckIn: boolean;
  uid: string;
  code: string;
  position?: { id: number; row: number | null; column: number | null };
  note?: string;
  birthday?: string;
  dailyRecords?: {
    id: string;
    date: string;
    attendance: boolean;
    comment: string;
    updatedAt: string;
    activities: {
      date: string;
      note: string;
      point: number;
      imageUrl: string;
    }[];
  }[];
  reports?: {
    weekStart: string;
    weekEnd: string;
    extraPoint: number;
    minusPoint: number;
    totalPoint: number;
  }[];
  [key: string]: any;
};

export type StudentParamsType = {
  nickname?: string;
  class?: string;
  birthday?: string;
  fullName?: string;
  gender?: boolean;
  group?: string;
  parentName?: string;
  parentPhone?: string;
  code?: string;
  note?: string;
  avatar?: {
    id: string;
  };
};

export type EditStudentParamsType = {
  nickname?: string;
  note?: string;
  class?: string;
  birthday?: string;
  fullName?: string;
  gender?: boolean;
  group?: string;
  parentName?: string;
  parentPhone?: string | null;
  code?: string;
  avatar?: {
    id: string;
  };
};

export type ImageLibraryRes = {
  data: {
    boys: Array<{
      url: string;
      id: string;
    }>;
    girls: Array<{
      url: string;
      id: string;
    }>;
  };
};

const studentRequest = {
  getList: async (pr?: any) => {
    try {
      const params = {
        "populate[avatar]": true,
        "pagination[withCount]": true,
        "populate[point]": true,
        "populate[position]": true,
        ...pr,
      };
      const paramsString = QueryString.stringify(params);
      const res = await http.get<{ data: StudentType[] }>(
        `/students?${paramsString}`
      );
      if (res.status === 200) return res.payload.data || [];
    } catch (error) {
      console.log(error);
    }
  },
  getImageLibrary: async () => http.get<ImageLibraryRes>("/v2/default-images"),
  getLearningTrackingStudent: async (
    classId: number,
    phoneOrCode: string,
    date: string
  ) => {
    try {
      if (classId && phoneOrCode) {
        const res = await http.get<{ data: TrackingStudentType }>(
          `v2/students?classId=${classId}&phoneOrCode=${phoneOrCode}&date=${date}`
        );
        if (res.status === 200) return res.payload.data || [];
      }
    } catch (error) {
      console.log(error);
    }
  },

  getConductStudent: async (
    classId: number,
    phoneOrCode: string,
    date?: string
  ) => {
    try {
      if (classId && phoneOrCode) {
        const res = await http.get<{ data: { students: StudentType[] } }>(
          `v2/students?classId=${classId}&phoneOrCode=${phoneOrCode}${
            date ? `&date=${date}` : ""
          }`
        );
        if (res.status === 200) return res.payload.data.students || [];
      }
    } catch (error) {
      console.log(error);
    }
  },
  getStudentDetail: async (studentId: string) => {
    const params = {
      "populate[avatar]": true,
    };
    const paramsString = QueryString.stringify(params);
    try {
      const res = await http.get<{ data: StudentType }>(
        `/students/${studentId}?${paramsString}`
      );
      if (res.status === 200) return res.payload.data || null;
    } catch (error) {
      console.log(error);
    }
  },
  addStudent: async (params: StudentParamsType) =>
    http.post("/students", { data: params }),
  editStudent: async (studentId: string, params: EditStudentParamsType) =>
    http.put<{ data: StudentType }>(`/students/${studentId}`, params),

  deleteStudent: async (studentId: string) =>
    http.delete<any>(`/students/${studentId}`),

  editStudentModal: async (
    studentId: string,
    params: EditStudentParamsType
  ) => {
    try {
      const res = await http.put<{ data: StudentType }>(
        `/students/${studentId}`,
        params
      );
      if (res.status === 200) return res.payload.data || null;
    } catch (error) {
      console.log(error);
    }
  },

  attendanceStudent: (recordId: string, params: { attendance: boolean }) => {
    return http.patch<any>(`v2/daily-records/${recordId}`, params);
  },

  givePointStudent: (classId: string, params: GivePointParamsType) => {
    return http.post<any>(
      `/v2/classes/${classId}/checkin?date=${formatDate(
        new Date(),
        "yyyy-MM-dd"
      )}`,
      params
    );
  },

  updatePositionStudent: async (
    id: number,
    positionId: number,
    row: number,
    column: number
  ) => {
    try {
      const params = { position: { id: positionId, column: column, row: row } };
      return await http.put(`/students/${id}`, params);
    } catch (error) {
      console.log(error);
    }
  },
  saveAttendance: (
    classId: string,
    params: SaveAttendanceParamsType[],
    date?: string
  ) => {
    return http.post<any>(
      `/v2/classes/${classId}/checkin${date ? `?date=${date}` : ""}`,
      { data: params }
    );
  },
  getPointClass: async (id: string, date: string) => {
    return await http.get<any>(`/v3/classes/${id}/report?date=${date}`);
  },
};

export default studentRequest;
