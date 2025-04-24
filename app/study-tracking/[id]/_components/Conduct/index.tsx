"use client";
import studentRequest, { StudentType } from "@/apiRequest/students";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { cn } from "@/lib/utils";
import { convertImageUrl, customFormatDate } from "@/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const convertToTimeString = (isoString: string) => {
  const date = new Date(isoString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
};

const handleRenderImage = (imageUrl: string | undefined) => {
  if (imageUrl) return convertImageUrl(imageUrl);
  if (imageUrl === "") return "/images/icons/extraMius.svg";

  return "/images/icons/note.svg";
};

const handleConvertComment = (comment: string, t: any) => {
  if (comment === "Cộng điểm đột xuất") return t("addPointSuddenly");
  if (comment === "Trừ điểm đột xuất") return t("minusPointSuddenly");
  return comment;
};

const ItemDescription = ({ note, point }: { note: string; point?: number }) => {
  const t = useTranslations("givePoint");
  const statusColor = point && point > 0 ? true : false;

  return (
    <div className="bg-white py-[4px] px-[6px] rounded-sm">
      {point && (
        <>
          <span
            className={cn(
              "font-bold",
              statusColor ? "text-primary" : "text-quaternary"
            )}
          >
            {statusColor ? `+${point} ` : `${point} `}
          </span>
          <span className="text-[#0F1834]">{`${t("give")} `}</span>
        </>
      )}

      <span
        className={cn(
          "font-bold",
          statusColor ? "text-primary" : "text-quaternary",
          !point && "text-[#0F1834] font-medium"
        )}
      >
        {handleConvertComment(note, t)}
      </span>
    </div>
  );
};

type ItemType = {
  date: string;
  note: string;
  point?: number;
  imageUrl?: string;
};

const Item = ({ date, note, point, imageUrl }: ItemType) => {
  console.log("img", imageUrl);
  return (
    <div className="flex justify-start items-start gap-[12px] mr-2">
      <Image
        src={handleRenderImage(imageUrl)}
        alt="avatar"
        width={50}
        height={50}
      />
      <div className="font-medium text-[14px] flex-1">
        <ItemDescription point={point} note={note} />
        <div className="text-[#0F1834] font-normal mb-[8px]">
          {convertToTimeString(date)}
        </div>
      </div>
    </div>
  );
};

export default function Conduct({
  params,
  searchParams,
  activeId,
}: {
  activeId: number;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = useTranslations("learningTracking");
  const [list, setList] = useState<StudentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await studentRequest.getConductStudent(
        Number(params.id),
        searchParams.phoneNumber as string,
        (searchParams.date as string) ??
          customFormatDate(new Date(), "yyyy-MM-dd")
      );
      if (data) setList([...data]);
      setIsLoading(false);
    };
    fetchData();
  }, [searchParams]);
  console.log("data", list);
  return (
    <div className="h-[300px] bg-[#F8F8F8] overflow-y-auto table-wrapper">
      {!isLoading ? (
        <>
          {list
            .filter((student) => student.id === activeId)
            .map((student) => {
              const commentRecord = student.dailyRecords?.find(
                (record) => record.comment
              );

              const listActivity = student.dailyRecords?.flatMap(
                (record) => record.activities
              );

              if (!commentRecord && !listActivity?.length) {
                return (
                  <div
                    key={1}
                    className="h-[100%] flex justify-center items-center"
                  >
                    {t("noCommonToday")}
                  </div>
                );
              }

              return (
                <div key={student.id}>
                  {commentRecord && (
                    <Item
                      note={commentRecord.comment}
                      date={commentRecord.updatedAt}
                    />
                  )}
                  {listActivity?.map((item, index) => (
                    <Item
                      key={index}
                      note={item.note}
                      date={item.date}
                      imageUrl={item.imageUrl}
                      point={item.point}
                    />
                  ))}
                </div>
              );
            })}
        </>
      ) : (
        <div className="h-[100%] flex justify-center items-center">
          <LoadingSnipper />
        </div>
      )}
    </div>
  );
}
