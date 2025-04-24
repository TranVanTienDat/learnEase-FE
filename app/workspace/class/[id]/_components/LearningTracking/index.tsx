"use client";
import React, { useState } from "react";
import AvatarStudent from "@/app/workspace/class/[id]/_components/LearningTracking/AvatarStudent";
import ListComment from "@/app/workspace/class/[id]/_components/LearningTracking/ListComment";
import { TrackingStudentType } from "@/types/learning-tracking";
import Link from "next/link";
import PhoneNumberInput from "@/app/workspace/class/[id]/_components/LearningTracking/PhoneNumberInput";
import { useTranslations } from "next-intl";

export default function LearningTracking({
  students,
  searchDate,
}: {
  students: TrackingStudentType;
  searchDate: string;
}) {
  const t = useTranslations("learningTracking");
  const tCommon = useTranslations("common");
  const { student } = students;
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isPermission, setIsPermission] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(value)) {
      setError(tCommon("invalidPhone"));
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!phone) {
      setError(t("enterPhone"));
      return;
    }
    if (!error) {
      if (student.parentPhone && phone === student.parentPhone) {
        setIsPermission(true);
      } else {
        setIsPermission(false);
        setError(t("incorrectPhone"));
      }
    }
  };

  return (
    <>
      <div className="pt-[80px] lg:pt-[118px] container">
        <ul className="flex py-5">
          <li className="hover:underline mr-2 cursor-pointer">
            <Link href={"/"}>{tCommon("home")}</Link>
          </li>
          /
          <li className="hover:underline mx-2 cursor-pointer capitalize">
            <Link href={`/workspace/class/${student?.class?.id}`}>
              {tCommon("classShort")} {student.class.name}
            </Link>
          </li>
          /
          <li className="hover:underline mx-2 text-primary font-semibold cursor-pointer capitalize">
            <Link href={"/"}>{student.fullName}</Link>
          </li>
        </ul>
      </div>
      <div className="container bg-[#F8F8F8] rounded-[20px] py-5 px-[35px] mb-5 min-h-[400px]">
        <div className="flex justify-center mb-5">
          <AvatarStudent
            nameStudent={student.fullName}
            point={student.point}
            url={student.avatar.url}
            isPermission={isPermission}
          />
        </div>
        {student?.parentPhone ? (
          <>
            {isPermission ? (
              <ListComment
                idClass={student.class.id}
                dailyRecords={student.dailyRecords[0] ?? []}
                phoneOrCode={student.code}
                searchDate={searchDate}
              />
            ) : (
              <PhoneNumberInput
                phone={phone}
                error={error}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
          </>
        ) : (
          <div className="min-h-[300px] flex justify-center items-center border-t border-t-[#E7E8EB] text-center">
            {t("noParentsPhone")}
            <br />
            {t("toViewComment")}
          </div>
        )}
      </div>
    </>
  );
}
