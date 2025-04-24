import { StudentCardType } from "@/types/namePickerN";
import { convertStudentImageUrl } from "@/utils";
import Image from "next/image";

export const Student = ({ student, randomStatus }: StudentCardType) => {
  return (
    <div className="text-center space-y-4 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] rounded-2xl p-4 group cursor-pointer basis-[144px] max-w-[144px]">
      <p className="font-semibold truncate">
        {student.nickname || student.fullName}
      </p>
      <div className="relative overflow-hidden after:content-[''] before:absolute before:w-[112px] before:h-[112px] before:border-2 before:border-primary before:rounded-full before:top-0 before:left-0 after:absolute after:top-2 after:right-2 after:bottom-2 after:left-2 after:border-2 after:border-dashed after:border-secondary after:animate-dash-rotate after:rounded-full after:opacity-0 group-hover:after:opacity-100 after:transition-all">
        <Image
          src={convertStudentImageUrl(student?.avatar?.url)}
          alt="avatar"
          width={200}
          height={200}
          className={`${
            randomStatus ? "animate-bounce-in-right" : ""
          }  rounded-full w-[112px] h-[112px] mx-auto group-hover:scale-105 transition-all`}
        />
      </div>
    </div>
  );
};
