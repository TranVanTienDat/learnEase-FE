"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Grid3X3, LucideProps, UserRoundPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default function ButtonAction({
  name,
  action,
  className,
  disabled,
  href,
  icon,
}: {
  name: string;
  action?: () => void;
  className?: string;
  disabled?: boolean;
  href?: string;
  icon?: any;
}) {
  if (href)
    return (
      <Link
        href={href}
        className={cn(
          "rounded-full transition-colors px-6 text-sm font-medium text-white bg-primary h-[48px] flex items-center justify-center hover:bg-secondary",
          className
        )}
      >
        {name}
      </Link>
    );
  return (
    <Button
      onClick={() => {
        action?.();
      }}
      disabled={disabled}
      className={cn("py-6 px-6 rounded-full", className)}
    >
      {icon && icon}
      {name}
    </Button>
  );
}

type ButtonNavigationProps = {
  name: string;
  href?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
  action?: () => void;
  disabled?: boolean;
};

export const ButtonNavigation = ({
  name,
  href,
  icon: Icon,
  disabled,
  className,
  action,
}: ButtonNavigationProps) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex justify-center items-center py-[12px] px-[8px] gap-[8px] text-[15px] font-medium rounded-[8px] border hover:bg-secondary",
          className
        )}
      >
        <Icon className="text-primary text-[18px]" />

        <span className="text-[#0F1834]">{name}</span>
      </Link>
    );
  }

  return (
    <Button
      onClick={() => {
        action?.();
      }}
      disabled={disabled}
      className={cn(
        "flex justify-center items-center py-[12px] px-[8px] gap-[8px] text-[15px] font-medium rounded-[8px] bg-white border",
        className
      )}
    >
      <UserRoundPlus className="text-primary text-[18px]" />

      <span className="text-[#0F1834]">{name}</span>
    </Button>
  );
};

export const SelectClassManagement = ({
  list,
  className,
}: {
  list: any;
  className?: string;
}) => {
  const tCommon = useTranslations("common");
  const router = useRouter();

  const handleNavigate = (value: string) => {
    router.push(value);
  };

  return (
    <Select onValueChange={handleNavigate}>
      <SelectTrigger
        className={cn(
          "min-w-[220px] text-[15px] text-[#0F1834] font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:cursor-not-allowed  hover:bg-secondary hover:text-white gap-2",
          className
        )}
      >
        <Grid3X3 className="text-primary" />
        <SelectValue placeholder={tCommon("classManagement")} />
      </SelectTrigger>
      <SelectContent className="px-[12px]">
        {list.map((select: any) => {
          return (
            <SelectItem
              key={select.href}
              value={select.href}
              className={cn(
                "rounded-[8px] border py-[12px] my-[12px] text-[15px] cursor-pointer text-[#0F1834] font-medium pl-3"
              )}
            >
              {tCommon(select.name)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
