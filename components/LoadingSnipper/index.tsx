import { cn } from "@/lib/utils";
import clsx from "clsx";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

export const LoadingSnipper = ({
  className,
  iconClass,
}: {
  className?: string;
  iconClass?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderCircleIcon className={cn("animate-spin", iconClass)} />
    </div>
  );
};
