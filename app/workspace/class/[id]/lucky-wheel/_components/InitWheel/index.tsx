import { DataType, WheelComponentProps } from "@/types/wheelLuck";
import { useEffect, useRef, useState } from "react";
import { Quicksand } from "next/font/google";
const inter = Quicksand({ subsets: ["vietnamese"] });
const setLength = (segments: DataType[]) =>
  segments.length > 30 ? segments.length : 30;
export default function InitWheel({
  segments,
  segColors = ["#0571444d", "#05714466"],
  onFinished,
  primaryColor = "#026e41",
  buttonText = "Spin",
  isOnlyOnce = true,
  size = window.innerWidth,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = inter.style.fontFamily,
  fontSize = "20px",
  outlineWidth = 10,
}: WheelComponentProps) {
  const randomString = (length = 8) => {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };
  const canvasId = useRef(`canvas-${randomString()}`);
  const wheelId = useRef(`wheel-${randomString()}`);

  const dimension = (size + 20) * 2;
  let currentSegment = { id: 0, name: "" };
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = setLength(segments);
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let maxSpeed = Math.PI / setLength(segments);
  const upTime = setLength(segments) * upDuration;
  const downTime = setLength(segments) * downDuration;
  let spinStart = 0;

  const centerX = size + 20;
  const centerY = size + 20;
  const spinSound = new Audio("/sounds/wheel.mp3");
  const soundCelebration = new Audio("/sounds/celebration.mp3");
  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null = document.getElementById(
      canvasId.current
    ) as HTMLCanvasElement;

    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", `${dimension}`);
      canvas.setAttribute("height", `${dimension}`);
      canvas.setAttribute("id", canvasId.current);
      document.getElementById(wheelId.current)?.appendChild(canvas);
    }
    canvas?.addEventListener("click", spin, false);
    canvasContext = canvas?.getContext("2d");
  };

  const spin = () => {
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = (Math.PI / segments.length) * 2;
      timerHandle = window.setInterval(onTimerTick, timerDelay);
      spinSound.play();
      console.time("Spin Time");
    }
  };

  const onTimerTick = () => {
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;

    const totalDuration = upTime + downTime;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else if (duration < totalDuration) {
      progress = (duration - upTime) / downTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
    } else {
      progress = 1;
      angleDelta = 0;
      finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;

    if (finished) {
      setFinished(true);
      onFinished(currentSegment.name);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
      spinSound.pause();
      spinSound.currentTime = 0;
      soundCelebration.play();
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const obj = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = "#000";
    ctx.font = `bold ${fontSize} ${fontFamily}`;
    ctx.fillText(obj.name || "".substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };
  const drawWheel = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "20px " + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor;
    ctx.fill();
    ctx.font = "bold 20px " + fontFamily;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  const drawNeedle = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 1.5em " + fontFamily;
    currentSegment = segments[i];
    isStarted &&
      ctx.fillText(currentSegment.name, centerX + 10, centerY + size + 50);
  };

  const clear = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, dimension);
  };

  return (
    <div id={wheelId.current} className="flex justify-center items-center">
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
          width: "80%",
          height: "80%",
        }}
      />
    </div>
  );
}
