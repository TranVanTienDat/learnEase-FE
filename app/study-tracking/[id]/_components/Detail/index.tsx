"use client";
import Conduct from "@/app/study-tracking/[id]/_components/Conduct";
import TabNav, { ContentTab } from "@/app/study-tracking/_components/TabNav";
import FilterTerm from "@/app/workspace/class/[id]/enter-points/_components/FilterTerm";
import StatisticalSubjectsTab from "@/app/workspace/class/[id]/statistical/_components/StatisticalSubjectsTab";
import { Tabs } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DatePickerConduct } from "../../../_components/Picker";
import Students from "../Students";

type DetailPropsType = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
  seasons: any[];
  subjects: any[];
  points: any[];
  students: any[];
  grandingBreakdowns: any[];
  seasonParams: string;
};

export default function Detail({
  students,
  searchParams,
  params,
  seasons,
  subjects,
  points,
  grandingBreakdowns,
  seasonParams,
}: DetailPropsType) {
  const [activeId, setActiveId] = useState(
    Number(searchParams.studentId) || students[0]?.id
  );
  const router = useRouter();
  const { phoneNumber, tabs, date, studentId, season } = searchParams;
  const handleActiveStudent = (id: number) => {
    setActiveId(id);
    router.replace(
      `${pathname}?phoneNumber=${phoneNumber}&tabs=${tabs}&studentId=${id}${
        date ? `$&date=${date}` : ""
      }`,
      { scroll: false }
    );
  };
  const handleOnchangeTabs = (value: string) => {
    router.replace(
      `${pathname}?phoneNumber=${phoneNumber}&tabs=${value}${
        studentId ? `&studentId=${studentId}` : ""
      }`,
      { scroll: false }
    );
  };

  const pathname = usePathname();

  const handleChangeFilterTerm = (value: string) => {
    const subject = searchParams?.subject || subjects[0].value;
    router.replace(
      `${pathname}?phoneNumber=${phoneNumber}&tabs=${tabs}&studentId=${activeId}&season=${value}&subject=${subject}`
    );
    router.refresh();
  };

  const handleChangeSubject = (value: string) => {
    router.push(
      `${pathname}?phoneNumber=${phoneNumber}&tabs=${tabs}&studentId=${activeId}&season=${seasonParams}&subject=${value}`
    );
  };

  return (
    <div className="bg-[#F8F8F8] p-[20px] rounded-[20px] pt-[120px] lg:pt-[130px] container">
      <Students
        listStudent={students}
        activeId={activeId}
        handleActiveStudent={handleActiveStudent}
      />
      <Tabs
        defaultValue={(searchParams.tabs as string) || "conductPoint"}
        className="my-7"
        onValueChange={handleOnchangeTabs}
      >
        <TabNav />
        <ContentTab
          datePicker={<DatePickerConduct idClass={params.id} />}
          uiRender={
            <Conduct
              searchParams={searchParams}
              params={params}
              activeId={activeId}
            />
          }
          title="conductPoint"
        />
        <ContentTab
          datePicker={
            <FilterTerm
              list={seasons.map((x) => ({
                ...x,
                id: x.id.toString(),
              }))}
              onChange={handleChangeFilterTerm}
              initValue={seasonParams}
              className="bottom-full top-auto relative"
            />
          }
          uiRender={
            <StatisticalSubjectsTab
              subjects={subjects}
              students={students.filter((x) => x.id === activeId)}
              grandingBreakdowns={grandingBreakdowns}
              points={points}
              key={seasonParams}
              onChangeConduct={() => {}}
              onChangeSubject={handleChangeSubject}
              allowDownload={false}
              isSingleStudent
            />
          }
          title="studyPoint"
        />
      </Tabs>
    </div>
  );
}
