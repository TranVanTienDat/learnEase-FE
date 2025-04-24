import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type AlertPropsType = {
  selectedStudent: { name: string; isOpen: boolean };
  setSelectedStudent: Dispatch<
    SetStateAction<{ name: string; isOpen: boolean }>
  >;
};

export default function Alert(props: AlertPropsType) {
  const { selectedStudent, setSelectedStudent } = props;
  const t = useTranslations("luckyWheel");
  return (
    <AlertDialog
      open={selectedStudent.isOpen}
      onOpenChange={() =>
        setSelectedStudent((prev) => ({ ...prev, isOpen: !prev.isOpen }))
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#454545]">
            {t("personSelected")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-2xl text-primary font-bold">
            {selectedStudent.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-tertiary text-[#fff] px-[30px] outline-none border-none">
            OK
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
