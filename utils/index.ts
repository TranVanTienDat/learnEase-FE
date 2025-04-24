import { format, isSameDay } from "date-fns";

export const convertImageUrl = (url: string | undefined) =>
  url
    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL_IMAGE}${url}`
    : "/images/logo.svg";

export const convertStudentImageUrl = (url: string | undefined) =>
  url
    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL_IMAGE}${url}`
    : "/images/logo.png";

export const convertTime = (time: string): string => time.substring(0, 5);

interface DynamicObject {
  [key: string]: any;
}

export function convertDataEmpty(arr: DynamicObject[]): DynamicObject[] {
  return arr.map((obj) => {
    const newObj: DynamicObject = {};
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
        newObj[key] = "---";
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatISOTime(
  dateString: string,
  searchDateString: string
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const searchDate = new Date(searchDateString);

  if (isSameDay(date, searchDate)) {
    return format(date, "h:mm a");
  } else {
    return format(date, "h:mm a dd/MM/yyyy");
  }
}

export function formatTimeApi(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date.toLocaleTimeString("it-IT");
}

export function isCheckTime(start: string, endTime: string): boolean {
  const startTimeDate = new Date(`1970-01-01 ${start}`);
  const endTimeDate = new Date(`1970-01-01 ${endTime}`);
  return endTimeDate.getTime() > startTimeDate.getTime();
}

export const calculatePositions = (listStudents: string[]) => {
  const numBees = listStudents.length;
  const raceHeight = 480; // Height of the race area
  const beeHeight = 100; // Height of the bee image
  const raceWidth = 200; // Width of the start area

  const raceStartLeft = numBees < 3 ? 0 : 20 + 50 / numBees; // Adjusted to be dynamic based on number of students
  const raceStartTop = 50 - 20 / numBees; // Adjusted to be dynamic based on number of students

  const availableHeight = raceHeight - beeHeight; // Available height for arranging bees
  const dynamicFactor =
    numBees < 7 ? 1 + 1 / (1 + numBees / 20) : 1 + 1 / (1 + numBees / 100); // Dynamic value between 1 and 2
  const verticalGap = Math.min(
    120,
    availableHeight / (numBees - dynamicFactor)
  ); // Maximum vertical gap is 120px
  const startTop =
    raceStartTop + (raceHeight - (numBees - 1) * verticalGap) / 2;

  const slope = raceHeight / raceWidth; //độ nghiêng của đường đua
  const horizontalGap = verticalGap / slope - 38 / numBees; // Adjusted to be dynamic based on number of students

  const startLeft = raceStartLeft + raceWidth - 20; // Adjust starting position from the right

  return listStudents.map((_, index) => ({
    left: startLeft - index * horizontalGap,
    top: startTop + index * verticalGap,
  }));
};

export function checkArrayContainsAllIds(
  arrayA: { id: number }[],
  arrayB: { id: number }[]
): boolean {
  if (
    arrayA.length === 0 ||
    arrayB.length === 0 ||
    arrayB.length < arrayA.length
  ) {
    return false;
  }

  const setB = new Set(arrayB.map((item) => item.id));

  return arrayA.every((item) => setB.has(item.id));
}

export const customFormatDate = (
  date: Date = new Date(),
  formatString: string = "yyyy-MM-dd"
): string => {
  return format(date, formatString);
};

export const handleFullscreen = (element = document.documentElement) => {
  if (!document.fullscreenElement) {
    element.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};
