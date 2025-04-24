"use client";
import { useState, useRef, useEffect } from "react";
import SoundEffects from "@/utils/SoundEffects";
import LuckyDraw from "./LuckyDraw";
import ModalSettings from "./ModalSettings";
import FunctionButtons from "./FunctionButtons";
import useConfetti from "@/hooks/useConfetti";
import useSlot from "@/hooks/useSlot";
import { StudentType } from "@/apiRequest/students";

export const NamePicker = ({ students }: { students: StudentType[] }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [names, setNames] = useState<string[]>(
    students.map((student) => student.nickname || student.fullName)
  );
  const [shouldRemoveWinner, setShouldRemoveWinner] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isEndSpinning, setIsEndSpinning] = useState(false);
  const [settingsNameList, setSettingsNameList] = useState<string>(
    students.map((student) => student.nickname || student.fullName).join("\n")
  );
  const soundEffects = useRef<SoundEffects>(new SoundEffects());
  const { confettiCanvasRef, confettiAnimation, stopWinningAnimation } =
    useConfetti();
  const { slotRef } = useSlot({
    names,
    confettiAnimation,
    shouldRemoveWinner,
    setIsEndSpinning,
    setIsSpinning,
    soundEffects,
  });

  const handleOpenSettings = () => {
    if (slotRef.current) {
      setSettingsNameList(
        slotRef.current.names.length ? slotRef.current.names.join("\n") : ""
      );
      setShouldRemoveWinner(slotRef.current.shouldRemoveWinnerFromNameList);
    } else {
      console.error("Slot instance is not initialized");
    }

    if (soundEffects.current) {
      setEnableSound(!soundEffects.current.mute);
    } else {
      console.error("SoundEffects instance is not initialized");
    }

    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    if (slotRef.current) {
      slotRef.current.names = settingsNameList
        .split("\n")
        .filter((name) => name.trim() !== "");
      slotRef.current.shouldRemoveWinnerFromNameList = shouldRemoveWinner;
      setNames(slotRef.current.names);
    } else {
      console.error("Slot instance is not initialized");
    }

    if (soundEffects.current) {
      soundEffects.current.mute = !enableSound;
    } else {
      console.error("SoundEffects instance is not initialized");
    }

    setShowSettings(false);
  };

  const handleDraw = () => {
    if (names.length === 0) {
      setShowSettings(true);
      return;
    }
    if (slotRef.current) {
      stopWinningAnimation();
      slotRef.current.spin();
    }
  };

  return (
    <div className="text-white flex flex-col min-h-full h-screen overflow-hidden items-center justify-center">
      <div className="flex flex-col items-center justify-center py-12 w-full flex-1 min-h-min bg-white">
        <canvas
          id="confetti-canvas"
          className="h-full left-0 pointer-events-none fixed top-0 w-full z-[1]"
          ref={confettiCanvasRef}
        ></canvas>
        <LuckyDraw
          isSpinning={isSpinning}
          isEndSpinning={isEndSpinning}
          handleDraw={handleDraw}
        />
        <FunctionButtons disable={isEndSpinning} onClick={handleOpenSettings} />
        <ModalSettings
          showSettings={showSettings}
          settingsNameList={settingsNameList}
          enableSound={enableSound}
          shouldRemoveWinner={shouldRemoveWinner}
          setShowSettings={(value) => setShowSettings(value)}
          setEnableSound={(checked) => setEnableSound(checked)}
          setSettingsNameList={(value) => setSettingsNameList(value)}
          setShouldRemoveWinner={(value) => setShouldRemoveWinner(value)}
          handleSaveSettings={handleSaveSettings}
        />
      </div>
    </div>
  );
};

export default NamePicker;
