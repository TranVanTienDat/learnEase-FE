import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function RemoveClassModal({
  icon,
  onRemove,
  className,
  handleOpenComfirm,
  isPermission = true,
  nameButton,
  description,
  title,
}: {
  onRemove: () => void;
  className?: string;
  nameButton?: string;
  title?: string;
  description?: string;
  isPermission?: boolean;
  handleOpenComfirm?: () => void;
  icon?: string;
}) {
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (!isPermission) {
            handleOpenComfirm?.();
            setOpen(!open);
          } else {
            setOpen(open);
          }
        } else {
          setOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        {icon ? (
          <img
            src="/images/icons/trash.svg"
            className="cursor-pointer"
            alt="delete"
          />
        ) : (
          <Button
            className={clsx(
              "rounded-full p-6 min-w-[180px] font-semibold ml-auto bg-quaternary",
              className
            )}
          >
            {nameButton ?? tCommon("titleDeleteClass")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[484px] text-center gap-10"
        aria-describedby={undefined}
        onPointerDownOutside={() => setOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {title ?? tCommon("titleDeleteClass")}
          </DialogTitle>
        </DialogHeader>
        <p>{description ?? tCommon("desDeleteClass")}</p>
        <DialogFooter className="sm:justify-center gap-4">
          <Button
            variant="outline"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={() => setOpen(false)}
          >
            {tCommon("back")}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
