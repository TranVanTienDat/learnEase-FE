"use client";
import dynamic from "next/dynamic";
const Chatbot = dynamic(() => import("./_component/Chatbot"), { ssr: false });
export default function Page() {
  return (
    <div className="p-2 bg-[#e9ebf0] h-screen">
      <Chatbot />
    </div>
  );
}
