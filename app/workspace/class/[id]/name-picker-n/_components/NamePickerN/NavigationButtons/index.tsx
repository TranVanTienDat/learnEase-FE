import React from "react";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import { NavigationButtonsType } from "@/types/namePickerN";
import { CLASS_PATH, TOOLS_PATH } from "@/constants";
import { useTranslations } from "next-intl";

export default function NavigationButtons({ idClass }: NavigationButtonsType) {
  const t = useTranslations("common");
  const convertClassPath = (childPath?: string) => {
    return `${CLASS_PATH}/${idClass}${childPath ? `/${childPath}` : ""}`;
  };
  const redirectButton = [
    {
      name: "joinClass",
      href: convertClassPath(),
      className: "text-base px-10 bg-secondary",
    },
    {
      name: TOOLS_PATH.NAME_PICKER.name,
      href: convertClassPath(TOOLS_PATH.NAME_PICKER.path),
      className: "text-base px-10",
    },
    {
      name: TOOLS_PATH.GROUP_GENERATOR.name,
      href: convertClassPath(TOOLS_PATH.GROUP_GENERATOR.path),
      className: "text-base px-10",
    },
    {
      name: TOOLS_PATH.CLICK_TIME.name,
      href: convertClassPath(TOOLS_PATH.CLICK_TIME.path),
      className: "text-base px-10",
    },
  ];
  return (
    <div className="flex items-center justify-center flex-wrap  gap-2 mt-10">
      {redirectButton.map((btn) => (
        <ButtonAction key={btn.name} {...btn} name={t(btn.name)} />
      ))}
    </div>
  );
}
