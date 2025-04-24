import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { StudentItemType } from "@/types/DiagramClass";

type RowTableProps = {
  row: (StudentItemType | null)[];
  rowIndex: number;
  handleDrop: (rowIndex: number, colIndex: number) => void;
  handleDragStart: (
    item: StudentItemType,
    type: "segment" | "table" | "none",
    row: number,
    col: number
  ) => void;
};

const RowTable = ({
  row,
  rowIndex,
  handleDrop,
  handleDragStart,
}: RowTableProps) => {
  return (
    <TableRow>
      {row.map((col, colIndex) => (
        <ColTable
          key={colIndex}
          col={col}
          rowIndex={rowIndex}
          colIndex={colIndex}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
        />
      ))}
    </TableRow>
  );
};

type ColTablePropsType = {
  col: { id: number; name: string | null } | null;
  rowIndex: number;
  colIndex: number;
  handleDragStart: any;
  handleDrop: (row: number, col: number) => void;
};

const ColTable = ({
  col,
  rowIndex,
  colIndex,
  handleDragStart,
  handleDrop,
}: ColTablePropsType) => {
  return (
    <TableCell
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(rowIndex, colIndex)}
      className="bg-[#0571444d] border-[1px] font-medium  border-slate-400 p-0 w-[100px] h-[50px]"
    >
      {col && (
        <div
          draggable
          onDragStart={() => handleDragStart(col, "table", rowIndex, colIndex)}
          className="chon text-base border-2 border-secondary rounded-[10px] w-[100%] h-[100%] flex justify-center items-center cursor-move hover:bg-primary hover:text-white"
        >
          {col.name}
        </div>
      )}
    </TableCell>
  );
};

type StudentTablePropsType = {
  tableData: (StudentItemType | null)[][];
  handleDrop: (rowIndex: number, colIndex: number) => void;
  handleDragStart: (
    item: StudentItemType,
    type: "segment" | "table" | "none",
    row: number,
    col: number
  ) => void;
};

export default function StudentTable({
  tableData,
  handleDrop,
  handleDragStart,
}: StudentTablePropsType) {
  return (
    <div className="py-4">
      <Table>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <RowTable
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
