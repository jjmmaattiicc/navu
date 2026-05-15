"use client";

import type { AppCopy } from "@/lib/i18n";

type LandingProps = {
  copy: AppCopy;
  onStart: () => void;
};

export default function Landing({ copy, onStart }: LandingProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white px-6 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <header className="mb-12">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
            Navu
          </h1>
        </header>

        <div className="space-y-6">
          <p className="text-[22px] leading-snug font-medium tracking-tight text-neutral-900 sm:text-2xl">
            {copy.tagline}
          </p>

          <p className="text-[15px] leading-relaxed text-neutral-500">
            {copy.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 w-full rounded-2xl bg-neutral-900 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:min-w-[220px]"
        >
          {copy.startButton}
        </button>
      </div>
    </div>
  );
}
