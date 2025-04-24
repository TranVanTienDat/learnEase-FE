import SignOut from "@/app/(auth)/_components/SignOut";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function WorkSpaceFooter() {
  const t = useTranslations("common");
  return (
    <footer className="bg-tertiary text-white">
      <div className="container">
        <div className="text-center py-8 text-lg font-semibold">
          <p className="capitalize">LearnEase - Kết nối tri thức!</p>
          <div className="flex flex-col md:flex-row items-center justify-center mt-2">
            <p>Copyright © 2025</p>
            <ul className="flex gap-1 items-center flex-wrap">
              <li className="after:content-['|']">
                <Link className="px-1 underline capitalize" href="/">
                  LearnEase
                </Link>
              </li>
              <li className="after:content-['|']">
                <Link className="px-1 underline capitalize" href="/">
                  {t("contact")}
                </Link>
              </li>
              <li className="after:content-['|']">
                <Link className="px-1 underline capitalize" href="/">
                  {t("introduction")}
                </Link>
              </li>
              <li>
                <SignOut />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
