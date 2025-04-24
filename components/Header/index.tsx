import SignIn from "@/app/(auth)/_components/SignIn";
import { getSessionToken } from "@/app/actions";
import HeadNavMobile from "@/components/HeaderNavMobile";
import LocaleSwitcher from "@/components/LocaleSwỉtcher";
import { Button } from "@/components/ui/button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

const HeaderNavItem = ({
  icon,
  text,
  href,
}: {
  icon?: IconProp;
  text?: string;
  href: string;
}) => {
  return (
    <Link href={href} target="_blank" className="group flex gap-3 items-center">
      <span className="w-10 h-10 rounded-full first-line:text-[18px] bg-white transition duration-300 ease-in-out group-hover:bg-secondary group-hover:text-white flex items-center justify-center">
        {icon && <FontAwesomeIcon className="w-4" icon={icon} />}
      </span>
      {text && (
        <span className="group-hover:text-secondary transition duration-300 ease-in-out text-white hidden lg:block">
          {text}
        </span>
      )}
    </Link>
  );
};

const HeaderNav = async () => {
  const t = await getTranslations("homepage");

  const navs = [
    {
      id: 1,
      text: t("guide"),
      href: "https://docs.google.com/document/d/1hkeCy_kAgTHnXKliXTaAoOHFv0Y_QC9N3PW9on-3kak/edit#heading=h.dakbldos42zw",
    },
    {
      id: 2,
      text: t("manageClass"),
      href: "/workspace/class",
    },
    {
      id: 3,
      text: t("learnVocabs"),
      href: "https://yourhomework.net/vocabulary/lessons",
    },
    {
      id: 4,
      text: t("internationalEnglish"),
      href: "https://tienganholympia.com/login.html",
    },
    {
      id: 5,
      text: t("appEnglishForKid"),
      listIcon: [
        {
          href: "https://apps.apple.com/vn/app/olymstars-english/id6503220689?l=vi",
          icon: "/images/app-store.png",
          name: "iOS",
        },
        {
          href: "https://play.google.com/store/apps/details?id=com.vfftechjsc.olympiaeducation",
          icon: "/images/ch-play.png",
          name: "Android",
        },
      ],
    },
  ];
  return (
    <div className="flex items-center rounded-full p-2 bg-white">
      <HeadNavMobile />
      <ul className="md:flex divide-x divide-[#BEBEBE] hidden">
        {navs.map((item) => (
          <li key={item.id}>
            {!item.listIcon ? (
              <Link
                href={item.href}
                target="_blank"
                className="font-medium leading-none text-[18px] md:text-[16px] xl:text-[18px] hover:text-secondary transition duration-300 ease-in-out px-5 truncate"
              >
                {item.text}
              </Link>
            ) : (
              <div className="flex justify-center items-center gap-[8px]">
                <span className="font-medium leading-none text-[18px] md:text-[16px] xl:text-[18px] pl-5 ">
                  {item.text}
                </span>
                <span className="flex gap-[14px] ">
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
                      <Image src={item.icon} alt="" width={20} height={20} />
                    </Link>
                  ))}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Button
        variant={"ghost"}
        className="ml-auto p-0 hover:text-secondary hover:bg-transparent before:w-[1px] before:h-[24px] before:bg-[#BEBEBE]"
        size={"sm"}
      >
        <FontAwesomeIcon className="w-14 h-6" icon={faSearch} />
      </Button>
    </div>
  );
};

export default async function Header() {
  const sessionToken = await getSessionToken();
  const t = await getTranslations("common");
  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent z-20">
      <div className="container">
        <div className="flex justify-between items-center gap-6 py-4">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.svg" alt="logo" width={50} height={50} />
            <Image
              src="/images/LearnEase.svg"
              alt="logo"
              width={140}
              height={50}
            />
          </Link>

          <div className="flex items-center gap-4">
            {/* <LocaleSwitcher /> */}

            <Link
              href="/register-class"
              className="
            text-primary text-white underline"
            >
              Đăng kí lớp học
            </Link>

            {sessionToken ? (
              <Link href="/workspace/class">
                <Button
                  className="text-white bg-[#F4673D] rounded-full px-6 md:px-10 text-sm h-8 md:h-11 text-[10px] md:text-[14px]"
                  size="lg"
                >
                  {t("joinClass")}
                </Button>
              </Link>
            ) : (
              <SignIn className="text-white bg-[#2E3899] rounded-full p-6 text-sm px-10">
                {t("joinClass")}
              </SignIn>
            )}
          </div>
        </div>
        {/* <HeaderNav /> */}
      </div>
    </header>
  );
}
