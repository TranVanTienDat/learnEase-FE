import { useRef, useCallback } from "react";
import SoundEffects from "@/utils/SoundEffects";

export const useSoundEffects = (enableSound: boolean) => {
  const soundEffects = useRef<SoundEffects>(new SoundEffects());

  const playSoundEffects = useCallback(() => {
    if (enableSound) {
      soundEffects.current.spin(1);
    }
  }, [enableSound]);

  return { soundEffects, playSoundEffects };
};
