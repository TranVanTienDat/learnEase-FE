"use client";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat";
import { memo, useCallback, useState } from "react";

const BoxInput = () => {
  const { onUserInput } = useChatStore((state) => state);

  const [messageInput, setMessageInput] = useState("");

  const handleSubmit = useCallback(() => {
    if (messageInput.trim() === "") return;

    onUserInput(messageInput);
    setMessageInput("");
  }, [messageInput, onUserInput]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        handleSubmit();
        return;
      }
      if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full absolute bottom-[84px] px-4">
      <div className="max-w-[768px] mx-auto ">
        <div className="flex justify-center p-2.5 rounded-xl shadow-md bg-white">
          <textarea
            rows={1}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block p-1 w-full text-sm text-gray-900
            focus-visible:outline-none resize-none"
            placeholder="Write your thoughts here..."
          ></textarea>

          <Button className="h-[30px] p-2" onClick={handleSubmit}>
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="remixicon h-4 w-4"
            >
              <path d="M3 12.9999H9V10.9999H3V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V12.9999Z"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(BoxInput);
