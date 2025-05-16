"use client";
import { StudentType } from "@/apiRequest/students";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import GroupButton from "@/app/workspace/class/[id]/group/_components/GroupButton";
import GroupCollection from "@/app/workspace/class/[id]/group/_components/GroupCollection";
import BackTitle from "@/components/BackTitle";
import { sortGroups } from "@/utils/group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type GroupsType = {
  name: string;
  listStudent: StudentType[];
};

const getGroupName = (group: string | null) => {
  return !group ? "Chưa có tổ/nhóm" : `Nhóm ${group}`;
};

export default function ListGroup({
  students: defaultStudents,
  classId,
}: {
  students: StudentType[];
  classId: string;
}) {
  const t = useTranslations("group");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [groups, setGroups] = useState<GroupsType[] | []>([]);

  useEffect(() => {
    const updatedGroupList = defaultStudents.reduce<GroupsType[]>(
      (acc, student) => {
        const groupName = getGroupName(student.group);
        const group = acc.find((g) => g.name === groupName);

        if (group) {
          group.listStudent.push(student);
        } else {
          acc.push({ name: groupName, listStudent: [student] });
        }

        return acc;
      },
      []
    );
    setGroups(sortGroups(updatedGroupList));
  }, []);

  return (
    <div className="container pb-10">
      <BackTitle url={`/workspace/class/${classId}`}>
        <h1 className="capitalize text-[32px] font-bold">Nhóm</h1>
      </BackTitle>
      {groups.length > 1 || groups[0]?.name !== "Chưa có tổ/nhóm" ? (
        <>
          <div>
            <GroupCollection tableData={groups} />
          </div>
          <GroupButton />
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-10">
          <Image src="/images/empty-data.svg" width={200} height={200} alt="" />
          <div className="text-[16px] text-[#0F1834] text-center my-[20px]">
            <p>{t("noGroupsInClass")}</p>
            <p>{t("addGroupsMessage")}</p>
          </div>

          <ButtonAction
            name={t("goToStudentList")}
            action={() => {
              router.push(`/workspace/class/${classId}/students`);
            }}
          />
        </div>
      )}
    </div>
  );
}
