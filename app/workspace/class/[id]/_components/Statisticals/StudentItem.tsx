import clsx from "clsx";
import { useTranslations } from "next-intl";
import { memo } from "react";

export type StatisticalType = {
  id?: number | string;
  stt: string | number;
  nickname: string;
  classId?: string;
  code: string;
  Element: React.ReactNode;
};

const StudentItem = ({ stt, nickname, code, Element }: StatisticalType) => {
  const t = useTranslations("attendance");
  const tCommon = useTranslations("common");
  const className = "flex items-center justify-center";

  return (
    <tr className="[&:not(:last-child)]:border-b">
      <td>
        <div className={clsx(className)}>{stt}</div>
      </td>
      <td className="border-l p-3 pr-6 relative">
        <div className={clsx(className)}>
          <div className="w-full">
            <p className="font-bold">{nickname}</p>
            <p className="text-[#5e6477]">{`${tCommon(
              "codeLabel"
            )} ${code}`}</p>
          </div>
        </div>
      </td>
      {Element}
    </tr>
  );
};

export default memo(StudentItem);
