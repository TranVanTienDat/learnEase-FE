import BoxInput from "./BoxInput";
import MessageList from "./MessageList";

export default function PaneMsg() {
  return (
    <div className="h-full relative bg-[linear-gradient(180deg,rgba(249,250,251,0.9)_0%,rgba(242,244,247,0.9)_90.48%)]">
      <MessageList />
      <BoxInput />
    </div>
  );
}
