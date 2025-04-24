import { ActiveCommentType } from "@/types/attendance";
import { useState } from "react";

export default function useActiveStudentComment() {
  const [activeStudent, setActiveStudent] = useState<ActiveCommentType>({
    id: "",
    comment: "",
  });

  const handleActiveStudentComment = (data: ActiveCommentType) => {
    setActiveStudent(data);
  };

  return { activeStudent, handleActiveStudentComment };
}
