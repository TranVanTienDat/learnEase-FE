"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function BackTitle({
  children,
  className,
  url,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  const router = useRouter();
  const handleBack = () => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  };
  return (
    <div
      className={clsx("cursor-pointer flex items-center gap-2", className)}
      onClick={handleBack}
    >
      <img src="/images/arrow-left.svg" alt="" />
      {children}
    </div>
  );
}
