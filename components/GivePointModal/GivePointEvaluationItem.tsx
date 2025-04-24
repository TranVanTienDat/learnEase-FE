import { Checkbox } from "@/components/ui/checkbox";
import { FeatureType } from "@/types";
import { GivePointEvaluationType } from "@/types/giveModal";
import { convertImageUrl } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { memo } from "react";

const GivePointEvaluationItem = ({
  onSelect,
  image,
  name,
  point,
  isActive,
  type,
}: GivePointEvaluationType) => {
  console.log("GivePointEvaluationItem render", image);

  return (
    <div
      className="cursor-pointer border rounded-lg bg-white relative p-4 h-[140px] hover:bg-[#E8F4E6]"
      onClick={onSelect}
    >
      <Checkbox
        checked={isActive}
        className="absolute top-3 right-3 w-[18px] h-[18px]"
      />
      <Image
        src={convertImageUrl(image?.url)}
        width={60}
        height={60}
        alt="icon"
        className="mx-auto"
      />
      <p className="font-semibold line-clamp-2 mt-3 text-sm font-semibold">
        {name}
      </p>
      <p
        className={clsx(
          "absolute right-3 top-1/2 -translate-y-1/2 w-[28px] h-[28px] text-white rounded-full flex items-center justify-center font-semibold",
          type === FeatureType.EXTRA ? "bg-primary" : "bg-quaternary"
        )}
      >
        {point}
      </p>
    </div>
  );
};

export default memo(GivePointEvaluationItem);
