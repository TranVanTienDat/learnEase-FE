import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { usePickDateAttendanceStudents } from "@/hooks/statistical";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { formatDate, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const handleFormatRenderDate = (
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  if (!startDate || !endDate) return;
  const date1 = formatDate(startDate, "yyyy-MM-dd");
  const date2 = formatDate(endDate, "yyyy-MM-dd");
  const [yearStart, monthStart] = date1.split("-");
  const [yearEnd, monthEnd] = date2.split("-");

  return monthEnd === monthStart
    ? `${monthStart}/${yearStart}`
    : `${monthStart}-${monthEnd}/${yearStart}`;
};

export default function PickerDateAttendance({
  searchParams,
  idClass,
}: {
  idClass: string;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const t = useTranslations("statistics");

  const { toast } = useToast();
  const { handleFilterDate, date, isCheckSpace } =
    usePickDateAttendanceStudents({ idClass });
  const { isOpen, toggle } = useModal();

  const [newDate, setNewDate] = useState<DateRange | undefined>({
    from: date.from || subDays(new Date(), 10),
    to: date.to || new Date(),
  });

  useEffect(() => {
    if (isCheckSpace) {
      toast({
        variant: "destructive",
        title: t("maxDuration"),
      });
    }
  }, [isCheckSpace]);

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
            {newDate?.from && newDate?.to
              ? `${t("month")} ${handleFormatRenderDate(
                  newDate?.from,
                  newDate?.to
                )}`
              : t("selectDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className=" min-w-[210px] p-0 "
          style={{
            position: "relative",
            right: "0",
            transform: "translateX(-11%)",
            transformOrigin: "right",
          }}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={newDate?.from}
            selected={newDate}
            onSelect={(date) => {
              handleFilterDate(date);
              setNewDate(date);
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
          ;
        </PopoverContent>
      </Popover>
    </div>
  );
}
