import { RegistrationStudents } from "@/apiRequest/students";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Body from "./Body";

export default function ListStudent({
  data,
}: {
  data: RegistrationStudents[] | undefined;
}) {
  const tCommon = useTranslations("common");
  const headSchedule = [
    {
      name: "order",
      className: "text-center w-[60px]",
    },
    {
      name: "fullName",
    },
    {
      name: "parentsName",
    },
    {
      name: "parentsPhone",
    },

    { name: "class" },
    { name: "action" },
  ];

  return (
    <div>
      <div className="table-wrapper overflow-y-auto max-h-[500px] border rounded-t-xl md:rounded-xl">
        <table className="relative w-full rounded-t-xl min-w-[800px]">
          <thead className="bg-primary text-white sticky top-0">
            <tr>
              {headSchedule.map((item) => (
                <th
                  className={clsx("p-3 py-2 text-left", item.className)}
                  key={item.name}
                >
                  {tCommon(item.name)}
                </th>
              ))}
            </tr>
          </thead>
          <Body students={data} />
        </table>
      </div>
    </div>
  );
}
