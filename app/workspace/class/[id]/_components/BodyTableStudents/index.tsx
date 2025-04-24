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
                  <td className="p-2 px-3 text-center">
                    <p>{index + 1}</p>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <div className="flex items-center gap-[10px]">
                      <div className="h-[60px] w-[60px]">
                        <Image
                          src={convertImageUrl(item?.avatar?.url)}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="rounded-full w-full h-full mx-auto group-hover:scale-105 transition-all"
                        />
                      </div>
                      <p>{item.fullName}</p>
                    </div>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <p className="max-w-[200px] line-clamp-1 mx-auto cursor-pointer">
                      {item.nickname}
                    </p>
                  </td>
                  <td className="p-2 px-3 border-l font-bold ">
                    <div className="flex items-center justify-between">
                      <p className="text-primary">+ {item.point.extraPoint}</p>
                      <p className="text-quaternary">
                        - {item.point.minusPoint}
                      </p>
                    </div>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <p>{item.gender ? tCommon("male") : tCommon("female")}</p>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <p className="cursor-pointer">{item.group}</p>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <p className="cursor-pointer">{item.parentPhone}</p>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <p className="cursor-pointer">{item.code}</p>
                  </td>
                  <td className="p-2 px-3 border-l">
                    <div className="flex gap-3 justify-between">
                      <img
                        src="/images/icons/edit.svg"
                        className="cursor-pointer"
                        onClick={() => handleEdit(item)}
                        alt="edit"
                      />
                      <RemoveClassModal
                        onRemove={() => handleRemoveStudent(item.id.toString())}
                        isPermission={isPermission}
                        handleOpenComfirm={() => handleComfirm()}
                        title={tCommon("titleDeleteStudent")}
                        description={tCommon("desDeleteStudent")}
                        icon="/images/icons/trash.svg"
                      />
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
