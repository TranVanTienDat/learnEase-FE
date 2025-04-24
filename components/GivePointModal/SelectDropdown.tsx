import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GiveModalClassType } from "@/types/giveModal";

export function SelectDropDown({
  onChange,
  list,
  initValue
}: {
  onChange: (value: string) => void;
  list: GiveModalClassType[] | [];
  initValue: string | number
}) {
  return (
    <Select onValueChange={onChange} defaultValue={initValue as string}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Chọn lớp" />
      </SelectTrigger>
      <SelectContent>
        {list.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
