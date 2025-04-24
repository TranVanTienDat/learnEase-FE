"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
export default function FilterTerm({
  list,
  onChange,
  initValue,
  className,
}: {
  list: { id: string; name: string; duration: string }[];
  onChange: (value: string) => void;
  initValue?: string;
  className?: string;
}) {
  return (
    <div className={cn("absolute top-0 right-0", className)}>
      <Select
        defaultValue={initValue}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {list.map((item) => {
              return (
                <SelectItem key={item.id} value={item.id}>
                  {`${item.name}(${item.duration})`}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
