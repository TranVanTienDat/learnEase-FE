"use client";
import { useEffect, useState } from "react";

import { DetailClassType } from "@/apiRequest/class";
import studentRequest from "@/apiRequest/students";
import { StudentItemType } from "@/types/DiagramClass";
import {
  createNewListStudent,
  swapPosition,
  updateCellTable,
} from "@/utils/diagramClass";
import ChangeBoardButton from "@/app/workspace/class/[id]/diagram-class/_components/Buttons/ChangeBoardButton";
import EstablishButtons from "@/app/workspace/class/[id]/diagram-class/_components/Buttons/EstablishButtons";
import ListStudent from "@/app/workspace/class/[id]/diagram-class/_components/ListStudent";
import StudentTable from "@/app/workspace/class/[id]/diagram-class/_components/StudentTable";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type DataDraggedSourceType = {
  type: "segment" | "table" | "none";
  row: number;
  col: number;
};

const initialTableData: (StudentItemType | null)[][] = [
  [null, null],
  [null, null],
];

const initDataDraggedSource: DataDraggedSourceType = {
  type: "none",
  row: -1,
  col: -1,
};

export default function DiagramClass({ data }: { data: DetailClassType }) {
  const t = useTranslations("diagramclass");
  const { toast } = useToast();
  const router = useRouter();
  const [listStudent, setListStudent] = useState<StudentItemType[]>([]);
  const [isOnChangeBoard, setIsOnChangeBoard] = useState<"Below" | "Above">(
    "Above"
  );
  const [tableData, setTableData] = useState(initialTableData);
  const [draggedItem, setDraggedItem] = useState<StudentItemType | null>(null);
  const [draggedItemSource, setDraggedItemSource] =
    useState<DataDraggedSourceType>(initDataDraggedSource);

  useEffect(() => {
    if (!data) return;

    const { classroomLayout, students } = data;
    let newTable: (StudentItemType | null)[][] = [];

    if (classroomLayout) {
      const { row, column, boardPosition } = classroomLayout;
      setIsOnChangeBoard(boardPosition);
      newTable = updateCellTable(row, column);
    }

    const { newCellTable, newListStudent } = createNewListStudent(
      students,
      newTable
    );

    setTableData(newCellTable);
    setListStudent(newListStudent);
  }, [data]);

  // Start drag
  const handleDragStart = (
    item: StudentItemType,
    type: "segment" | "table" | "none",
    row: number,
    col: number
  ) => {
    setDraggedItem(item);
    setDraggedItemSource({ type, row, col });
  };

  // Finish drop
  const handleDrop = async (rowIndex: number, colIndex: number) => {
    if (!draggedItem) return;

    const { row: rowSource, col: colSource } = draggedItemSource;
    const { id, positionId } = draggedItem;

    const handleError = (message: string) => {
      toast({
        variant: "destructive",
        title: message,
      });
    };

    const handleSuccess = (updatedData: any, updatedTableData: any) => {
      setListStudent(updatedData);
      setTableData(updatedTableData);
    };

    try {
      if (
        draggedItemSource.type === "segment" &&
        !tableData[rowIndex][colIndex]
      ) {
        const updatedData = listStudent.map((item) =>
          item.id === id ? { ...item, name: null } : item
        );

        const updatedTableData = tableData.map((row, rIndex) =>
          row.map((cell, cIndex) =>
            rIndex === rowIndex && cIndex === colIndex && !cell
              ? draggedItem
              : cell
          )
        );

        const response = await studentRequest.updatePositionStudent(
          id,
          positionId,
          rowIndex,
          colIndex
        );

        if (response?.status === 200) {
          handleSuccess(updatedData, updatedTableData);
          router.refresh();
        } else if (response?.status === 403) handleError(t("noPermission"));
      } else if (draggedItemSource.type === "table") {
        const { res, updatedArray } = await swapPosition(
          tableData,
          rowSource,
          colSource,
          rowIndex,
          colIndex
        );

        if (res?.status === 200) {
          setTableData(updatedArray);
          router.refresh();
        } else if (res?.status === 403) handleError(t("noPermission"));
      }
    } catch (error) {
      handleError(t("layoutError"));
    }

    setDraggedItem(null);
    setDraggedItemSource(initDataDraggedSource);
  };

  return (
    <div className="py-10 text-center">
      <ListStudent
        listStudent={listStudent}
        handleDragStart={handleDragStart}
      />
      <hr className="my-7 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <StudentTable
        tableData={tableData}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
      />
      <EstablishButtons
        tableData={tableData}
        classroomLayoutId={data.classroomLayout?.id}
        classId={data.id}
        setTableData={setTableData}
      />
    </div>
  );
}
