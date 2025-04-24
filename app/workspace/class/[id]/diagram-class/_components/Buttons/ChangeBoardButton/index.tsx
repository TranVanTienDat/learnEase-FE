import classRequest from "@/apiRequest/class";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type ChangeBoardButtonPropsType = {
  setIsOnChangeBoard: Dispatch<SetStateAction<"Below" | "Above">>;
  classroomLayoutId: number | undefined;
  classId: string;
  isOnChangeBoard: "Below" | "Above";
  action: "Below" | "Above";
};

export default function ChangeBoardButton({
  setIsOnChangeBoard,
  classroomLayoutId,
  classId,
  action,
}: ChangeBoardButtonPropsType) {
  const t = useTranslations("diagramclass");
  const { toast } = useToast();
  const router = useRouter();
  const handleOnChange = async (action: "Below" | "Above") => {
    try {
      const response = await classRequest.updateBoardClass(
        classId,
        classroomLayoutId!,
        action
      );
      if (response?.status === 200) {
        setIsOnChangeBoard(action);
        router.refresh();
      } else if (response?.status === 403)
        toast({
          variant: "destructive",
          title: t("noPermission"),
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("layoutError"),
      });
    }
  };

  return (
    <button
      className="w-[50%] bg-tertiary h-[50px] rounded-[9999px] text-white mt-2"
      onClick={() => handleOnChange(action)}
    >
      {t("tablePosition")}
    </button>
  );
}
