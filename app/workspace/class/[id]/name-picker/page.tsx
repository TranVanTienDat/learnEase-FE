import { LoadingSnipper } from "@/components/LoadingSnipper";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import NamePicker from "./_components/NamePicker";
import classRequest from "@/apiRequest/class";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });

  if (!data) {
    return <LoadingSnipper />;
  }
  return <NamePicker students={data.students} />;
}
