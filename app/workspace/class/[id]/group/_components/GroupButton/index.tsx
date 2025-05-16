import ButtonAction from "@/app/workspace/class/[id]/_components/ButtonAction";
import { handleRandom, handleRemoveAll, randomGroup } from "@/utils/group";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type GroupButtonType = {
  isImg: boolean;
  lengthGroup: number;
  setIsImg: Dispatch<SetStateAction<boolean>>;
};

export default function GroupButton() {
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
      <div className="flex items-center space-x-2"></div>
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
