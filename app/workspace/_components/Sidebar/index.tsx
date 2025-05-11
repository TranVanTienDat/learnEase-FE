"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CLASS_PATH, TOOLS_PATH } from "@/constants";
import { cn } from "@/lib/utils";
import useUserDetailStore from "@/stores/user-store";
import {
  AlarmClockCheck,
  Bike,
  Boxes,
  Grid3X3,
  LifeBuoy,
  Menu,
  Sparkles,
  SquareDashedKanban,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const { id } = params as { id: string };

  const [open, setOpen] = useState(false);

  const convertClassPath = (childPath: string) => {
    return `${CLASS_PATH}/${id}/${childPath}`;
  };
  const user = useUserDetailStore((state) => state.user);

  const ToolNavigation = [
    {
      name: "attendance",
      href: convertClassPath("attendance"),
      icon: UserCheck,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.LUCKY_WHEEL.name,
      href: convertClassPath(TOOLS_PATH.LUCKY_WHEEL.path),
      icon: LifeBuoy,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.GROUP.name,
      href: convertClassPath(TOOLS_PATH.GROUP.path),
      icon: Users,
      className: "h-[44px]",
    },
    {
      name: TOOLS_PATH.DIAGRAM.name,
      href: convertClassPath(TOOLS_PATH.DIAGRAM.path),
      icon: Grid3X3,
      className: "h-[44px]",
    },
  ];

  const NavigateButtons = [
    {
      name: "listStudent",
      href: convertClassPath("students"),
    },
    {
      name: "statisticalLearn",
      href: convertClassPath("statistical?key=point"),
    },
    {
      name: "subjectManagement",
      href: convertClassPath("subject-management"),
    },
    {
      name: "enterPoints",
      href: convertClassPath("enter-points"),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{id && <Menu size={28} color="white" />}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="w-[260px] [&>button]:hidden p-3 flex flex-col justify-start"
      >
        <SheetHeader className="mb-[24px] ">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="logo" width={40} height={40} />
            <Image
              src="/images/LearnEase.svg"
              alt="logo"
              width={100}
              height={70}
            />
          </Link>
        </SheetHeader>
        <div className="flex flex-col gap-4 justify-between">
          <div className="space-y-2 overflow-y-auto table-wrapper h-[calc(100vh-180px)]">
            {ToolNavigation.map((item) => (
              <LinkButton
                key={item.name}
                item={item}
                pathname={pathname}
                onClose={() => setOpen(false)}
              />
            ))}

            <Accordion type="single" collapsible className="">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger
                  style={{ textDecoration: "none" }}
                  className="hover:bg-[#E9F5FE] px-3 py-2 rounded-sm"
                >
                  <div className="flex items-center gap-3 ">
                    <SquareDashedKanban scale={24} />
                    <span>Quản lý lớp học</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-3">
                  {NavigateButtons.map((item) => (
                    <LinkButton
                      key={item.name}
                      item={item}
                      pathname={pathname}
                      onClose={() => setOpen(false)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="rounded-sm flex  gap-3 bg-[#d9e8ff]">
            <Avatar className="rounded-sm w-[40px] h-[40px] my-[6px] ml-[6px]">
              <AvatarFallback className="rounded-sm">
                {user?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className=" flex flex-col justify-center">
              <span className="text-sm font-semibold text-[#2E3899]">
                {user?.name}
              </span>
              <p className="text-xs text-[#5D7285]">{user?.email}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const LinkButton = ({
  item,
  pathname,
  onClose,
}: {
  item: any;
  pathname: string;
  onClose: () => void;
}) => {
  const t = useTranslations("common");

  return (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        "flex items-center  gap-3 px-3 py-2 text-[#5D7285] rounded-sm  transition-all hover:bg-[#E9F5FE]",
        pathname === item.href && "text-[#2E3899] bg-[#E9F5FE] font-extrabold"
      )}
      onClick={onClose}
    >
      {item?.icon && <item.icon size={24} />}
      <span className="text-base">{t(item.name)}</span>
    </Link>
  );
};
