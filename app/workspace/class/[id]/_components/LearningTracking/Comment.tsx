import { formatISOTime } from "@/utils";
import Image from "next/image";
import React from "react";
import { CommentType } from "@/types/learning-tracking";
import { useTranslations } from "next-intl";

export default function Comment({ comment, time, searchDate }: CommentType) {
  const t = useTranslations("learningTracking");
  return (
    <div className="flex gap-3 text-[#0F1834] text-sm">
      <div>
        <Image
          src="/images/image-comment.svg"
          alt="comment"
          width={64}
          height={64}
        />
      </div>
      <div className="flex flex-col w-full gap-1 ">
        <>
          <div className="p-2.5 font-medium bg-white rounded-lg">
            {comment ?? t("noCommonToday")}
          </div>
          <p>{comment ? formatISOTime(time, searchDate) : ""}</p>
        </>
      </div>
    </div>
  );
}
