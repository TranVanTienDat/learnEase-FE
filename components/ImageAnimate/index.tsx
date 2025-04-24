import { cn } from "@/lib/utils";
import { convertImageUrl } from "@/utils";
import clsx from "clsx";
import Image from "next/image";

export default function ImageAnimate({
  src,
  size = 100,
  classNames = "",
}: {
  src: string;
  size: string | number;
  classNames?: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={clsx(
          `relative after:content-[''] before:absolute before:w-full before:h-full before:border-2 before:border-primary before:rounded-full before:top-0 before:left-0 after:absolute after:top-2 after:right-2 after:bottom-2 after:left-2 after:border-2 after:border-dashed after:border-secondary after:animate-dash-rotate after:rounded-full after:opacity-0 hover:after:opacity-100 after:transition-all group cursor-pointer w-[100px] h-[100px]`,
          classNames
        )}
      >
        <div
          className={cn(
            `w-full h-full flex items-center justify-center cursor-pointer`
          )}
        >
          <Image
            src={convertImageUrl(src)}
            alt="avatar"
            width={+size}
            height={+size}
            className="rounded-full w-4/5 h-4/5 mx-auto group-hover:scale-105 transition-all cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
