"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-8">
      <div className="w-full max-w-lg">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            Navu
          </h1>
        </header>

        <div className="space-y-4">
          <p className="text-[22px] leading-snug font-medium tracking-tight text-neutral-900 sm:text-2xl">
            {copy.tagline}
          </p>

          <p className="text-[15px] leading-relaxed text-neutral-500">
            {copy.trustLine}
          </p>
        </div>

        <div className="mt-10 space-y-3">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-2xl bg-neutral-900 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:min-w-[220px]"
          >
            {copy.startButton}
          </button>

          <p className="text-[13px] leading-relaxed text-neutral-400">
            {copy.durationLine}
          </p>
        </div>
      </div>
    </div>
  );
}
