"use client";

import { useEffect, useState } from "react";

export default function LoadingState() {
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-6 sm:mx-12 my-6 bg-[#141414] border border-[#1e1e1e] rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-4">
      {/* Minimalist Spinner */}
      <div className="spinner" />

      <div className="max-w-md space-y-1.5">
        {!isWakingUp ? (
          <p className="text-[13px] text-[#f0ede8] font-normal tracking-wide">
            Analyzing your contracts...
          </p>
        ) : (
          <p className="text-[12px] text-[#888] font-light leading-relaxed">
            Still working — our server is waking up from sleep. This only happens
            on the first request and takes about 30 seconds. Your files are safe
            and have not been uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
