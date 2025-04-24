import { useEffect, useRef } from "react";
import Slot from "@/utils/Slot";
import SoundEffects from "@/utils/SoundEffects";
import { MAX_REEL_ITEMS } from "@/constants/namePicker";

interface UseSlotProps {
  names: string[];
  shouldRemoveWinner: boolean;
  setIsSpinning: (value: boolean) => void;
  setIsEndSpinning: (value: boolean) => void;
  soundEffects: React.RefObject<SoundEffects>;
  confettiAnimation: () => void;
}

const useSlot = ({
  names,
  shouldRemoveWinner,
  setIsSpinning,
  setIsEndSpinning,
  soundEffects,
  confettiAnimation,
}: UseSlotProps) => {
  const slotRef = useRef<Slot | null>(null);

  const handleSpinStart = () => {
    setIsSpinning(false);
    setIsEndSpinning(true);
    soundEffects.current?.spin((MAX_REEL_ITEMS - 1) / 10);
  };

  const handleSpinEnd = async () => {
    setIsSpinning(true);
    setIsEndSpinning(false);
    confettiAnimation();
    await soundEffects.current?.win();
  };

  useEffect(() => {
    slotRef.current = new Slot({
      reelContainerSelector: "#reel",
      maxReelItems: MAX_REEL_ITEMS,
      onSpinStart: handleSpinStart,
      onSpinEnd: handleSpinEnd,
    });

    if (slotRef.current) {
      slotRef.current.names = names;
      slotRef.current.shouldRemoveWinnerFromNameList = shouldRemoveWinner;
    }
  }, []);

  return { slotRef, handleSpinStart, handleSpinEnd };
};

export default useSlot;
