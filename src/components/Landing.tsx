"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF] px-6 py-16 sm:px-8">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
        <p className="text-[14px] font-medium tracking-[0.2em] text-[#8a8480] uppercase">
          Navu
        </p>

        <h1 className="mt-20 text-[2rem] font-medium leading-[1.2] tracking-tight text-[#1a1a1a] sm:text-[2.4rem]">
          {copy.tagline}
        </h1>

        <p className="mt-10 text-[16px] leading-relaxed text-[#5c5650]">
          {copy.trustLine}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-20 rounded-full bg-[#3d3832] px-10 py-3.5 text-[15px] font-medium text-[#F7F4EF] transition-colors duration-200 hover:bg-[#4a4540]"
        >
          {copy.startButton}
        </button>

        <p className="mt-8 text-[12px] leading-relaxed text-[#8a8480]">
          {copy.privacyLine}
        </p>
      </div>
    </div>
  );
}
