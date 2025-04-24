"use client";
import useGetClassInfo from "@/queryHooks/class/useGetClassInfo";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const Breadcrumb = ({ homeElement, separator }: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  // const { data } = useGetClassInfo(pathNames[2]);
  const t = useTranslations("common");

  let breadCrumbVietnamese: { [key: string]: string } = {
    home: t("home"),
    class: t("class"),
    create: t("addClass"),
    config: t("generalSettings"),
    students: t("classList"),
    "create-student": t("addStudent"),
    attendance: t("attendance"),
    "white-board": t("board"),
    group: t("group"),
    "diagram-class": t("diagramClass"),
    "lucky-wheel": t("luckyWheel"),
    "edit-class": t("editClass"),
    "name-picker": t("callOne"),
    "name-picker-n": t("callMultiple"),
    "bee-race": t("race"),
    "group-generator": t("divideGroup"),
    "click-time": t("stopwatch"),
    statistical: t("statistical"),
  };

  // if (data?.name) {
  //   breadCrumbVietnamese[data?.id] = `${t("class")} ${data?.name}`;
  // }

  const breadcrumbs = pathNames
    .map((key, index) => {
      return {
        name: breadCrumbVietnamese[key],
        href: `/${pathNames.slice(0, index + 1).join("/")}`,
      };
    })
    .filter((item) => item.name);

  return (
    <div>
      <ul className="flex py-5">
        <li className="hover:underline mr-1 cursor-pointer">
          <Link href={"/"}>{homeElement}</Link>
        </li>
        {breadcrumbs.length > 0 && separator}
        {breadcrumbs.map(({ name, href }, index) => {
          let itemClasses =
            paths === href
              ? "hover:underline mx-1 text-primary font-semibold cursor-pointer capitalize"
              : "hover:underline mx-1 cursor-pointer capitalize";
          return (
            <React.Fragment key={index}>
              <li className={clsx(itemClasses)}>
                <Link href={href}>{name}</Link>
              </li>
              {breadcrumbs.length !== index + 1 && separator}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;
