import { SortType, SortTypeTHead } from "@/types/attendance";
import { useState } from "react";

export default function useSortAttendance() {
  const [activeSort, setActiveSort] = useState<{
    status: SortTypeTHead;
    key: string;
  }>({
    status: SortType.DESC,
    key: "name",
  });
  const handleChangeSort = (value: { status: SortTypeTHead; key: string }) => {
    setActiveSort(value);
  };
  return {
    sort: activeSort,
    onSort: handleChangeSort,
  };
}
