import { StudentType } from "@/apiRequest/students";
import { DataType } from "@/types/wheelLuck";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export const checkGroups = (
  students: StudentType[],
  tableData: (StudentType | null)[][]
) => {
  return students.length >= tableData.length * tableData[0].length;
};

export const updateCellTable = (
  table: (StudentType | null)[][],
  field?: "row" | "col",
  action?: "add" | "remove",
  inputRow?: number,
  inputCol?: number
) => {
  const numRows = table.length;
  const numCols = table[0].length;

  const newRows =
    inputRow !== undefined
      ? inputRow
      : field === "row"
      ? action === "add"
        ? numRows + 1
        : numRows - 1
      : numRows;

  const newCols =
    inputCol !== undefined
      ? inputCol
      : field === "col"
      ? action === "add"
        ? numCols + 1
        : numCols - 1
      : numCols;

  return Array.from({ length: newRows }, () => Array(newCols).fill(null));
};

// Xáo trộn  mảng sinh viên bằng thuật toán  Fisher–Yates Shuffle
export const fisherYatesShuffle = (array: StudentType[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const handleAppendStudents = async (
  students: StudentType[],
  table: (StudentType | null)[][],
  setTable: Dispatch<SetStateAction<(StudentType | null)[][]>>,
  refCheckRandom: MutableRefObject<boolean>
) => {
  refCheckRandom.current = true;
  const newArrStudent = fisherYatesShuffle(students);
  const newTable: (StudentType | null)[][] = [...table];

  const row = table.length;
  const col = table[0].length;
  let indexStudent = 0;
  for (let i = 0; i < col; i++) {
    const sound = new Audio("/sounds/random-group.wav");
    await sleep(1000);
    for (let j = 0; j < row; j++) {
      newTable[j][i] = newArrStudent[indexStudent];
      indexStudent++;
    }

    setTable([...newTable]);
    sound.play();
  }

  refCheckRandom.current = false;
};
