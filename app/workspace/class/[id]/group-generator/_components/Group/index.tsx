import { StudentType } from "@/apiRequest/students";
import { convertImageUrl } from "@/utils";

import useGivePointStore from "@/stores/give-point";
import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import { useTranslations } from "next-intl";

type RowGroupType = {
  row: (StudentType | null)[];
  width: number;
  isImg: boolean;
  isStatusRandom: boolean;
  indexRow: number;
  status: {
    isStatusRandom: boolean;
    isListGroup: boolean;
  };
};

const RowGroup = ({
  row,
  width,
  indexRow,
  isImg,
  status,
  isStatusRandom,
}: RowGroupType) => {
  const t = useTranslations("class");
  const tCommon = useTranslations("common");
  const tGroup = useTranslations("group");
  const { toggle, updateStudent } = useGivePointStore();
  const handleClick = (students: (StudentType | null)[]) => {
    const validStudents = students.filter(
      (student): student is StudentType => student !== null
    );
    updateStudent(validStudents);
    toggle();
  };

  return (
    <div className="p-[5px] min-w-[20%]" style={{ width: `${width}%` }}>
      <div className="p-[10px] border-[3px] border-secondary rounded-[30px] text-left hover:border-tertiary">
        <h3 className="text-2xl font-semibold relative mb-6 text-primary">
          {`${tCommon("group")} ${indexRow + 1}`}
          <span className="absolute left-0 bottom-[-10px] w-[40px] h-[5px] bg-secondary rounded-[999999px] "></span>
        </h3>
        <div className="">
          {row.map((col, indexCol) => {
            return (
              <ColGroup
                key={indexCol}
                col={col}
                isImg={isImg}
                isStatusRandom={isStatusRandom}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-2 mb-6">
        {status.isListGroup && (
          <ButtonAction
            name={`${tGroup("givePointGroup")} ${indexRow + 1}`}
            action={() => handleClick(row)}
          />
        )}
      </div>
    </div>
  );
};

type ColGroupPropsType = {
  col: StudentType | null;
  isImg: boolean;
  isStatusRandom: boolean;
};

const ColGroup = ({ isImg, isStatusRandom, col }: ColGroupPropsType) => {
  return (
    <div className="flex justify-center items-center mb-3">
      {isImg && (
        <div className="overflow-hidden max-w-[65px] min-w-[20px]">
          <img
            src={
              isStatusRandom
                ? col
                  ? convertImageUrl(col.avatar?.url)
                  : "/images/laughing.gif"
                : "/images/logo.svg"
            }
            className="w-[100%] hover:scale-125 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 text-left">
        <h4 className="text-[16px] font-bold p-[10px] pl-[5px] text-primary">
          {col ? col.nickname || col.fullName : "?????"}
        </h4>
      </div>
    </div>
  );
};

type GroupPropsType = {
  tableData: (StudentType | null)[][];
  isImg: boolean;
  status: {
    isStatusRandom: boolean;
    isListGroup: boolean;
  };
  isStatusRandom: boolean;
};

export default function Group({
  tableData,
  isImg,
  isStatusRandom,
  status,
}: GroupPropsType) {
  return (
    <div className="flex justify-center items-start flex-wrap">
      {tableData.map((row, indexRow) => {
        const width = 100 / tableData.length;
        return (
          <RowGroup
            key={indexRow}
            row={row}
            width={width}
            isImg={isImg}
            isStatusRandom={isStatusRandom}
            indexRow={indexRow}
            status={status}
          />
        );
      })}
    </div>
  );
}
