"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function WorkSpaceHeaderNavMobile() {
  const t = useTranslations("common");
  const navs = [
    {
      id: 1,
      text: t("class"),
      href: "/workspace/class",
    },
    {
      id: 2,
      text: t("guide"),
      href: "https://docs.google.com/document/d/1hkeCy_kAgTHnXKliXTaAoOHFv0Y_QC9N3PW9on-3kak/edit#heading=h.dakbldos42zw",
    },

    {
      id: 3,
      text: t("board"),
      href: "/workspace/white-board",
    },
  ];
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleShow = () => {
    setShow(!show);
  };
  useOnClickOutside(ref, () => setShow(false));

  return (
    <>
      <div
        className="flex cursor-pointer gap-6 w-8 h-8 md:w-12 md:h-12 items-center rounded-full lg:hidden bg-secondary lg:ml-0"
        onClick={toggleShow}
      >
        <FontAwesomeIcon
          className="w-8 md:w-12 md:px-4 text-white"
          icon={faBars}
        />
      </div>
      <div
        className={clsx(
          "fixed bottom-0 top-0 left-0 bg-white z-30 w-[310px] pt-4 pb-10 space-y-6 px-2 transition-all duration-700 ease-in-out ",
          show ? "translate-x-0" : "-translate-x-[100%]"
        )}
        ref={ref}
      >
        <button
          className="rounded-full w-10 h-10 bg-secondary text-center flex items-center justify-center ml-auto"
          onClick={toggleShow}
        >
          <FontAwesomeIcon className="w-12 h-6 text-white" icon={faTimes} />
        </button>
        <Link href="/">
          <Image
            src="/images/Logo-green-text-2.png"
            alt="logo"
            width={270}
            height={80}
          />
        </Link>
        <ul className="pl-4 divide-y">
          {navs.map((item) => (
            <li
              key={item.id}
              className="before:content-['>'] before:font-semibold flex items-center py-4 px-5 gap-4"
            >
              <Link
                href={item.href}
                target="_blank"
                className="font-semibold capitalize leading-none text-[18px] md:text-[16px] xl:text-[18px] hover:text-secondary transition duration-300 ease-in-out"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
