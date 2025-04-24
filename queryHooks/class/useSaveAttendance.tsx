import studentRequest from "@/apiRequest/students";
import { useToast } from "@/components/ui/use-toast";
import { SaveAttendanceParamsType } from "@/types/attendance";
import { useMutation } from "@tanstack/react-query";

export default function useSaveAttendance() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      classId,
      params,
      date,
    }: {
      classId: string;
      params: SaveAttendanceParamsType[];
      date?: string;
    }) => {
      try {
        const res = await studentRequest.saveAttendance(classId, params, date);
        return res;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Có lỗi trong khi điểm danh",
        });
      }
    },
  });
}
