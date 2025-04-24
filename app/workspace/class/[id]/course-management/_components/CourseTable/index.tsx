"use client";

import classRequest from "@/apiRequest/class";
import MainTable from "@/components/MainTable";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useModals from "@/hooks/useModals";
import { SquarePen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditCourseForm from "../EditCourseForm";

type CourseType = {
  id: number | string;
  stt: string | number;
  name: string;
  duration: string;
};

export default function CourseTable({
  courses = [],
  classId,
}: {
  courses: CourseType[];
  classId: string;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("courseManagement");
  const tToastMessage = useTranslations("toastmessage");
  const { toast } = useToast();
  const router = useRouter();
  const { toggle: toggleRemove, modal: RemoveCourseModal } = useModals();
  const { toggle: toggleEdit, modal: EditCourseModal } = useModals();
  const [deleteId, setDeleteId] = useState<number | string>(-1);
  const [courseEdit, setCourseEdit] = useState<CourseType>({
    id: -1,
    stt: -1,
    name: "",
    duration: "",
  });
  const tHeads = [
    {
      name: "stt",
      title: tCommon("stt"),
      className: "w-[40px]",
    },
    {
      name: "courseName",
      title: tCommon("courseName"),
    },
    {
      name: "duration",
      title: tCommon("duration"),
    },
    {
      name: "action",
      title: tCommon("action"),
      className: "w-[140px]",
    },
  ];

  const handleRemove = async (id: string | number) => {
    const response = await classRequest.deleteCourse(id);
    if (response.status === 200) {
      toast({
        title: tToastMessage("success"),
        description: t("deleteCourseSuccess"),
      });
      router.refresh();
      toggleRemove();
    } else {
      toast({
        variant: "destructive",
        title: tToastMessage("error"),
        description: tCommon("deleteCourseError"),
      });
    }
  };

  const handleEdit = (id: string | number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCourseEdit(course);
      toggleEdit();
    }
  };

  const tBody = courses.map((item, index) => ({
    stt: <p className="text-center">{index + 1}</p>,
    courseName: <p className="font-bold">{item.name}</p>,
    duration: <p className="font-bold">{item.duration}</p>,
    action: (
      <div className="text-center flex items-center justify-center">
        <div className="text-center flex items-center justify-center gap-10">
          <Button variant="link" className="text-foreground p-0 h-auto">
            <SquarePen
              className="w-5"
              onClick={() => {
                handleEdit(item.id);
              }}
            />
          </Button>
          <Button
            variant="link"
            className="text-foreground p-0 h-auto"
            disabled={index === 0}
          >
            <Trash2
              className="w-5"
              onClick={() => {
                toggleRemove();
                setDeleteId(item.id);
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
      <RemoveCourseModal title={t("deleteCourse")}>
        <p className="text-center">{t("confirmDeleteCourse")}</p>
        <p className="text-center mt-[-16px]">{t("note")}</p>
        <DialogFooter className="sm:justify-center gap-4 mt-4">
          <Button
            variant="outline"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={toggleRemove}
          >
            {tCommon("close")}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={() => {
              handleRemove(deleteId);
            }}
          >
            {tCommon("delete")}
          </Button>
        </DialogFooter>
      </RemoveCourseModal>
      <EditCourseModal title={t("editCourse")} classNameContent="max-w-[985px]">
        <EditCourseForm
          toggleRemove={toggleEdit}
          course={courseEdit}
          classId={classId}
        />
      </EditCourseModal>
    </>
  );
}
