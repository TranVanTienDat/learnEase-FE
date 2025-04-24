export type LuckyDrawProp = {
  isSpinning: boolean;
  isEndSpinning: boolean;
  handleDraw: () => void;
};

export type ModalSettingsProps = {
  showSettings: boolean;
  settingsNameList: string;
  shouldRemoveWinner: boolean;
  enableSound: boolean;
  setSettingsNameList: (value: string) => void;
  setShouldRemoveWinner: (value: boolean) => void;
  setShowSettings: (value: boolean) => void;
  setEnableSound: (value: boolean) => void;
  handleSaveSettings: () => void;
};
