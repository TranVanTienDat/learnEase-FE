import CreateClassForm from "@/app/workspace/class/create/_components/CreateClassForm";
import BackTitle from "@/components/BackTitle";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Create() {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");

  return (
    <div className="container">
      <div className="p-5 border-primary border-2 rounded-[20px] mb-10">
        <div className="flex gap-10">
          <div className="space-y-2 text-center md:text-left flex-1">
            <p className="text-secondary uppercase font-bold tracking-[0.3em]">
              {tCommon("happyClass")}
            </p>
            <BackTitle>
              <h2 className="text-4xl md:text-[32px] font-bold capitalize leading-[1.2] my-3">
                {t("addNewClass")}
              </h2>
            </BackTitle>
            <CreateClassForm />
          </div>
        </div>
      </div>
    </div>
  );
}
