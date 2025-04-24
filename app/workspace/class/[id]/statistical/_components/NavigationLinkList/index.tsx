import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavigationLinkList({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const t = useTranslations("statistics");

  const link = [
    {
      title: t("attendance"),
      name: "attendance",
      path: `/workspace/class/${params.id}/statistical?key=attendance`,
    },
    {
      title: t("score"),
      name: "point",
      path: `/workspace/class/${params.id}/statistical?key=point`,
    },
    {
      title: t("academicScore"),
      name: "study",
      path: `/workspace/class/${params.id}/statistical?key=study`,
    },
  ];

  return (
    <div className="flex gap-3">
      {link.map((item, index) => {
        return (
          <div key={index}>
            <Link
              href={item.path}
              className={clsx(
                "cursor-pointer peer-checked:hidden relative font-semibold w-max",
                searchParams?.key === item.name
                  ? "before:absolute before:-bottom-2 before:left-0 before:w-full before:h-[1px] before:bg-primary before:content-[''] before:rounded-[99999px]"
                  : "text-[#a39e9e]"
              )}
            >
              {item.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
