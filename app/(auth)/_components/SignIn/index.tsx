"use client";
import { setSessionTokenCookies } from "@/app/actions";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import { Button } from "@/components/ui/button";
import { auth, provider } from "@/lib/firebase";
import servicesApi from "@/services";
import useUserDetailStore from "@/stores/user-store";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

export default function SignIn({
  children,
  className,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}) {
  const saveUser = useUserDetailStore((state) => state.saveUser);
  const [isLoading, setIsLoading] = useState(false);
  const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      GoogleAuthProvider.credentialFromResult(result);
      setIsLoading(true);
      const idToken = await auth.currentUser?.getIdToken(true);
      const dataUser = await servicesApi.post("firebase-auth", { idToken });
      if (dataUser) {
        console.log("dataUser", dataUser);
        setSessionTokenCookies(dataUser.jwt, dataUser.user.id);
        localStorage.setItem("sessionToken", dataUser.jwt);
        saveUser(dataUser.user);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button variant={variant} onClick={handleLoginGoogle} className={className}>
      {children}
      {isLoading && <LoadingSnipper className="p-0 pl-2" iconClass="w-5 h-5" />}
    </Button>
  );
}
