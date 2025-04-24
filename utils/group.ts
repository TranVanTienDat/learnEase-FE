import { StudentType } from "@/apiRequest/students";

export const fisherYatesShuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const playRandomSelection = async (
  elements: Element[],
  className: string,
  soundFilePath: string,
  iterationCount: number,
  delayTime: number
) => {
  const sound = new Audio(soundFilePath);

  for (let i = 0; i < iterationCount; i++) {
    const element = elements[i];

    sound.play();
    element.classList.add(className);

    if (i < iterationCount - 1) {
      await delay(delayTime);
      element.classList.remove(className);
    }

    await delay(delayTime);
  }
};

export const handleRandom = async (index: number) => {
  const elementId = document.querySelector(`#nhom-dshs${index}`);
  if (elementId) {
    const childrenArray = Array.from(elementId.querySelectorAll(".random"));

    const availableElements = childrenArray.filter(
      (element) => !element.classList.contains("chon")
    );

    if (availableElements.length === 0) {
      return;
    }

    const randomArray = Array.from(
      { length: 6 },
      () =>
        availableElements[Math.floor(Math.random() * availableElements.length)]
    );

    await playRandomSelection(
      randomArray,
      "chon",
      "/sounds/slot-machine-1.wav",
      6,
      150
    );
  }
};

export const randomGroup = async () => {
  const childrenArray = Array.from(document.querySelectorAll(".random-nhom"));
  childrenArray.forEach((element) => element.classList.remove("chon-nhom"));

  const randomArray = Array.from(
    { length: 6 },
    () => childrenArray[Math.floor(Math.random() * childrenArray.length)]
  );

  await playRandomSelection(
    randomArray,
    "chon-nhom",
    "/sounds/slot-machine-1.wav",
    6,
    150
  );
};

export const sortGroups = (
  groups: {
    name: string;
    listStudent: StudentType[];
  }[]
) => {
  return groups.sort((a, b) => {
    if (a.name === "Chưa có tổ/nhóm") return -1;
    if (b.name === "Chưa có tổ/nhóm") return 1;
    return a.name.localeCompare(b.name);
  });
};

export const handleRemoveAll = () => {
  const randomElementsGroup = document.querySelectorAll(".random-nhom");
  const randomElementsItem = document.querySelectorAll(".random");

  randomElementsGroup.forEach((element) => {
    element.classList.remove("chon-nhom");
  });
  randomElementsItem.forEach((element) => {
    element.classList.remove("chon");
  });
};
