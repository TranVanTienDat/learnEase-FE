"use client";
import { StudentType } from "@/apiRequest/students";
import useGivePointStore from "@/stores/give-point";
import { convertImageUrl } from "@/utils";
import Image from "next/image";

export default function StudentItem(student: StudentType) {
  const { toggle, updateStudent } = useGivePointStore();
  const handleClick = () => {
    updateStudent([student]);
    toggle();
  };
  return (
    <div
      className="text-center space-y-4 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] rounded-2xl p-4 group cursor-pointer basis-[144px] max-w-[144px]"
      onClick={handleClick}
    >
      <p className="font-semibold truncate">{student.nickname}</p>
      <div className="relative after:content-[''] before:absolute before:w-[112px] before:h-[112px] before:border-2 before:border-primary before:rounded-full before:top-0 before:left-0 after:absolute after:top-2 after:right-2 after:bottom-2 after:left-2 after:border-2 after:border-dashed after:border-secondary after:animate-dash-rotate after:rounded-full after:opacity-0 group-hover:after:opacity-100 after:transition-all">
        <Image
          src={convertImageUrl(student?.avatar?.url)}
          alt="avatar"
          width={112}
          height={112}
          className="rounded-full w-[112px] h-[112px] mx-auto group-hover:scale-105 transition-all"
        />
        <div className="absolute top-0 right-0 flex justify-between w-full z-10">
          <p className="text-white w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold">
            {student?.point?.extraPoint}
          </p>
          <p className="text-white w-10 h-10 rounded-full bg-tertiary flex items-center justify-center font-semibold">
            {student?.point?.minusPoint}
          </p>
        </div>
      </div>
    </div>
  );
}
