"use client";

import clsx from "clsx";
import { Briefcase, Check, Clock, MapPin, Pencil, Smartphone, Monitor, Wallet } from "lucide-react";
import { useState } from "react";
import { Segmented } from "./ui";
import { Chip, CompanyMark, Panel } from "@/components/ui/primitives";
import { formatSalary, validateStep, type JobDraft } from "@/lib/jobdraft";
import { LEVEL_LABEL, type Partner } from "@/lib/types";

/** Pratinjau lowongan persis seperti kartu dan detail yang dilihat student. */
export function JobPreview({ draft, partner }: { draft: JobDraft; partner?: Partner }) {
  const [view, setView] = useState<"mobile" | "desktop">("desktop");
  const salary = formatSalary(draft.salaryMin, draft.salaryMax);
  const required = draft.reqs.filter((r) => r.weight === "wajib");
  const bonus = draft.reqs.filter((r) => r.weight === "nilai-tambah");
  return (
    <Panel
      title="Pratinjau untuk student"
      action={
        <Segmented
          label="Ukuran pratinjau"
          value={view}
          onChange={setView}
          options={[{ value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }]}
        />
      }
    >
      <div className="rounded-xl bg-canvas p-4">
        <div className={clsx("mx-auto flex flex-col gap-4 rounded-tile border border-line bg-surface p-5 shadow-xs", view === "mobile" ? "max-w-[340px]" : "max-w-full")}>
          <div className="flex items-start gap-3.5">
            <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} />
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight">{draft.title.trim() || "Judul posisi"}</h3>
              <p className="text-sm text-muted">{partner?.name}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
            <li className="flex items-center gap-1.5"><MapPin size={14} aria-hidden />{draft.location}</li>
            <li className="flex items-center gap-1.5"><Briefcase size={14} aria-hidden />{draft.workType} · {draft.level}</li>
            {salary && <li className="flex items-center gap-1.5"><Wallet size={14} aria-hidden />{salary}</li>}
          </ul>
          <p className="text-[15px] leading-relaxed">{draft.description.trim() || "Deskripsi pekerjaan akan tampil di sini."}</p>
          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <p className="text-sm font-semibold">Skill yang dicari</p>
            <ul className="flex flex-wrap gap-1.5">
              {required.map((r) => <li key={r.skill}><Chip>{r.skill} · min {LEVEL_LABEL[r.min]}</Chip></li>)}
              {bonus.map((r) => <li key={r.skill}><Chip tone="plain">{r.skill} · nilai tambah</Chip></li>)}
            </ul>
            <p className="text-xs text-muted">Student melihat skill mana yang sudah terpenuhi, tanpa persentase.</p>
          </div>
          {draft.screening.some((q) => q.trim()) && (
            <p className="text-xs text-muted">{draft.screening.filter((q) => q.trim()).length} pertanyaan screening saat melamar.</p>
          )}
          <p className="flex items-center gap-1.5 text-xs text-muted"><Clock size={13} aria-hidden />Perusahaan berkomitmen merespons dalam 7 hari kalender.</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">{view === "mobile" ? <Smartphone size={13} aria-hidden /> : <Monitor size={13} aria-hidden />}Tampilan {view === "mobile" ? "ponsel" : "desktop"}</p>
    </Panel>
  );
}

const CHECKS: { step: number; label: string; ok: (d: JobDraft) => boolean }[] = [
  { step: 1, label: "Judul dan deskripsi lengkap", ok: (d) => !validateStep(d, 1).title && !validateStep(d, 1).description },
  { step: 1, label: "Kisaran gaji tertera", ok: (d) => d.salaryMin !== null || d.salaryMax !== null },
  { step: 2, label: "Minimal satu skill wajib", ok: (d) => !validateStep(d, 2).reqs },
  { step: 3, label: "Pertanyaan screening sudah terisi", ok: (d) => !validateStep(d, 3).screening },
];

export function ReviewStep({ draft, partner, onEdit }: { draft: JobDraft; partner?: Partner; onEdit: (step: number) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Periksa sebelum kirim">
        <ul className="flex flex-col divide-y divide-line">
          {CHECKS.map((c) => {
            const ok = c.ok(draft);
            return (
              <li key={c.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className={clsx("grid size-6 place-items-center rounded-full", ok ? "bg-ok-100 text-ok-700" : "bg-warn-100 text-warn-700")}>{ok ? <Check size={14} aria-hidden /> : <span className="text-xs font-bold" aria-hidden>!</span>}</span>
                <span className="flex-1 text-sm">{c.label}</span>
                {!ok && <span className="sr-only">Belum terpenuhi</span>}
                <button type="button" onClick={() => onEdit(c.step)} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"><Pencil size={12} aria-hidden />Ubah</button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">Kisaran gaji bersifat opsional, tetapi lowongan dengan gaji tertera lebih sering dilamar.</p>
      </Panel>
      <JobPreview draft={draft} partner={partner} />
    </div>
  );
}
