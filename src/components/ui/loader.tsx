import { useLanguage } from "@/context/languageContext";
import LoaderSkeleton from "../loaderSkeleton";

export default function Loader() {
  const { language }: any = useLanguage();

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          <p className="text-[14px] text-[#fff] text-center color-[#006838] bg-[#27A830] m-0 p-2 rounded-[10px]">
            {language.waitText}
          </p>
        </div>
      </div>
      <LoaderSkeleton />
    </>
  );
}
