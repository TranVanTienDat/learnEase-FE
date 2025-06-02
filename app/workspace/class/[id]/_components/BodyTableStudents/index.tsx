"use client";
import studentRequest, { StudentType } from "@/apiRequest/students";
import useModals from "@/hooks/useModals";
import { convertImageUrl } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import EditStudentModal from "@/app/workspace/class/[id]/_components/EditStudentModal";
import RemoveClassModal from "@/components/RemoveClassModal";
import { useTranslations } from "next-intl";
import { LucideTrash2, Pencil, TrashIcon, UserRoundPlus } from "lucide-react";

export default function BodyTableStudents({
  students,
  isPermission,
}: {
  students: StudentType[];
  isPermission: boolean;
}) {
  const tToast = useTranslations("toastmessage");
  const tCommon = useTranslations("common");
  const [localStudents, setLocalStudents] = useState(students);
  const router = useRouter();
  const { toast } = useToast();
  const { toggle: toggleEdit, modal } = useModals();
  const [dataModal, setDataModal] = useState<StudentType>();
  const handleReFetchList = (item: StudentType) => {
    setLocalStudents((prev) => {
      return prev.map((student) => {
        if (student.id === item.id) return item;
        return student;
      });
    });
  };
  const handleEdit = (item: StudentType) => {
    if (!isPermission) {
      toast({
        variant: "destructive",
        title: tToast("notAuthorized"),
        description: tToast("desNotAuthorizedEdit"),
      });
    } else {
      setDataModal(item);
      toggleEdit();
    }
  };
  const handleComfirm = () => {
    if (!isPermission) {
      toast({
        variant: "destructive",
        title: tToast("notAuthorized"),
        description: tToast("desNotAuthorizedDelete"),
      });
    }
  };
  const handleRemoveStudent = async (id: string) => {
    try {
      if (id) {
        const res = await studentRequest.deleteStudent(id);
        if (res.status === 200) {
          router.refresh();
          toast({
            title: tCommon("titleDeleteStudent"),
            description: tToast("success"),
          });
        } else if (res.status === 403) {
          toast({
            variant: "destructive",
            title: tToast("error"),
            description: tToast("desNotAuthorizedAction"),
          });
        } else {
          toast({
            variant: "destructive",
            title: tToast("error"),
            description: tToast("desErrorAction"),
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: tToast("error"),
        description: tToast("desErrorDelete"),
      });
    }
  };
  return (
    <>
      {dataModal && (
        <EditStudentModal
          modal={modal}
          toggle={toggleEdit}
          initValue={dataModal}
          onReFetchList={handleReFetchList}
          isPermission={isPermission}
        />
      )}
      <tbody className="bg-white">
        {!!localStudents?.length &&
          localStudents.map(
            (item, index) => (
              console.log("student", convertImageUrl(item?.avatar?.url)),
              (
                <tr
                  key={item.id}
                  className="text-md [&:not(:last-child)]:border-b hover:bg-[#E8F4E6]"
                >
                  <td className="p-1 px-3 text-center">
                    <p>{index + 1}</p>
                  </td>
                  <td className="p-2 px-3">
                    <div className="flex items-center gap-[10px]">
                      <div className="h-[32px] w-[32px]">
                        <Image
                          src={convertImageUrl(item?.avatar?.url)}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="rounded-full w-full h-full mx-auto group-hover:scale-105 transition-all"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold">{item.fullName}</p>
                        <p className="text-xs">{item.nickname}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-1 px-3  font-semibold ">
                    <div className="flex items-center justify-between">
                      <p className="text-primary">+ {item.point.extraPoint}</p>
                      <p className="text-quaternary">
                        - {item.point.minusPoint}
                      </p>
                    </div>
                  </td>
                  <td className="p-1 px-3 ">
                    <p>{item.gender ? tCommon("male") : tCommon("female")}</p>
                  </td>
                  <td className="p-1 px-3 ">
                    <p className="cursor-pointer">{item.group}</p>
                  </td>
                  <td className="p-1 px-3">
                    <p className="cursor-pointer">{item.parentPhone}</p>
                  </td>
                  <td className="p-1 px-3">
                    <p className="cursor-pointer">{item.code}</p>
                  </td>
                  <td className="p-1 px-3">
                    <div className="flex gap-4 justify-start">
                      <Pencil
                        width={18}
                        hanging={18}
                        className="cursor-pointer"
                        onClick={() => handleEdit(item)}
                      />
                      {/* <RemoveClassModal
                        onRemove={() => handleRemoveStudent(item.id.toString())}
                        isPermission={isPermission}
                        handleOpenComfirm={() => handleComfirm()}
                        title={tCommon("titleDeleteStudent")}
                        description={tCommon("desDeleteStudent")}
                        icon={
                          <LucideTrash2
                            className="cursor-pointer"
                            width={18}
                            hanging={18}
                          />
                        }
                      /> */}
                    </div>
                  </td>
                </tr>
              )
            )
          )}
      </tbody>
    </>
  );
}
