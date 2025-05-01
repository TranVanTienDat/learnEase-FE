import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/chat";
import { Menu, MessageCirclePlus } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

const Header = () => {
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

      <ChatMenu />
    </div>
  );
};

function ChatMenu() {
  const { resetSession } = useChatStore((state) => state);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        side="bottom"
        align="start"
        alignOffset={40}
      >
        <DropdownMenuItem onClick={resetSession} className="cursor-pointer">
          Tạo chat mới
          <DropdownMenuShortcut>
            <MessageCirclePlus className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default memo(Header);
