"use client";

import { ButtonNavigation } from "@/app/workspace/class/[id]/_components/ButtonAction";
import { CLASS_PATH, TOOLS_PATH } from "@/constants";
import {
  AlarmClockCheck,
  Boxes,
  Sparkles,
  SquareArrowLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

const ListButtonNav = ({ params }: { params: { id: string } }) => {
  const tCommon = useTranslations("common");
  const convertClassPath = (childPath?: string) => {
    return `${CLASS_PATH}/${params.id}${childPath ? `/${childPath}` : ""}`;
  };
  const redirectButton = [
    {
      name: "joinClass",
      href: convertClassPath(),
      className: "border-primary h-[44px]",
      icon: SquareArrowLeft,
    },
    {
      name: TOOLS_PATH.NAME_PICKER_N.name,
      href: convertClassPath(TOOLS_PATH.NAME_PICKER_N.path),
      icon: Sparkles,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.GROUP_GENERATOR.name,
      href: convertClassPath(TOOLS_PATH.GROUP_GENERATOR.path),
      icon: Boxes,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.CLICK_TIME.name,
      href: convertClassPath(TOOLS_PATH.CLICK_TIME.path),
      icon: AlarmClockCheck,
      className: "h-[44px]",
    },
  ];

  return (
    <div className="flex justify-center gap-[8px] flex-wrap">
      {redirectButton.map((btn) => (
        <ButtonNavigation key={btn.name} {...btn} name={tCommon(btn.name)} />
      ))}
    </div>
  );
};

export default memo(ListButtonNav);
