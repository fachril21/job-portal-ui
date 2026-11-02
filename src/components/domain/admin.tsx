"use client";

import clsx from "clsx";
import { Pill } from "@/components/ui/primitives";
import { slaTone, WEEK_LABELS } from "@/lib/admin";

export function SlaPill({ score }: { score: number }) {
  return <Pill tone={slaTone(score)}>SLA {score}</Pill>;
}

/** Batang tren mingguan. Batang terakhir (minggu ini) memakai warna brand penuh. */
export function TrendBars({ values, label, compact }: { values: number[]; label: string; compact?: boolean }) {
  return (
    <figure aria-label={label} className="m-0">
      <div className={clsx("flex items-end gap-1.5", compact ? "h-10" : "h-28")}>
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end" title={`${WEEK_LABELS[i] ?? i}: ${v}`}>
            <div className={clsx("w-full rounded-t-md", i === values.length - 1 ? "bg-brand-600" : "bg-brand-100")} style={{ height: `${Math.max(4, v)}%` }} />
          </div>
        ))}
      </div>
      {!compact && (
        <div className="mt-1.5 flex gap-1.5 text-[11px] text-muted" aria-hidden>
          {values.map((v, i) => <span key={i} className="flex-1 text-center">{WEEK_LABELS[i]}<br /><span className="font-medium text-ink">{v}</span></span>)}
        </div>
      )}
    </figure>
  );
}

export const daysAgo = (day: number, today: number): string => {
  const d = today - day;
  return d <= 0 ? "hari ini" : `${d} hari lalu`;
};
