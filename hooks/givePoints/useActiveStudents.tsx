"use client";
import { StudentType } from "@/apiRequest/students";
import useGivePointStore from "@/stores/give-point";
import { useEffect, useState } from "react";

export default function useActiveStudents() {
  const { student } = useGivePointStore();
  const [activeStudents, setActiveStudents] = useState<StudentType[] | []>([]);
  const handleChangeActiveStudents = (student: StudentType) => {
    if (activeStudents?.some((item) => item.id === student.id)) {
      setActiveStudents(
        activeStudents?.filter((item) => item.id !== student.id)
      );
    } else {
      setActiveStudents([...(activeStudents || []), student]);
    }
  };
  useEffect(() => {
    if (Array.isArray(student)) {
      setActiveStudents(student.filter((item) => item.isCheckIn));
    } else if (student) {
      setActiveStudents([student]);
    }
  }, [student]);
  return {
    students: activeStudents,
    onReset: () => setActiveStudents([]),
    onSelectAll: (students: StudentType[]) => setActiveStudents(students),
    onChange: handleChangeActiveStudents,
  };
}
