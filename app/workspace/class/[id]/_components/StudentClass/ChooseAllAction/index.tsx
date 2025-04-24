"use client";
import React, { useEffect } from "react";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import useGivePointStore from "@/stores/give-point";
import { StudentType } from "@/apiRequest/students";
import { useTranslations } from "next-intl";

export default function ChooseAllAction({
  students,
  deselect,
}: {
  students: StudentType[];
  deselect: () => void;
}) {
  const t = useTranslations("class");
  const { toggle, updateStudent } = useGivePointStore();

  useEffect(() => {
    updateStudent(students);
  }, []);

  return (
    <div className="flex justify-center sm:justify-end flex-wrap gap-2">
      <ButtonAction
        action={() => {
          console.log("abc");
        }}
        name={`${t("select")}: ${students.length} ${t("studentAbbr")}`}
        className="bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:border-transparent"
      />
      <ButtonAction
        action={toggle}
        name={t("givePointStudent")}
        className="bg-secondary"
      />
      <ButtonAction
        action={() => deselect()}
        name={t("deselect")}
        className="bg-secondary"
      />
    </div>
  );
}
