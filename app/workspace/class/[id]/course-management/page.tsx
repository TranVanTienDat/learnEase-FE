import classRequest from "@/apiRequest/class";
import AddNewSubject from "@/app/workspace/class/[id]/subject-management/_components/AddNewSubject";
import Empty from "@/app/workspace/class/[id]/subject-management/_components/Empty";
import SubjectTable from "@/app/workspace/class/[id]/subject-management/_components/SubjectTable";
import BackTitle from "@/components/BackTitle";
import MainTable from "@/components/MainTable";
import { Button } from "@/components/ui/button";
import { SUBJECT_MOCKS } from "@/constants/mock";
import { Plus, TrainTrackIcon, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import CourseTable from "./_components/CourseTable";
import AddNewCourse from "./_components/AddNewCourse";
import { LoadingSnipper } from "@/components/LoadingSnipper";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const t = await getTranslations("courseManagement");
  const data = await classRequest.getCourseByClassId(params.id);

  return (
    <div className="container pb-5 space-y-5 min-h-[calc(100vh-310px)]">
      <div className="flex items-center justify-between">
        <BackTitle url={`/workspace/class/${params.id}`}>
          <h1 className="capitalize text-[32px] font-bold">
            {t("courseManagement")}
          </h1>
        </BackTitle>
        <AddNewCourse classId={params.id} />
      </div>
      {!!data.length ? (
        <CourseTable courses={data} classId={params.id} />
      ) : (
        <div>
          <LoadingSnipper className="pt-10" />
        </div>
      )}
    </div>
  );
}
