import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { useMemo, useState } from "react";

export default function useModals() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const Modal = ({
    title,
    children,
    classNameContent,
    isModal = true,
  }: {
    title?: string;
    children?: React.ReactNode;
    classNameContent?: string;
    isModal?: boolean;
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={toggle} modal={isModal}>
        <DialogContent
          className={clsx(
            "rounded-[20px] p-6",
            classNameContent,
            !isModal && "backgroundShadow"
          )}
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {title && (
            <DialogHeader>
              <DialogTitle className="text-center font-bold text-xl">
                {title}
              </DialogTitle>
            </DialogHeader>
          )}

          {children}
        </DialogContent>
      </Dialog>
    );
  };

  const ModalMemo = useMemo(() => Modal, [isOpen]);

  return {
    isOpen,
    toggle,
    modal: ModalMemo,
  };
}
