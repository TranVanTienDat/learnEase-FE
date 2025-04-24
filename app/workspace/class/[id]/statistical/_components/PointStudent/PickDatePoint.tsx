import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePickDatePointStudents } from "@/hooks/statistical";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { DatePointType } from "@/types/statisticalPoint";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  ButtonMonth,
  ButtonYear,
} from "@/app/workspace/class/[id]/statistical/_components/PointStudent/Buttons";
import { useTranslations } from "next-intl";
import { locales } from "@/i18n/config";
import { LIST_MONTH } from "@/constants/statistical";

type CustomCalenderType = {
  time: DatePointType;
  toggle: () => void;
  setTime: Dispatch<SetStateAction<DatePointType>>;
  handleFilterDate: (month: Date) => void;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const dateNow = new Date();
const CustomCalender = ({
  time,
  toggle,
  setTime,
  handleFilterDate,
  searchParams,
}: CustomCalenderType) => {
  const handleOnChangeYear = (field: "up" | "down") => {
    if (field === "up" && time.year < dateNow.getFullYear())
      setTime((prev) => ({ ...prev, year: prev.year + 1 }));
    else if (field === "down")
      setTime((prev) => ({ ...prev, year: prev.year - 1 }));
  };

  const handleGetMonth = (month: number) => {
    setTime((prev) => ({ ...prev, month: month }));
    const selectedDate = new Date(time.year, month - 1);
    toggle();
    handleFilterDate(selectedDate);
  };

  const listMonth = LIST_MONTH.map((item, index) => {
    return {
      month: index + 1,
      name: item,
    };
  });
  return (
    <div className="min-w-[210px] p-[12px]">
      <div className="flex justify-between items-center border-b-[1px]  pb-2 px-[6px]">
        <ButtonYear
          handleOnChangeYear={() => handleOnChangeYear("down")}
          icon={faChevronLeft}
        />
        <div className="text-base font-semibold">{time.year}</div>
        <ButtonYear
          handleOnChangeYear={() => handleOnChangeYear("up")}
          disable={time.year >= dateNow.getFullYear()}
          time={time}
          dateNow={dateNow}
          icon={faChevronRight}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {listMonth.map((item, index) => {
          return (
            <ButtonMonth
              key={index}
              dateNow={dateNow}
              time={time}
              searchParams={searchParams}
              handleGetMonth={handleGetMonth}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default function DatePickerPoint({
  idClass,
  searchParams,
  locale,
}: {
  idClass: string;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  locale: string;
}) {
  const { handleFilterDate, date } = usePickDatePointStudents({ idClass });
  const { isOpen, toggle } = useModal();
  const t = useTranslations("statistics");

  const [time, setTime] = useState({
    year: parseInt(formatDate(date, "yyyy")),
    month: parseInt(formatDate(date, "MM")),
  });
  return (
    <div className="relative inline-flex ml-auto items-center gap-2 font-medium">
      <Popover open={isOpen} onOpenChange={toggle}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[210px] justify-start text-left border-input text-foreground font-medium",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="capitalize">
                {format(date, "MMMM", {
                  locale: locale === locales[0] ? vi : enUS,
                })}
              </span>
            ) : (
              <span>{t("selectDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-[210px] p-0 "
          style={{
            position: "relative",
            right: "0",
            transform: "translateX(-13%)",
            transformOrigin: "right",
          }}
        >
          <CustomCalender
            time={time}
            toggle={toggle}
            setTime={setTime}
            handleFilterDate={handleFilterDate}
            searchParams={searchParams}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
