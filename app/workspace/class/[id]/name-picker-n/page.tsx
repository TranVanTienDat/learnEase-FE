import { LoadingSnipper } from "@/components/LoadingSnipper";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import NamePickerN from "./_components/NamePickerN";
import classRequest from "@/apiRequest/class";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });

  if (!data) {
    return <LoadingSnipper />;
  }

  return <NamePickerN students={data.students} id={params.id} />;
}
