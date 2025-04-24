import AddNewSubject from "@/app/workspace/class/[id]/subject-management/_components/AddNewSubject";
import { SUBJECT_MOCKS } from "@/constants/mock";
import useModals from "@/hooks/useModals";
import { useTranslations } from "next-intl";
import Image from "next/image";
type SubjectType = {
  value: string;
  label: string;
};

export default function Empty({
  subjects,
  listSubjectId,
  params,
}: {
  subjects: SubjectType[];
  listSubjectId: number[];
  params: { id: string };
}) {
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-5 pt-[90px]">
        <Image src="/images/empty-data.svg" width={200} height={200} alt="" />
        <p>{tCommon("noSubjectsData")}</p>
      </div>
      <AddNewSubject
        subjects={subjects}
        listSubjectId={listSubjectId}
        params={params}
      />
    </div>
  );
}
