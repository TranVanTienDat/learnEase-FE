import classRequest from "@/apiRequest/class";
import AddNewSubject from "@/app/workspace/class/[id]/subject-management/_components/AddNewSubject";
import Empty from "@/app/workspace/class/[id]/subject-management/_components/Empty";
import SubjectTable from "@/app/workspace/class/[id]/subject-management/_components/SubjectTable";
import BackTitle from "@/components/BackTitle";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: { params: { id: string } }) {
  const tCommon = await getTranslations("common");

  const [data, data2] = await Promise.all([
    classRequest.getClassGrandingBreakdown(params.id),
    classRequest.getListSubject(),
  ]);

  const subjects = !!data?.length
    ? data.map((item: any, index: number) => {
        return {
          id: item.subject.id,
          stt: index + 1,
          subjectCode: item.subject.code,
          subjectName: item.subject.name,
          subjectGbId: item.id,
        };
      })
    : [];
  const listSubject = data2.map((item: any) => ({
    label: item.name,
    value: String(item.id),
  }));

  const listSubjectId = !!data?.length
    ? data.map((item: any) => item.subject.id)
    : [];

  return (
    <div className="container pb-5 space-y-5 min-h-[calc(100vh-310px)]">
      <div className="flex items-center justify-between">
        <BackTitle url={`/workspace/class/${params.id}`}>
          <h1 className="capitalize text-[32px] font-bold">
            {tCommon("managementSubject")}
          </h1>
        </BackTitle>
        {!!data.length && (
          <AddNewSubject
            subjects={listSubject.filter(
              (item: any) => !listSubjectId.includes(Number(item.value))
            )}
            listSubjectId={listSubjectId}
            params={params}
          />
        )}
      </div>
      {!!data.length ? (
        <SubjectTable subjects={[...subjects]} params={params} />
      ) : (
        <Empty
          subjects={listSubject}
          listSubjectId={listSubjectId}
          params={params}
        />
      )}
    </div>
  );
}
