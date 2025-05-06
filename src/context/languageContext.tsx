'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import english from "../../public/locale/english.json";
import albanian from "../../public/locale/albanian.json";
import arabic from "../../public/locale/arabic.json";
import bengali from "../../public/locale/bengali.json";
import persian from "../../public/locale/persian.json";
import romanian from "../../public/locale/romanian.json";
import russian from "../../public/locale/russian.json";
import sinhalese from "../../public/locale/sinhalese.json";
import turkish from "../../public/locale/turkish.json";
import ukrainian from "../../public/locale/ukrainian.json";
import polish from "../../public/locale/polish.json";

const translations: any = {
  english,
  turkish,
  ukrainian,
  sinhalese,
  russian,
  romanian,
  persian,
  bengali,
  arabic,
  albanian,
  polish,
};

interface LanguageContextProps {
  language: any;
  setAppLanguage: (lang: string) => void;
  getAppLanguage: () => string;
}

// Initialize the context with default values
const LanguageContext = createContext<LanguageContextProps>({
  language: translations["english"], // Default language
  setAppLanguage: () => {},
  getAppLanguage: () => "english",
});

// Helper functions for cookies
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

// LanguageProvider component to wrap the app
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<any>(translations["english"]);

  // Retrieve language from cookies or use default
  useEffect(() => {
    const savedLanguage = getCookie("language") || "english";
    setLanguage(translations[savedLanguage]);
  }, []);

  // Function to set the language and save it in a cookie
  const setAppLanguage = (lang: string) => {
    setCookie("language", lang, 365); // Save language for a year
    setLanguage(translations[lang]);
  };

  // Function to get the current language
  const getAppLanguage = () => language;

  return (
    <LanguageContext.Provider
      value={{ language, setAppLanguage, getAppLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy access to language context
export const useLanguage = () => useContext(LanguageContext);
