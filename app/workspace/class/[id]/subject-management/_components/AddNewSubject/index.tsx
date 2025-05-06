"use client";
import classRequest from "@/apiRequest/class";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MOCKS } from "@/constants/mock";
import useModals from "@/hooks/useModals";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type SubjectType = {
  value: string;
  label: string;
};

export default function AddNewSubject({
  subjects: initSubjects,
  listSubjectId,
  params,
}: {
  subjects: SubjectType[];
  listSubjectId: number[];
  params: { id: string };
}) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const tCommon = useTranslations("common");
  const t = useTranslations("class");
  const tToastMessage = useTranslations("toastmessage");
  const { toast } = useToast();
  const router = useRouter();
  const { toggle, modal: AddNewSubjectModal } = useModals();

  const handleAddSubject = async () => {
    const newList = Array.from(
      new Set([...subjects, ...listSubjectId.map(String)])
    );
    const data = {
      subjects: [...newList],
    };

    const response = await classRequest.updateClassSubject({
      id: params.id,
      data,
    });

    if (response.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: tCommon("updateSubjectSuccess"),
      });
      toggle();
      setSubjects([]);
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: tCommon("updateSubjectErr"),
      });
    }
  };
  const handleShowSubjects = () => {
    toggle();
  };
  return (
    <>
      <Button
        className="flex items-center gap-2 rounded-full"
        onClick={handleShowSubjects}
      >
        <Plus />
        <span>{tCommon("addSubject")}</span>
      </Button>
      <AddNewSubjectModal title={tCommon("addNewSubject")}>
        <MultiSelect
          modalPopover={true}
          options={initSubjects}
          defaultValue={subjects}
          onValueChange={setSubjects}
          placeholder={tCommon("selectSubjects")}
          variant="inverted"
          animation={2}
          maxCount={3}
          contentClassName="w-[400px]  "
          extraText={tCommon("subject")}
        />

        <Button onClick={handleAddSubject} disabled={subjects.length === 0}>
          {t("add")}
        </Button>
      </AddNewSubjectModal>
    </>
  );
}
