"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF] px-6 py-12 sm:px-8">
      <div className="w-full max-w-lg">
        <header className="mb-12">
          <p className="text-xl font-medium tracking-tight text-[#1a1a1a]/70">
            Navu
          </p>
        </header>

        <div className="space-y-5">
          <h1 className="text-[2.5rem] font-medium leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-5xl">
            {copy.tagline}
          </h1>

          <p className="text-[16px] leading-relaxed text-[#5c5650]">
            {copy.trustLine}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-full bg-[#3d3832] px-8 py-3.5 text-[15px] font-medium text-[#F7F4EF] transition-colors duration-200 hover:bg-[#4a4540] sm:w-auto"
          >
            {copy.startButton}
          </button>

          <p className="text-[12px] leading-relaxed text-[#8a8480]">
            {copy.privacyLine}
          </p>

          <p className="text-[13px] leading-relaxed text-[#8a8480]">
            {copy.durationLine}
          </p>
        </div>
      </div>
    </div>
  );
}
