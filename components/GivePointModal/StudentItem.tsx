import { StudentType } from "@/apiRequest/students";
import { Checkbox } from "@/components/ui/checkbox";
import { convertImageUrl } from "@/utils";
import clsx from "clsx";
import Image from "next/image";

export default function StudentItem({
  student,
  isActive = false,
  onClick,
}: {
  student: StudentType;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 font-semibold cursor-pointer px-2 py-1 rounded-lg hover:bg-[#E8F4E6]",
        { "bg-[#E8F4E6]": isActive }
      )}
      onClick={onClick}
    >
      <Checkbox checked={isActive} className="w-[18px] h-[18px]" />
      <Image
        src={convertImageUrl(student.avatar?.url)}
        width={48}
        height={48}
        alt="avatar"
      />
      <p className="flex-1 text-left truncate">
        {student.nickname || student.fullName}
      </p>
      <div className="flex gap-3">
        <p className="rounded-full bg-primary text-white h-[28px] min-w-[28px] flex items-center justify-center font-semibold">
          {student.point.extraPoint}
        </p>
        <p className="rounded-full bg-quaternary text-white h-[28px] min-w-[28px] flex items-center justify-center font-semibold">
          {student.point.minusPoint}
        </p>
      </div>
    </div>
  );
}
