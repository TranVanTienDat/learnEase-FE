import { AttendanceStudentType } from "@/types/statisticalAttendance";
import { HeadItemType, SortType } from "@/types/attendance";
import { useEffect, useState } from "react";
import THeadItem from "@/app/workspace/class/[id]/_components/Statisticals/THeadItem";
import useSortAttendance from "@/hooks/attendance/useSortAttendance";
import { customFormatDate } from "@/utils";
import { eachDayOfInterval, parseISO, subDays } from "date-fns";
import StudentItem from "@/app/workspace/class/[id]/_components/Statisticals/StudentItem";
import { PointAttendance } from "../PointStudent/Point";
import { cn } from "@/lib/utils";
import { StudentType } from "@/apiRequest/students";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ArrDateType = {
  from: string;
  to: string;
};

const createDateArray = (
  from: string,
  to: string,
  useFullDate: boolean = true
): string[] => {
  const startDate = new Date(from);
  const endDate = new Date(to);

  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  return dates.map((date) => {
    const [year, month, day] = customFormatDate(date).split("-");
    return useFullDate ? customFormatDate(date) : `${day}/${month}`;
  });
};

export default function AttendanceStatisticalTable({
  students: defaultStudents,
  searchParams,
  tableRef,
}: {
  students: StudentType[];
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  tableRef: React.RefObject<HTMLTableElement>;
}) {
  const t = useTranslations("statistics");
  const tCommon = useTranslations("common");

  const [arrDate, setArrDate] = useState<ArrDateType>({
    from:
      (searchParams?.date1 as string) ||
      customFormatDate(subDays(new Date(), 10)),
    to: (searchParams?.date2 as string) || customFormatDate(),
  });
  const { sort, onSort } = useSortAttendance();
  const tHeads: HeadItemType[] = [
    {
      className: "w-[40px]",
      subRows: [
        {
          title: {
            label: tCommon("order"),
            value: "stt",
          },
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: tCommon("fullName"),
            value: "name",
          },
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
          className: "min-w-[170px]",
        },
      ],
    },
    {
      subRows: [
        {
          title: {
            label: t("total"),
            value: "totalExtra",
          },
          [SortType.DESC]: () => handleSortTotal(SortType.DESC),
          [SortType.ASC]: () => handleSortTotal(SortType.ASC),
          className: "w-[120px] ",
        },
      ],
    },
    ...createDateArray(arrDate.from, arrDate.to, false).map((item, index) => ({
      subRows: [
        {
          title: {
            label: item,
            value: `attendance${index}`,
          },
          disabled: true,

          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
          className: "justify-center w-[70px] ",
        },
      ],
    })),
  ];

  const [students, setStudents] = useState(defaultStudents);

  useEffect(() => {
    setStudents(defaultStudents);
  }, [defaultStudents]);

  useEffect(() => {
    if (searchParams?.date1 && searchParams?.date2) {
      setArrDate({
        from: searchParams.date1 as string,
        to: searchParams.date2 as string,
      });
    }
  }, [searchParams]);

  const handleSortTotal = (type: SortType) => {
    const newStudents = [...students];
    newStudents.sort((a, b) => {
      const totalA =
        a.dailyRecords?.reduce(
          (acc, item) => (item.attendance ? acc + 1 : acc - 1),
          0
        ) ?? 0;

      const totalB =
        b.dailyRecords?.reduce(
          (acc, item) => (item.attendance ? acc + 1 : acc - 1),
          0
        ) ?? 0;

      return type === SortType.ASC ? totalA - totalB : totalB - totalA;
    });
    setStudents(newStudents);
  };

  return (
    <>
      {!!students.length ? (
        <div className="border rounded-[20px] overflow-auto">
          <table className="w-full text-sm" ref={tableRef}>
            <thead className="bg-primary">
              <tr className="">
                {tHeads.map((item) => (
                  <THeadItem
                    key={item.subRows[0].title.value}
                    subRows={item.subRows}
                    activeSort={sort}
                    onChange={onSort}
                    className={item.className}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((x, index) => {
                let countAbsent = 0;
                let countPresent = 0;

                if (x.dailyRecords) {
                  x.dailyRecords.forEach((item) => {
                    item.attendance ? countPresent++ : countAbsent++;
                  });
                }

                const Point = (
                  <td key={`point-${x.id}`} className="border-l bg-[#e7e8eb99]">
                    <PointAttendance
                      extraPoint={countPresent}
                      minusPoint={countAbsent}
                    />
                  </td>
                );

                const Element = createDateArray(arrDate.from, arrDate.to).map(
                  (date, dateIndex) => {
                    const isCheck =
                      x.dailyRecords &&
                      x.dailyRecords.find((record) => record.date === date);

                    return (
                      <td
                        key={`date-${x.id}-${dateIndex}`}
                        className="border-l text-center"
                      >
                        {isCheck ? (
                          isCheck.attendance === null ? (
                            <div className="text-lg font-bold text-[#0F1834]">
                              x
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "font-bold text-base",
                                isCheck.attendance
                                  ? "text-primary"
                                  : "text-quaternary"
                              )}
                            >
                              {isCheck.attendance ? t("present") : t("absent")}
                            </div>
                          )
                        ) : (
                          <div className="text-lg font-bold text-[#0F1834]">
                            x
                          </div>
                        )}
                      </td>
                    );
                  }
                );

                return (
                  <StudentItem
                    Element={
                      <>
                        {Point}
                        {Element}
                      </>
                    }
                    {...x}
                    nickname={x.nickname || x.fullName}
                    key={x.id}
                    stt={index + 1}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Image src="/images/empty-data.svg" width={200} height={200} alt="" />
          <p>{tCommon("noData")}</p>
        </div>
      )}
    </>
  );
}
