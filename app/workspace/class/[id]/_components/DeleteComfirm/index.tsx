import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const DeleteComfirm = ({
  onRemove,
  title,
}: {
  onRemove: (id?: string) => void;
  title?: string;
}) => {
  const tCommon = useTranslations("common");
  const tClass = useTranslations("class");
  return (
    <>
      <p>{title || tCommon("desDeleteStudent")}</p>
      <DialogFooter className="sm:justify-center gap-4">
        <DialogClose asChild>
          <Button
            variant="outline"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          >
            {tCommon("close")}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="destructive"
            className="rounded-full p-6 px-10 min-w-[180px] font-medium text-md"
            onClick={() => onRemove()}
          >
            {tClass("ok")}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
