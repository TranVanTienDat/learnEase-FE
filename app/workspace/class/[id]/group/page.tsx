import classRequest from "@/apiRequest/class";
import ListGroup from "@/app/workspace/class/[id]/group/_components/ListGroup";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id);
  const students = data ? data.students : [];

  return <ListGroup students={students} classId={params.id} />;
}
