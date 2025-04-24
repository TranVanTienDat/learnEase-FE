"use client";
import { useEffect, useState } from "react";

import { StudentType } from "@/apiRequest/students";
import { LoadingSnipper } from "@/components/LoadingSnipper";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import Alert from "../Alert";
import InitWheel from "../InitWheel";
import { useTranslations } from "next-intl";

type selectedStudentType = {
  isOpen: boolean;
  name: string;
};

const DynamicClientComponent = dynamic(() => Promise.resolve(InitWheel), {
  ssr: false,
});

type DataType = {
  id: number;
  name: string;
};

export default function LuckyWheel({ students }: { students: StudentType[] }) {
  const t = useTranslations("luckyWheel");
  const [data, setData] = useState<DataType[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<selectedStudentType>({
    isOpen: false,
    name: "",
  });

  useEffect(() => {
    setData(
      students.map((item) => ({
        id: item.id,
        name: item.nickname || item.fullName,
      }))
    );
  }, [students]);

  const onFinished = (name: string) => {
    setSelectedStudent({ isOpen: true, name });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="py-10">
      <Alert
        setSelectedStudent={setSelectedStudent}
        selectedStudent={selectedStudent}
      />
      <div className="flex justify-center items-center">
        {data.length > 0 ? (
          <DynamicClientComponent
            segments={data}
            onFinished={(winner) => onFinished(winner)}
            buttonText={t("spin")}
            isOnlyOnce={false}
            size={290}
            upDuration={100}
            downDuration={200}
          />
        ) : (
          <LoadingSnipper />
        )}
      </div>
    </div>
  );
}
