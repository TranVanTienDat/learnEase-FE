import classRequest from "@/apiRequest/class";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAX_NUMBER_STUDENTS_PER_CLASS } from "@/constants";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { customFormatDate } from "@/utils";
import { formatDate, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const usePickDateConduct = ({ idClass }: { idClass: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = parse(
    searchParams.get("date") || formatDate(new Date(), "yyyy-MM-dd"),
    "yyyy-MM-dd",
    new Date()
  );

  const phoneNumber = searchParams.get("phoneNumber") ?? "";
  const tabs = searchParams.get("tabs") ?? "";
  const studentId = searchParams.get("studentId") ?? "";
  const handleFilterDate = (day: Date) => {
    const dateSearchParams = formatDate(day, "yyyy-MM-dd");
    router.replace(
      `/study-tracking/${idClass}?phoneNumber=${phoneNumber}&tabs=${tabs}&studentId=${studentId}&date=${dateSearchParams}`,
      {
        scroll: false,
      }
    );
  };
  return {
    handleFilterDate,
    date: date,
  };
};

export const DatePickerConduct = ({ idClass }: { idClass: string }) => {
  const { handleFilterDate, date } = usePickDateConduct({
    idClass,
  });
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
              {day ? formatDate(day, "dd/MM/yyyy") : <span>Chọn ngày</span>}
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
    </div>
  );
};

export default function FilterTerm({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const season = searchParams.get("season");

  const [list, setList] = useState<{ id: string; name: string }[]>([]);

  const handleChange = (value: string) => {
    router.replace(
      `${pathname}?season=${value}&subject=${searchParams.get("subject")}`
    );
    router.refresh();
  };

  useEffect(() => {
    const fetchData = async () => {
      const classDetail = await classRequest.getDetail(params.id, {
        "pagination[pageSize]=": MAX_NUMBER_STUDENTS_PER_CLASS,
        "[populate][subjects]": true,
        "[populate][grandingBreakdowns][populate][grandingBreakdown]": true,
        "[populate][seasons]": true,
      });

      if (!!classDetail?.seasons?.length) {
        setList(
          classDetail?.seasons.map((x) => ({
            ...x,
            id: x.id.toString(),
          }))
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div className="absolute top-0 right-0">
      {!!list.length && (
        <Select
          defaultValue={season || list[0].id}
          onValueChange={(range) => handleChange(range)}
        >
          <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {list.map((item) => {
                return (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
