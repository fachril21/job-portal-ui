"use client";

import clsx from "clsx";
import { Check, CircleDashed, ChevronRight } from "lucide-react";
import { useState } from "react";
import { LEVEL_LABEL, type PassportSkill, type SkillLevel } from "@/lib/types";
import type { JobMatch, MatchStatus } from "@/lib/match";
import { Pill } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/overlay";

/** Level skill: 4 segmen + label teks + angka. Makna tidak bergantung pada warna saja. */
export function SkillMeter({ level, showLabel = true, size = "md" }: { level: SkillLevel | 0; showLabel?: boolean; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-[3px]" role="img" aria-label={level ? `Level ${level} dari 4, ${LEVEL_LABEL[level]}` : "Belum terlihat"}>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={clsx("rounded-full", size === "sm" ? "h-1.5 w-4" : "h-2 w-6", i <= level ? "bg-brand-500" : "bg-line")} />
        ))}
      </span>
      {showLabel && (
        <span className="text-[13px] font-medium text-ink">
          {level ? LEVEL_LABEL[level] : "Belum terlihat"}
          {level ? <span className="ml-1 text-muted">{level}/4</span> : null}
        </span>
      )}
    </span>
  );
}

/** Daftar skill terverifikasi. Tap skill membuka bukti dalam satu interaksi. */
export function SkillList({ skills, compact }: { skills: PassportSkill[]; compact?: boolean }) {
  const [open, setOpen] = useState<PassportSkill | null>(null);
  return (
    <>
      <ul className="divide-y divide-line">
        {skills.map((s) => (
          <li key={s.skill}>
            <button
              type="button"
              onClick={() => setOpen(s)}
              className={clsx("group flex w-full items-center justify-between gap-3 text-left", compact ? "py-2.5" : "py-3.5")}
            >
              <span className="font-medium">{s.skill}</span>
              <span className="flex items-center gap-2">
                <SkillMeter level={s.level} size="sm" showLabel={!compact} />
                <ChevronRight size={16} className="text-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `${open.skill}: ${LEVEL_LABEL[open.level]}` : ""} width="max-w-md">
        {open && (
          <div className="flex flex-col gap-4">
            <SkillMeter level={open.level} />
            <div className="rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-medium text-brand-700">Bukti</p>
              <p className="mt-1 text-[15px]">{open.evidence}</p>
            </div>
            <p className="text-sm text-muted">Level ini bersumber dari proses belajar, bukan isian bebas. Skill terverifikasi tidak bisa disembunyikan agar Passport tetap bisa dipercaya.</p>
          </div>
        )}
      </Sheet>
    </>
  );
}

const MATCH_ICON: Record<MatchStatus, React.ReactNode> = {
  terpenuhi: <Check size={16} className="text-brand-600" aria-hidden />,
  hampir: <span className="size-2.5 rounded-full bg-warn-700" aria-hidden />,
  belum: <CircleDashed size={16} className="text-subtle" aria-hidden />,
};

/** Tabel requirement lowongan vs Passport: Terpenuhi, Hampir, Belum terlihat. Tanpa persentase. */
export function MatchTable({ match, dense }: { match: JobMatch; dense?: boolean }) {
  const wajib = match.rows.filter((r) => r.requirement.weight === "wajib");
  const plus = match.rows.filter((r) => r.requirement.weight === "nilai-tambah");
  const Row = ({ r }: { r: JobMatch["rows"][number] }) => (
    <li className={clsx("flex items-center justify-between gap-3", dense ? "py-2" : "py-3")}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-6 shrink-0 place-items-center">{MATCH_ICON[r.status]}</span>
        <div className="min-w-0">
          <p className="truncate font-medium">{r.requirement.skill}</p>
          <p className="text-xs text-muted">
            Minimal {r.requirement.min}/4 · {LEVEL_LABEL[r.requirement.min]}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {r.status === "terpenuhi" && <Pill tone="ok">Terpenuhi</Pill>}
        {r.status === "hampir" && <Pill tone="warn">Hampir · 1 level lagi</Pill>}
        {r.status === "belum" && <Pill tone="muted">Belum terlihat</Pill>}
        <span className="text-xs text-muted">Kamu: {r.yourLevel ? `${r.yourLevel}/4` : "belum ada"}</span>
      </div>
    </li>
  );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-medium text-muted">Skill wajib</p>
        <ul className="divide-y divide-line">{wajib.map((r) => <Row key={r.requirement.skill} r={r} />)}</ul>
      </div>
      {plus.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-muted">Nilai tambah</p>
          <ul className="divide-y divide-line">{plus.map((r) => <Row key={r.requirement.skill} r={r} />)}</ul>
        </div>
      )}
    </div>
  );
}

/** Ringkasan "X dari Y skill wajib terpenuhi" dengan segmen. Tidak pernah persentase. */
export function MatchSummary({ match, size = "md" }: { match: JobMatch; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-col gap-2">
      <p className={clsx("font-semibold tracking-tight", size === "lg" ? "font-display text-3xl" : "text-sm")}>
        <span className={size === "lg" ? "" : "text-brand-700"}>{match.requiredMet} dari {match.requiredTotal}</span>{" "}
        <span className={clsx("font-normal", size === "lg" ? "text-xl text-muted" : "text-muted")}>skill wajib terpenuhi</span>
      </p>
      <span className="flex gap-1" role="img" aria-label={`${match.requiredMet} dari ${match.requiredTotal} skill wajib terpenuhi`}>
        {Array.from({ length: match.requiredTotal }).map((_, i) => (
          <span key={i} className={clsx("h-1.5 flex-1 rounded-full", i < match.requiredMet ? "bg-brand-500" : "bg-line")} />
        ))}
      </span>
    </div>
  );
}

export function GapNote({ match }: { match: JobMatch }) {
  if (match.gaps.length === 0) return null;
  const n = match.gaps.length;
  return (
    <div className="rounded-2xl bg-learn-100 p-4 text-learn-700">
      <p className="font-semibold">Ada {n} skill yang belum terlihat.</p>
      <p className="mt-0.5 text-sm">Ambil modul terkait dulu atau lanjut melamar. Keduanya boleh.</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {match.gaps.map((g) => (
          <li key={g.requirement.skill} className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium">
            {g.requirement.skill} ke level {g.requirement.min}
          </li>
        ))}
      </ul>
    </div>
  );
}

