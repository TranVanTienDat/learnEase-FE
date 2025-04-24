import { SlotControlsType } from "@/types/namePickerN";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function SlotControls({
  listStudentsLength,
  maxStudentsLength,
  randomStatus,
  handleAddSlot,
  handleSubtractSlot,
  handleRandom,
  handleTypeChangeSlot,
}: SlotControlsType) {
  const [numberSlot, setNumberSlot] = useState(listStudentsLength);
  const t = useTranslations("callMultiple");
  const handleSlot = (number: string) => {
    let newNumber = parseInt(number);
    if (newNumber > maxStudentsLength) {
      newNumber = maxStudentsLength;
    }
    if (newNumber < 1) {
      newNumber = 1;
    }

    handleTypeChangeSlot(String(newNumber));
    setNumberSlot(String(newNumber));
  };

  useEffect(() => {
    setNumberSlot(listStudentsLength);
  }, [listStudentsLength]);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <div className="flex justify-center items-center rounded-full overflow-hidden border border-border ">
        <button
          className="group size-[50px] bg-border hover:bg-primary disabled:cursor-not-allowed"
          disabled={randomStatus === "randomming"}
          onClick={() => handleSubtractSlot()}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-sm group-hover:text-white"
          />
        </button>
        <input
          type="number"
          className="h-[50px] w-[50px] text-center outline-none px-[10px] py-[9px] text-base font-semibold"
          value={numberSlot}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNumberSlot(e.target.value)
          }
          onBlur={(e) => {
            handleSlot(e.target.value);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleSlot(e.currentTarget.value);
            }
          }}
        />
        <button
          className="group size-[50px] bg-border hover:bg-primary disabled:cursor-not-allowed"
          disabled={randomStatus === "randomming"}
          onClick={() => handleAddSlot()}
        >
          <FontAwesomeIcon
            icon={faChevronUp}
            className="text-sm group-hover:text-white"
          />
        </button>
      </div>
      <ButtonAction
        action={() => handleRandom()}
        name={t("callName")}
        disabled={randomStatus === "randomming"}
        className="text-base px-10 disabled:cursor-not-allowed disabled:pointer-events-auto"
      />
    </div>
  );
}
