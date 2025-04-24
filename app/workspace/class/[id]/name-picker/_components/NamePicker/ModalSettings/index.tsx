import React, { useState } from "react";
import { ModalSettingsProps } from "@/types/namePicker";
import { useTranslations } from "next-intl";

export default function ModalSettings({
  showSettings,
  enableSound,
  handleSaveSettings,
  setEnableSound,
  setSettingsNameList,
  setShouldRemoveWinner,
  setShowSettings,
  settingsNameList,
  shouldRemoveWinner,
}: ModalSettingsProps) {
  const t = useTranslations("namePicker");
  const tCommon = useTranslations("common");
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleClickOutside = () => {
    if (!isFocused) {
      setShowSettings(false);
    }
    setIsFocused(false);
  };

  return (
    <>
      {showSettings && (
        <div
          id="settings"
          className="fixed inset-0 bg-black bg-opacity-60 z-50"
          onClick={handleClickOutside}
        >
          <div
            id="settings-panel"
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={-1}
            className="fixed top-0 right-0 h-full w-full max-w-[33.125rem] flex flex-col justify-between overflow-auto p-12 pt-12 bg-primary text-white z-50"
          >
            <div className="pb-12">
              <h1 className="text-4xl font-bold mb-7.5">{t("setting")}</h1>
              <div className="mb-16">
                <label
                  className="inline-block text-2xl font-semibold mb-6"
                  htmlFor="name-list"
                >
                  {tCommon("listStudent")}
                </label>
                <textarea
                  className="p-[1.875rem] h-[55px] min-h-[150px] w-full bg-[#e8e8e8] border-none rounded text-black font-[inherit] text-2xl leading-tight outline-none shadow-[0.625rem_0.625rem_0_rgba(0,0,0,0.2)] resize-y"
                  rows={8}
                  placeholder={t("separateLine")}
                  id="name-list"
                  value={settingsNameList}
                  onChange={(e) => setSettingsNameList(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center mb-16">
                <label
                  className="text-2xl font-semibold"
                  htmlFor="remove-from-list"
                >
                  {t("delStudentFromList")}
                </label>
                <label className="relative inline-block w-[75px] h-[30px] flex-none ml-4">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0 peer"
                    checked={shouldRemoveWinner}
                    id="remove-from-list"
                    onChange={(e) => setShouldRemoveWinner(e.target.checked)}
                  />
                  <span className="absolute cursor-pointer inset-0 bg-[#e8e8e8] rounded-[30px] before:absolute before:content-[''] before:h-6 before:w-6 before:left-[3px] before:bottom-[3px] before:bg-[#B5B7C0] before:rounded-full before:transition-transform before:duration-400 peer-checked:before:translate-x-[45px] peer-checked:before:bg-primary"></span>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <label
                  className="text-2xl font-semibold"
                  htmlFor="enable-sound"
                >
                  {t("turnSound")}
                </label>
                <label className="relative inline-block w-[75px] h-[30px] flex-none ml-4">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0 peer"
                    checked={enableSound}
                    id="enable-sound"
                    onChange={(e) => setEnableSound(e.target.checked)}
                  />
                  <span className="absolute cursor-pointer inset-0 bg-[#e8e8e8] rounded-[30px] before:absolute before:content-[''] before:h-6 before:w-6 before:left-[3px] before:bottom-[3px] before:bg-[#B5B7C0] before:rounded-full before:transition-transform before:duration-400 peer-checked:before:translate-x-[45px] peer-checked:before:bg-primary"></span>
                </label>
              </div>
            </div>
            <div>
              <button
                id="settings-save"
                className="w-full bg-[#ffbf1f] border-none rounded-[0.625rem] shadow-[0.625rem_0.625rem_0_rgba(0,0,0,0.2)] text-white cursor-pointer font-bold text-[1.75rem] leading-[1.75rem] p-4 mb-6 hover:bg-[#ffc639] disabled:cursor-not-allowed disabled:hover:bg-[#ffbf1f]"
                onClick={handleSaveSettings}
              >
                {tCommon("save")}
              </button>
              <button
                id="settings-close"
                className="w-full bg-[#e54c23] capitalize border-none rounded-[0.625rem] shadow-[0.625rem_0.625rem_0_rgba(0,0,0,0.2)] text-white cursor-pointer font-bold text-[1.75rem] leading-[1.75rem] p-4 hover:bg-[#e85f3a] disabled:cursor-not-allowed disabled:hover:bg-[#e54c23]"
                onClick={() => setShowSettings(false)}
              >
                {tCommon("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
