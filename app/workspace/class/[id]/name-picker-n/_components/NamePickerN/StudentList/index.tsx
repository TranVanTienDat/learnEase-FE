import { StudentType } from "@/apiRequest/students"
import { StudentListType } from "@/types/namePickerN"
import React from "react"
import { Student } from "../../../../_components/StudentCard"

export default function StudentList({
  listStudents,
  randomStatus,
}: StudentListType) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-4">
      {!!listStudents?.length &&
        listStudents?.map((student: StudentType) => (
          <Student
            key={student.id}
            student={student}
            randomStatus={randomStatus === "randomming"}
          />
        ))}
    </div>
  )
}
