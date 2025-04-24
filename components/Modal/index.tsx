"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ReactNode, useRef } from "react";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  isShowCloseBtn?: boolean;
  classNames?: string;
}

export default function Modal({
  toggle,
  isOpen,
  children,
  isShowCloseBtn = true,
  classNames,
}: ModalType) {
  const ref = useRef(null);
  useOnClickOutside(ref, toggle);
  if (!isOpen) return null;
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black/30 flex items-center justify-center !m-0">
      <div
        className={clsx(
          "bg-white w-[70%] h-[70%] p-4 rounded-sm relative",
          classNames
        )}
        ref={ref}
      >
        {children}
        {isShowCloseBtn && (
          <FontAwesomeIcon
            onClick={toggle}
            className="cursor-pointer text-[40px] text-primary absolute top-4 right-4"
            icon={faXmark}
          />
        )}
      </div>
    </div>
  );
}
