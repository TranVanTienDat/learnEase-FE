import classRequest from "@/apiRequest/class";
import LuckyWheel from "@/app/workspace/class/[id]/lucky-wheel/_components/LuckWheel";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: { params: { id: string } }) {
  const t = await getTranslations("common");

  const data = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });

  return (
    <div className="container py-10">
      {data && !!data.students.length && (
        <LuckyWheel students={data.students} />
      )}
    </div>
  );
}
