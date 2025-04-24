"use client";

import { removeSessionTokenCookies } from "@/app/actions";
import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await removeSessionTokenCookies();
    localStorage.removeItem("sessionToken");
    router.push(`/`);
  };
  return (
    <ButtonAction
      name="Logout"
      action={handleLogout}
      icon={
        <FontAwesomeIcon
          className="text-[16px] md:text-[17px] mr-2 text-white cursor-pointer"
          icon={faArrowRightFromBracket}
          onClick={handleLogout}
        />
      }
      className="text-[17px]"
    />
  );
}
