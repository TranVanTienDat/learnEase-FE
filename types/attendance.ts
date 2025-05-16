export type SortTypeTHead = "descending" | "ascending";

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
  onChange?: (value: { status: SortTypeTHead; key: string }) => void;
};

export type HeadItemRowType = {
  title: {
    label: string;
    value: string;
  };
  className?: string;
  disabled?: boolean;
  [SortType.DESC]: () => void;
  [SortType.ASC]: () => void;
};

export type HeadItemType = {
  className?: string;
  subRows: HeadItemRowType[];
};

export type dailyRecordType = {
  comment: string;
  attendance: true | false | null;
  id: string;
};

export type AttendanceStudentParams =
  | {
      id: string;
      field: keyof dailyRecordType;
      value: boolean | string;
    }
  | undefined;

export const ranks = {
  "1": {
    text: "1st",
    color: "#ffd72e",
  },
  "2": {
    text: "2nd",
    color: "#c4c4c4",
  },
  "3": {
    text: "3rd",
    color: "#e88d21",
  },
};

export type RankType = {
  text: string;
  color: string;
};

export type AttendanceStudentType = {
  id: string;
  stt: string | number;
  nickname: string;
  fullName: string;
  code: string;
  point: {
    extraPoint: string;
    minusPoint: string;
  };
  monthPoint: {
    extra: string;
    minus: string;
  };
  weekPoint: {
    extra: string;
    minus: string;
  };
  dayPoint: {
    extra: string;
    minus: string;
  };
  dailyRecord: dailyRecordType;
  avatar: any;
} & {
  isShowEditComment: boolean;
  isShowSum?: boolean;
  isDisableAttendance: boolean;
  onChangeStudent: (params: AttendanceStudentParams) => void;
  classId: string;
  rank?: keyof typeof ranks;
  onToggleComment?: () => void;
  date: string;
};

export type SaveAttendanceParamsType = {
  studentId: string;
  attendance?: boolean;
  comment?: string;
  activity?: {
    point?: number;
    note?: string;
  };
};

export type ActiveCommentType = {
  id: string;
  comment: string;
};
