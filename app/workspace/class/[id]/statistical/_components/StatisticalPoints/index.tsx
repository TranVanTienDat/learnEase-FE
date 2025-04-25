"use client";
import FilterTerm from "@/app/workspace/class/[id]/enter-points/_components/FilterTerm";
import NavigationLinkList from "@/app/workspace/class/[id]/statistical/_components/NavigationLinkList";
import StatisticalSubjectsTab from "@/app/workspace/class/[id]/statistical/_components/StatisticalSubjectsTab";
import { usePathname, useRouter } from "next/navigation";

export default function StatisticalPoints({
  seasons,
  subjects,
  students,
  grandingBreakdowns,
  points,
  seasonParams,
  searchParams,
  params,
}: {
  seasons: any[];
  subjects: any[];
  points: any[];
  students: any[];
  grandingBreakdowns: any[];
  seasonParams: string;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  params: { id: string };
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeFilterTerm = (value: string) => {
    const subject = searchParams?.subject || subjects[0].value;
    router.replace(`${pathname}?key=study&season=${value}&subject=${subject}`);
    router.refresh();
  };

  const handleChangeSubject = (value: string) => {
    router.push(
      `${pathname}?key=study&season=${seasonParams}&subject=${value}`
    );
  };

  return (
    <div className="py-2 border-t">
      <div className="relative">
        {!!seasons?.length && (
          <FilterTerm
            list={seasons.map((x) => ({
              ...x,
              id: x.id.toString(),
            }))}
            onChange={handleChangeFilterTerm}
            initValue={seasonParams.toString()}
            className="bottom-full top-auto  mb-6"
          />
        )}
        {!!subjects?.length && (
          <StatisticalSubjectsTab
            subjects={subjects}
            students={students}
            grandingBreakdowns={grandingBreakdowns}
            points={points}
            key={seasonParams}
            onChangeConduct={() => {}}
            onChangeSubject={handleChangeSubject}
          />
        )}
      </div>
    </div>
  );
}
