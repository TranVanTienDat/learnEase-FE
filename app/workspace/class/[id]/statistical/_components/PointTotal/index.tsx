"use client";
import { StudentType } from "@/apiRequest/students";
import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import MainTable from "@/components/MainTable";
import { SubjectsTabType } from "@/types/points";
import { calculateAverage, convertAbility } from "@/utils/points";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

export default function PointTotal({
  students,
  points,
  subjects,
  grandingBreakdowns,
  isSingleStudent,
}: {
  students: StudentType[];
  points: any[];
  subjects: SubjectsTabType[];
  grandingBreakdowns: any[];
  isSingleStudent?: boolean;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("points");
  const tStatistics = useTranslations("statistics");

  const tHeadSubjects = subjects.map((item) => ({
    name: item.label,
    title: item.label,
    className: "w-[110px] justify-center",
  }));
  const headBase = isSingleStudent
    ? []
    : [
        {
          name: "stt",
          title: tCommon("stt"),
          className: "w-[40px] ",
        },
        {
          name: "name",
          title: tCommon("fullName"),
          className: "min-w-[120px]",
        },
      ];
  const tHeads = [
    ...headBase,
    ...tHeadSubjects,
    {
      name: "average",
      title: tCommon("average"),
      className: "justify-center",
    },
    {
      name: "ability",
      title: tCommon("ability"),
      className: "justify-center",
    },
    {
      name: "conduct",
      title: tCommon("classificationConduct"),
      className: "justify-center",
    },
  ];

  const tBody = students.map((item, index) => {
    const baseColumns = isSingleStudent
      ? {}
      : {
          stt: <p className="text-center">{index + 1}</p>,
          name: (
            <div className="space-y-1 w-full">
              <p className="font-bold">{item.fullName}</p>
              <p className="text-[#5e6477]">{`${tCommon("codeLabel")} ${
                item.code
              }`}</p>
            </div>
          ),
        };

    const subjectsColumns = subjects.reduce((acc: any, subject) => {
      const currentGrandingBreakdown = grandingBreakdowns.find(
        (x) => x.subject.id == subject.value
      );

      const average = calculateAverage({
        points,
        grandingBreakdowns: currentGrandingBreakdown?.grandingBreakdown,
        student: item,
        subjectId: subject.value,
      });
      acc[subject.label] = <p className="text-center">{+average}</p>;
      return acc;
    }, {});

    const totalAbility = (
      subjects.reduce((acc: any, subject) => {
        const currentGrandingBreakdowns = grandingBreakdowns?.find(
          (x) => x.subject.id == subject.value
        )?.grandingBreakdown;
        const averages = calculateAverage({
          points,
          grandingBreakdowns: currentGrandingBreakdowns,
          student: item,
          subjectId: subject.value,
        });
        return acc + +averages;
      }, 0) / subjects.length
    ).toFixed(1);

    const bottomColumns = {
      average: <p className="text-center">{+totalAbility}</p>,
      ability: (
        <p className="text-center">
          {totalAbility === "0.0" ? '-' : t(convertAbility(+totalAbility))}
        </p>
      ),
      conduct: (
        <p className="text-center">
          {points.find(
            (i) => i.student.id === item.id && i.grandingBreakdown === null
          )
            ? tCommon(
                points.find(
                  (i) =>
                    i.student.id === item.id && i.grandingBreakdown === null
                )?.conduct
              )
            : "-"}
        </p>
      ),
    };

    return { ...baseColumns, ...subjectsColumns, ...bottomColumns };
  });
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: tCommon("pointTotal"),
    sheet: tCommon("pointTotal"),
  });

  return (
    <>
      <MainTable tHeads={tHeads} tBody={tBody} tableRef={tableRef} />
      {!!students.length && (
        <div className="mt-[16px] flex justify-start items-center gap-[24px]">
          <ButtonAction
            name={tStatistics("downloadExcel")}
            className="bg-primary"
            action={onDownload}
          />
        </div>
      )}
    </>
  );
}
