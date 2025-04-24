"use client";

import { CLASS_PATH, TOOLS_PATH } from "@/constants";
import {
  AlarmClockCheck,
  Bike,
  Boxes,
  LifeBuoy,
  Sparkles,
  SquareArrowLeft,
  Star,
  UserCheck,
} from "lucide-react";
import { ButtonNavigation } from "@/app/workspace/class/[id]/_components/ButtonAction";
import { memo } from "react";
import { useTranslations } from "next-intl";

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
      name: TOOLS_PATH.NAME_PICKER.name,
      href: convertClassPath(TOOLS_PATH.NAME_PICKER.path),
      icon: Star,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.NAME_PICKER_N.name,
      href: convertClassPath(TOOLS_PATH.NAME_PICKER_N.path),
      icon: Sparkles,
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
