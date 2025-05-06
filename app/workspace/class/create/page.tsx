import CreateClassForm from "@/app/workspace/class/create/_components/CreateClassForm";
import BackTitle from "@/components/BackTitle";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Create() {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");

  return (
    <div className="container">
      <div className="rounded-[20px] mb-10">
        <div className="flex gap-10">
          <div className="space-y-2 text-center md:text-left flex-1">
            <CreateClassForm />
          </div>
        </div>
      </div>
    </div>
  );
}
