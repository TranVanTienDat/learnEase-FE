"use client";
import http from "@/lib/http";
import useUserDetailStore, { UserType } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SaveUserDetail() {
  const saveUser = useUserDetailStore((state) => state.saveUser);
  const getDetailUser = async () => {
    const token = localStorage?.getItem("sessionToken");
    if (token) {
      const { status, payload } = await http.get("/users/me");
      if (status === 200) {
        saveUser(payload as UserType);
      }
    }
  };
  useEffect(() => {
    getDetailUser();
  }, []);
  return null;
}
