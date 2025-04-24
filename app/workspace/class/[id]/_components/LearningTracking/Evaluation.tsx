import { convertImageUrl, formatISOTime } from "@/utils";
import Image from "next/image";
import React from "react";
import { EvaluationType } from "@/types/learning-tracking";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function Evaluation({
  activity,
  time,
  searchDate,
}: EvaluationType) {
  const t = useTranslations("learningTracking");
  return (
    <div className="flex gap-3 text-[#0F1834] text-sm">
      <div>
        <Image
          src={
            activity?.imageUrl !== ""
              ? convertImageUrl(activity.imageUrl)
              : "/images/suddenly-point.svg"
          }
          alt="comment"
          width={64}
          height={64}
        />
      </div>
      <div className="flex flex-col w-full gap-1 ">
        <div className="p-2.5 font-medium bg-white rounded-lg">
          <span
            className={cn(
              "font-bold",
              activity.point > 0 ? "text-primary" : "text-quaternary"
            )}
          >
            {`${activity.point > 0 ? "+" : ""}${activity.point}`}
          </span>{" "}
          {t("for")}{" "}
          <span
            className={cn(
              "font-bold",
              activity.point > 0 ? "text-primary" : "text-quaternary"
            )}
          >
            {activity.note}
          </span>
        </div>
        <p>{formatISOTime(time, searchDate)}</p>
      </div>
    </div>
  );
}
