import React from "react";
import { ReactNode } from "react";
import clsx from "clsx";
import { HeadItemType, SortType } from "@/types/attendance";
import { StudyPointsStudentType } from "@/types/statisticalStudy";
import THeadItem from "@/app/workspace/class/[id]/_components/Statisticals/THeadItem";
import StudentItem from "@/app/workspace/class/[id]/_components/Statisticals/StudentItem";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { convertAcademicRating, convertConduct } from "@/utils/statistical";

const formatDateGrades = (
  grades: { name: string; coefficient: number }[]
): string[] => {
  return grades.map((grade) => {
    return `${grade.name} (${grade.coefficient}%)`;
  });
};

export default function TableStudy({
  students,
  tableRef,
}: {
  students: StudyPointsStudentType[];
  tableRef: React.RefObject<HTMLTableElement>;
}) {
  const t = useTranslations("statistics");
  const tCommon = useTranslations("common");

  const className = "flex items-center justify-center";

  const tHeads = (student: StudyPointsStudentType[]): HeadItemType[] => [
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
        },
      ],
    },

    ...formatDateGrades(student[0].grades).map((item, index) => ({
      className: "w-[160px]",
      subRows: [
        {
          title: {
            label: item,
            value: `point${index}`,
          },
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
          disabled: true,
          className: "justify-center",
        },
      ],
    })),

    {
      className: "w-[160px]",
      subRows: [
        {
          title: {
            label: t("averageScore"),
            value: "averageScore",
          },
          className: "justify-center",
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },

    {
      className: "w-[160px]",
      subRows: [
        {
          title: {
            label: t("academicRating"),
            value: "academicPerformance",
          },
          className: "justify-center",
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
    {
      className: "w-[160px]",
      subRows: [
        {
          title: {
            label: t("conduct"),
            value: "conduct",
          },
          className: "justify-center",
          disabled: true,
          [SortType.DESC]: () => {},
          [SortType.ASC]: () => {},
        },
      ],
    },
  ];

  return (
    <div className="pt-10 pb-4">
      {!!students?.length ? (
        <div className="border rounded-[20px] overflow-auto">
          <table className="w-full text-sm" ref={tableRef}>
            <thead className="bg-primary">
              <tr>
                {tHeads(students).map((item) => (
                  <THeadItem
                    key={item.subRows[0].title.value}
                    subRows={item.subRows}
                    className={item.className}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((x, index) => {
                const Element: ReactNode = (
                  <>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {x?.grades?.[0]?.score}
                      </div>
                    </td>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {x?.grades?.[1]?.score}
                      </div>
                    </td>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {x?.grades?.[2]?.score}
                      </div>
                    </td>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {x.avgScore}
                      </div>
                    </td>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {t(convertAcademicRating(x.academicPerformance))}
                      </div>
                    </td>
                    <td className="border-l">
                      <div className={clsx(className, "font-bold")}>
                        {t(convertConduct(x.conduct))}
                      </div>
                    </td>
                  </>
                );

                return (
                  <StudentItem
                    key={x.id}
                    {...x}
                    stt={index + 1}
                    nickname={x.student.nickname || x.student.fullName}
                    code={x.student.code}
                    Element={Element}
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
    </div>
  );
}
