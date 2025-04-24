"use client";
import classRequest from "@/apiRequest/class";
import { StudentType } from "@/apiRequest/students";
import ButtonAction from "@/app/workspace//class/[id]/_components/ButtonAction";
import AttendanceStatisticalTable from "@/app/workspace/class/[id]/_components/AttendanceStatisticalTable";
import PickerDateAttendance from "@/app/workspace/class/[id]/statistical/_components/Attendance/PickerDateAttendance";
import NavigationLinkList from "@/app/workspace/class/[id]/statistical/_components/NavigationLinkList";
import { customFormatDate } from "@/utils";
import { subDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

export default function Attendance({
  searchParams,
  params,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  params: { id: string };
}) {
  const t = useTranslations("statistics");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const tableRef = useRef(null);
  const refCheck = useRef(true);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Thống kê điểm danh ${customFormatDate()}`,
    sheet: `Thống kê điểm danh ${customFormatDate()}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await classRequest.getStatisticalAttendance(
        params.id,

        (searchParams?.date1 as string) ||
          customFormatDate(subDays(new Date(), 10)),
        (searchParams?.date2 as string) || customFormatDate()
      );
      if (data.payload.data?.students) setStudents(data.payload.data.students);
    };

    if (refCheck.current || (searchParams.date1 && searchParams.date2)) {
      fetchData();
    }

    refCheck.current = false;
  }, [params.id, searchParams]);
  return (
    <div>
      <div className="flex justify-between items-center gap-[20px] flex-wrap">
        <NavigationLinkList params={params} searchParams={searchParams} />
        <PickerDateAttendance searchParams={searchParams} idClass={params.id} />
      </div>
      <div className="py-10">
        <AttendanceStatisticalTable
          students={students}
          searchParams={searchParams}
          tableRef={tableRef}
        />
        {!!students.length && (
          <div className="mt-[16px] flex justify-start items-center gap-[24px]">
            <ButtonAction
              name={t("downloadExcel")}
              className="bg-primary"
              action={onDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
