"use client";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ActiveCommentType, AttendanceStudentParams } from "@/types/attendance";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function CommentModal({
  initValue,
  handleSave,
}: {
  initValue: ActiveCommentType;
  handleSave: (params: AttendanceStudentParams) => void;
}) {
  const t = useTranslations("attendance");
  const tCommon = useTranslations("common");
  const [localComment, setLocalComment] = useState("");
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setLocalComment(initValue.comment);
    setIsChanged(false);
  }, [initValue]);

  const handleLocalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalComment(e.target.value);
    setIsChanged(true);
  };
  return (
    <>
      <Textarea
        placeholder={`${t("addComment")}...`}
        value={localComment}
        onChange={handleLocalChange}
        className="min-h-[156px] w-full"
      />
      <DialogFooter className="h-10 space-x-2 flex-row justify-center sm:justify-center gap-x-4 flex-wrap">
        <DialogClose asChild>
          <Button
            variant="outline"
            className="rounded-full p-4 px-10 min-w-[180px] font-medium text-md border-[#E7E8EB] text-black"
          >
            {tCommon("back")}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="destructive"
            className="rounded-full p-4 px-10 min-w-[180px] font-medium text-md"
            onClick={() =>
              handleSave({
                id: initValue.id,
                field: "comment",
                value: localComment,
              })
            }
            disabled={!isChanged}
          >
            {tCommon("save")}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
