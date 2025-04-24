import classRequest from "@/apiRequest/class";
import studentRequest from "@/apiRequest/students";
import EditStudent from "@/app/workspace/class/[id]/_components/EditStudent";

export default async function Page({
  params,
}: {
  params: { id: string; studentId: string };
}) {
  const data = await classRequest.getDetail(params.id);
  const student = await studentRequest.getStudentDetail(params.studentId);
  return (
    <div className="container">
      <div className="pb-14">
        <div className="p-8 border-2 border-tertiary rounded-3xl">
          {data?.name && student && (
            <EditStudent
              classId={params.id}
              nameClass={data.name}
              student={student}
            />
          )}
        </div>
      </div>
    </div>
  );
}
