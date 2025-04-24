export type AttendanceStudentType = {
  id: string;
  stt: string | number;
  nickname: string;
  code: string;
  point: {
    id: number;
    extraPoint: number;
    minusPoint: number;
  };
  dailyRecords: {
    id: number;
    date: string;
    attendance: boolean;
  }[];
} & {
  classId: string;
};
