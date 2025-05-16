import { HeadItemRowType, SortType, THeadItemType } from "@/types/attendance";
import clsx from "clsx";
import { useTranslations } from "next-intl";

const THeadItem = ({
  subRows,
  activeSort,
  onChange,
  className,
}: THeadItemType) => {
  const iconRender = (subRow: HeadItemRowType) => {
    if (activeSort?.key === subRow.title.value) {
      return activeSort?.status === SortType.DESC
        ? "/images/icons/descending.svg"
        : "/images/icons/ascending.svg";
    } else {
      return "/images/icons/sort-default.svg";
    }
  };
  const action = (subRow: HeadItemRowType) => {
    if (activeSort?.status === SortType.DESC) {
      return subRow[SortType.DESC]();
    }
    return subRow[SortType.ASC]();
  };
  const t = useTranslations("attendance");
  return (
    <th className={clsx(className, "text-white")}>
      <div className="flex">
        {subRows.map((subRow) => {
          return (
            <p
              key={subRow.title.value}
              className="flex gap-4 items-center h-10 p-2 px-3 flex-1 text-sm justify-between"
            >
              <span>{t(subRow.title.label)}</span>
            </p>
          );
        })}
      </div>
    </th>
  );
};

export default THeadItem;
