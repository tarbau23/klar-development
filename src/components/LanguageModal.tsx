"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/context/languageContext";
import AnimatedMultiLangHeading from "@/components/animatedHeading";
import Image from "next/image";

interface FeedbackFormProps {
  isOpen: boolean;
  isExpend: boolean;
  onClose: () => void;
}

const phrases = [
  "Tap on the flag to choose your language",
  "اضغط على العلم لاختيار لغتك",
  "Dilinizi seçmek için bayrağa dokunun",
  "Trokitë flamurin për të zgjedhur gjuhën tuaj",
  "Торкніться прапора, щоб вибрати свою мову",
  "روی پرچم ضربه بزنید تا زبان خود را انتخاب کنید",
  "আপনার ভাষা নির্বাচন করতে পতাকায় ট্যাপ করুন",
  "ඔබේ භාෂාව තෝරා ගැනීමට ධජය මත තට්ටු කරන්න",
  "Atingeți steagul pentru a alege limba dvs.",
  "Нажмите на флаг, чтобы выбрать свой язык",
];

const languages = [
  { label: "Türkçe", code: "turkish" },
  { label: "العربية", code: "arabic" },
  { label: "Українська", code: "ukrainian" },
  { label: "العربية", code: "arabic" },
  { label: "فارسی", code: "persian" },
  { label: "English (UK)", code: "english" },
  { label: "සිංහල", code: "sinhalese" },
  { label: "فارسی", code: "persian" },
  { label: "Română", code: "romanian" },
  { label: "Shqip", code: "albanian" },
  { label: "Polski", code: "polish" },
  { label: "বাংলা", code: "bengali" },
];

export function LanguageModal({
  isOpen,
  onClose,
  isExpend,
}: FeedbackFormProps) {
  const [isExpanded, setIsExpanded] = useState(isExpend);
  const { getAppLanguage, setAppLanguage } = useLanguage();

  const t: any = getAppLanguage();

  const handleLanguageChange = (lang: any) => {
    setAppLanguage(lang);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px] [&>button]:hidden backdrop-blur-md bg- border-[#AFC4BF66] rounded-[10px] transition-all duration-500 ease-in-out ${
          isExpanded ? "w-[90%]" : "w-[65%] p-1 fixed top-[15%] left-[65%]"
        }`}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div onClick={() => (!isExpanded ? setIsExpanded(true) : null)}>
          {isExpanded ? <AnimatedMultiLangHeading sentences={phrases} /> : null}
          <div className="w-100 flex justify-center">
            <Image
              className={`animate-blink ${isExpanded ? "py-5" : "py-2"}`}
              alt="hand icon prompting to tap"
              width={isExpanded ? 70 : 30}
              height={isExpanded ? 70 : 30}
              src={"/handIcon.png"}
            />
          </div>
          <div
            className={`flags flex flex-wrap justify-center ${
              isExpanded ? "mb-8" : null
            }`}
          >
            {languages.map((lang, index) => (
              <div
                className={` md:basis-1/6 xl:basis-1/6 2xl:basis-1/4 p-0 ${
                  isExpanded ? "basis-1/3" : "basis-1/4"
                } ${
                  !isExpanded && index >= 8 ? "hidden" : null
                } transition-all duration-700 ease-in-out`}
              >
                <Image
                  key={index}
                  className="w-[100%]"
                  alt={`${lang.label} flag`}
                  width={isExpanded ? 70 : 30}
                  height={isExpanded ? 70 : 30}
                  src={`/flags/${index}.svg`}
                  onClick={() =>
                    isExpanded ? handleLanguageChange(lang.code) : null
                  }
                />
                {isExpanded ? <p className="text-center">{lang.label}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
