import { cn } from "@/lib/utils";
import {
  TableRowSubjectManagement,
  THeadItemTypeSubjectManagement,
} from "@/types/subjectManagement";
import { ReactNode } from "react";

type THeadItemType = {
  title: ReactNode;
  className?: string;
};

const THeadItem = ({ title, className }: THeadItemType) => {
  return (
    <th className={cn(className, "text-white")}>
      <div className="flex">
        <p
          className={cn(
            "flex gap-4 items-center h-10 p-2 px-3 flex-1 text-sm",
            className
          )}
        >
          <span>{title}</span>
        </p>
      </div>
    </th>
  );
};

const sortBodyFromTHead = (
  thead: THeadItemTypeSubjectManagement[],
  keys: string[]
) => {
  const indexMap: Record<string, number> = thead.reduce(
    (acc, item: any, index) => {
      acc[item.name] = index;
      return acc;
    },
    {} as Record<string, number>
  );
  keys.sort((a, b) => indexMap[a] - indexMap[b]);
};

export default function MainTable({
  tHeads = [],
  tBody = [],
  tableRef,
}: {
  tHeads: THeadItemTypeSubjectManagement[];
  tBody: TableRowSubjectManagement[];
  tableRef?: React.RefObject<HTMLTableElement>;
}) {
  const allKeys = Array.from(
    new Set(tBody.flatMap((item) => Object.keys(item)))
  );

  sortBodyFromTHead(tHeads, allKeys);

  return (
    <div className="border rounded-[20px] overflow-auto">
      <table className="w-full" ref={tableRef}>
        <thead className="bg-primary">
          <tr className="">
            {tHeads.map((item, index) => (
              <THeadItem
                key={index}
                className={item.className}
                title={item.title}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {tBody.map((item, index) => (
            <tr className="[&:not(:last-child)]:border-b" key={index}>
              {allKeys.map((key) => (
                <td
                  className="[&:not(:first-child)]:border-l p-3 relative"
                  key={key}
                >
                  {item[key] !== undefined ? item[key] : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
