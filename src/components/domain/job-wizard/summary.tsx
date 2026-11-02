"use client";

import { Briefcase, Clock, MapPin, Users, Wallet } from "lucide-react";
import { useMemo } from "react";
import { Chip, CompanyMark, Panel } from "@/components/ui/primitives";
import { estimateTalent, formatSalary, type JobDraft } from "@/lib/jobdraft";
import { LEVEL_LABEL, type Partner, type Student } from "@/lib/types";

/** Panel kanan wizard: perkiraan kandidat, tiap skill wajib, dan kartu lowongan seperti yang dilihat student. */
export function WizardSummary({ draft, partner, students }: { draft: JobDraft; partner?: Partner; students: Student[] }) {
  const required = draft.reqs.filter((r) => r.weight === "wajib");
  const bonus = draft.reqs.filter((r) => r.weight === "nilai-tambah");
  const total = useMemo(() => estimateTalent(students, draft), [students, draft]);
  const perSkill = useMemo(
    () => required.map((r) => ({ ...r, count: estimateTalent(students, { ...draft, reqs: [r] }) })),
    [students, draft, required],
  );
  const salary = formatSalary(draft.salaryMin, draft.salaryMax);
  const narrow = required.length > 0 && total === 0;

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Perkiraan kandidat">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Users size={18} aria-hidden /></span>
          <div>
            <p className="font-display text-3xl font-bold leading-none tracking-tight" aria-live="polite">{total}</p>
            <p className="mt-1 text-sm text-muted">talent memenuhi {required.length > 0 ? "semua skill wajib" : "bidang ini"}</p>
          </div>
        </div>
        {perSkill.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-3" aria-label="Talent per skill wajib">
            {perSkill.map((r) => (
              <li key={r.skill} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{r.skill} <span className="text-xs text-muted">min {LEVEL_LABEL[r.min]}</span></span>
                <span className="shrink-0 font-medium tabular-nums">{r.count}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">
          {narrow ? "Coba turunkan level minimal atau jadikan sebagian skill nilai tambah." : "Dari student bootcamp yang membuka profilnya. Angka berubah saat skill diubah."}
        </p>
      </Panel>

      <Panel title="Tampilan untuk student">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{draft.title.trim() || "Judul posisi"}</p>
              <p className="text-xs text-muted">{partner?.name}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <li className="flex items-center gap-1"><MapPin size={12} aria-hidden />{draft.location}</li>
            <li className="flex items-center gap-1"><Briefcase size={12} aria-hidden />{draft.workType} · {draft.level}</li>
            {salary && <li className="flex items-center gap-1"><Wallet size={12} aria-hidden />{salary}</li>}
          </ul>
          <p className="line-clamp-3 text-[13px] leading-relaxed">{draft.description.trim() || "Deskripsi pekerjaan akan tampil di sini."}</p>
          {draft.reqs.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {required.map((r) => <li key={r.skill}><Chip>{r.skill}</Chip></li>)}
              {bonus.map((r) => <li key={r.skill}><Chip tone="plain">{r.skill}</Chip></li>)}
            </ul>
          )}
          <p className="flex items-center gap-1.5 text-xs text-muted"><Clock size={12} aria-hidden />Respons dalam 7 hari kalender.</p>
        </div>
      </Panel>
    </div>
  );
}
