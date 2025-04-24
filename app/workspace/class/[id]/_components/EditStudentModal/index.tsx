import React from "react";
import { StudentType } from "@/apiRequest/students";
import EditStudentModalForm from "@/app/workspace/class/[id]/_components/EditStudentModalForm";
import { useTranslations } from "next-intl";

export default function EditStudentModal({
  toggle,
  modal: Modal,
  initValue,
  onReFetchList,
  handleRemoveStudent,
  enableRemove = false,
  isPermission,
}: {
  toggle: () => void;
  modal: any;
  initValue: StudentType;
  onReFetchList: (student: StudentType) => void;
  handleRemoveStudent?: (id: string) => void;
  enableRemove?: boolean;
  isPermission: boolean;
}) {
  const tCommon = useTranslations("common");
  return (
    <Modal
      title={tCommon("editStudent")}
      classNameContent="sm:max-w-[654px]"
      isModal={false}
    >
      <EditStudentModalForm
        initValue={initValue}
        onSave={onReFetchList}
        toggle={toggle}
        handleRemoveStudent={handleRemoveStudent}
        isPermission={isPermission}
        enableRemove={enableRemove}
      />
    </Modal>
  );
}
