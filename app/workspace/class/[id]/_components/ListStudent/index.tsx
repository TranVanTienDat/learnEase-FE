"use client";
import { StudentType } from "@/apiRequest/students";
import BodyTableStudents from "@/app/workspace/class/[id]/_components/BodyTableStudents";
import CreateStudentModalForm from "@/app/workspace/class/[id]/_components/CreateStudentModalForm";
import BackTitle from "@/components/BackTitle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useModals from "@/hooks/useModals";
import useUserDetailStore from "@/stores/user-store";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const ModalCreateInfo = ({
  toggle,
  modal: Modal,
  nameClass,
  classId,
}: {
  toggle: () => void;
  modal: any;
  initValue: StudentType;
  nameClass: string;
  classId: string;
}) => {
  const t = useTranslations("students");
  return (
    <Modal
      title={t("addNewStudent")}
      classNameContent="sm:max-w-[654px]"
      isModal={false}
    >
      <CreateStudentModalForm
        classId={classId}
        nameClass={nameClass}
        toggle={toggle}
      />
    </Modal>
  );
};

export default function ListStudent({
  students: defaultStudents,
  nameClass,
  classId,
  teacherUid,
}: {
  students: StudentType[];
  nameClass: string;
  classId: string;
  teacherUid: string;
}) {
  const t = useTranslations("students");
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toastmessage");
  const { toggle: toggleCreate, modal } = useModals();
  const { toast } = useToast();
  const [students] = useState<StudentType[]>(defaultStudents);
  console.log("student", students);
  const user = useUserDetailStore((state) => state.user);

  const headSchedule = [
    {
      name: "order",
      className: "text-center w-[60px]",
    },
    {
      name: "fullName",
    },
    {
      name: "shortName",
    },
    {
      name: "totalPoint",
    },
    {
      name: "gender",
    },
    {
      name: "groupLong",
    },
    {
      name: "parentsPhone",
    },
    {
      name: "code",
    },
    {
      name: "action",
    },
  ];

  const handleOpenModal = () => {
    if (!isPermission) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desNotAuthorizedAdd"),
      });
    } else {
      toggleCreate();
    }
  };

  const isPermission = user?.uid == teacherUid;

  return (
    <>
      <ModalCreateInfo
        modal={modal}
        toggle={toggleCreate}
        initValue={{} as StudentType}
        classId={classId}
        nameClass={nameClass}
      />
      <div className="container">
        <div className="space-y-5 pb-5">
          <div className="flex gap-4 justify-between items-center">
            <BackTitle>
              <h1 className="capitalize text-[32px] font-bold">
                {t("titlePage")} {nameClass} {t("class")}
              </h1>
            </BackTitle>
            <div className="flex justify-center gap-4">
              <Button
                variant={"outline"}
                className="min-w-[160px] rounded-full p-2 font-medium text-md "
                onClick={handleOpenModal}
              >
                {tCommon("addStudent")}
              </Button>
              <Link href={`/workspace/class/${classId}`}>
                <Button className="min-w-[160px] rounded-full p-2 font-medium text-md">
                  {tCommon("joinClass")}
                </Button>
              </Link>
            </div>
          </div>

          <div className=" min-h-[500px] bg-white">
            <div className="table-wrapper overflow-y-auto max-h-[500px] border rounded-t-xl md:rounded-xl">
              <table className="relative w-full rounded-t-xl min-w-[800px]">
                <thead className="bg-primary text-white sticky top-0">
                  <tr>
                    {headSchedule.map((item) => (
                      <th
                        className={clsx("p-3 py-2 text-left", item.className)}
                        key={item.name}
                      >
                        {tCommon(item.name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                {students.length > 0 && (
                  <BodyTableStudents
                    students={students}
                    isPermission={isPermission}
                  />
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
