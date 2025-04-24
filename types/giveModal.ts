import { FeatureType } from "@/types";

export type GiveModalClassType = {
  name: string;
  id: string;
};

export type GivePointEvaluationType = {
  onSelect: () => void;
  image?: {
    url: string;
  };
  name: string;
  point: string;
  isActive: boolean;
  type: FeatureType;
  id: string;
};

export type EvaluationsActiveGivePointType = {
  id: string;
  name: string;
  point: string;
  imageUrl: string;
  date: string;
};

export type EvaluationsActiveType = {
  extras: EvaluationsActiveGivePointType[];
  minus: EvaluationsActiveGivePointType[];
};

export type EvaluationsActiveChangeType = {
  evaluation: EvaluationsActiveGivePointType;
  type: `${FeatureType}`;
};

export type GivePointParamsType = {
  studentId: string;
  activities: {
    point: number | string;
    note: string;
    imageUrl: string;
    date: string;
  }[];
}[];
