import classRequest from "@/apiRequest/class";
import DiagramClass from "@/app/workspace/class/[id]/diagram-class/_components/DiagramClass";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "populate[classroomLayout]": true,
    "populate[students][populate][position]": true,
  });

  return (
    <div className="container py-10">
      <div>{data && <DiagramClass data={data} />}</div>
    </div>
  );
}
