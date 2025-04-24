import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { memo } from "react";

export const ContentTab = ({
  datePicker,
  uiRender,
  title,
}: {
  datePicker?: any;
  uiRender: any;
  title: string;
}) => {
  return (
    <TabsContent value={title}>
      <div className="relative border-t-[1px] mt-[20px] pt-[20px]">
        {datePicker && (
          <div className="absolute right-0 top-[-65px]">{datePicker}</div>
        )}
        <div>{uiRender}</div>
      </div>
    </TabsContent>
  );
};

const links = [
  {
    title: "Điểm hạnh kiểm",
    key: "conductPoint",
  },
  {
    title: "Điểm học tập",
    key: "studyPoint",
  },
];

type TabNavProps = {
  listNav?: { title: string; key: string }[];
  className?: string;
};

const TabNav = ({ listNav = links, className }: TabNavProps) => {
  const tCommon = useTranslations("common");
  return (
    <TabsList className="bg-transparent ">
      {listNav.map((item, index) => (
        <TabsTrigger
          key={index}
          value={item.key}
          className={cn(
            "cursor-pointer relative font-medium py-0 px-1 mr-2 text-center bg-transparent text-[16px] text-[#a39e9e] rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#0F1834] data-[state=active]:border-b-[1.5px] data-[state=active]:shadow-none data-[state=active]:border-b-primary data-[state=active]:font-bold",
            className
          )}
        >
          {tCommon(item.key)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
export default memo(TabNav);
