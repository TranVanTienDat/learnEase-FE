import classRequest from "@/apiRequest/class";
import ListStudent from "@/app/workspace/class/[id]/_components/ListStudent";
import { v4 as uuidv4 } from "uuid";

export default async function Students({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "populate[teacher]": true,
  });
  const students = data ? data.students : [];

  return (
    <ListStudent
      key={uuidv4()}
      students={students}
      classId={params.id}
      nameClass={data?.name ?? ""}
      teacherUid={data?.teacher?.uid ?? ""}
    />
  );
}
