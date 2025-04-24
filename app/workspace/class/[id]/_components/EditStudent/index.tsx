"use client";
import studentRequest, {
  StudentParamsType,
  StudentType,
} from "@/apiRequest/students";
import StudentForm from "@/app/workspace/class/[id]/_components/StudentForm";
import { useToast } from "@/components/ui/use-toast";
import { formEditStudentSchema } from "@/constants";
import { useRouter } from "next/navigation";

export default function EditStudent({
  classId,
  nameClass,
  student,
}: {
  classId: string;
  nameClass: string;
  student: StudentType;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const handleSubmit = async (params: StudentParamsType) => {
    try {
      const res = await studentRequest.editStudent(
        student.id.toString(),
        params
      );
      if (res?.status === 200) {
        toast({
          title: "Thành Công",
          description: "Bạn đã chỉnh sửa thành công",
        });
        router.push(`/workspace/class/${classId}`);
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description:
            "Mã học sinh đã bị trùng. Vui lòng đổi lại mã khác",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          "Mã học sinh đã bị trùng. Vui lòng đổi lại mã khác",
      });
    }
  };
  return (
    <StudentForm
      classId={classId}
      nameClass={nameClass}
      student={student}
      onSubmit={handleSubmit}
      formSchema={formEditStudentSchema}
    />
  );
}
