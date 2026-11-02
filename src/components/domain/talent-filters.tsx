"use client";

import clsx from "clsx";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button, inputCalmCls } from "@/components/ui/primitives";
import { SKILL_TAXONOMY } from "@/data/seed";
import { activeFilterCount, type TalentFilters } from "@/lib/talent";
import { LEVEL_LABEL, type Bootcamp, type SkillLevel, type WorkType } from "@/lib/types";

const BOOTCAMPS: Bootcamp[] = ["Data Analyst", "UI/UX Design", "Digital Marketing"];
const MODES: WorkType[] = ["Onsite", "Hybrid", "Remote"];
const TYPES = ["Full-time", "Freelance", "Magang"];
const BUDGETS = [5, 6, 7, 8, 10];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2 border-t border-line pt-4 first:border-0 first:pt-0">
      <legend className="mb-1 text-xs font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Toggle<T extends string>({ values, picked, onToggle }: { values: readonly T[]; picked: T[]; onToggle: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => {
        const on = picked.includes(v);
        return (
          <button key={v} type="button" aria-pressed={on} onClick={() => onToggle(v)} className={clsx("h-8 rounded-lg border px-3 text-[13px] font-medium transition-colors", on ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line-strong bg-surface hover:bg-canvas")}>
            {v}
          </button>
        );
      })}
    </div>
  );
}

const flip = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

interface Props {
  filters: TalentFilters;
  onChange: (f: TalentFilters) => void;
  cities: string[];
  onReset: () => void;
}

export function TalentFilterPanel({ filters, onChange, cities, onReset }: Props) {
  const [skill, setSkill] = useState(SKILL_TAXONOMY[0]);
  const [min, setMin] = useState<SkillLevel>(2);
  const set = (p: Partial<TalentFilters>) => onChange({ ...filters, ...p });
  const count = activeFilterCount(filters);

  const addSkill = () => {
    if (filters.skills.some((c) => c.skill === skill)) return;
    set({ skills: [...filters.skills, { skill, min }] });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Kriteria</h2>
        {count > 0 && <button type="button" onClick={onReset} className="text-xs font-medium text-brand-600 hover:underline">Hapus semua ({count})</button>}
      </div>

      <Group title="Bidang bootcamp">
        <Toggle values={BOOTCAMPS} picked={filters.bootcamps} onToggle={(v) => set({ bootcamps: flip(filters.bootcamps, v) })} />
      </Group>

      <Group title="Skill terverifikasi">
        {filters.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {filters.skills.map((c) => (
              <li key={c.skill} className="flex h-8 items-center gap-1 rounded-lg bg-brand-50 pl-2.5 pr-1 text-[13px] font-medium text-brand-700">
                {c.skill} min {c.min}/4
                <button type="button" aria-label={`Hapus ${c.skill}`} onClick={() => set({ skills: filters.skills.filter((x) => x.skill !== c.skill) })} className="grid size-6 place-items-center rounded-md hover:bg-brand-100"><X size={13} aria-hidden /></button>
              </li>
            ))}
          </ul>
        )}
        <select aria-label="Skill" className={inputCalmCls} value={skill} onChange={(e) => setSkill(e.target.value)}>
          {SKILL_TAXONOMY.map((k) => <option key={k}>{k}</option>)}
        </select>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.allowNear} onChange={(e) => set({ allowNear: e.target.checked })} className="size-4 accent-[#007378]" />
          Sertakan yang 1 level di bawah
        </label>
        <div className="flex gap-2">
          <select aria-label="Level minimal" className={inputCalmCls} value={min} onChange={(e) => setMin(Number(e.target.value) as SkillLevel)}>
            {([1, 2, 3, 4] as SkillLevel[]).map((l) => <option key={l} value={l}>Min {l}/4 · {LEVEL_LABEL[l]}</option>)}
          </select>
          <Button size="sm" variant="secondary" icon={Plus} onClick={addSkill}>Tambah</Button>
        </div>
      </Group>

      <Group title="Domisili atau bersedia bekerja di">
        <select aria-label="Kota" className={inputCalmCls} value={filters.city} onChange={(e) => set({ city: e.target.value })}>
          <option value="">Semua kota</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Group>

      <Group title="Model kerja">
        <Toggle values={MODES} picked={filters.workModes} onToggle={(v) => set({ workModes: flip(filters.workModes, v) })} />
      </Group>

      <Group title="Tipe kerja">
        <Toggle values={TYPES} picked={filters.jobTypes} onToggle={(v) => set({ jobTypes: flip(filters.jobTypes, v) })} />
      </Group>

      <Group title="Anggaran gaji per bulan">
        <select aria-label="Anggaran gaji" className={inputCalmCls} value={filters.budget ?? ""} onChange={(e) => set({ budget: e.target.value ? Number(e.target.value) * 1_000_000 : null })}>
          <option value="">Bebas</option>
          {BUDGETS.map((b) => <option key={b} value={b}>Hingga Rp{b} juta</option>)}
        </select>
        <p className="text-xs text-muted">Menampilkan talent yang ekspektasi minimalnya masuk anggaranmu.</p>
      </Group>

      <Group title="Asal akun">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.onlyBootcamp} onChange={(e) => set({ onlyBootcamp: e.target.checked })} className="size-4 accent-[#007378]" />
          Hanya student bootcamp
        </label>
        <p className="text-xs text-muted">Hanya student bootcamp yang punya skill terverifikasi dan penilaian mentor.</p>
      </Group>

      <Group title="Kelengkapan">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.hasCv} onChange={(e) => set({ hasCv: e.target.checked })} className="size-4 accent-[#007378]" />
          Sudah mengunggah CV
        </label>
      </Group>
    </div>
  );
}
