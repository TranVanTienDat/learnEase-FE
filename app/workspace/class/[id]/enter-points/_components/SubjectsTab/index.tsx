"use client";
import { StudentType } from "@/apiRequest/students";
import CLassificationConduct from "@/app/workspace/class/[id]/enter-points/_components/CLassificationConduct";
import EnterPointTable from "@/app/workspace/class/[id]/enter-points/_components/EnterPointTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConductType } from "@/types/points";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SubjectsTabType = {
  value: string;
  label: string;
};

export default function SubjectsTab({
  subjects,
  students,
  grandingBreakdowns,
  points,
  onChangePoints,
  onChangeConduct,
  onChangeSubject,
}: {
  subjects: SubjectsTabType[];
  students: StudentType[];
  grandingBreakdowns: any[];
  points: any[];
  onChangePoints?: (points: any) => void;
  onChangeConduct: (conduct: ConductType) => void;
  onChangeSubject: (value: string) => void;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("points");
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const tabHeads = [...subjects];
  const renderTabContent = subjects.map((subject) => {
    return (
      <TabsContent key={subject.value} value={subject.value}>
        <EnterPointTable
          subject={subject.value}
          students={students}
          grandingBreakdown={
            grandingBreakdowns.find((item) => item.subject.id == subject.value)
              ?.grandingBreakdown
          }
          points={points}
          onChangePoints={onChangePoints}
        />
        <p className="mt-5 text-quaternary text-sm">{t("clickInput")}</p>
      </TabsContent>
    );
  });
  return (
    <Tabs
      defaultValue={subject || subjects[0].value}
      onValueChange={onChangeSubject}
    >
      <div className="overflow-x-auto tabList-scroll custom-table-scrollbar tabList-width">
        <TabsList className="bg-transparent rounded-none gap-5 ">
          {tabHeads.map((subject) => (
            <TabsTrigger
              key={subject.value}
              value={subject.value}
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#0F1834] data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-primary rounded-none px-0 data-[state=active]:font-bold"
            >
              {subject.label}
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="classificationConduct"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#0F1834] data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-primary rounded-none px-0 data-[state=active]:font-bold"
          >
            {tCommon("classificationConduct")}
          </TabsTrigger>
        </TabsList>
      </div>
      {renderTabContent}
      <TabsContent value="classificationConduct">
        <CLassificationConduct
          students={students}
          points={points}
          onChange={onChangeConduct}
        />
      </TabsContent>
    </Tabs>
  );
}
