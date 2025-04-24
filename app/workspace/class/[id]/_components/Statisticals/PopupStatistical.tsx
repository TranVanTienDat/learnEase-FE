import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

const ButtonPopup = ({
  name,
  action,
  className,
}: {
  name: string;
  action?: () => void;
  className: String;
}) => {
  return (
    <Button
      onClick={action}
      className={clsx("py-[16px] px-[60px] rounded-full text-white", className)}
    >
      {name}
    </Button>
  );
};

export default function PopupStatistical({
  label,
  title,
  des1,
  des2,
  isOpen,
  className,
  titleCancel,
  titleAction,
  setIsOpen,
  handleAction,
}: {
  label: string;
  title: string;
  des1: string;
  des2: string;
  className?: string;
  isOpen: boolean;
  titleCancel?: string;
  titleAction?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleAction: () => void;
}) {
  const tCommon = useTranslations("common");
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <ButtonAction
          name={label}
          action={() => setIsOpen((prev) => !prev)}
          className={className}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="p-[28px] sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[20px] font-semibold text-[#0F1834] relative">
            {title}

            <FontAwesomeIcon
              icon={faXmark}
              fontSize={24}
              fontWeight={400}
              className="absolute right-[6px] top-0  cursor-pointer rounded-sm opacity-60 hover:opacity-100"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[16px] text-[#0E0D25] font-normal text-center py-[20px]">
            <div>{des1}</div>
            <div>{des2}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center gap-[24px]">
          <ButtonPopup
            name={titleCancel || tCommon("close")}
            className="bg-white text-[#0F1834] border-[.5px] hover:text-white"
            action={() => setIsOpen((prev) => !prev)}
          />
          <ButtonPopup
            name={titleAction || tCommon("delete")}
            className="bg-quaternary"
            action={handleAction}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
