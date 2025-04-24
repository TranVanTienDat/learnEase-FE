'use client'
import { HeadItemRowType, SortType, THeadItemType } from "@/types/attendance";
import clsx from "clsx";

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
  return (
    <th className={clsx(className, "text-white")}>
      <div className="flex">
        {subRows.map((subRow) => {
          return (
            <p
              key={subRow.title.value}
              className={clsx(
                "flex gap-4 items-center h-10 p-2 px-3 flex-1 text-sm",
                !subRow.disabled && "justify-between",
                subRow.className
              )}
            >
              <span>{subRow.title.label}</span>
              {!subRow.disabled && (
                <img
                  src={iconRender(subRow)}
                  onClick={() => {
                    action(subRow);
                    onChange?.({
                      status:
                        activeSort?.status === SortType.DESC
                          ? SortType.ASC
                          : SortType.DESC,
                      key: subRow.title.value,
                    });
                  }}
                  className="cursor-pointer"
                  alt=""
                />
              )}
            </p>
          );
        })}
      </div>
    </th>
  );
};

export default THeadItem;
