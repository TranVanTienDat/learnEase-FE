import LocaleSwitcherSelect from "@/components/LocaleSwitcherSelect";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "vi",
          label: t("vi"),
        },
        {
          value: "en",
          label: t("en"),
        },
      ]}
      label={t("language")}
    />
  );
}
