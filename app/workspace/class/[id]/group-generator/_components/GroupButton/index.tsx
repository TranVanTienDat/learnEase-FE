import { StudentType } from "@/apiRequest/students";
import { Input } from "@/components/ui/input";
import {
  checkGroups,
  handleAppendStudents,
  updateCellTable,
} from "@/utils/groupGenerator";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import ButtonAction from "../../../_components/ButtonAction";

type CheckInputPropsType = {
  isImg: boolean;
  setIsImg: Dispatch<SetStateAction<boolean>>;
};

export const CheckInput = ({ isImg, setIsImg }: CheckInputPropsType) => {
  const tCommon = useTranslations("common");

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="inline-flex items-center">
        <label
          className="relative flex items-center rounded-full cursor-pointer"
          htmlFor="blue"
        >
          <input
            type="checkbox"
            checked={isImg}
            onChange={() => setIsImg((prev) => !prev)}
            className="peer relative h-[22px] w-[22px] cursor-pointer appearance-none rounded-md border-[2px] border-secondary transition-all  checked:border-primary checked:bg-primary  "
            id="blue"
          />
          <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
      </div>

      <label className="text-xl font-thin cursor-pointer" htmlFor="blue">
        {tCommon("hasImage")}
      </label>
    </div>
  );
};

type ButtonItemPropsType = {
  handleAction1: () => void;
  handleAction2: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  isRow?: boolean;
  isCol?: boolean;
  tableData: (StudentType | null)[][];
  students: StudentType[];
  title: string;
  quantity: number;
};

const ButtonItem = ({
  title,
  isRow,
  isCol,
  quantity,
  students,
  tableData,
  handleAction1,
  handleAction2,
  handleChange,
  handleBlur,
}: ButtonItemPropsType) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span className="text-xl font-thin">{title}</span>
      <div className="flex justify-center items-center rounded-[999999px] overflow-hidden bg-primary">
        <button
          className="p-[10px] bg-primary active:bg-secondary"
          style={isRow || isCol ? { backgroundColor: "#E0E0E0" } : {}}
          disabled={isRow || isCol}
          onClick={handleAction1}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-xl text-white "
            style={isRow || isCol ? { color: "#A6A6A6" } : {}}
          />
        </button>
        <div className=" text-xl   mx-[2px] max-w-[60px] text-center">
          <Input
            type="number"
            value={quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-number-transparent text-center   text-base font-semibold"
          />
        </div>
        <button
          className="p-[10px] bg-primary active:bg-secondary"
          onClick={handleAction2}
          disabled={!checkGroups(students, tableData)}
          style={
            !checkGroups(students, tableData)
              ? { backgroundColor: "#E0E0E0" }
              : {}
          }
        >
          <FontAwesomeIcon icon={faChevronUp} className="text-xl  text-white" />
        </button>
      </div>
    </div>
  );
};

type EnableTableType = {
  isRow: boolean;
  isCol: boolean;
};

type StatusType = {
  isStatusRandom: boolean;
  isListGroup: boolean;
};

type GroupButtonPropsType = {
  isImg: boolean;
  students: StudentType[];
  tableData: (StudentType | null)[][];
  enableTable: EnableTableType;
  setIsImg: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<StatusType>>;
  setTableData: Dispatch<SetStateAction<(StudentType | null)[][]>>;
  setEnableTable: Dispatch<SetStateAction<EnableTableType>>;
};

export default function GroupButton({
  isImg,
  students,
  tableData,
  enableTable,
  setStatus,
  setIsImg,
  setTableData,
  setEnableTable,
}: GroupButtonPropsType) {
  const t = useTranslations("class");
  const refCheckRandom = useRef(false);
  const [quantity, setQuantity] = useState({ row: 2, col: 2 });

  useEffect(() => {
    let isRow = true;
    let isCol = true;
    if (tableData.length > 1) isRow = false;
    if (tableData[0].length > 1) isCol = false;

    setEnableTable({ isRow, isCol });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const handleRandomTeam = async () => {
    if (!checkGroups(students, tableData) || refCheckRandom.current) return;
    const updatedTable = updateCellTable(tableData);
    setTableData(updatedTable);
    setStatus({ isStatusRandom: true, isListGroup: false });
    await handleAppendStudents(
      students,
      updatedTable,
      setTableData,
      refCheckRandom
    );
    setStatus((prev) => ({ ...prev, isListGroup: true }));
  };

  const updateTable = (field: "row" | "col", action: "add" | "remove") => {
    setStatus({ isStatusRandom: false, isListGroup: false });

    setTableData(updateCellTable(tableData, field, action));

    setQuantity((prev) => ({
      ...prev,
      [field]: prev[field] + (action === "add" ? 1 : -1),
    }));
  };

  const handleAddTable = (field: "row" | "col") => {
    updateTable(field, "add");
  };

  const handleMoveTable = (field: "row" | "col") => {
    updateTable(field, "remove");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "row" | "col"
  ) => {
    const newValue = parseInt(e.target.value);
    if (field === "row") setQuantity((prev) => ({ ...prev, row: newValue }));
    else if (field === "col")
      setQuantity((prev) => ({ ...prev, col: newValue }));
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement>,
    field: "row" | "col"
  ) => {
    const inputValue = e.target.value;
    const newValue = parseInt(inputValue, 10);
    const isInvalidValue = inputValue === "" || isNaN(newValue) || newValue < 1;
    const validValue = isInvalidValue ? 1 : newValue;

    setQuantity((prev) => ({
      ...prev,
      [field]: validValue,
    }));

    setTableData(
      updateCellTable(
        tableData,
        field,
        "remove",
        field === "row" ? validValue : undefined,
        field === "col" ? validValue : undefined
      )
    );
    setStatus((prev) => ({ ...prev, isListGroup: false }));
  };

  return (
    <div className="flex justify-center items-center gap-6  py-[30px]">
      <ButtonItem
        title={`${t("numberOfGroups")}:`}
        quantity={quantity.row}
        handleAction1={() => handleMoveTable("row")}
        handleAction2={() => handleAddTable("row")}
        handleChange={(e) => handleChange(e, "row")}
        handleBlur={(e) => handleBlur(e, "row")}
        isRow={enableTable.isRow}
        students={students}
        tableData={tableData}
      />

      <ButtonItem
        title={`${t("numberOfStudents")}:`}
        quantity={quantity.col}
        handleAction1={() => handleMoveTable("col")}
        handleAction2={() => handleAddTable("col")}
        isCol={enableTable.isCol}
        handleChange={(e) => handleChange(e, "col")}
        handleBlur={(e) => handleBlur(e, "col")}
        students={students}
        tableData={tableData}
      />
      <CheckInput isImg={isImg} setIsImg={setIsImg} />
      <div className="flex justify-center items-center gap-2">
        <ButtonAction
          action={() => handleRandomTeam()}
          name={`${t("grouping")}`}
          className="active:bg-tertiary"
        />
      </div>
    </div>
  );
}
