import Image from "next/image";

export default function Header() {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between p-3 bg-[#e0e0e0]">
      <div className="flex items-center justify-start gap-2">
        <Image
          src="/images/chatbot.png"
          alt="logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />

        <div className="font-bold ">/</div>
        <div className="font-semibold text-base text-primary">
          Đăng kí lớp học tự động
        </div>
      </div>
    </div>
  );
}
