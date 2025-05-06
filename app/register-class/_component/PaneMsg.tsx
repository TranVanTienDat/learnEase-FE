import { useCallback, useEffect, useRef } from "react";
import BoxInput from "./BoxInput";
import MessageList from "./MessageList";
import { useChatStore } from "@/stores/chat";

export default function PaneMsg() {
  const ref = useRef<HTMLDivElement | null>(null);
  const messages = useChatStore((state) => state.session.messages);
  const { session } = useChatStore((state) => state);
  console.log("PaneMsg", session);
  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  return (
    <div className="h-full relative bg-[linear-gradient(180deg,rgba(249,250,251,0.9)_0%,rgba(242,244,247,0.9)_90.48%)]">
      <div
        className="mb-[84px] h-[calc(100vh-140px)] overflow-y-scroll table-wrapper px-4"
        ref={ref}
      >
        <MessageList />
      </div>
      <BoxInput />
    </div>
  );
}
