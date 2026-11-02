"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

export function Segmented<T extends string | number>({ label, options, value, onChange, className }: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={clsx("inline-flex rounded-lg border border-line-strong bg-canvas p-0.5", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={clsx("h-8 flex-1 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-colors", on ? "bg-surface text-brand-700 shadow-xs" : "text-muted hover:text-ink")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const STEPS = ["Dasar", "Skill", "Seleksi", "Tinjau"] as const;

export function Stepper({ current, onJump, maxReached }: { current: number; onJump: (n: number) => void; maxReached: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Langkah pembuatan lowongan">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        const reachable = n <= maxReached;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              disabled={!reachable}
              aria-current={active ? "step" : undefined}
              onClick={() => onJump(n)}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span className={clsx("grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold", active ? "bg-brand-600 text-white" : done ? "bg-brand-100 text-brand-700" : "border border-line-strong bg-surface text-muted")}>
                {done ? <Check size={14} aria-hidden /> : n}
              </span>
              <span className={clsx("text-sm font-medium", active ? "text-ink" : "hidden text-muted sm:inline")}>{label}</span>
            </button>
            {n < STEPS.length && <span aria-hidden className={clsx("h-px min-w-4 flex-1", done ? "bg-brand-600" : "bg-line-strong")} />}
          </li>
        );
      })}
    </ol>
  );
}
