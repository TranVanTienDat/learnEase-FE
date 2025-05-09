"use client";
import studentRequest, { RegistrationStudents } from "@/apiRequest/students";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useModals from "@/hooks/useModals";
import { TrashIcon, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Body({
  students,
}: {
  students: RegistrationStudents[] | undefined;
}) {
  const tToast = useTranslations("toastmessage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | string>(-1);
  const { toggle: toggleRemove, modal: RemoveCourseModal } = useModals();

  const handleRemove = async (id: string) => {
    const response = await studentRequest.deleteRegistrationStudent(id);
    if (response.status === 200) {
      toast({
        title: "Xóa thành công",
      });
      router.refresh();
      toggleRemove();
    } else {
      toast({
        variant: "destructive",
        title: "Xảy ra lỗi trong khi xóa",
      });
    }
  };

  return (
    <>
      <RemoveCourseModal title={"Xóa học sinh này"}>
        <p className="text-center">Xác nhận xóa</p>
        <p className="text-center mt-[-16px]">
          Lưu ý:Khi xóa không thể khôi phục hệ thống
        </p>
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
              handleRemove(String(deleteId));
            }}
          >
            {tCommon("delete")}
          </Button>
        </DialogFooter>
      </RemoveCourseModal>
      <tbody className="bg-white">
        {students?.length &&
          students.map((item, index) => (
            <tr
              key={item.id}
              className="text-md [&:not(:last-child)]:border-b hover:bg-[#E8F4E6]"
            >
              <td className="p-1 px-3 text-center">
                <p>{index + 1}</p>
              </td>
              <td className="p-2 px-3">
                <p>{item.fullName}</p>
              </td>
              <td className="p-1 px-3  font-semibold ">
                <p>{item.parentName}</p>
              </td>
              <td className="p-1 px-3 ">
                <p>{item.parentPhone}</p>
              </td>
              <td className="p-1 px-3 ">
                <p>{item.className}</p>
              </td>
              <td className="p-1 px-3">
                <div className="flex gap-6 justify-start">
                  <TrashIcon
                    className="w-5 h-5 cursor-pointer text-red-600"
                    onClick={() => {
                      setDeleteId(item.id);
                      toggleRemove();
                    }}
                  />
                  <UserPlus className="w-5 h-5 cursor-not-allowed " />
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </>
  );
}
