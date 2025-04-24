import React from "react";
import { LuckyDrawProp } from "@/types/namePicker";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LuckyDraw({
  isSpinning,
  handleDraw,
  isEndSpinning,
}: LuckyDrawProp) {
  const t = useTranslations("namePicker");
  return (
    <div className="text-center z-[2] relative w-full">
      <h1 className="mt-0 mb-6 font-semibold text-secondary text-4xl">
        {t("luckyEagle")}
      </h1>

      <div className="relative max-1599:h-[11.5rem] max-[600px]:h-2 max-1599:my-0 max-1599:mx-auto max-1599:w-[50rem] max-1199:w-[41.25rem] max-1199:h-[9.4875rem] custom-576-767::h-[7.1875rem] custom-576-767:w-[31.25rem] max-575:w-[18rem] max-575:h-[4.14rem]  ">
        <div
          className="max-1599:transform max-1599:scale-[0.8] max-1599:origin-top-left max-1199:scale-[0.66] custom-576-767:scale-[0.5] max-575:scale-[0.288]  relative rounded-[1.25rem] bg-primary shadow-slot-shadow h-[14.375rem] my-0 mx-auto p-[1.625rem] w-[62.5rem] z-[3]"
          style={{ backgroundImage: "url('/images/light-blubs.svg')" }}
        >
          <div className="bg-[#fefec2] h-full overflow-hidden p-[1.8125rem] w-full rounded-[1.25rem] relative">
            <div className="bg-slot-gradient rounded-bl-[1.25rem] rounded-br-[1.25rem] bottom-0 h-[5.625rem] left-0 absolute w-full"></div>
            <div id="reel" className="w-full"></div>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-1/2 hidden h-screen m-[-50vh_0_0_-50vw] overflow-hidden pointer-events-none w-screen z-0"
          style={{ display: isSpinning ? "block" : "none" }}
        >
          <Image
            className="absolute left-1/2 top-1/2 h-auto w-[100vmin] m-[-50vmin_0_0_-50vmin] animate-rotate"
            src="/images/sunburst.svg"
            width={632}
            height={634}
            alt="sunburst"
          />
        </div>
      </div>

      <button
        className="hover:bg-secondary disabled:cursor-not-allowed disabled:hover:bg-primary appearance-none  bg-primary border-none rounded-[0.625rem] shadow-[0.625rem_0.625rem_0_rgba(0,0,0,0.2)] text-white cursor-pointer inline-block font-[inherit] text-[1.75rem] font-bold leading-[1.75rem] outline-none py-[1rem] px-[0.625rem] text-center no-underline whitespace-nowrap
        mt-[5.5rem] mx-0 max-w-full relative w-[22.5rem] z-[5] before:max-1599:rounded-md max-1599:text-[1.4rem] max-1599:leading-[1.4rem] max-1599:mt-[4.4rem] max-1599:mx-0 max-1599:pt-[0.8rem] max-1599:shadow-[0.5rem_0.5rem_0_rgba(0,0,0,0.2)] max-1599:pb-[0.8rem] max-1599:pl-[0.5rem] max-1599:pr-[0.5rem] max-1599:w-[18rem]
        "
        onClick={handleDraw}
        disabled={isEndSpinning}
      >
        {t("spin")}
      </button>
    </div>
  );
}
