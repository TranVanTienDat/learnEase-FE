import { SortType } from "@/types/attendance";
import { HeadItemType, PointStudentType } from "@/types/statisticalPoint";
import { useEffect, useState } from "react";
import useSortAttendance from "@/hooks/attendance/useSortAttendance";
import THeadItem from "@/app/workspace/class/[id]/_components/Statisticals/THeadItem";
import Point from "@/app/workspace/class/[id]/_components/PointStudent/Point";
import StudentItem from "@/app/workspace/class/[id]/_components/Statisticals/StudentItem";
import { useTranslations } from "next-intl";
import Image from "next/image";

type ReportType = {
  weekStart: string;
  weekEnd: string;
  extraPoint: number;
  minusPoint: number;
  totalPoint: number;
};

export const formatDateReports = (reports: ReportType[]): string[] => {
  return reports.map((report, index) => {
    const [startDay] = report.weekStart.split("/");
    const [endDay] = report.weekEnd.split("/");

    return `${startDay}-${endDay}(week ${index + 1})`;
  });
};

export default function TablePoint({
  students: defaultStudents,
  searchParams,
  tableRef,
}: {
  students: PointStudentType[];
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  tableRef: React.RefObject<HTMLTableElement>;
}) {
  const tCommon = useTranslations("common");

  const tHeads = (defaultStudents: PointStudentType[]): HeadItemType[] => [
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
          [SortType.DESC]: () => handleSortName(SortType.DESC),
          [SortType.ASC]: () => handleSortName(SortType.ASC),
        },
      ],
    },
    ...formatDateReports(defaultStudents[0].reports).map((item, index) => ({
      subRows: [
        {
          title: {
            label: item,
            value: `point${index}`,
          },
          [SortType.DESC]: () => handleSortPointTotal(SortType.DESC, index),
          [SortType.ASC]: () => handleSortPointTotal(SortType.ASC, index),
        },
      ],
    })),
  ];

  const [students, setStudents] = useState(defaultStudents);
  const { sort, onSort } = useSortAttendance();

  useEffect(() => {
    setStudents(defaultStudents);
  }, [searchParams]);

  const handleSortName = (type: `${SortType}`) => {
    const newStudents = [...students];
    newStudents.sort((a, b) => {
      return type === SortType.ASC
        ? a.nickname.localeCompare(b.nickname)
        : b.nickname.localeCompare(a.nickname);
    });
    setStudents(newStudents);
  };

  const handleSortPointTotal = (type: SortType, index: number) => {
    const newStudents = [...students];

    newStudents.sort((a, b) => {
      const totalA = +a.reports[index].totalPoint;
      const totalB = +b.reports[index].totalPoint;

      return type === SortType.ASC ? totalB - totalA : totalA - totalB;
    });

    setStudents(newStudents);
  };

  return (
    <>
      {!!students.length ? (
        <div className="border rounded-[20px] overflow-auto">
          <table className="w-full text-sm" ref={tableRef}>
            <thead className="bg-primary">
              <tr>
                {tHeads(defaultStudents)?.map((item) => (
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
                const Element = x.reports.map((point, index) => {
                  return (
                    <td key={index} className="border-l">
                      <Point
                        extraPoint={point.extraPoint}
                        minusPoint={point.minusPoint}
                        totalPoint={point.totalPoint}
                      />
                    </td>
                  );
                });

                return (
                  <StudentItem
                    Element={Element}
                    key={x.id}
                    {...x}
                    nickname={x.nickname || x.fullName}
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
