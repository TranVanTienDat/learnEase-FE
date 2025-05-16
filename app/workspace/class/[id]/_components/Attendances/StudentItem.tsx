import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ActiveCommentType,
  AttendanceStudentType,
  ranks,
  RankType,
} from "@/types/attendance";
import { convertImageUrl } from "@/utils";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { memo, useState } from "react";

export const SwitchAttendance = ({
  status,
  onChange,
  disabled,
}: {
  status: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => {
  const t = useTranslations("attendance");

  return (
    <div
      className="flex items-center space-x-2 relative font-semibold cursor-pointer"
      onClick={onChange}
    >
      <Switch
        className={clsx(
          "w-[70px] h-[32px] data-[state=checked]:bg-[#e8f4e6] data-[state=checked]:[&_>_span]:bg-primary [&_>_span]:w-[28px] [&_>_span]:h-[28px] [&_>_span]:border-white [&_>_span]:border data-[state=checked]:[&_>_span]:shadow-[-1px_0px_1px_#00000040] [&_>_span]:shadow-[1px_0px_1px_#00000040] data-[state=checked]:[&_>_span]:translate-x-[38px] [&_>_span]:bg-quaternary data-[state=unchecked]:bg-[#f6f6f6] disabled:!bg-[#e7e8eb]",
          disabled && "[&_>_span]:!bg-[#B5B7C0]"
        )}
        checked={status}
        disabled={disabled}
      />
      <Label
        className={clsx(
          "absolute  slide-out-to-top-1/2",
          status == true ? "text-primary left-2" : "text-quaternary right-1",
          disabled && "text-[#b5b7c0]"
        )}
      >
        {status ? t("present") : t("absent")}
      </Label>
    </div>
  );
};

const StudentItem = ({
  id,
  stt,
  nickname,
  code,
  dailyRecord,
  isDisableAttendance,
  onChangeStudent,
  classId,
  date,
  onToggleComment,
  handleActiveStudentComment,
  handleEdit,
  avatar,
}: AttendanceStudentType & {
  handleActiveStudentComment: (data: ActiveCommentType) => void;
  handleEdit: (id: string) => void;
}) => {
  const t = useTranslations("attendance");
  const tCommon = useTranslations("common");

  const className = "flex items-center justify-center";

  const handleAttendance = async () => {
    if (isDisableAttendance) return;
    onChangeStudent({
      id,
      field: "attendance",
      value: dailyRecord?.attendance != true ? true : false,
    });
  };
  const statusRender = () => {
    if (Object.keys(dailyRecord || {}).length === 0) {
      return false;
    } else {
      return !!dailyRecord?.attendance;
    }
  };
  const handleToggle = async (comment: string) => {
    handleActiveStudentComment({ id, comment });
    onToggleComment?.();
  };

  return (
    <>
      <tr className="[&:not(:last-child)]:border-b">
        <td>
          <div className={clsx(className)}>{stt}</div>
        </td>
        <td className=" p-1 pr-6 relative">
          <div
            className={clsx(
              className,
              "flex justify-center items-center gap-[10px]"
            )}
          >
            <div className="overflow-hidden">
              <Image
                src={convertImageUrl(avatar?.url || "")}
                alt="avatar"
                width={40}
                height={40}
                className="w-[40px] rounded-[50%]"
              />
            </div>
            <div className=" w-full">
              <p
                className="font-bold cursor-pointer text-md"
                onClick={() => handleEdit(id)}
              >
                {nickname}
              </p>
              <p className="text-[#5e6477] text-xs">{`${tCommon(
                "codeLabel"
              )} ${code}`}</p>
            </div>
          </div>
        </td>
        <td className="">
          <div className={clsx("", className)}>
            <SwitchAttendance
              status={statusRender()}
              onChange={handleAttendance}
              disabled={isDisableAttendance}
            />
          </div>
        </td>
        <td className="">
          <div
            className="flex gap-2 items-center p-2 px-3 cursor-pointer"
            onClick={() => handleToggle(dailyRecord?.comment)}
          >
            {dailyRecord?.comment ? (
              <p className="font-medium">{dailyRecord?.comment}</p>
            ) : (
              <p className="text-[#b5b7c0]">{t("addComment")}</p>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default memo(StudentItem);
