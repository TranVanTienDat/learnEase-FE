import PaneMsg from "./PaneMsg";
import Header from "./Header";

export default function Chatbot() {
  return (
    <div className="rounded-[16px] overflow-hidden  h-full bg-white">
      <Header />
      <PaneMsg />
    </div>
  );
}
