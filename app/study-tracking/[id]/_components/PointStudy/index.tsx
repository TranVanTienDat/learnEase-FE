import studentRequest from "@/apiRequest/students";
import TabNav, { ContentTab } from "@/app/study-tracking/_components/TabNav";
import { Tabs } from "@/components/ui/tabs";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import { useEffect, useState } from "react";
import SubjectsTab from "../SubjectsTab";
import classRequest from "@/apiRequest/class";

const subjects = [
  { title: "Tổng điểm", key: "totalPoint" },
  { title: "Anh văn", key: "english" },
  { title: "Toán học", key: "math" },
  { title: "Văn học", key: "literature" },
  { title: "Giáo dục công dân", key: "civicEducation" },
  { title: "Hóa học", key: "chemistry" },
  { title: "Vật lí", key: "physics" },
];

export default function PointStudy({
  searchParams,
  params,
  activeId,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
  activeId: number;
}) {
  const [subjects, setSubjects] = useState<{ label: string; value: string }[]>(
    []
  );

  const fetchData = async () => {
    const classDetail = await classRequest.getDetail(params.id, {
      "[populate][subjects]": true,
    });

    if (!!classDetail?.subjects.length) {
      setSubjects(
        classDetail.subjects.map((x) => ({
          label: x.name,
          value: x.id.toString(),
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {!!subjects?.length && (
        <SubjectsTab
          subjects={subjects}
          points={[]}
          key={searchParams?.season as string}
        />
      )}
    </div>
  );
}
