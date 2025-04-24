"use client";
import { useEffect, useRef, useState } from "react";
import NavigationLinkList from "@/app/workspace/class/[id]/statistical/_components/NavigationLinkList";
import { StudyPointsStudentType } from "@/types/statisticalStudy";
import StudyPicker from "@/app/workspace/class/[id]/statistical/_components/Study/StudyPicker";
import TableStudy from "@/app/workspace/class/[id]/statistical/_components/Study/TableStudy";
import ButtonAction from "../../../_components/ButtonAction";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslations } from "next-intl";

export default function Study({
  searchParams,
  students: defaultStudents,
  params,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  students: StudyPointsStudentType[];
  params: { id: string };
}) {
  const t = useTranslations("statistics");
  const [students, setStudents] = useState(defaultStudents);
  const tableRef = useRef(null);

  const getFilename = () => {
    const semester =
      searchParams?.semester?.toString()?.toLowerCase() ?? "học kỳ 1";
    const year = searchParams.year ?? String(new Date().getFullYear());
    return `Thống kê điểm học tập ${semester} năm ${year}`;
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: getFilename(),
    sheet: getFilename(),
  });

  useEffect(() => {
    setStudents(defaultStudents);
  }, [defaultStudents]);

  return (
    <>
      <div className="flex justify-between items-center gap-[20px] flex-wrap">
        <NavigationLinkList searchParams={searchParams} params={params} />
        <StudyPicker idClass={params.id} />
      </div>
      <TableStudy students={students} tableRef={tableRef} />
      {!!students?.length && (
        <ButtonAction name={t("downloadExcel")} action={onDownload} />
      )}
    </>
  );
}
