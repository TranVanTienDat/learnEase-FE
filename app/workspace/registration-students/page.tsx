import studentRequest from "@/apiRequest/students";
import ListStudent from "./_components/ListStudent";

export default async function Page() {
  const data = await studentRequest.getRegistrationStudents();

  return (
    <div className="container">
      <ListStudent data={data} />
    </div>
  );
}
