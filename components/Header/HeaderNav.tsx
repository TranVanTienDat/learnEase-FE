"use client";
import HeadNavMobile from "@/components/HeaderNavMobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const HeaderNav = () => {
  const t = useTranslations("homepage");
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isOpenButtonScroll, setIsOpenButtonScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const carousel = carouselRef.current;
      if (carousel) {
        setIsOpenButtonScroll(carousel.clientWidth < carousel.scrollWidth);
      }
    };

    checkScroll();

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScroll);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 3000, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -3000, behavior: "smooth" });
    }
  };

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
      text: t("seePoint"),
      href: "/study-tracking",
    },
    {
      id: 4,
      text: t("manageClass"),
      href: "/workspace/class",
    },
    {
      id: 5,
      text: t("learnVocabs"),
      href: "https://yourhomework.net/vocabulary/lessons",
    },
    {
      id: 6,
      text: t("internationalEnglish"),
      href: "https://tienganholympia.com/login.html",
    },
    {
      id: 7,
      text: t("appEnglishForKid"),
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
      id: 8,
      text: "OlymClass",
      href: "https://play.google.com/store/apps/details?id=vn.olympiavietnam.olymclass.olymclass_mobile",
      icon: "/images/logo-OLYMPIA.png",
    },
  ];
  return (
    <div className="flex items-center rounded-full p-2 bg-white">
      <HeadNavMobile />
      {isOpenButtonScroll && (
        <button
          className="px-[6px] py-[4px] rounded-[2px] hover:bg-primary group"
          onClick={handlePrev}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="group-hover:text-white"
          />
        </button>
      )}

      <div className="overflow-x-auto custom-scrollbar" ref={carouselRef}>
        <ul className="md:flex divide-x divide-[#BEBEBE] py-2 hidden">
          {navs.map((item) => (
            <li key={item.id} className="flex items-center ">
              {!item.listIcon ? (
                <Link
                  href={item.href}
                  target="_blank"
                  className="flex items-center gap-2 font-medium leading-5 text-[16px] md:text-[15px] lg:text-[16px] xl:text-[18px] hover:text-secondary transition duration-300 ease-in-out px-2"
                >
                  <span className="line-clamp-2 w-max">{item.text}</span>
                  {item.icon && (
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="min-w-5 min-h-5 hidden lg:block"
                    />
                  )}
                </Link>
              ) : (
                <div className="flex justify-center items-center gap-[8px] px-3">
                  <div className="hidden lg:flex gap-1 items-center">
                    <span className="line-clamp-2 font-medium leading-5 text-[16px] md:text-[15px] lg:text-[16px] xl:text-[18px] w-max">
                      {item.text}
                    </span>
                    <span className="lg:flex items-center gap-[14px] hidden">
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
                  <div className="lg:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center outline-none">
                        <span className="hover:text-secondary text-start text-[16px] md:text-[15px] line-clamp-2 font-medium leading-5">
                          {item.text}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="ml-1"
                          width={10}
                          height={10}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-w-[120px] px-4 py-2">
                        {item.listIcon.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            className="flex items-center gap-[5px] group"
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isOpenButtonScroll && (
        <button
          className="px-[6px] py-[4px] rounded-[2px] hover:bg-primary group mr-1"
          onClick={handleNext}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="group-hover:text-white"
          />
        </button>
      )}

      <Button
        variant={"ghost"}
        className="ml-auto p-0 hover:text-secondary hover:bg-transparent before:w-[1px] before:h-[24px] before:bg-[#BEBEBE]"
        size={"sm"}
      >
        <FontAwesomeIcon className="w-14  h-6" icon={faSearch} />
      </Button>
    </div>
  );
};
