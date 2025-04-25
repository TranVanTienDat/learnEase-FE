import classRequest from "@/apiRequest/class";
import pointsRequest from "@/apiRequest/points";
import studentRequest from "@/apiRequest/students";
import Attendance from "@/app/workspace/class/[id]/statistical/_components/Attendance";
import Point from "@/app/workspace/class/[id]/statistical/_components/PointStudent";
import StatisticalPoints from "@/app/workspace/class/[id]/statistical/_components/StatisticalPoints";
import BackTitle from "@/components/BackTitle";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import { getUserLocale } from "@/services/locale";
import { customFormatDate } from "@/utils";
import { getTranslations } from "next-intl/server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const locale = await getUserLocale();
  const tCommon = await getTranslations("common");
  let data;
  let points;
  let students;
  let classDetail;
  let seasonParams;
  let subjects;
  const date = customFormatDate();

  students = await studentRequest.getList({
    "filters[class][id]": params.id,
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });
  classDetail = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
    "[populate][subjects]": true,
    "[populate][grandingBreakdowns][populate][grandingBreakdown]": true,
    "[populate][grandingBreakdowns][populate][subject]": true,
    "[populate][seasons]": true,
  });

  seasonParams =
    (searchParams?.season as string) ||
    (classDetail?.seasons?.[0]?.id as string);

  points = await pointsRequest.getList(params.id, seasonParams);
  subjects = classDetail?.subjects?.map((x) => ({
    label: x.name,
    value: x.id.toString(),
  }));

  return (
    <div className="container space-y-5 pb-5  min-h-[calc(100vh-310px)]">
      <BackTitle url={`/workspace/class/${params.id}`}>
        <h1 className="capitalize text-[32px] font-bold">
          {tCommon("statistical")}
        </h1>
      </BackTitle>
      {classDetail && (
        <StatisticalPoints
          points={points?.payload?.data || []}
          subjects={subjects || []}
          grandingBreakdowns={classDetail?.grandingBreakdowns || []}
          seasonParams={seasonParams as string}
          students={students || []}
          seasons={classDetail?.seasons}
          params={params}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
