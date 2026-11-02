"use client";

import clsx from "clsx";
import { Info, Plus, Trash2 } from "lucide-react";
import { Segmented } from "./ui";
import { Banner, Button, Field, Panel, inputCalmCls } from "@/components/ui/primitives";
import { BOOTCAMP_FIELDS, LEVEL_HELP, SCREENING_IDEAS, SKILL_BY_FIELD } from "@/data/job-templates";
import { CITIES, MAX_REQUIRED, MAX_SCREENING, MIN_DESCRIPTION, WAIT_OPTIONS, formatSalary, type DraftErrors, type JobDraft } from "@/lib/jobdraft";
import { LEVEL_LABEL, type Requirement, type SkillLevel } from "@/lib/types";

interface StepProps {
  draft: JobDraft;
  patch: (p: Partial<JobDraft>) => void;
  errors: DraftErrors;
}

const numOrNull = (v: string): number | null => (v.trim() === "" ? null : Number(v.replace(",", ".")));
const textareaCls = "w-full rounded-lg border border-line-strong bg-surface p-3 text-sm outline-none focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]";

export function StepBasics({ draft, patch, errors }: StepProps) {
  const count = draft.description.trim().length;
  const salary = formatSalary(draft.salaryMin, draft.salaryMax);
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Posisi">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Judul posisi" htmlFor="jt" error={errors.title} hint="Gunakan nama yang dicari student, misalnya Junior Data Analyst.">
              <input id="jt" className={inputCalmCls} value={draft.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Junior Data Analyst" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Bidang bootcamp" hint="Lowongan tampil lebih dulu untuk student di bidang ini, dan dipakai untuk memperkirakan talent yang cocok.">
              <Segmented label="Bidang bootcamp" className="w-full" value={draft.field} onChange={(v) => patch({ field: v })} options={BOOTCAMP_FIELDS.map((f) => ({ value: f, label: f }))} />
            </Field>
          </div>
          <Field label="Level">
            <Segmented label="Level" className="w-full" value={draft.level} onChange={(v) => patch({ level: v })} options={[{ value: "Magang", label: "Magang" }, { value: "Junior", label: "Junior" }]} />
          </Field>
          <Field label="Model kerja">
            <Segmented label="Model kerja" className="w-full" value={draft.workType} onChange={(v) => patch({ workType: v })} options={["Onsite", "Hybrid", "Remote"].map((w) => ({ value: w as typeof draft.workType, label: w }))} />
          </Field>

          <Field label="Lokasi kerja" htmlFor="jl">
            <select id="jl" className={inputCalmCls} value={draft.location} onChange={(e) => patch({ location: e.target.value })}>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div>
            <Field label="Kisaran gaji per bulan (juta rupiah, opsional)" error={errors.salary}>
              <div className="flex items-center gap-2">
                <input aria-label="Gaji minimal" inputMode="decimal" className={inputCalmCls} value={draft.salaryMin ?? ""} onChange={(e) => patch({ salaryMin: numOrNull(e.target.value) })} placeholder="6" />
                <span className="text-muted" aria-hidden>–</span>
                <input aria-label="Gaji maksimal" inputMode="decimal" className={inputCalmCls} value={draft.salaryMax ?? ""} onChange={(e) => patch({ salaryMax: numOrNull(e.target.value) })} placeholder="8" />
              </div>
            </Field>
            <p className="mt-1.5 text-xs text-muted">{salary ? `Tampil di student sebagai: ${salary}` : "Lowongan dengan gaji tertera lebih sering dilamar."}</p>
          </div>
        </div>
      </Panel>

      <Panel title="Tentang posisi">
        <Field label="Deskripsi pekerjaan" htmlFor="jd" error={errors.description} hint="Apa yang dikerjakan sehari-hari, dengan siapa, dan hasil apa yang diharapkan.">
          <textarea id="jd" rows={6} className={textareaCls} value={draft.description} onChange={(e) => patch({ description: e.target.value })} />
        </Field>
        <p className={clsx("mt-1.5 text-xs", count >= MIN_DESCRIPTION ? "text-ok-700" : "text-muted")}>{count} / minimal {MIN_DESCRIPTION} karakter</p>
      </Panel>
    </div>
  );
}

