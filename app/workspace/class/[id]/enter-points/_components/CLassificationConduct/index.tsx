"use client";
import { StudentType } from "@/apiRequest/students";
import ConductSelect from "@/app/workspace/class/[id]/enter-points/_components/ConductSelect";
import MainTable from "@/components/MainTable";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function CLassificationConduct({
  students,
  points,
  onChange,
}: {
  students: StudentType[];
  points: any[];
  onChange: (points: { studentId: string | number; conduct: string }) => void;
}) {
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const tHeads = [
    {
      name: "stt",
      title: tCommon("stt"),
      className: "w-[40px]",
    },
    {
      name: "name",
      title: tCommon("fullName"),
    },
    {
      name: "conduct",
      title: tCommon("classificationConduct"),
      className: "justify-center",
    },
  ];

  const tBody = students.map((item, index) => {
    const baseColumns = {
      stt: <p className="text-center">{index + 1}</p>,
      name: (
        <div className="space-y-1 w-full">
          <p className="font-bold ">{item.fullName}</p>
          <p className="text-[#5e6477]">{`${tCommon("codeLabel")} ${
            item.code
          }`}</p>
        </div>
      ),
      conduct: (
        <ConductSelect
          initValue={
            points.find(
              (i) => i.student.id === item.id && i.grandingBreakdown === null
            )?.conduct
          }
          onChange={(conduct: string) => {
            const params = {
              studentId: item.id,
              conduct,
            };
            onChange(params);
          }}
        />
      ),
    };

    return baseColumns;
  });

  return <MainTable tHeads={tHeads} tBody={tBody} />;
}
