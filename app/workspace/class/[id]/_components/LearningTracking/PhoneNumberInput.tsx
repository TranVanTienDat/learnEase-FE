import React from "react";
import { Input } from "@/components/ui/input";
import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function PhoneNumberInput({
  phone,
  error,
  handleInputChange,
  handleSubmit,
}: {
  phone: string;
  error: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}) {
  const t = useTranslations("learningTracking");
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };
  return (
    <div className="border-t border-t-red-[#E7E8EB] mb-9">
      <div className="max-w-[736px] mx-auto mt-5">
        <div className="p-5 bg-primary rounded-t-xl">
          <p className="font-bold text-xl text-white">{t("enterPhoneTitle")}</p>
        </div>
        <div className="flex flex-col gap-10 justify-center items-center bg-white p-5 rounded-b-xl">
          <div className="w-full">
            <Input
              className={cn("rounded-lg", error && "border-[#E02B1E]")}
              placeholder={t("phoneNumber")}
              type="tel"
              value={phone}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            {error && (
              <p className="text-[#E02B1E] text-sm font-normal mt-2">{error}</p>
            )}
          </div>
          <ButtonAction
            className="px-12 py-0"
            action={handleSubmit}
            name={t("viewInfo")}
          />
        </div>
      </div>
    </div>
  );
}
