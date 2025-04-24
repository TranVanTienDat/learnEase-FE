import classRequest from "@/apiRequest/class";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import GroupGenerator from "./_components/GroupGenerator";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });

  return (
    <div className="container py-10">
      {data && !!data.students?.length && (
        <GroupGenerator students={data.students} />
      )}
    </div>
  );
}
