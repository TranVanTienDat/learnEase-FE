"use client";
import Whiteboard from "@/app/workspace/white-board/_components/WhiteBoard";

export default function WhiteBoard() {
  return (
    <div className="container">
      <div className="p-5 border-primary border-2 rounded-[20px] mb-10">
        <Whiteboard />
      </div>
    </div>
  );
}
