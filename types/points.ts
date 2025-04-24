export type PointIUpdateParamsType = {
  seasonId: string;
  studentId: string;
  subjectId?: string;
  score?: number | string;
  grandingBreakdownId: string | null;
  conduct?: string;
};

export type ConductType = { studentId: string | number; conduct: string };

export type SubjectsTabType = {
  value: string;
  label: string;
};
