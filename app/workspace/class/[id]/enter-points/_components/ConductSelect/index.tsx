"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConductEnum } from "@/constants/point";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function ConductSelect({
  initValue,
  onChange,
}: {
  initValue: string;
  onChange: (value: string) => void;
}) {
  const tCommon = useTranslations("common");
  const list = Object.values(ConductEnum).map((item) => {
    return { label: tCommon(item), value: item };
  });
  const handleChange = (value: string) => {
    onChange(value);
  };
  return (
    <div className="flex items-center justify-center">
      <Select
        defaultValue={initValue}
        onValueChange={(range) => handleChange(range)}
      >
        <SelectTrigger className="w-auto focus:ring-0 focus:ring-transparent focus:ring-offset-0 rounded-none border-0 capitalize gap-[10px]">
          <SelectValue placeholder={tCommon("selectConduct")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {list.map((item) => {
              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="capitalize"
                >
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
