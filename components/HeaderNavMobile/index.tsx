"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function HeadNavMobile() {
  const t = useTranslations("homepage");
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleShow = () => {
    setShow(!show);
  };
  useOnClickOutside(ref, () => setShow(false));

  const navs = [
    {
      id: 1,
      text: "Olympia VN",
      href: "https://olympiavietnam.vn/",
    },
    {
      id: 2,
      text: t("guide"),
      href: "https://docs.google.com/document/d/1hkeCy_kAgTHnXKliXTaAoOHFv0Y_QC9N3PW9on-3kak/edit#heading=h.dakbldos42zw",
    },
    {
      id: 3,
      text: t("manageClass"),
      href: "/workspace/class",
    },
    {
      id: 4,
      text: t("learnVocabs"),
      href: "https://yourhomework.net/vocabulary/lessons",
    },
    {
      id: 5,
      text: t("internationalEnglish"),
      href: "https://tienganholympia.com/login.html",
    },
    {
      id: 6,
      text: t("appEnglishForKid"),
      href: "https://tienganholympia.com/login.html",
      listIcon: [
        {
          href: "https://play.google.com/store/apps/details?id=com.vfftechjsc.olympiaeducation",
          icon: "/images/ch-play.png",
          name: "Android",
        },
        {
          href: "https://apps.apple.com/vn/app/olymstars-english/id6503220689?l=vi",
          icon: "/images/app-store.png",
          name: "IOS",
        },
      ],
    },
    {
      id: 7,
      text: "OlymClass",
      href: "https://play.google.com/store/apps/details?id=vn.olympiavietnam.olymclass.olymclass_mobile",
    },
  ];

  return (
    <>
      <div
        className="flex cursor-pointer gap-6 w-12 h-12 items-center rounded-full md:hidden bg-secondary"
        onClick={toggleShow}
      >
        <FontAwesomeIcon className="w-12 px-4 text-white" icon={faBars} />
      </div>
      <div
        className={clsx(
          "fixed bottom-0 top-0 left-0 bg-white z-20 w-[310px] pt-4 pb-10 space-y-6 px-2 transition-all duration-700 ease-in-out ",
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
          {/* <Image
            src="/images/Logo-green-text-2.png"
            alt="logo"
            width={270}
            height={80}
          /> */}
        </Link>
        <ul className="pl-4 divide-y">
          {navs.map((item) => (
            <li
              key={item.id}
              className="before:content-['>'] before:font-semibold flex items-center py-4 px-5 gap-4"
            >
              {!item.listIcon ? (
                <Link
                  href={item.href}
                  target="_blank"
                  className="font-semibold leading-none text-[18px] md:text-[16px] xl:text-[18px] hover:text-secondary transition duration-300 ease-in-out"
                >
                  {item.text}
                </Link>
              ) : (
                <div className="flex flex-col justify-center items-center gap-[8px]">
                  <span className="font-semibold leading-none text-[18px] md:text-[16px] xl:text-[18px]  ">
                    {item.text}
                  </span>
                  <span className="flex items-center gap-[14px] ">
                    {item.listIcon.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        className="flex justify-center items-center gap-[5px] group"
                      >
                        <span className="group-hover:text-secondary">
                          {item.name}
                        </span>
                        <Image
                          src={item.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="min-w-5 min-h-5"
                        />
                      </Link>
                    ))}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
