"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage, useChatStore } from "@/stores/chat";
import Markdown from "./Markdown";
import { LoadingSnipper } from "@/components/LoadingSnipper";

export default function MessageList() {
  const messages = useChatStore((state) => state.getSession().messages);

  return (
    <div className="max-w-[768px] mx-auto py-2 flex flex-col gap-2 ">
      {messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
}

const Message = (msg: ChatMessage) => {
  const { content, role, streaming, isError } = msg;
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 pb-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="rounded-[50%] w-[40px] h-[40px] bg-[#d5f5f6] flex justify-center items-end">
        <AvatarImage
          className="rounded-[50%] w-[30px] h-[30px]"
          src={!isUser ? "/images/assistant.png" : "/images/user.png"}
          alt="img"
        />
      </Avatar>

      <p
        className={cn(
          "bg-white p-3 rounded-2xl text-sm font-semibold",
          isError && "bg-[#f8d7da] text-[#721c24]"
        )}
      >
        {streaming && (
          <span className=" text-gray-400 font-normal flex items-center gap-1">
            Thinking <LoadingSnipper className="p-0" iconClass="w-4 h-4" />
          </span>
        )}

        <Markdown content={content} />
      </p>
    </div>
  );
};
