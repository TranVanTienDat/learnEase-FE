"use client";

import { removeSessionTokenCookies } from "@/app/actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const t = useTranslations('common')

  const handleLogout = async () => {
    await removeSessionTokenCookies();
    localStorage.removeItem("sessionToken");
    router.push(`/`);
  };
  return (
    <a className="px-1 underline capitalize" onClick={handleLogout}>
      {t('logout')}
    </a>
  );
}
