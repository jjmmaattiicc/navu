"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EF] px-6 py-10 sm:px-8">
      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
          <p className="text-[2rem] font-semibold tracking-tight text-[#1a1a1a] sm:text-[2.4rem]">
            Navu
          </p>

          <div className="mt-10 space-y-5">
            <h1 className="text-[2rem] font-medium leading-[1.2] tracking-tight text-[#1a1a1a] sm:text-[2.4rem]">
              {copy.tagline}
            </h1>

            <p className="text-[16px] leading-relaxed text-[#5c5650]">
              {copy.trustLine}
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-4">
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

          <ol className="mt-14 flex w-full max-w-[420px] flex-col gap-3 text-[14px] leading-relaxed text-[#5c5650]">
            {copy.howItWorks.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-left">
                <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d8d2c8] text-[11px] font-medium text-[#8a8480]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>

      <footer className="shrink-0 pt-10 text-center text-[12px] text-[#a8a29a]">
        {copy.footerLine}
      </footer>
    </div>
  );
}
