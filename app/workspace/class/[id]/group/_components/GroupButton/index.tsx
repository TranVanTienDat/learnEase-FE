import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import { handleRandom, handleRemoveAll, randomGroup } from "@/utils/group";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type GroupButtonType = {
  isImg: boolean;
  lengthGroup: number;
  setIsImg: Dispatch<SetStateAction<boolean>>;
};

export default function GroupButton({
  isImg,
  setIsImg,
  lengthGroup,
}: GroupButtonType) {
  const t = useTranslations("group");

  const handleRandomGroup = async () => {
    handleRemoveAll();
    await randomGroup();
  };

  const handleSelectStudentFromEachGroup = () => {
    handleRemoveAll();
    const arrIdGroup = Array.from({ length: 6 }, (_, index) => index);
    for (const groupId of arrIdGroup) {
      handleRandom(groupId);
    }
  };

  return (
    <div className="flex justify-center gap-[11px]">
      <div className="flex items-center space-x-2">
        <CheckInput isImg={isImg} setIsImg={setIsImg} />
      </div>
      <ButtonAction
        className="py-0"
        name={t("selectOneStudentPerGroup")}
        action={handleSelectStudentFromEachGroup}
      />
      <ButtonAction
        className="py-0"
        name={t("selectOneGroup")}
        action={handleRandomGroup}
      />

      <ButtonAction
        className="py-0"
        name={t("refresh")}
        action={handleRemoveAll}
      />
    </div>
  );
}

type CheckInputPropsType = {
  isImg: boolean;
  setIsImg: Dispatch<SetStateAction<boolean>>;
};
const CheckInput = ({ isImg, setIsImg }: CheckInputPropsType) => {
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
