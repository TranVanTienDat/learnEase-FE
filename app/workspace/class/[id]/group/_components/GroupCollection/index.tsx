"use client";
import { StudentType } from "@/apiRequest/students";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import useGivePointStore from "@/stores/give-point";
import { convertImageUrl } from "@/utils";
import { handleRandom, handleRemoveAll } from "@/utils/group";
import { useTranslations } from "next-intl";

type GroupsType = {
  name: string;
  listStudent: StudentType[];
};

type RowGroupType = {
  row: GroupsType;
  isImg: boolean;
  indexRow: number;
};

const convertNameTeam = (name: string, t: any, tCommon: any): string => {
  const teamName = name.replace(/^Nhóm\s*/, "").trim();
  if (teamName === "Chưa có tổ/nhóm") return t("noGroup");
  return `${tCommon("group")} ${teamName}`;
};

const RowGroup = ({ row, indexRow, isImg }: RowGroupType) => {
  const t = useTranslations("group");
  const tCommon = useTranslations("common");

  return (
    <div
      className="border-[1px] rounded-[12px] text-left hover:border-tertiary random-nhom"
      id={`nhom${indexRow}`}
    >
      <div className="p-[10px] pr-[4px]">
        <div className="flex justify-between items-start">
          <h3 className="text-[16px] font-bold relative mb-6 text-primary">
            {convertNameTeam(row.name, t, tCommon)}
            <span className="absolute left-0 bottom-[-12px] w-[55px] h-[4px] bg-secondary rounded-[999999px] "></span>
          </h3>
          <ButtonGivePoints indexRow={indexRow} listStudent={row.listStudent} />
        </div>
        <div
          className="h-[284px] table-wrapper overflow-y-auto pr-[2px]"
          id={`nhom-dshs${indexRow}`}
        >
          {row.listStudent.map((col, indexCol) => {
            return <ColGroup key={indexCol} isImg={isImg} col={col} />;
          })}
        </div>
      </div>
    </div>
  );
};

type ColGroupPropsType = {
  col: StudentType;
  isImg: boolean;
};

const ColGroup = ({ isImg, col }: ColGroupPropsType) => {
  return (
    <div className="flex justify-center items-center mb-[4px] random py-[6px] px-[8px]">
      {isImg && (
        <div className="overflow-hidden w-[50px]">
          <img
            src={convertImageUrl(col.avatar?.url)}
            className="w-[100%] hover:scale-125 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 text-left">
        <h4 className="text-[14px] font-medium py-[6px] px-[8px] pl-[8px] text-[#0F1834]">
          {col.nickname || col.fullName}
        </h4>
      </div>
    </div>
  );
};

type GroupCollectionType = {
  tableData: GroupsType[];
};

export default function GroupCollection({ tableData }: GroupCollectionType) {
  return (
    <div className="grid grid-cols-1 gap-[15px] mt-[20px] mb-[40px] sm:grid-cols-2 md:grid-cols-3 ">
      {tableData.map((row, indexRow) => {
        return (
          <RowGroup isImg={true} key={indexRow} row={row} indexRow={indexRow} />
        );
      })}
    </div>
  );
}

const ButtonGivePoints = ({
  indexRow,
  listStudent,
}: {
  indexRow: number;
  listStudent: StudentType[];
}) => {
  const t = useTranslations("group");
  const { toggle, updateStudent } = useGivePointStore();

  const getParentElement = (selector: string) =>
    document.querySelector(selector);

  const getRandomElements = (parent: Element | null) =>
    parent ? Array.from(parent.querySelectorAll(".random")) : [];

  const handleGivePoints = () => {
    const parentElement = getParentElement(`#nhom-dshs${indexRow}`);

    if (!parentElement) return;

    const elements = getRandomElements(parentElement);
    const chonElements = elements.filter((el) => el.classList.contains("chon"));

    let arrStudents: Element[] = chonElements;

    if (!chonElements.length) {
      arrStudents = elements;
    }

    const positions = arrStudents.map((chonElement) =>
      elements.indexOf(chonElement)
    );

    const listGivePointStudent = positions
      .filter((position) => position !== -1)
      .map((position) => listStudent[position]);

    if (!listGivePointStudent.length) return;

    updateStudent(listGivePointStudent);
    toggle();
  };

  return (
    <ButtonAction
      name={t("givePoints")}
      className="bg-white hover:bg-primary border text-[#0F1834] hover:text-white py-[4px] px-[8px] text-[14px] w-[90px] mr-[6px] border-primary"
      action={handleGivePoints}
    />
  );
};
