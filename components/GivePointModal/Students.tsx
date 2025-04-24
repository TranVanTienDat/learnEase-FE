import { StudentType } from "@/apiRequest/students";
import StudentItem from "@/components/GivePointModal/StudentItem";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Students({
  students = [],
  activeStudents = [],
  onChange,
}: {
  students: StudentType[];
  activeStudents: StudentType[] | [];
  onChange: (student: StudentType) => void;
}) {
  return (
    <div className="-mr-3">
      <ScrollArea className="h-[306px] w-full pr-3">
        <div className="space-y-1">
          {students.map((student) => {
            return (
              <StudentItem
                key={student.id}
                student={student}
                onClick={() => onChange(student)}
                isActive={activeStudents.some((item) => item.id === student.id)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
