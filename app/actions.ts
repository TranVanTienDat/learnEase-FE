"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const setSessionTokenCookies = (token: string, userId: string) => {
  // const expires = new Date(Date.now() + 10 * 1000);
  cookies().set("sessionToken", token, {
    httpOnly: true,
    // expires,
  });
  cookies().set("userId", userId);
  redirect(`/workspace/class`);
};

export const removeSessionTokenCookies = () => {
  cookies().set("sessionToken", "", { expires: new Date(0) });
  cookies().set("userId", "", { expires: new Date(0) });
};

export const getSessionToken = () => {
  return cookies().get("sessionToken")?.value;
};

export const getUserId = () => {
  return cookies().get("userId")?.value;
};
