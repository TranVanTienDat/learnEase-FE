import { convertImageUrl } from "@/utils";
import Image from "next/image";

type PointType = {
  extraPoint: number;
  minusPoint: number;
  id: number;
};
type AvatarStudentProps = {
  point: PointType;
  nameStudent: string;
  url: string;
  isPermission: boolean;
};

export default function AvatarStudent({
  point,
  nameStudent,
  url,
  isPermission,
}: AvatarStudentProps) {
  return (
    <div className=" flex flex-col items-center gap-5">
      <div
        className={`relative transition-all ease-linear text-center space-y-4 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] rounded-full p-4 group cursor-pointer basis-[120px] max-w-[120px]`}
        onClick={() => console.log()}
      >
        <div>
          <Image
            src={convertImageUrl(url ?? "")}
            alt="avatar"
            width={112}
            height={112}
            className="relative z-[9] rounded-full w-[88px] h-[88px] mx-auto group-hover:scale-105 transition-all"
          />
          {isPermission && (
            <div className="absolute -bottom-3 right-0 flex justify-between w-full z-10">
              <p className="text-primary w-10 h-10 rounded-full bg-[#E8F4E6] flex items-center justify-center font-bold text-sm">
                {point?.extraPoint}
              </p>
              <p className="text-quaternary w-10 h-10 rounded-full bg-[#FEEFEA] flex items-center justify-center font-bold text-sm">
                {point?.minusPoint}
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="font-bold text-[#0F1834] text-xl">{nameStudent}</p>
    </div>
  );
}
