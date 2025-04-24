"use client";
import TimerToolItem from "@/app/workspace/class/_components/TimeToolItem";
import { Button } from "@/components/ui/button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const bells = [
  {
    id: 1,
    color: "yellow",
    image: "/images/bell-1.gif",
    sound: "/sounds/bell-1.mp3",
  },
  {
    id: 2,
    color: "blue",
    image: "/images/bell-2.gif",
    sound: "/sounds/bell-2.mp3",
  },
  {
    id: 3,
    color: "red",
    image: "/images/bell-3.gif",
    sound: "/sounds/bell-3.mp3",
  },
  {
    id: 4,
    color: "orange",
    image: "/images/bell-6.gif",
    sound: "/sounds/bell-6.mp3",
  },
  {
    id: 5,
    color: "purple",
    image: "/images/bell-5.gif",
    sound: "/sounds/bell-5.mp3",
  },
  {
    id: 6,
    color: "green",
    image: "/images/bell-4.gif",
    sound: "/sounds/bell-4.mp3",
  },
];

const BellItem = ({
  color,
  onPlayBell,
}: {
  color: string;
  onPlayBell: () => void;
}) => {
  return (
    <button
      style={{ backgroundColor: color }}
      className={clsx(
        "w-10 h-10 rounded-full flex items-center justify-center"
      )}
      onClick={() => onPlayBell()}
    >
      <FontAwesomeIcon icon={faBell} />
    </button>
  );
};

const CountdownTimer = ({ isStopTimer }: { isStopTimer: boolean }) => {
  const tCommon = useTranslations("common");
  const t = useTranslations("class");
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const audioRef = useRef<null | HTMLMediaElement>(null);

  const handleStart = () => {
    const totalSeconds = minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
    setIsCounting(true);
  };

  const handleStop = () => {
    setIsCounting(false);
    setTimeLeft(0);
    audioRef?.current?.pause();
  };

  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCounting(false);
      if (isCounting) audioRef?.current?.play();
    }
  }, [isCounting, timeLeft]);

  const displayTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    if (isStopTimer) handleStop();
  }, [isStopTimer]);

  return (
    <>
      <div className="rounded-xl text-[90px] font-semibold leading-none text-center bg-tertiary text-white p-4">
        <p>{displayTime()}</p>
      </div>
      <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
        <TimerToolItem
          label={tCommon("minute")}
          number={1}
          onSetTimer={setMinutes}
        />
        <TimerToolItem
          label={tCommon("second")}
          number={0}
          onSetTimer={setSeconds}
        />
      </div>
      <div className="flex space-x-4 justify-center">
        <Button
          className="rounded-full text-white font-semibold"
          onClick={handleStart}
        >
          {tCommon("start")}
        </Button>
        <Button
          className="bg-secondary rounded-full font-semibold text-white"
          onClick={handleStop}
        >
          {t("end")}
        </Button>
        <audio ref={audioRef} src="/sounds/bell-1.mp3" preload="auto" />
      </div>
    </>
  );
};

interface Bell {
  index: number;
  image: string;
  sound: string;
}

export default function TimerTool() {
  const tCommon = useTranslations("common");
  const t = useTranslations("stopwatch");
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [bell, setBell] = useState<null | Bell>(null);
  const toggleShow = () => {
    setShow(!show);
    if (show && bell) setBell(null);
  };
  useOnClickOutside(ref, () => {
    setShow(false);
    setBell(null);
  });

  const handleBell = (index: number, bellItem: any) => {
    if (bell?.index === index && bell) {
      setBell(null);
    } else setBell({ index, image: bellItem.image, sound: bellItem.sound });
  };

  return (
    <>
      <div
        className="flex cursor-pointer gap-6 h-12 items-center"
        onClick={toggleShow}
      >
        <FontAwesomeIcon className="text-[20px] md:text-[30px] text-white" icon={faClock} />
      </div>
      <div
        className={clsx(
          " fixed bottom-0 top-0 right-0 bg-white z-20 w-full md:w-[450px] transition-all duration-700 ease-in-out",
          show
            ? "translate-x-0 after:content-[''] after:-z-20 after:w-screen after:h-screen after:fixed after:right-0 after:top-0 after:bg-black/50"
            : "translate-x-[100%]"
        )}
      >
        <div className="bg-white pt-4 pb-10 p-6 h-full" ref={ref}>
          <button
            className="rounded-full w-10 h-10 bg-secondary text-center flex items-center justify-center ml-auto"
            onClick={toggleShow}
          >
            <FontAwesomeIcon
              className="text-[20px] md:text-[30px] text-white"
              icon={faTimes}
            />
          </button>
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold capitalize">
              {tCommon("tools")}
            </h3>
            <div className="flex items-center gap-4">
              <p>{t("ring")}</p>
              <div className="flex gap-2">
                {bells.map((bell, index) => (
                  <BellItem
                    key={bell.id}
                    color={bell.color}
                    onPlayBell={() => handleBell(index + 1, bell)}
                  />
                ))}
              </div>
            </div>
            {bell && (
              <div className="w-full h-[240px] flex justify-center">
                <Image
                  className="w-auto h-full"
                  src={bell.image}
                  width={200}
                  height={240}
                  alt="bell"
                />
                <audio src={bell.sound} preload="auto" autoPlay />
              </div>
            )}
            <CountdownTimer isStopTimer={!show} />
          </div>
        </div>
      </div>
    </>
  );
}
