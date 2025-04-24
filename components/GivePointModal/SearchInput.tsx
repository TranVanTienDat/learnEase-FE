import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SearchInput({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const t = useTranslations("common");
  const debounceSearch = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    500
  );
  return (
    <div className="relative">
      <Image
        src="/images/icons/search.svg"
        width={24}
        height={24}
        alt="icon"
        className="absolute top-1/2 left-2 -translate-y-1/2"
      />
      <Input
        placeholder={t("search")}
        onChange={debounceSearch}
        className="pl-10"
      />
    </div>
  );
}
