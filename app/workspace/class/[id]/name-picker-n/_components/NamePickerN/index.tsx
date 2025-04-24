"use client";
import { StudentType } from "@/apiRequest/students";
import ButtonAction from "@/app/workspace//class//[id]/_components/ButtonAction";
import { INITIAL_SLOTS } from "@/constants/namePickerN";
import useGivePointStore from "@/stores/give-point";
import { StudentClassType } from "@/types";
import { RandomStatus } from "@/types/namePickerN";
import { shuffleArray } from "@/utils/namePickerN";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import NavigationButtons from "./NavigationButtons";
import SlotControls from "./SlotControls";
import StudentList from "./StudentList";

export default function NamePickerN({ students, id }: StudentClassType) {
  const [listStudents, setListStudents] =
    useState<StudentType[]>(INITIAL_SLOTS);
  const [randomStatus, setRandomStatus] = useState<RandomStatus>("not-random");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toggle, updateStudent } = useGivePointStore();
  const t = useTranslations("callMultiple");
  const tCommon = useTranslations("common");

  const handleAddSlot = () => {
    if (listStudents.length < students.length) {
      setListStudents((prev: any) => {
        let newListStudents: StudentType[] = [];
        for (let i = 0; i <= prev.length; i++) {
          newListStudents.push({
            ...INITIAL_SLOTS[0],
            id: i,
            nickname: "???",
          });
        }
        return newListStudents;
      });
    }

    if (listStudents.length > students.length) {
      setListStudents([INITIAL_SLOTS[0]]);
    }
  };

  const handleSubtractSlot = () => {
    if (listStudents && listStudents.length > 1) {
      setListStudents((prev) => {
        let newListStudents: StudentType[] = [];
        for (let i = 0; i <= prev.length - 2; i++) {
          newListStudents.push({
            ...INITIAL_SLOTS[0],
            id: i,
            nickname: "???",
          });
        }
        return newListStudents;
      });
    }

    if (listStudents.length > students.length) {
      setListStudents([INITIAL_SLOTS[0]]);
    }
  };

  const handleTypeChangeSlot = (number: string) => {
    const newNumber = parseInt(number);

    setListStudents(() => {
      let newListStudents: StudentType[] = [];
      for (let i = 0; i < newNumber; i++) {
        newListStudents.push({
          ...INITIAL_SLOTS[0],
          id: i,
          nickname: "???",
        });
      }
      return newListStudents;
    });
  };

  const handleRandom = () => {
    audioRef.current?.pause();
    audioRef.current!.currentTime = 0;

    if (listStudents.length <= students.length) {
      setRandomStatus("randomming");
      audioRef.current?.play().catch(console.error);
      const totalIterations = 10;
      let currentIteration = 0;

      const generateRandomGroups = () => {
        const shuffledStudents = shuffleArray(students);
        const groups = [];
        for (let i = 0; i < listStudents.length; i++) {
          const randomStudent = shuffledStudents[i % shuffledStudents.length];
          groups.push(
            students.filter((student) => student.id === randomStudent.id)[0]
          );
        }
        return groups;
      };

      const animateRandom = () => {
        if (currentIteration < totalIterations) {
          const randomGroups = generateRandomGroups();
          setListStudents(randomGroups);
          currentIteration++;
          setTimeout(animateRandom, 400);
        } else {
          setRandomStatus("randomed");
        }
      };

      animateRandom();
    } else {
      window.alert(t("studentNotEnough"));
    }
  };

  const handleGivePoint = () => {
    toggle();
    updateStudent(listStudents);
  };

  useEffect(() => {
    audioRef.current = new Audio("/sounds/slot-machine.wav");
  }, []);

  return (
    <div className="py-24 px-4">
      <StudentList listStudents={listStudents} randomStatus={randomStatus} />
      {randomStatus === "randomed" && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <ButtonAction
            action={handleGivePoint}
            name={tCommon("addPoint")}
            className="text-base px-10 bg-secondary"
          />
        </div>
      )}
      <SlotControls
        listStudentsLength={String(listStudents.length)}
        maxStudentsLength={students.length}
        randomStatus={randomStatus}
        handleAddSlot={handleAddSlot}
        handleSubtractSlot={handleSubtractSlot}
        handleRandom={handleRandom}
        handleTypeChangeSlot={handleTypeChangeSlot}
      />
      <NavigationButtons idClass={id} />
    </div>
  );
}
