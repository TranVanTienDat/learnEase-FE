"use client";
import { StudentType } from "@/apiRequest/students";
import { cn } from "@/lib/utils";
import { convertImageUrl } from "@/utils";
import Image from "next/image";

const ItemDescription = ({ item }: { item: any }) => {
  return (
    <div className="bg-white py-[4px] px-[6px] rounded-sm">
      <span
        className={cn(
          "font-bold",
          item.type === "ex" ? "text-primary" : "text-quaternary"
        )}
      >
        +{item.point}{" "}
      </span>
      Cho{" "}
      <span
        className={cn(
          "font-bold",
          item.type === "ex" ? "text-primary" : "text-quaternary"
        )}
      >
        {item.des}
      </span>
    </div>
  );
};

const Item = ({ item }: { item: any }) => {
  return (
    <div className="flex justify-start items-start gap-[12px] mr-2">
      <Image
        src={convertImageUrl(item.img ?? "")}
        alt="avatar"
        width={50}
        height={50}
      />
      <div className="font-medium text-[14px] flex-1">
        <ItemDescription item={item} />
        <div className="text-[#0F1834] font-normal mb-[8px]">{item.time}</div>
      </div>
    </div>
  );
};

type PointType = {
  extraPoint: number;
  minusPoint: number;
  id: number;
};
type AvatarStudentProps = {
  activeId: number;
  listStudent: StudentType[];
  handleActiveStudent: (id: number) => void;
};

export default function Students({
  listStudent,
  activeId,
  handleActiveStudent,
}: AvatarStudentProps) {
  return (
    <div className="overflow-x-auto ">
      <div className="grid grid-flow-col gap-5 justify-center">
        {listStudent.map((student) => {
          return (
            <div
              key={student.id}
              className={cn(
                "bg-white rounded-[12px] p-[20px] border-[2px] cursor-pointer w-[190px] h-[196]",
                activeId === student.id &&
                  "border-primary shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]"
              )}
              onClick={() => handleActiveStudent(student.id)}
            >
              <div className="relative transition-all ease-linear text-center space-y-4  px-4 group cursor-pointer basis-[120px] max-w-[120px">
                <div>
                  <Image
                    src={convertImageUrl(student.avatar.url ?? "")}
                    alt="avatar"
                    width={120}
                    height={120}
                    className="relative z-[9] rounded-full w-[88px] h-[88px] mx-auto group-hover:scale-105 transition-all"
                  />
                  <div className="absolute bottom-[-10px] right-0 flex justify-center gap-10 w-full z-10">
                    <p className="text-primary w-[34px] h-[34px] rounded-full bg-[#E8F4E6] flex items-center justify-center font-bold text-sm ">
                      {student.point.extraPoint}
                    </p>
                    <p className="text-quaternary w-[34px] h-[34px] rounded-full bg-[#FEEFEA] flex items-center justify-center font-bold text-sm text-[14px]">
                      {student.point.minusPoint}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-[20px]">
                <p className="font-bold text-[#0F1834] text-[14px] ">
                  {student.nickname || student.fullName}
                </p>
                <p className="font-normal text-[#0F1834] text-[14px] mt-[8px] ">
                  {student.class.name || student.class.fullName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
