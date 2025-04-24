import { TimePicker } from "@/components/TimePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import { heads, ScheduleType, ScheduleTypes } from "@/types";
import { formatTime, isCheckTime } from "@/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const ModalEditSchedule = ({
  isOpen,
  toggle,
  onChange,
  initValue,
}: {
  isOpen: boolean;
  toggle: () => void;
  onChange: (value: ScheduleType, type: "add" | "update") => void;
  initValue: ScheduleType & { type: "add" | "update" };
}) => {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");
  const [startTime, setStartTime] = useState(initValue.startTime);
  const [endTime, setEndTime] = useState(initValue.endTime);
  const handleSubmit = () => {
    onChange(
      {
        startTime,
        endTime,
        day: initValue.day,
      },
      initValue.type
    );
  };
  useEffect(() => {
    setStartTime(formatTime(initValue.startTime));
    setEndTime(formatTime(initValue.endTime));
  }, [initValue]);
  const isCorrect = isCheckTime(startTime, endTime);
  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className="sm:max-w-[464px] !rounded-[20px] p-6 gap-10"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {t("chooseTime")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="space-y-2 flex-1">
            <label className="font-medium"> {tCommon("start")}</label>
            <TimePicker time={startTime} onUpdate={setStartTime} />
          </div>
          <span className="font-semibold mt-10">-</span>
          <div className="space-y-2 flex-1">
            <label className="font-medium"> {t("end")}</label>
            <TimePicker time={endTime} onUpdate={setEndTime} />
          </div>
        </div>
        {!isCorrect && (
          <p className="text-red-500 text-center">
            {t("endTimeGreaterThanStart")}
          </p>
        )}
        <DialogFooter className="sm:justify-center gap-4">
          <DialogClose asChild>
            <Button
              className="rounded-full px-10 min-w-[180px] font-medium text-md"
              disabled={!isCorrect}
              onClick={handleSubmit}
            >
              {t("add")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Schedules({
  list,
  onChange,
}: {
  list: ScheduleTypes;
  onChange: (item: ScheduleType, type: "add" | "update" | "remove") => void;
}) {
  const t = useTranslations("class");
  const { isOpen, toggle } = useModal();
  const [dataModal, setDataModal] = useState<
    ScheduleType & { type: "add" | "update" }
  >();
  const handleRemove = (item: ScheduleType) => {
    onChange(item, "remove");
  };
  const handleChange = (item: ScheduleType, type: "update" | "add") => {
    setDataModal({ ...item, type });
    toggle();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label>{t("timeTable")}</label>
        <div className="border rounded-md p-3 py-1 divide-y">
          {Object.keys(heads).map((day) => {
            const { text, value } = heads[day as keyof typeof heads];
            const item = list.find((item) => item.day === value);
            return (
              <div
                className="flex items-center py-[9.3px] gap-5 h-[60px]"
                key={day}
              >
                <p className="w-[100px] font-bold h-[36.5px] flex items-center border-r">
                  {t(text)}
                </p>
                {item ? (
                  <div className="flex justify-between gap-3 flex-1">
                    <div
                      className="flex border p-2 rounded-lg px-3 border-[#0305d9] cursor-pointer w-[110px] text-sm text-center justify-center"
                      onClick={() => handleChange(item, "update")}
                    >
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </div>
                    <button
                      className="ml-auto"
                      onClick={() => handleRemove(item)}
                    >
                      <img src="/images/remove.svg" alt="" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="ml-auto"
                    onClick={() =>
                      handleChange(
                        {
                          day: day as keyof typeof heads,
                          endTime: "00:00",
                          startTime: "00:00",
                        },
                        "add"
                      )
                    }
                  >
                    <img src="/images/add.svg" alt="" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {dataModal && (
        <ModalEditSchedule
          isOpen={isOpen}
          toggle={toggle}
          onChange={onChange}
          initValue={dataModal}
        />
      )}
    </>
  );
}
