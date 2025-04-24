export type WheelComponentProps = {
  segments: DataType[];
  segColors?: string[];
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
};

export type DataType = {
  id: number;
  name: string;
};
