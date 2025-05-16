import classRequest from "@/apiRequest/class";
import { Button } from "@/components/ui/button";
import { StudentItemType } from "@/types/DiagramClass";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type EstablishButtonsPropsType = {
  tableData: (StudentItemType | null)[][];
  setTableData: Dispatch<SetStateAction<(StudentItemType | null)[][]>>;
  classroomLayoutId: number | undefined;
  classId: string;
};

export default function EstablishButtons({
  tableData,
  setTableData,
  classroomLayoutId,
  classId,
}: EstablishButtonsPropsType) {
  const t = useTranslations("diagramclass");
  const { toast } = useToast();
  const router = useRouter();

  const [enableBtnTable, setEnableBtnTable] = useState({
    isRow: true,
    isCol: false,
  });

  useEffect(() => {
    let isRow = true;
    let isCol = true;
    if (isLastRowEmpty(tableData) && tableData.length > 2) isRow = false;
    if (isLastColumnEmpty(tableData) && tableData[0].length > 2) isCol = false;

    setEnableBtnTable({ isRow, isCol });
  }, [tableData]);

  const handleTableChange = async (
    action: "add" | "remove",
    field: "row" | "col"
  ) => {
    let updatedTableData = [...tableData];

    if (action === "add") {
      if (field === "row") {
        const lengthCol = updatedTableData[0].length;
        updatedTableData = [
          ...updatedTableData,
          new Array(lengthCol).fill(null),
        ];
      } else if (field === "col") {
        updatedTableData = updatedTableData.map((row) => [...row, null]);
      }
    } else if (action === "remove") {
      if (field === "row") {
        updatedTableData = updatedTableData.slice(0, -1);
      } else if (field === "col") {
        updatedTableData = updatedTableData.map((row) => row.slice(0, -1));
      }
    }
    try {
      const response = await classRequest.updateTableDiagramClass(
        classId,
        classroomLayoutId!,
        updatedTableData.length,
        updatedTableData[0].length
      );
      if (response?.status === 200) {
        setTableData(updatedTableData);
        router.refresh();
      } else if (response?.status === 403) {
        toast({
          variant: "destructive",
          title: t("noPermission"),
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("layoutError"),
      });
    }
    try {
      const response = await classRequest.updateTableDiagramClass(
        classId,
        classroomLayoutId!,
        updatedTableData.length,
        updatedTableData[0].length
      );
      if (response?.status === 200) {
        setTableData(updatedTableData);
        router.refresh();
      } else if (response?.status === 403) {
        toast({
          variant: "destructive",
          title: t("noPermission"),
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("layoutError"),
      });
    }
  };

  const isLastRowEmpty = (data: (StudentItemType | null)[][]) => {
    return data[data.length - 1].every((cell) => cell === null);
  };

  const isLastColumnEmpty = (data: (StudentItemType | null)[][]) => {
    return data.every((row) => row[row.length - 1] === null);
  };

  return (
    <div>
      <div className="flex gap-2 justify-end items-center mb-2 mt-8">
        <Button
          className="bg-tertiary"
          onClick={() => handleTableChange("add", "row")}
        >
          {t("addRow")}
        </Button>
        <Button
          className="bg-tertiary"
          onClick={() => handleTableChange("add", "col")}
        >
          {t("addColumn")}
        </Button>
        <Button
          className="bg-primary"
          disabled={enableBtnTable.isRow}
          onClick={() => handleTableChange("remove", "row")}
        >
          {t("deleteLastRow")}
        </Button>
        <Button
          className="bg-primary"
          disabled={enableBtnTable.isCol}
          onClick={() => handleTableChange("remove", "col")}
        >
          {t("deleteLastColumn")}
        </Button>
      </div>
    </div>
  );
}
