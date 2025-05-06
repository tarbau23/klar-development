"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
import { useLanguage } from "@/context/languageContext";
import { LanguageModal } from "./LanguageModal";
import { useState } from "react";

function deleteCookie(name: any) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const languages = [
  { label: "Turkish", code: "turkish" },
  { label: "Arabic", code: "arabic" },
  { label: "Ukrainian", code: "ukrainian" },
  { label: "Arabic", code: "arabic" },
  { label: "Persian", code: "persian" },
  { label: "English (UK)", code: "english" },
  { label: "Sinhalese", code: "sinhalese" },
  { label: "Persian", code: "persian" },
  { label: "Romanian", code: "romanian" },
  { label: "Albanian", code: "albanian" },
  { label: "Polish", code: "polish" },
  { label: "Bengali", code: "bengali" },
];

export default function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  //context
  const { getAppLanguage } = useLanguage();
  let router: any = useRouter();

  const t: any = getAppLanguage();

  const isHome = usePathname() === "/";
  const isPrompt = usePathname() === "/prompt";

  const goHome = () => {
    deleteCookie("language");
    router.push("/");
  };

  return (
    <div>
      <LanguageModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} isExpend={true}/>
      <div className="flex justify-between md:max-w-[900px] mx-auto p-[20px] pb-[0px]">
        <div className="flex align-center gap-[20px]">
          {!isHome ? (
            <div className=" h-[40px] w-[40px] rounded-full  bg-card flex align-center justify-center">
              <Image
                src={"/icons/back.svg"}
                alt="logo"
                width={25}
                height={25}
                className=""
                onClick={() => {
                  if (isPrompt) {
                    goHome();
                  } else {
                    router.back();
                  }
                }}
              />
            </div>
          ) : null}
          <div className="flex align-center" onClick={()=> setIsFormOpen(true)}>
            <Image
              className="p-0 w-[50px]"
              alt={`flag`}
              width={100}
              height={100}
              src={`/flags/${t.index ? t.index : "5"}.svg`}
              onClick={() => {}}
            />
            <Image
              src={"/icons/downArrow.svg"}
              alt="arrow"
              width={25}
              height={25}
              className=""
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="flex align-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
