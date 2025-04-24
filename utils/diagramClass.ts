import studentRequest, { StudentType } from "@/apiRequest/students";
import { StudentItemType } from "@/types/DiagramClass";

export const swapPosition = async (
  array: (StudentItemType | null)[][],
  rowSource: number,
  colSource: number,
  rowIndex: number,
  colIndex: number
) => {
  let res: { status: number; payload: unknown } | undefined = undefined;
  const updatedArray = array.map((row) => [...row]);

  // Take the pulling element
  const draggedItem = updatedArray[rowSource][colSource];
  if (draggedItem) {
    // Check the destination cell
    if (updatedArray[rowIndex][colIndex] === null) {
      updatedArray[rowIndex][colIndex] = draggedItem;
      updatedArray[rowSource][colSource] = null;
      res = await studentRequest.updatePositionStudent(
        draggedItem.id,
        draggedItem.positionId,
        rowIndex,
        colIndex
      );
    } else {
      const temp = updatedArray[rowIndex][colIndex];
      updatedArray[rowIndex][colIndex] = draggedItem;
      updatedArray[rowSource][colSource] = temp;
      res = await studentRequest.updatePositionStudent(
        draggedItem.id,
        draggedItem.positionId,
        rowIndex,
        colIndex
      );
      if (temp) {
        res = await studentRequest.updatePositionStudent(
          temp.id,
          temp.positionId,
          rowSource,
          colSource
        );
      }
    }
  }

  return { res, updatedArray };
};

export const updateCellTable = (rows: number, columns: number) => {
  const newTableData: (StudentItemType | null)[][] = Array.from(
    { length: rows },
    () => Array(columns).fill(null)
  );
  return newTableData;
};

export const createNewListStudent = (
  students: StudentType[],
  newCellTable: (StudentItemType | null)[][]
) => {
  let newListStudent: StudentItemType[] = [];
  if (students.length === 0) return { newCellTable, newListStudent };
  students.forEach((st, index) => {
    if (st.position) {
      const { row, column, id } = st.position;

      if (column !== null && row !== null) {
        newListStudent[index] = { id: st.id, name: null, positionId: id };
        newCellTable[row][column] = {
          id: st.id,
          name: st.nickname || st.fullName,
          positionId: id,
        };
      } else
        newListStudent[index] = {
          id: st.id,
          name: st.nickname || st.fullName,
          positionId: id,
        };
    }
  });

  return { newCellTable, newListStudent };
};
