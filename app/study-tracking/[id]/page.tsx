import studentRequest, { StudentType } from "@/apiRequest/students";
import Detail from "./_components/Detail";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import classRequest from "@/apiRequest/class";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import pointsRequest from "@/apiRequest/points";

export default async function Page({
  searchParams,
  params,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await studentRequest.getConductStudent(
    Number(params.id),
    searchParams.phoneNumber as string
  );

  const classDetail = await classRequest.getDetailWithPhone(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
    "[populate][subjects]": true,
    "[populate][grandingBreakdowns][populate][grandingBreakdown]": true,
    "[populate][grandingBreakdowns][populate][subject]": true,
    "[populate][seasons]": true,
    phoneOrCode: searchParams.phoneNumber,
  });

  const seasonParams = (
    searchParams.season || classDetail?.seasons?.[0]?.id
  )?.toString() as string;

  const points = await pointsRequest.getList(params.id, seasonParams);

  const subjects = classDetail?.subjects?.map((x) => ({
    label: x.name,
    value: x.id.toString(),
  }));

  if (!data) return <LoadingSnipper />;

  return (
    <Detail
      students={data}
      searchParams={searchParams}
      params={params}
      subjects={subjects || []}
      seasonParams={seasonParams}
      points={points?.payload?.data || []}
      grandingBreakdowns={classDetail?.grandingBreakdowns || []}
      seasons={classDetail?.seasons || []}
    />
  );
}
