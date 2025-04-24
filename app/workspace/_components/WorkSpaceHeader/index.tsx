import SignOutButton from "@/app/(auth)/_components/SignOutButton";
import WorkSpaceHeaderNavMobile from "@/app/workspace/_components/WorkSpaceHeaderNavMobile";
import TimerTool from "@/app/workspace/class/_components/TimerTool";
import HeadNavMobile from "@/components/HeaderNavMobile";
import LocaleSwitcher from "@/components/LocaleSwỉtcher";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../Sidebar";

const HeaderNav = () => {
  const t = useTranslations("common");
  const navs = [
    // {
    //   id: 1,
    //   text: t("class"),
    //   href: "/workspace/class",
    //   target: "_self",
    // },
    {
      id: 3,
      text: t("board"),
      href: "/workspace/white-board",
      target: "_blank",
    },
  ];
  return (
    <div className="gap-6 items-center rounded-full p-2 hidden lg:flex">
      <HeadNavMobile />
      <ul className="md:flex hidden">
        {navs.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              target={item.target}
              className="font-medium text-white leading-none text-[18px] md:text-[16px] xl:text-[18px] hover:text-secondary transition duration-300 ease-in-out px-5 capitalize"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function WorkSpaceHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent z-20">
      <div className="container p-0">
        <div className="flex justify-between items-center gap-2 md:gap-6 py-4 px-12 bg-tertiary rounded-bl-full rounded-br-full">
          {/* <WorkSpaceHeaderNavMobile /> */}
          <div className="flex items-center gap-2 ">
            <Sidebar />
            <Link href="/" className="lg:h-auto  flex items-center">
              <Image src="/images/Logo.svg" alt="logo" width={50} height={50} />
            </Link>
          </div>
          <HeaderNav />
          <div className="flex items-center gap-2 md:gap-8">
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
