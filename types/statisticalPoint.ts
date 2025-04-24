export type SortTypeTHead = "descending" | "ascending";

export type DatePointType = {
  year: number;
  month: number;
};

export enum SortType {
  ASC = "ascending",
  DESC = "descending",
}

export type THeadItemType = {
  subRows: HeadItemRowType[];
  className?: string;
  activeSort?: {
    status: SortTypeTHead;
    key: string;
  };
  onChange: (value: { status: SortTypeTHead; key: string }) => void;
};

export type HeadItemRowType = {
  title: {
    label: string;
    value: string;
  };
  disabled?: boolean;
  [SortType.DESC]: () => void;
  [SortType.ASC]: () => void;
};

export type HeadItemType = {
  className?: string;
  subRows: HeadItemRowType[];
};

export type PointStudentType = {
  id: string;
  stt: string | number;
  nickname: string;
  fullName: string;
  code: string;
  reports: {
    weekStart: string;
    weekEnd: string;
    extraPoint: number;
    minusPoint: number;
    totalPoint: number;
  }[];
} & {
  isShowEditComment: boolean;
  isShowSum?: boolean;
  isDisableAttendance: boolean;
  classId: string;
};
