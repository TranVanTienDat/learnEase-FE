import classRequest from "@/apiRequest/class";
import EditClass from "@/app/workspace/class/[id]/edit-class/_components/EditClass";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "populate[classroomLayout]": true,
    "populate[schedules]": true,
    "populate[department]": true,
    "populate[grandingBreakdown]": true,
    "populate[assistantTeachers][populate][avatar]": true,
  });
  return (
    <div className="container">
      <div className="pb-14">
        <EditClass teachers={data?.assistantTeachers} data={data} />
      </div>
    </div>
  );
}
