"use client";

import { Copy, FilePlus2, FileText, LayoutTemplate } from "lucide-react";
import { Button, Panel } from "@/components/ui/primitives";
import { BOOTCAMP_FIELDS } from "@/data/job-templates";
import type { JobDraft } from "@/lib/jobdraft";
import type { Bootcamp, Job } from "@/lib/types";

interface Props {
  jobs: Job[];
  drafts: JobDraft[];
  onBlank: () => void;
  onTemplate: (f: Bootcamp) => void;
  onDuplicate: (j: Job) => void;
  onResume: (d: JobDraft) => void;
}

export function StartScreen({ jobs, drafts, onBlank, onTemplate, onDuplicate, onResume }: Props) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {drafts.length > 0 && (
        <Panel title={`Lanjutkan draft (${drafts.length})`}>
          <ul className="flex flex-col divide-y divide-line">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <FileText size={16} className="text-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.title.trim() || "Draft tanpa judul"} <span className="font-normal text-muted">· {d.field}</span></span>
                <Button size="sm" variant="secondary" onClick={() => onResume(d)}>Lanjutkan</Button>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Mulai dari template" className="sm:col-span-2">
          <p className="mb-3 text-sm text-muted">Skill wajib, level, dan deskripsi sudah terisi. Ubah sesuai kebutuhanmu.</p>
          <ul className="grid gap-2 sm:grid-cols-3">
            {BOOTCAMP_FIELDS.map((f) => (
              <li key={f}>
                <button type="button" onClick={() => onTemplate(f)} className="flex h-full w-full flex-col items-start gap-2 rounded-xl border border-line-strong bg-surface p-3.5 text-left transition-colors hover:border-brand-600 hover:bg-brand-50">
                  <LayoutTemplate size={18} className="text-brand-600" aria-hidden />
                  <span className="text-sm font-medium">{f}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Mulai kosong">
          <p className="mb-3 text-sm text-muted">Isi semuanya dari awal.</p>
          <Button size="sm" variant="secondary" icon={FilePlus2} onClick={onBlank}>Lowongan kosong</Button>
        </Panel>

        <Panel title="Duplikat lowongan lama">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted">Belum ada lowongan untuk disalin.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {jobs.slice(0, 4).map((j) => (
                <li key={j.id} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                  <span className="min-w-0 flex-1 truncate text-sm">{j.title}</span>
                  <Button size="sm" variant="quiet" icon={Copy} onClick={() => onDuplicate(j)}>Salin</Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
