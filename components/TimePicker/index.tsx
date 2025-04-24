"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

const hours = [...(Array(24).keys() as any)];
const minutes = [...(Array(60).keys() as any)];
const zeroPad = (n: number) => (n >= 10 ? n : `${0}${n}`);

function parseTime(time: string) {
  let [hour, minute]: string[] | number[] = time.split(":");
  return { hour, minute };
}

export function TimePicker({
  time = "00:00",
  onUpdate,
}: {
  time: string;
  onUpdate: (time: string) => void;
}) {
  const { hour, minute } = parseTime(time);
  const handleHourChange = (hourInput: string) => {
    const time = [hourInput, minute].map((h) => zeroPad(+h)).join(":");
    onUpdate(time);
  };
  const handleMinusChange = (minusInput: string) => {
    const time = [hour, minusInput].map((h) => zeroPad(+h)).join(":");
    onUpdate(time);
  };

  return (
    <Popover modal>
      <PopoverTrigger className="w-full">
        <div className="relative p-2 px-[10px] border rounded-md text-left">
          <span className="font-bold">{time}</span>
          <FontAwesomeIcon
            className="absolute top-1/2 right-2 -translate-y-1/2"
            icon={faClock}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[116px] p-3 pr-0 text-center">
        <div className="flex h-[200px] divide-x">
          <ScrollArea className="h-full flex-1 pr-[18px] gap-[2px]">
            {hours.map((h) => (
              <p
                className={clsx(
                  "w-[28px] h-[24px] flex items-center justify-center rounded-md cursor-pointer hover:bg-[#e8f4e6] hover:text-primary",
                  zeroPad(h) == hour ? "bg-[#e8f4e6] text-primary" : ""
                )}
                key={h}
                onClick={() => handleHourChange(h.toString())}
              >
                {h}
              </p>
            ))}
          </ScrollArea>
          <ScrollArea className="h-full flex-1 px-[18px] gap-[2px]">
            {minutes.map((m) => (
              <p
                className={clsx(
                  "w-[28px] h-[24px] flex items-center justify-center rounded-md cursor-pointer hover:bg-[#e8f4e6] hover:text-primary",
                  zeroPad(m) == minute ? "bg-[#e8f4e6] text-primary" : ""
                )}
                key={m}
                onClick={() => handleMinusChange(m.toString())}
              >
                {m}
              </p>
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
