import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { formatDate, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SwitchAttendance } from "@/app/workspace/class/[id]/_components/Attendances/StudentItem";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

const usePickDate = ({
  idClass,
  setIsLoading,
}: {
  idClass: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("d") || formatDate(new Date(), "yyyy-MM-dd");
  const dateSearchParams = parse(date, "yyyy-MM-dd", new Date());
  const handleFilterDate = (day: Date) => {
    const dateSearchParams = formatDate(day, "yyyy-MM-dd");
    setIsLoading(false);
    router.replace(
      `/workspace/class/${idClass}/attendance?d=${dateSearchParams}`
    );
  };
  return {
    handleFilterDate,
    date: dateSearchParams,
  };
};

export default function DatePicker({
  idClass,
  isAttendanceAll,
  isDisableAttendance,
  handleToggle,
  setIsLoading,
}: {
  idClass: string;
  isAttendanceAll: boolean;
  isDisableAttendance: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleToggle: () => void;
}) {
  const t = useTranslations("attendance");

  const { handleFilterDate, date } = usePickDate({ idClass, setIsLoading });
  const [day, setDay] = useState(date);
  const { isOpen, toggle } = useModal();
  return (
    <div className="flex justify-start gap-4 font-medium">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={toggle}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[150px] justify-start text-left border-input text-foreground font-medium",
                !day && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {day ? (
                formatDate(day, "dd/MM/yyyy")
              ) : (
                <span>{t("selectDate")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={day}
              onSelect={(day) => {
                if (day) {
                  handleFilterDate(day);
                  toggle();
                  setDay(day);
                }
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <SwitchAttendance
          status={isAttendanceAll}
          onChange={handleToggle}
          disabled={isDisableAttendance}
        />
      </div>
    </div>
  );
}
