"use client";
import { StudentType } from "@/apiRequest/students";
import ButtonAction, {
  ButtonNavigation,
  SelectClassManagement,
} from "@/app/workspace/class/[id]/_components/ButtonAction";
import { CLASS_PATH, TOOLS_PATH } from "@/constants";
import useGivePointStore from "@/stores/give-point";
import { StudentClassType, StudentListPageType } from "@/types";
import { convertImageUrl } from "@/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ChooseAllAction from "./ChooseAllAction";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import {
  AlarmClockCheck,
  Bike,
  Boxes,
  Copy,
  Grid3X3,
  LifeBuoy,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from "lucide-react";

const Student = ({ student }: StudentListPageType) => {
  const { toggle, updateStudent } = useGivePointStore();
  const handleClick = () => {
    updateStudent([student]);
    toggle();
  };
  return (
    <div
      className="transition-all ease-linear text-center space-y-4 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] rounded-2xl p-4 group cursor-pointer basis-[144px] max-w-[144px]"
      onClick={handleClick}
    >
      <div className="relative after:content-[''] before:absolute before:w-[112px] before:h-[112px] before:bg-white before:border-2 before:border-primary before:rounded-full before:top-0 before:left-0 after:absolute after:top-2 after:right-2 after:bottom-2 after:left-2 after:border-2 after:border-dashed after:border-secondary after:animate-dash-rotate after:rounded-full after:opacity-0 group-hover:after:opacity-100 after:transition-all">
        <Image
          src={convertImageUrl(student?.avatar?.url)}
          alt="avatar"
          width={112}
          height={112}
          className="relative z-[9] rounded-full w-[112px] h-[112px] mx-auto group-hover:scale-105 transition-all"
        />

        <div className="absolute top-0 right-0 flex justify-between w-full z-10">
          <p className="text-white w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold">
            {student?.point?.extraPoint}
          </p>
          <p className="text-white w-10 h-10 rounded-full bg-quaternary flex items-center justify-center font-semibold">
            {student?.point?.minusPoint}
          </p>
        </div>
      </div>
      <p className="font-semibold truncate">
        {student.nickname || student.fullName}
      </p>
    </div>
  );
};

export default function StudentClass({ students, id }: StudentClassType) {
  const t = useTranslations("common");
  const [isSelectAll, setIsSelectAll] = useState(false);

  const toolRef = useRef<HTMLDivElement>(null);
  const [toolHeight, setToolHeight] = useState<number>(0);
  useEffect(() => {
    const updateHeight = () => {
      if (toolRef.current) {
        setToolHeight(toolRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);
  return (
    <div className="relative">
      <div
        className="space-y-10 py-10 min-h-[calc(100vh-240px)]"
        style={{ paddingBottom: `${toolHeight}px` }}
      >
        <div className="flex items-center justify-center flex-wrap gap-4">
          {!!students?.length &&
            students?.map((student: StudentType) => (
              <Student
                key={student.id}
                student={student}
                isSelectAll={isSelectAll}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export const ClassCodeCopy = ({ id }: { id: string | number }) => {
  const tCommon = useTranslations("common");
  return (
    <div
      onClick={() => navigator.clipboard.writeText(id.toString())}
      className="flex gap-[10px] text-[16px]  text-[#0F1834] font-medium border py-[4px] px-[12px] rounded-[20px] bg-[#F8F8F8] cursor-pointer active:bg-primary active:text-white"
    >
      <span>{`${tCommon("codeClass")}: ${id}`}</span>
      <Copy className="w-[18px]" />
    </div>
  );
};
