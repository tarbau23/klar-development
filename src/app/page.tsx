"use client";

import { useEffect } from "react";
import Component from './prompt/page'
import { useRouter } from "next/navigation";


const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

export default function Home() {
  // const { setAppLanguage } = useLanguage();
  const router = useRouter();

  let hasUsedChatBefore : any = localStorage.getItem('hasUsedChatBefore');
  let isUserSecondTime : any = localStorage.getItem('isUserSecondTime');
  const savedLanguage = getCookie("language");

  // if (savedLanguage) {
  //   router.push("/prompt");
  // }

  // const handleLanguageChange = (lang : any) => {
  //   setAppLanguage(lang);
  //   router.push("/prompt");
  // };

  useEffect(() => {
    
    if(hasUsedChatBefore && !isUserSecondTime){
      localStorage.setItem('isUserSecondTime', 'true');
    }
  }, [])
  

  return (
    <Component />



    // <div className="w-full flex flex-col items-center p-4">
    //   {/* <AnimatedMultiLangHeading sentences={phrases} />

    //   <Image
    //     className="py-5 animate-blink"
    //     alt="hand icon prompting to tap"
    //     width={70}
    //     height={70}
    //     src={hand}
    //   />

    //   <div className="flags flex flex-wrap justify-center mb-8">
    //     {languages.map((lang, index) => (
    //       <Image
    //         key={index}
    //         className="basis-1/3 md:basis-1/6 xl:basis-1/6 2xl:basis-1/4 p-0"
    //         alt={`${lang.label} flag`}
    //         width={70}
    //         height={70}
    //         src={`/flags/${index}.svg`}
    //         onClick={() => handleLanguageChange(lang.code)}
    //       />
    //     ))}
    //   </div>

    //   <SocialShareLinks /> */}
    // </div>
  );
}
