import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SemesterEnum } from "@/constants/statistical";
import { usePickStatisticalStudy } from "@/hooks/statistical";
import { useTranslations } from "next-intl";

export default function StudyPicker({ idClass }: { idClass: string }) {
  const t = useTranslations("statistics");

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const OPTION_SEMESTER = [
    { label: `${t("semester")} 1`, value: "Học Kỳ 1" },
    { label: `${t("semester")} 2`, value: "Học Kỳ 2" },
  ];
  const OPTION_YEAR2 = [
    { label: `${t("year")} 2022`, value: "2022" },
    { label: `${t("year")} 2023`, value: "2023" },
    { label: `${t("year")} 2024`, value: "2024" },
  ];
  const OPTION_YEAR = years.map((year) => ({
    label: `${t("year")} ${year}`,
    value: year.toString(),
  }));

  const { handleFilterStatisticalStudy, semester, year } =
    usePickStatisticalStudy({
      idClass,
    });

  return (
    <div className="flex gap-3">
      <Select
        defaultValue={semester}
        onValueChange={(value: string) =>
          handleFilterStatisticalStudy({
            semester: value as SemesterEnum,
            year,
          })
        }
      >
        <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {OPTION_SEMESTER.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        defaultValue={year}
        onValueChange={(year) =>
          handleFilterStatisticalStudy({
            semester: semester as SemesterEnum,
            year,
          })
        }
      >
        <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {OPTION_YEAR.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
