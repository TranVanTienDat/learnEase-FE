import React, { useEffect, useState } from "react";
import DatePicker from "@/app/workspace/class/[id]/_components/LearningTracking/DatePicker";
import Comment from "@/app/workspace/class/[id]/_components/LearningTracking/Comment";
import { Activity, DailyRecord } from "@/types/learning-tracking";
import Evaluation from "@/app/workspace/class/[id]/_components/LearningTracking/Evaluation";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { useTranslations } from "next-intl";

export default function ListComment({
  idClass,
  phoneOrCode,
  dailyRecords,
  searchDate,
}: {
  idClass: number;
  phoneOrCode: string;
  dailyRecords: DailyRecord;
  searchDate: string;
}) {
  const t = useTranslations("learningTracking");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [dailyRecords]);

  return (
    <>
      <div className="flex justify-between items-center pb-5 mb-5 border-b border-b-[#E7E8EB]">
        <p className="font-bold text-xl text-[#0F1834]">
          {t("learningTracking")}
        </p>
        <DatePicker
          idClass={idClass}
          phoneOrCode={phoneOrCode}
          setIsLoading={setIsLoading}
        />
      </div>

      <div className="space-y-3">
        {!isLoading ? (
          <>
            {Array.isArray(dailyRecords) ||
            (dailyRecords?.comment === null &&
              dailyRecords?.activities?.length <= 0) ? (
              <div className="min-h-[300px] flex justify-center items-center">
                {t("noCommonToday")}
              </div>
            ) : (
              <>
                <Comment
                  comment={dailyRecords?.comment}
                  time={dailyRecords?.updatedAt}
                  searchDate={searchDate}
                />
                {dailyRecords?.activities.length > 0 &&
                  dailyRecords?.activities?.map(
                    (activity: Activity, index: number) => (
                      <Evaluation
                        key={index}
                        activity={{
                          imageUrl: activity.imageUrl,
                          note: activity.note,
                          point: activity.point,
                          date: activity.date,
                        }}
                        time={activity.date}
                        searchDate={searchDate}
                      />
                    )
                  )}
              </>
            )}
          </>
        ) : (
          <LoadingSnipper />
        )}
      </div>
    </>
  );
}
