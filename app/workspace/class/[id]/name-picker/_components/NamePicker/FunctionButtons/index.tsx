import React from "react";
import { Fullscreen, Settings } from "lucide-react";
import { handleFullscreen } from "@/utils";

export default function FunctionButtons({
  onClick,
  disable,
}: {
  onClick: () => void;
  disable: boolean;
}) {
  return (
    <div className="control-group mt-12">
      <button
        className="hover:text-secondary disabled:cursor-not-allowed disabled:hover:text-secondary appearance-none bg-transparent border-0 rounded-none shadow-none text-primary cursor-pointer inline-block font-inherit text-2xl leading-[1em] m-0 outline-none p-0 text-center no-underline"
        onClick={()=>handleFullscreen()}
      >
        <Fullscreen className="block h-[1em] w-[1em]" />
      </button>
      <button
        className="hover:text-secondary disabled:cursor-not-allowed disabled:hover:text-secondary appearance-none bg-transparent border-0 rounded-none shadow-none text-primary cursor-pointer inline-block font-inherit text-2xl leading-[1em] m-0 outline-none p-0 text-center no-underline ml-6"
        onClick={onClick}
        disabled={disable}
      >
        <Settings className="block h-[1em] w-[1em]" />
      </button>
    </div>
  );
}
