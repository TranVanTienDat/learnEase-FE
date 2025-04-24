import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const FooterIcon = ({ icon, href }: { icon?: IconProp; href: string }) => {
  return (
    <Link
      href={href}
      target="_blank"
      className="group flex gap-3 items-center text-black"
    >
      <span className="md:w-10 md:h-10 w-[50px] h-[50px] rounded-full first-line:text-[18px] bg-primary transition duration-300 ease-in-out group-hover:bg-secondary group-hover:text-white flex items-center justify-center bg-white">
        {icon && <FontAwesomeIcon className="w-4" icon={icon} />}
      </span>
    </Link>
  );
};

export default function Footer() {
  const t = useTranslations("homepage");

  return (
    <footer className="bg-tertiary text-white py-5">
      <div className="container">
        <div className="flex justify-center items-center gap-3">
          <Link href="/" className=" items-center md:flex  hidden">
            <Image src="/images/logo.svg" alt="logo" width={50} height={50} />
            <Image
              src="/images/LearnEase.svg"
              alt="logo"
              width={140}
              height={50}
            />
          </Link>
          <span className="h-[90px] w-[2px] bg-white md:block  hidden" />

          <div>
            <label className="text-base font-medium">
              Đăng ký để nhận bản tin của chúng tôi
            </label>
            <div className="pt-1 flex justify-start flex-wrap gap-2">
              <input
                className="w-[400px] bg-transparent py-[6px] border-[1px] px-1 border-white rounded-md text-white placeholder:text-black focus-visible:outline-none"
                type="email"
                placeholder="Nhập email của bạn"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        <div className="font-semibold text-lg pt-[30px] text-center">
          © 2021 Class Technologies Inc.
        </div>
      </div>
    </footer>
  );
}
