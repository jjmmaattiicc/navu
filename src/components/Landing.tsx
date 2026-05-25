"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6 py-16 sm:px-8">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
        <p className="text-[14px] font-medium tracking-[0.2em] text-[#7A5040] uppercase">
          Navu
        </p>

        <h1
          className="mt-20 text-[2rem] font-medium leading-[1.2] tracking-tight text-[#2C1810] sm:text-[2.4rem]"
          style={{
            fontVariantLigatures: "none",
            fontFeatureSettings: '"liga" 0, "clig" 0, "dlig" 0, "calt" 0',
          }}
        >
          {copy.tagline}
        </h1>

        <p className="mt-10 text-[16px] leading-relaxed text-[#5C3D2E]">
          {copy.trustLine}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-20 rounded-full bg-[#5C3D2E] px-10 py-3.5 text-[15px] font-medium text-[#FAF7F2] transition-colors duration-200 hover:bg-[#7A5040]"
        >
          {copy.startButton}
        </button>

        <p className="mt-8 text-[12px] leading-relaxed text-[#7A5040]">
          {copy.privacyLine}
        </p>
      </div>
    </div>
  );
}
