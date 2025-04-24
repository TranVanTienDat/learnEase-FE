"use client";

import { StudentType } from "@/apiRequest/students";
import { checkGroups } from "@/utils/groupGenerator";
import { useState } from "react";
import Group from "../Group";
import GroupButton from "../GroupButton";
import { useTranslations } from "next-intl";

const initialTableData: (StudentType | null)[][] = [
  [null, null],
  [null, null],
];
export default function GroupGenerator({
  students,
}: {
  students: StudentType[];
}) {
  const t = useTranslations("groupGenerator");
  const [isImg, setIsImg] = useState<boolean>(true);
  const [tableData, setTableData] = useState(initialTableData);
  const [enableTable, setEnableTable] = useState({ isRow: true, isCol: false });
  const [status, setStatus] = useState<{
    isStatusRandom: boolean;
    isListGroup: boolean;
  }>({
    isStatusRandom: false,
    isListGroup: false,
  });

  return (
    <div className="container">
      <Group
        tableData={tableData}
        isImg={isImg}
        isStatusRandom={status.isStatusRandom}
        status={status}
      />
      {!checkGroups(students, tableData) && (
        <div className="text-lg text-[#c51919] text-center pt-4">
          {t("notEnoughNumberDivide")}
        </div>
      )}

      <div className="flex justify-center items-center gap-6  pb-[30px]">
        <GroupButton
          isImg={isImg}
          students={students}
          tableData={tableData}
          enableTable={enableTable}
          setTableData={setTableData}
          setEnableTable={setEnableTable}
          setIsImg={setIsImg}
          setStatus={setStatus}
        />
      </div>
    </div>
  );
}
