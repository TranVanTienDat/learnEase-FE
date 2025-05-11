import SignOutButton from "@/app/(auth)/_components/SignOutButton";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../Sidebar";

export default function WorkSpaceHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent z-20">
      <div className="container p-0">
        <div className="flex justify-between items-center gap-2 md:gap-6 py-4 px-12 bg-tertiary rounded-bl-full rounded-br-full">
          <div className="flex items-center gap-2 ">
            <Sidebar />
            <Link href="/" className="lg:h-auto  flex items-center">
              <Image src="/images/logo.svg" alt="logo" width={50} height={50} />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-8">
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
