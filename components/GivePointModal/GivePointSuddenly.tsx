"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { FeatureType } from "@/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function GivePointSuddenly({
  type,
  initValue,
  onChange,
}: {
  type: FeatureType;
  initValue?: number;
  onChange: (type: "extras" | "minus", value: number) => void;
}) {
  const tGivePoint = useTranslations("givePoint");
  const t = useTranslations("common");
  const [checked, setChecked] = useState<boolean>(!!initValue);
  const [value, setValue] = useState(initValue === 0 ? "" : initValue);
  const toggleCheck = () => {
    setChecked(!checked);
  };
  const debounce = useDebounce(
    (point: number) =>
      onChange(type === FeatureType.EXTRA ? "extras" : "minus", point),
    500
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, +e.target.value);
    setValue(newValue);
    debounce(newValue);
  };
  return (
    <div className="mt-3">
      <div
        className="flex items-center gap-[10px] cursor-pointer"
        onClick={toggleCheck}
      >
        <Checkbox checked={checked} className="w-[18px] h-[18px]" />
        <span className="font-semibold text-sm capitalize">
          {type === FeatureType.EXTRA
            ? tGivePoint("addPointSuddenly")
            : tGivePoint("minusPointSuddenly")}
        </span>
      </div>
      {checked && (
        <Input
          type="number"
          placeholder={`${t("enter")} ${t("point")}`}
          className="mt-[10px]"
          onChange={handleChange}
          value={value === 0 ? "" : value}
          onKeyDown={(e) => {
            if (
              e.key === "e" ||
              e.key === "E" ||
              e.key === "+" ||
              e.key === "-"
            ) {
              e.preventDefault();
            }
          }}
        />
      )}
    </div>
  );
}
