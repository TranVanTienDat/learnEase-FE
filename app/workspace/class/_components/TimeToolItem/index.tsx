"use client";
import { Input } from "@/components/ui/input";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

export default function TimerToolItem({
  label,
  number = 0,
  onSetTimer = () => {},
}: {
  label: string;
  number?: number;
  onSetTimer: (value: number) => void;
}) {
  const [value, setValue] = useState(number);
  const [inputValue, setInputValue] = useState(number.toString());

  const increment = () => {
    const newValue = value + 1;
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  const decrement = () => {
    if (value >= 1) {
      const newValue = value - 1;
      setValue(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const newValue = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setValue(newValue);
    } else {
      (e.target as HTMLInputElement).value = "0";
    }
  };

  useEffect(() => onSetTimer(+inputValue), [inputValue]);

  return (
    <div className="flex items-center space-x-2">
      <p className="capitalize">{label}</p>
      <div className="flex items-center rounded-full bg-slate-100 font-semibold">
        <button className="px-2" onClick={decrement}>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
        <Input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          className="input-number-transparent text-center"
        />
        <button className="px-2" onClick={increment}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
    </div>
  );
}
