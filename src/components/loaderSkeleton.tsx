import React from "react";

const LoaderSkeleton = () => {
  return (
    <div className="flex h-32 gap-4 p-5 fade-in-25 md:gap-6">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg pt-2">
        <div
          className="h-5 w-10/12 origin-left animate-loading bg-[length:200%] rounded-sm opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E6F4EA 30%, #27A830 60%, #E6F4EA)",
          }}
        ></div>
        <div
          className="h-5 w-full origin-left animate-loading bg-[length:200%] rounded-sm opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #27A830, #F8FFF8 30%, #27A830 60%)",
          }}
        ></div>
        <div
          className="duration-600 h-5 w-3/5 origin-left animate-loading bg-[length:200%] rounded-sm opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E6F4EA 40%, #27A830 70%, #E6F4EA)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoaderSkeleton;
