"use client";
import { StudentType } from "@/apiRequest/students";
import useGetStudentGivePoint from "@/queryHooks/class/useGetStudentGivePoint";
import { useEffect, useState } from "react";

export default function useStudents(activeClassId: string) {
  const { data } = useGetStudentGivePoint(activeClassId);
  const studentAttendance = data?.students?.filter((stu) => stu?.isCheckIn);
  const [students, setStudents] = useState<StudentType[]>();
  useEffect(() => {
    setStudents(studentAttendance as StudentType[]);
  }, [data]);
  return {
    students: students || [],
    onChange: (studs: StudentType[]) => setStudents(studs),
  };
}
