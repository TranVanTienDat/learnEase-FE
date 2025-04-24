import { StudentType } from "@/apiRequest/students";

export type ImageType = {
  id: string;
  url: string;
};

export const heads = {
  Monday: {
    text: "monday",
    value: "Monday",
  },
  Tuesday: {
    text: "tuesday",
    value: "Tuesday",
  },
  Wednesday: {
    text: "wednesday",
    value: "Wednesday",
  },
  Thursday: {
    text: "thursday",
    value: "Thursday",
  },
  Friday: {
    text: "friday",
    value: "Friday",
  },
  Saturday: {
    text: "saturday",
    value: "Saturday",
  },
  Sunday: {
    text: "sunday",
    value: "Sunday",
  },
};

export enum FeatureType {
  MINUS = "Minus",
  EXTRA = "Extra",
}

export type IFeature = {
  id?: number | null;
  name: string;
  point: string;
  type: FeatureType;
  image: ImageType | null;
};

export type IEditEvaluation = {
  type: FeatureType;
  index: string;
  value: IFeature;
};

export type TeacherType = {
  uid: string;
  name: string;
  avatar: {
    url: string;
  } | null;
};

export type TeachersType = TeacherType[] | undefined;

export type ScheduleType = {
  day: keyof typeof heads;
  endTime: string;
  id?: string;
  startTime: string;
};
export type ScheduleTypes = ScheduleType[] | [];

export type StudentClassType = {
  students: StudentType[];
  id: string;
};

export type StudentListPageType = {
  student: StudentType;
  isSelectAll: boolean;
};