export function StepSkills({ draft, patch, errors }: StepProps) {
  const have = new Set(draft.reqs.map((r) => r.skill));
  const suggestions = SKILL_BY_FIELD[draft.field].filter((k) => !have.has(k));
  const required = draft.reqs.filter((r) => r.weight === "wajib").length;
  const setReq = (i: number, p: Partial<Requirement>) => patch({ reqs: draft.reqs.map((r, idx) => (idx === i ? { ...r, ...p } : r)) });
  const add = (skill: string) => patch({ reqs: [...draft.reqs, { skill, min: 2, weight: draft.reqs.length < 3 ? "wajib" : "nilai-tambah" }] });

  return (
    <div className="flex flex-col gap-4">
      <Panel title={`Disarankan untuk ${draft.field}`}>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted">Semua skill yang disarankan sudah ditambahkan.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {suggestions.map((k) => (
              <li key={k}>
                <button type="button" onClick={() => add(k)} className="flex h-8 items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 text-[13px] font-medium hover:bg-canvas">
                  <Plus size={13} aria-hidden />{k}
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">Skill diambil dari taksonomi Dibimbing sehingga cocok langsung dengan Skill Passport student.</p>
      </Panel>

      <Panel title={`Skill yang dibutuhkan (${draft.reqs.length})`}>
        {draft.reqs.length === 0 ? (
          <p className="text-sm text-muted">Belum ada skill. Pilih dari saran di atas.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {draft.reqs.map((r, i) => (
              <li key={r.skill} className="flex flex-col gap-2.5 rounded-xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.skill}</span>
                  <button type="button" aria-label={`Hapus ${r.skill}`} onClick={() => patch({ reqs: draft.reqs.filter((_, idx) => idx !== i) })} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-700"><Trash2 size={15} aria-hidden /></button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Segmented label={`Level minimal ${r.skill}`} value={r.min} onChange={(v) => setReq(i, { min: v as SkillLevel })} options={([1, 2, 3, 4] as SkillLevel[]).map((l) => ({ value: l, label: `${l} ${LEVEL_LABEL[l]}` }))} />
                  <Segmented label={`Bobot ${r.skill}`} value={r.weight} onChange={(v) => setReq(i, { weight: v })} options={[{ value: "wajib", label: "Wajib" }, { value: "nilai-tambah", label: "Nilai tambah" }]} />
                </div>
                <p className="text-xs text-muted">Level {r.min}: {LEVEL_HELP[r.min]}</p>
              </li>
            ))}
          </ul>
        )}
        {errors.reqs && <p className="mt-2 text-xs text-danger-700">{errors.reqs}</p>}
        {required > MAX_REQUIRED && <div className="mt-3"><Banner tone="warn">{required} skill wajib akan mempersempit kandidat. Pertimbangkan menjadikan sebagian nilai tambah.</Banner></div>}
      </Panel>
    </div>
  );
}

export function StepScreening({ draft, patch, errors }: StepProps) {
  const unused = SCREENING_IDEAS.filter((q) => !draft.screening.includes(q));
  return (
    <div className="flex flex-col gap-4">
      <Panel title={`Pertanyaan screening (${draft.screening.length}/${MAX_SCREENING})`} action={draft.screening.length < MAX_SCREENING ? <Button size="sm" variant="ghost" icon={Plus} onClick={() => patch({ screening: [...draft.screening, ""] })}>Tambah</Button> : null}>
        {draft.screening.length === 0 ? (
          <p className="text-sm text-muted">Opsional. Semakin sedikit pertanyaan, semakin banyak student yang menyelesaikan lamaran.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {draft.screening.map((q, i) => (
              <li key={i} className="flex items-center gap-2">
                <input aria-label={`Pertanyaan ${i + 1}`} className={inputCalmCls} value={q} onChange={(e) => patch({ screening: draft.screening.map((x, idx) => (idx === i ? e.target.value : x)) })} placeholder="Tulis pertanyaan" />
                <button type="button" aria-label="Hapus pertanyaan" onClick={() => patch({ screening: draft.screening.filter((_, idx) => idx !== i) })} className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-700"><Trash2 size={16} aria-hidden /></button>
              </li>
            ))}
          </ul>
        )}
        {errors.screening && <p className="mt-2 text-xs text-danger-700">{errors.screening}</p>}
        {unused.length > 0 && draft.screening.length < MAX_SCREENING && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium">Ide pertanyaan</p>
            <ul className="flex flex-wrap gap-2">
              {unused.map((q) => (
                <li key={q}><button type="button" onClick={() => patch({ screening: [...draft.screening.filter((x) => x.trim()), q] })} className="h-8 rounded-lg border border-line-strong bg-surface px-3 text-left text-[13px] hover:bg-canvas">{q}</button></li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel title="Lamar ulang">
        <Field label="Masa tunggu sebelum kandidat boleh melamar ulang" hint="Berlaku bila lamaran ditutup karena kemampuan. Masa tunggu pendek memberi kandidat kesempatan belajar dan mencoba lagi.">
          <Segmented label="Masa tunggu" value={draft.wait} onChange={(v) => patch({ wait: v })} options={WAIT_OPTIONS.map((d) => ({ value: d, label: d === 0 ? "Tanpa" : `${d} hari` }))} />
        </Field>
      </Panel>

      <div className="flex items-start gap-2 rounded-xl bg-proc-100 p-3.5 text-sm text-proc-700">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
        <p>Setiap lowongan di Dibimbing Career Hub berkomitmen merespons dalam 7 hari kalender, dan menutup lamaran dengan tag alasan. Student melihat komitmen ini di halaman lowongan.</p>
      </div>
    </div>
  );
}
