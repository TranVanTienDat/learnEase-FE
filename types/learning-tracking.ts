export type AvatarFormats = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

export type Avatar = {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: AvatarFormats;
    small?: AvatarFormats;
    medium?: AvatarFormats;
    large?: AvatarFormats;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any> | null;
  folderPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Point = {
  id: number;
  extraPoint: number;
  minusPoint: number;
};

export type Activity = {
  note: string;
  point: number;
  imageUrl: string;
  date: string;
};

export type DailyRecord = {
  id: number;
  date: string;
  comment: string;
  activities: Activity[];
  attendance: boolean;
  createdAt: string;
  updatedAt: string;
  point: Point;
};

export type Class = {
  id: number;
  name: string;
  fullName: string;
  publicDailyRecords: boolean;
  attendanceMarkedToday: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: number;
  nickname: string;
  fullName: string;
  birthday: string | null;
  gender: boolean;
  parentName: string;
  parentPhone: string | null;
  note: string;
  group: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  isCheckIn: boolean;
  point: Point;
  avatar: Avatar;
  class: Class;
  dailyRecords: DailyRecord[];
};

export type PreviewImage = {
  id: number;
  name: string;
  alternativeText: string;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: AvatarFormats;
    small?: AvatarFormats;
    medium?: AvatarFormats;
    large?: AvatarFormats;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any> | null;
  folderPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrackingStudentType = {
  student: Student;
  previewImage: PreviewImage;
};
type BaseCommentType = {
  time: string;
  searchDate: string;
};

export type CommentType = BaseCommentType & {
  comment: string;
};

export type EvaluationType = BaseCommentType & {
  activity: Activity;
};
