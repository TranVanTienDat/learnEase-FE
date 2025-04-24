"use client";
import { StudentType } from "@/apiRequest/students";
import EnterPointTable from "@/app/workspace/class/[id]/enter-points/_components/EnterPointTable";
import PointTotal from "@/app/workspace/class/[id]/statistical/_components/PointTotal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConductType } from "@/types/points";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type SubjectsTabType = {
  value: string;
  label: string;
};

export default function StatisticalSubjectsTab({
  subjects,
  students,
  grandingBreakdowns,
  points,
  onChangePoints,
  onChangeSubject,
  allowDownload = true,
  isSingleStudent,
}: {
  subjects: SubjectsTabType[];
  students: StudentType[];
  grandingBreakdowns: any[];
  points: any[];
  onChangePoints?: (points: any) => void;
  onChangeConduct: (conduct: ConductType) => void;
  onChangeSubject: (value: string) => void;
  allowDownload?: boolean;
  isSingleStudent?: boolean;
}) {
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const tabHeads = [...subjects];
  const renderTabContent = subjects.map((subject) => {
    return (
      <TabsContent key={subject.value} value={subject.value}>
        <EnterPointTable
          subject={subject.value}
          subjectName={subject.label}
          students={students}
          grandingBreakdown={
            grandingBreakdowns.find((item) => item.subject.id == subject.value)
              ?.grandingBreakdown
          }
          points={points}
          onChangePoints={onChangePoints}
          allowDownload={allowDownload}
          isSingleStudent={isSingleStudent}
        />
      </TabsContent>
    );
  });
  return (
    <Tabs
      defaultValue={subject || "pointTotal"}
      onValueChange={onChangeSubject}
    >
      <TabsList className="bg-transparent rounded-none gap-5">
        <TabsTrigger
          value="pointTotal"
          className="data-[state=active]:bg-transparent data-[state=active]:text-[#0F1834] data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-primary rounded-none px-0 data-[state=active]:font-bold"
        >
          {tCommon("pointTotal")}
        </TabsTrigger>
        {tabHeads.map((subject) => (
          <TabsTrigger
            key={subject.value}
            value={subject.value}
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#0F1834] data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-primary rounded-none px-0 data-[state=active]:font-bold"
          >
            {subject.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {renderTabContent}
      <TabsContent value="pointTotal">
        <PointTotal
          students={students}
          points={points}
          subjects={subjects}
          grandingBreakdowns={grandingBreakdowns}
          isSingleStudent={isSingleStudent}
        />
      </TabsContent>
    </Tabs>
  );
}
