import { StudentType } from "@/apiRequest/students";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type StudentCardType = {
  student: StudentType;
  randomStatus: boolean;
};

export type RandomStatus = "not-random" | "randomming" | "randomed";

export type StudentListType = {
  listStudents: StudentType[];
  randomStatus: RandomStatus;
};

export type SlotControlsType = {
  listStudentsLength: string;
  maxStudentsLength: number;
  randomStatus: RandomStatus;
  handleAddSlot: () => void;
  handleSubtractSlot: () => void;
  handleTypeChangeSlot: (number: string) => void;
  handleRandom: () => void;
};

export type NavigationButtonsType = {
  idClass: string;
};
