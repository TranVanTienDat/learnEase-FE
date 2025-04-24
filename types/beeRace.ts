import { StaticImageData } from "next/image";

export interface BeeProps {
  index: number;
  top: number;
  left: number;
  name: string;
  imageObject: StaticImageData;
}
export interface RaceTrackProps {
  raceStartImg: number;
  raceEndImg: number;
  hiveBeePosition: number;
  winner: string | null;
}
export interface WinnerAnnouncementProps {
  winner: string | null;
}

export interface BeePosition {
  left: number;
  top: number;
}

export type RaceStatus = "not-started" | "racing" | "finished";
export type ListObjectKeys = "bee" | "bird" | "plane" | "helicopter";
