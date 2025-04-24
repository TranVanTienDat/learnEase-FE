import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { CONFETTI_COLORS } from "@/constants/namePicker";

export default function useConfetti() {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
  const confettiAnimationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (confettiCanvasRef.current) {
      confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }
    return () => {
      if (confettiAnimationIdRef.current) {
        window.cancelAnimationFrame(confettiAnimationIdRef.current);
      }
    };
  }, []);

  const confettiAnimation = () => {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.getElementsByTagName("body")[0].clientWidth;
    const confettiScale = Math.max(0.5, Math.min(1, windowWidth / 1100));

    if (confettiInstanceRef.current) {
      confettiInstanceRef.current({
        particleCount: 1,
        gravity: 0.8,
        spread: 90,
        origin: { y: 0.6 },
        colors: [
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        ],
        scalar: confettiScale,
      });
    }

    confettiAnimationIdRef.current =
      window.requestAnimationFrame(confettiAnimation);
  };

  const stopWinningAnimation = () => {
    if (confettiAnimationIdRef.current) {
      window.cancelAnimationFrame(confettiAnimationIdRef.current);
    }
  };
  return {
    confettiCanvasRef,
    confettiAnimation,
    stopWinningAnimation,
  };
}
