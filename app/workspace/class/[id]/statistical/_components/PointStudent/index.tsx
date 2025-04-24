"use client";
import ButtonAction from "@/app/workspace//class/[id]/_components/ButtonAction";
import TablePoint from "@/app/workspace/class/[id]/_components/PointStudent";
import NavigationLinkList from "@/app/workspace/class/[id]/statistical/_components/NavigationLinkList";
import { PointStudentType } from "@/types/statisticalPoint";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import DatePickerPoint from "@/app/workspace/class/[id]/statistical/_components/PointStudent/PickDatePoint";
import { useTranslations } from "next-intl";

export default function Point({
  students,
  searchParams,
  params,
  month,
  locale,
}: {
  students: PointStudentType[];
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  month: string;
  params: { id: string };
  locale: string;
}) {
  const t = useTranslations("statistics");

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Thống kê điểm số tháng ${month}`,
    sheet: `Thống kê điểm số tháng ${month}`,
  });

  return (
    <div>
      <div className="flex justify-between items-center gap-[20px] flex-wrap">
        <NavigationLinkList params={params} searchParams={searchParams} />
        <DatePickerPoint
          idClass={params.id}
          searchParams={searchParams}
          locale={locale}
        />
      </div>
      <div className="py-10">
        <TablePoint
          searchParams={searchParams}
          students={students}
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
