import { LoadingSnipper } from "@/components/LoadingSnipper";
import { StudentItemType } from "@/types/DiagramClass";

type StudentItemPropsType = {
  item: StudentItemType;
  handleDragStart: (
    item: StudentItemType,
    type: "segment" | "table" | "none",
    param1: number,
    param2: number
  ) => void;
};

const StudentItem = ({ item, handleDragStart }: StudentItemPropsType) => (
  <div className="text-[#444444] font-normal cursor-move">
    {item.name && (
      <div
        className="chon hover:bg-primary hover:text-white p-[4px] text-center"
        draggable
        onDragStart={() => handleDragStart(item, "segment", -1, -1)}
      >
        {item.name}
      </div>
    )}
  </div>
);

type ListStudentPropsType = {
  listStudent: StudentItemType[];
  handleDragStart: (
    item: StudentItemType,
    type: "segment" | "table" | "none",
    param1: number,
    param2: number
  ) => void;
};

export default function ListStudent({
  listStudent,
  handleDragStart,
}: ListStudentPropsType) {
  return (
    <div>
      {listStudent.length > 0 ? (
        <div className="grid gap-4  2xl:grid-cols-6    lg:grid-cols-5  max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 ">
          {listStudent.map((item) => {
            return (
              <StudentItem
                key={item.id}
                item={item}
                handleDragStart={handleDragStart}
              />
            );
          })}
        </div>
      ) : (
        <LoadingSnipper />
      )}
    </div>
  );
}
