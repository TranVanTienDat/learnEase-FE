"use client";
import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import MainTable from "@/components/MainTable";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

type PointItemType = {
  id?: number;
  conduct?: string;
  score: number;
  student: {
    id: number;
  };
  grandingBreakdown: {
    id?: number;
    coefficient?: number;
    name?: string;
  } | null;
  subject: {
    id: number;
    code?: string;
    name?: string;
  };
};

const isDifferent = (item1: PointItemType, item2: PointItemType): boolean => {
  return (
    item1.student.id === item2.student.id &&
    item1?.subject?.id === item2?.subject?.id &&
    item1.grandingBreakdown?.id === item2.grandingBreakdown?.id &&
    item1.score === item2.score
  );
};

type Item = {
  id?: number;
  conduct?: string;
  score: number;
  student: {
    id: number;
  };
  grandingBreakdown: {
    id?: number;
    coefficient?: number;
    name?: string;
  } | null;
  subject: {
    id: number;
    code?: string;
    name?: string;
  };
};

export default function EnterPointTable({
  subject,
  students,
  grandingBreakdown,
  points,
  onChangePoints,
  allowDownload = false,
  subjectName,
  isSingleStudent,
}: {
  subject: string;
  students: any[];
  grandingBreakdown: { name: string; coefficient: string; id: string }[];
  points: any[];
  onChangePoints?: (points: any) => void;
  allowDownload?: boolean;
  subjectName?: string;
  isSingleStudent?: boolean;
}) {
  const [pointsLocal, setPointsLocal] = useState<any[]>(points);
  const tCommon = useTranslations("common");
  const tStatistics = useTranslations("statistics");
  const tHeadCoefficient =
    grandingBreakdown?.map((item) => ({
      name: item.id,
      title: item.name,
      className: "w-[140px] justify-center",
    })) || [];

  const headBase = isSingleStudent
    ? []
    : [
        {
          name: "stt",
          title: tCommon("stt"),
          className: "w-[40px]",
        },
        {
          name: "name",
          title: tCommon("fullName"),
          className: "min-w-[120px]",
        },
      ];
  const tHeads = [
    ...headBase,
    ...tHeadCoefficient,
    {
      name: "averageScore",
      title: tCommon("averageScore"),
      className: "w-[140px] justify-center",
    },
  ];

  const tBody = students.map((item, index) => {
    const baseColumns = isSingleStudent
      ? {}
      : {
          stt: <p className="text-center">{index + 1}</p>,
          name: (
            <div className="space-y-1 w-full">
              <p className="font-bold text-md">{item.fullName}</p>
              <p className="text-[#5e6477] text-sm">{`${tCommon("codeLabel")} ${
                item.code
              }`}</p>
            </div>
          ),
        };

    const coefficientTotal = grandingBreakdown?.reduce((acc, coef) => {
      return acc + +coef.coefficient;
    }, 0);

    const averageScore = (
      <p className="text-center bg-[#F8F8F8] h-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        {grandingBreakdown
          ?.reduce((acc, coef) => {
            return (
              acc +
              ((pointsLocal?.find(
                (x) =>
                  x.student.id === item.id &&
                  x?.subject?.id == subject &&
                  x?.grandingBreakdown?.id == coef.id
              )?.score ?? 0) *
                +coef.coefficient) /
                coefficientTotal
            );
          }, 0)
          .toFixed(1)}
      </p>
    );

    const coefficientColumns = grandingBreakdown?.reduce((acc: any, coef) => {
      acc[coef.id] = onChangePoints ? (
        <EnterPointInput
          initValue={
            pointsLocal?.find(
              (x) =>
                x.student.id === item.id &&
                x?.subject?.id == subject &&
                x?.grandingBreakdown?.id == coef.id
            )?.score ?? "-"
          }
          readOnly={!onChangePoints}
          onChange={(value) => {
            const newPoints = JSON.parse(JSON.stringify(pointsLocal));
            const index = newPoints.findIndex(
              (x: any) =>
                x.student.id === item.id &&
                x?.subject?.id == subject &&
                x?.grandingBreakdown?.id == coef.id
            );
            if (index !== -1) {
              newPoints[index].score = +value;
            } else {
              newPoints.push({
                student: {
                  id: item.id,
                },
                subject: {
                  id: subject,
                },
                grandingBreakdown: {
                  id: coef.id,
                  coefficient: coef.coefficient,
                  name: coef.name,
                },
                score: +value,
              });
            }

            setPointsLocal(newPoints);
            const pointsChange = newPoints.filter(
              (itemB: Item) =>
                !points.some((itemA) => isDifferent(itemA, itemB))
            );
            onChangePoints?.(pointsChange);
          }}
        />
      ) : (
        <p className="text-center">
          {pointsLocal?.find(
            (x) =>
              x.student.id === item.id &&
              x?.subject?.id == subject &&
              x?.grandingBreakdown?.id == coef.id
          )?.score ?? "-"}
        </p>
      );
      return acc;
    }, {});

    return { ...baseColumns, ...coefficientColumns, averageScore };
  });
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: subjectName || "File",
    sheet: subjectName,
  });

  return (
    <>
      <MainTable tHeads={tHeads} tBody={tBody} tableRef={tableRef} />
      {allowDownload && !!students.length && (
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

const EnterPointInput = ({
  onChange = () => {},
  initValue = 0,
  readOnly = false,
}: {
  onChange?: (value: number) => void;
  initValue?: number;
  readOnly?: boolean;
}) => {
  const [value, setValue] = useState<number>(initValue);
  const debounceChange = useDebounce(onChange, 500);
  const min = 0;
  const max = 10;
  return (
    <Input
      value={value}
      type="number"
      min={0}
      max={10}
      onChange={(e) => {
        const newValue =
          Math.min(Math.max(parseInt(e.target.value, 10), min), max) || "";
        setValue(newValue as number);
        debounceChange(newValue as number);
      }}
      className="border-0 focus:border rounded-none focus:border-primary text-center h-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center cursor-pointer"
      readOnly={readOnly}
    />
  );
};
