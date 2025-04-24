export type OptionsType = { label: string; value: string | number };

type Avatar = {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: object;
  createdAt: string;
  updatedAt: string;
};

type Class = {
  id: number;
  name: string;
  fullName: string;
  students: {
    data: string[];
  };
  classroomLayout: {
    id: number;
    row: number;
    column: number;
    boardPosition: string;
  };
  assistantTeachers: {
    data: string[];
  };
  evaluations: Evaluation[];
  schedules: Schedule[];
  department: Department;
  teacher: {
    data: string[];
  };
  publicDailyRecords: boolean;
  attendanceMarkedToday: boolean;
  grandingBreakdown: GradingBreakdown[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
  updatedBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
};

type Evaluation = {
  id: number;
  name: string;
  point: number;
  type: string;
  image: Avatar;
};

type Schedule = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

type Department = {
  name: string;
  users: {
    data: string[];
  };
  classes: {
    data: string[];
  };
  address: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
  updatedBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
};

type GradingBreakdown = {
  id: number;
  coefficient: number;
  name: string;
};

type Point = {
  id: number;
  extraPoint: number;
  minusPoint: number;
};

type Position = {
  id: number;
  row: number;
  column: number;
};

type DailyRecord = {
  id: number;
  attributes: any;
};

type Transcript = {
  id: number;
  attributes: any;
};

type Student = {
  id: string;
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
  dailyRecords?: { id: string; date: string; attendance: boolean }[];
};

type Grade = {
  id: number;
  score: number;
  coefficient: number;
  name: string;
};
type AcademicPerformanceType = "Giỏi" | "Khá" | "Trung Bình" | "Yếu";

type ConductType = "Tốt" | "Khá" | "Trung Bình" | "Yếu";

export type StudyPointsStudentType = {
  id: string;
  stt: string | number;
  student: Student;
  semester: string;
  year: string;
  conduct: ConductType;
  avgScore: number;
  academicPerformance: AcademicPerformanceType;
  grades: Grade[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
  updatedBy: {
    data: {
      id: number;
      attributes: any;
    };
  };
} & {
  classId: string;
};
