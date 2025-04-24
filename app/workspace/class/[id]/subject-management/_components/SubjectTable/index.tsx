"use client";
import classRequest from "@/apiRequest/class";
import EditSubjectForm from "@/app/workspace/class/[id]/subject-management/_components/EditSubjectForm";
import MainTable from "@/components/MainTable";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useModals from "@/hooks/useModals";
import useDeleteSubject from "@/queryHooks/class/useDeleteSubject";
import { PencilIcon, Trash2, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SubjectType = {
  id: number | string;
  stt: string | number;
  subjectCode: string;
  subjectName: string;
  subjectGbId: number;
};

export default function SubjectTable({
  subjects = [],
  params,
}: {
  subjects: SubjectType[];
  params: { id: string };
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("subjectManagement");
  const tToastMessage = useTranslations("toastmessage");
  const { toast } = useToast();
  const mutation = useDeleteSubject();
  const router = useRouter();
  const { toggle: toggleRemove, modal: RemoveSubjectModal } = useModals();
  const { toggle: toggleEdit, modal: EditSubjectModal } = useModals();
  const [subjectIdEdit, setSubjectIdEdit] = useState<string | number>("");
  const tHeads = [
    {
      name: "stt",
      title: tCommon("stt"),
      className: "w-[40px]",
    },
    {
      name: "subjectCode",
      title: tCommon("subjectCode"),
    },
    {
      name: "subjectName",
      title: tCommon("subjectName"),
    },
    {
      name: "action",
      title: tCommon("action"),
      className: "w-[140px]",
    },
  ];

  const handleRemove = async (id: string | number) => {
    const listSubjectId = subjects
      .filter((item) => item.id !== id)
      .map((item) => item.id);

    const data = {
      subjects: [...listSubjectId],
    };
    const response = await mutation.mutateAsync({ classId: params.id, data });

    if (response.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: tCommon("deleteSubjectSuccess"),
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: tCommon("deleteSubjectErr"),
      });
    }
  };
  const handleEdit = (id: string | number) => {
    toggleEdit();
    setSubjectIdEdit(id);
  };

  const tBody = subjects.map((item, index) => ({
    stt: <p className="text-center">{index + 1}</p>,
    subjectCode: <p className="font-bold">{item.subjectCode}</p>,
    subjectName: <p className="font-bold">{item.subjectName}</p>,
    action: (
      <div className="text-center flex items-center justify-center">
        <div className="text-center flex items-center justify-center gap-10">
          <Button variant="link" className="text-foreground p-0 h-auto">
            <SquarePen
              className="w-5"
              onClick={() => {
                handleEdit(item.subjectGbId);
              }}
            />
          </Button>
          <Button
            variant="link"
            className="text-foreground p-0 h-auto"
            disabled={mutation.isPending}
          >
            <Trash2
              className="w-5"
              onClick={() => {
                handleRemove(item.id);
              }}
            />
          </Button>
        </div>
      </div>
    ),
  }));

  return (
    <>
      <MainTable tBody={tBody} tHeads={tHeads} />
      <RemoveSubjectModal title={t("deleteSubjects")}>
        <p className="text-center">{t("sureDelete")}</p>
        <DialogFooter className="sm:justify-center gap-4">
          <Button
            variant="outline"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={toggleRemove}
          >
            {tCommon("back")}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={() => {
              toggleRemove();
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </RemoveSubjectModal>
      <EditSubjectModal
        title={t("editSubjects")}
        classNameContent="max-w-[985px]"
      >
        <EditSubjectForm
          toggleRemove={toggleEdit}
          subjectId={subjectIdEdit}
          params={params}
        />
      </EditSubjectModal>
    </>
  );
}
