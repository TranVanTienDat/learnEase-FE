import classRequest from "@/apiRequest/class";
import CreateStudent from "@/app/workspace/class/[id]/_components/CreateStudent";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id);
  return (
    <div className="container">
      <div className="pb-14">
        <div className="p-8 border-2 border-tertiary rounded-3xl">
          {data?.name && (
            <CreateStudent classId={params.id} nameClass={data.name} />
          )}
        </div>
      </div>
    </div>
  );
}
