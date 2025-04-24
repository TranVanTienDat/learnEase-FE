import { cn } from "@/lib/utils";
import { DatePointType } from "@/types/statisticalPoint";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

type ButtonMonthType = {
  time: DatePointType;
  dateNow: Date;
  item: {
    month: number;
    name: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  handleGetMonth: (month: number) => void;
};

export const ButtonMonth = ({
  time,
  dateNow,
  item,
  searchParams,
  handleGetMonth,
}: ButtonMonthType) => {
  const t = useTranslations("statistics");

  const date =
    typeof searchParams?.month === "string" ? searchParams?.month : "";

  const year = date ? parseInt(date.split("-")[0]) : dateNow.getFullYear();

  return (
    <button
      onClick={() => handleGetMonth(item.month)}
      className={cn(
        "text-center rounded-sm  p-1 text-sm hover:text-white hover:bg-primary",
        time.month === item.month &&
          time.year === year &&
          "bg-primary text-white",
        time.year > dateNow.getFullYear() ||
          (time.year === dateNow.getFullYear() &&
            item.month > dateNow.getMonth() + 1)
          ? "text-[#a39e9e] hover:bg-[#E5E5E5] bg-transparent"
          : ""
      )}
      disabled={
        time.year > dateNow.getFullYear() ||
        (time.year === dateNow.getFullYear() &&
          item.month > dateNow.getMonth() + 1)
      }
    >
      {t(item.name)}
    </button>
  );
};

type ButtonYearType = {
  handleOnChangeYear: () => void;
  disable?: boolean;
  dateNow?: Date;
  time?: DatePointType;
  icon: IconDefinition;
};

export const ButtonYear = ({
  handleOnChangeYear,
  disable,
  icon,
  dateNow,
  time,
}: ButtonYearType) => {
  return (
    <button
      onClick={handleOnChangeYear}
      disabled={disable}
      className={cn(
        "px-[10px] py-[3px] w-7 rounded-md border-[1px] border-primary opacity-50 hover:opacity-100 hover:bg-[#1994001a] text-sm text-primary",
        time &&
          dateNow &&
          time.year >= dateNow.getFullYear() &&
          "text-[#a39e9e] bg-[#E5E5E5]  border-[#a39e9e]"
      )}
    >
      <FontAwesomeIcon icon={icon} fontWeight={400} />
    </button>
  );
};
