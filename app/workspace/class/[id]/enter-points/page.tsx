import classRequest from "@/apiRequest/class";
import pointsRequest from "@/apiRequest/points";
import studentRequest from "@/apiRequest/students";
import EnterPoints from "@/app/workspace/class/[id]/enter-points/_components/EnterPoints";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const students = await studentRequest.getList({
    "filters[class][id]": params.id,
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });
  const classDetail = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
    "[populate][subjects]": true,
    "[populate][grandingBreakdowns][populate][grandingBreakdown]": true,
    "[populate][grandingBreakdowns][populate][subject]": true,
    "[populate][seasons]": true,
  });

  const seasonParams =
    (searchParams?.season as string) ||
    (classDetail?.seasons?.[0]?.id as string);

  const points = await pointsRequest.getList(params.id, seasonParams);

  const subjects = classDetail?.subjects?.map((x) => ({
    label: x.name,
    value: x.id.toString(),
  }));
  if (!students) {
    return <div>Không có học sinh</div>;
  }
  return (
    <div className="container pb-5 space-y-5 min-h-[calc(100vh-310px)]">
      <EnterPoints
        classId={params.id}
        points={points?.payload?.data || []}
        subjects={subjects || []}
        grandingBreakdowns={classDetail?.grandingBreakdowns || []}
        seasonParams={seasonParams}
        students={students}
        seasons={classDetail?.seasons || []}
      />
    </div>
  );
}
