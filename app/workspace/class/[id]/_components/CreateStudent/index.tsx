"use client";
import studentRequest, {
  StudentParamsType,
  StudentType,
} from "@/apiRequest/students";
import StudentForm from "@/app/workspace/class/[id]/_components/StudentForm";
import { useToast } from "@/components/ui/use-toast";
import { formAddStudentSchema } from "@/constants";
import { useRouter } from "next/navigation";

export default function CreateStudent({
  classId,
  nameClass,
  student,
}: {
  classId: string;
  nameClass: string;
  student?: StudentType;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const handleSubmit = async (params: StudentParamsType) => {
    try {
      const res = await studentRequest.addStudent(params);
      if (res?.status === 200) {
        toast({
          title: "Thành Công",
          description: "Bạn đã tạo thành công",
        });
        // router.push(`/workspace/class/${classId}`);
        // router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tạo, vui lòng kiếm tra lại thông tin",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo, vui lòng kiếm tra lại thông tin",
      });
    }
  };
  return (
    <StudentForm
      classId={classId}
      nameClass={nameClass}
      student={student}
      onSubmit={handleSubmit}
      formSchema={formAddStudentSchema}
    />
  );
}
