import classRequest from "@/apiRequest/class";
import BackTitle from "@/components/BackTitle";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import { getTranslations } from "next-intl/server";
import StudentClass from "./_components/StudentClass";

export default async function Page({ params }: { params: { id: string } }) {
  const tCommon = await getTranslations("common");

  const data = await classRequest.getDetail(params.id, {
    "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
  });
  if (!data) {
    return <LoadingSnipper />;
  }

  return (
    <div className="container">
      <div className="flex gap-[20px] items-center justify-start">
        <BackTitle>
          <h1 className="capitalize text-[32px] font-bold">
            {tCommon("classShort")}: <span>{data?.name}</span>
          </h1>
        </BackTitle>
      </div>
      <StudentClass id={params.id} students={data.students} />;
    </div>
  );
}
