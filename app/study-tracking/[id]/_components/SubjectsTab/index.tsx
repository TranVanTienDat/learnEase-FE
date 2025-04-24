"use client";
import { StudentType } from "@/apiRequest/students";
import CLassificationConduct from "@/app/workspace/class/[id]/enter-points/_components/CLassificationConduct";
import EnterPointTable from "@/app/workspace/class/[id]/enter-points/_components/EnterPointTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SubjectsTabType = {
  value: string;
  label: string;
};

export default function SubjectsTab({
  subjects,
  points,
}: {
  subjects: SubjectsTabType[];
  points: any[];
}) {
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const subject = searchParams.get("subject");
  const router = useRouter();
  const pathName = usePathname();
  const tabHeads = [...subjects];
  const renderTabContent = subjects.map((subject) => {
    return (
      <TabsContent key={subject.value} value={subject.value}>
        <>1234</>
      </TabsContent>
    );
  });
  return (
    <Tabs
      defaultValue={subject || subjects[0].value}
      onValueChange={(value) => {
        router.push(`${pathName}?subject=${value}`);
      }}
    >
      <TabsList className="bg-transparent rounded-none gap-5">
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
      {renderTabContent}
    </Tabs>
  );
}
