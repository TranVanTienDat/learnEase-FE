import classRequest from "@/apiRequest/class";
import Attendances from "@/app/workspace/class/[id]/_components/Attendances";
import { formatDate } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = formatDate(new Date(), "yyyy-MM-dd");
  const data = await classRequest.getAttendance(
    params.id,
    typeof searchParams?.d === "string" ? searchParams?.d : today
  );
  const dataClass = await classRequest.getDetail(params.id, {
    "populate[teacher]": true,
  });

  return (
    <div className="container">
      <Attendances
        classData={{
          name: dataClass?.name || "",
          id: params.id,
          teacherUid: dataClass?.teacher?.uid || "",
        }}
        searchParams={searchParams?.d ? searchParams.d : today}
        students={data.payload.data}
        key={(searchParams.d as string) || uuidv4()}
      />
    </div>
  );
}
