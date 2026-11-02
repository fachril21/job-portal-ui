"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Button, EmptyState, Panel, Pill, inputCalmCls } from "@/components/ui/primitives";
import { BOOTCAMP_FIELDS, SKILL_BY_FIELD } from "@/data/job-templates";
import { TAGS, tagById, TYPE_LABEL } from "@/data/taxonomy";
import { useStore } from "@/lib/store";
import type { Bootcamp } from "@/lib/types";

type Tab = "pemetaan" | "skill" | "tag";

export default function AdminTaxonomy() {
  const s = useStore();
  const [tab, setTab] = useState<Tab>("pemetaan");
  const [name, setName] = useState("");
  const [field, setField] = useState<Bootcamp>("Data Analyst");

  const jobsUsing = (skill: string) => s.jobs.filter((j) => j.requirements.some((r) => r.skill === skill)).length;
  const studentsHaving = (skill: string) => s.students.filter((st) => st.skills.some((k) => k.skill === skill)).length;
  const tagUse = (id: string) => s.applications.filter((a) => a.closure?.tagIds.includes(id)).length;
  const categories = [...new Set(TAGS.map((t) => t.category))];

  return (
    <>
      <PageHeader title="Taksonomi dan mapping" sub="Kelola skill, tag alasan penutupan, dan pemetaan tag ke saran arah belajar." />
      <div role="tablist" className="mb-4 flex gap-1 border-b border-line">
        {([["pemetaan", "Pemetaan saran belajar"], ["skill", "Skill"], ["tag", "Tag alasan"]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={clsx("-mb-px h-10 border-b-2 px-3 text-sm font-medium", tab === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
        ))}
      </div>

      <ScreenGate empty={<EmptyState title="Belum ada data" body="Taksonomi muncul di sini." />}>
        {tab === "pemetaan" && (
          <div className="flex flex-col gap-3">
            <p className="max-w-[65ch] text-sm text-muted">Alasan penutupan dari partner diterjemahkan menjadi saran arah belajar untuk student. Ubah judulnya bila kurikulum berubah.</p>
            {s.mappings.map((m) => (
              <Panel key={m.tagId} title={tagById(m.tagId)?.label ?? m.tagId} action={<span className="text-xs text-muted">dipakai {tagUse(m.tagId)}×</span>}>
                <ul className="flex flex-col gap-2">
                  {m.items.map((it, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2">
                      <Pill tone="learn" dot={false}>{TYPE_LABEL[it.type]}</Pill>
                      <input aria-label={`Judul item ${i + 1} untuk ${tagById(m.tagId)?.label}`} className={`${inputCalmCls} min-w-0 flex-1 basis-64`} value={it.title} onChange={(e) => s.editMapping(m.tagId, i, e.target.value)} />
                      <span className="text-xs text-muted">{it.estimate}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        )}

        {tab === "skill" && (
          <div className="flex flex-col gap-4">
            <Panel title="Tambah skill">
              <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); s.addSkill(name, field); setName(""); }}>
                <label className="flex min-w-0 flex-1 basis-56 flex-col gap-1.5 text-xs font-medium">Nama skill<input className={inputCalmCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Looker Studio" /></label>
                <label className="flex w-48 flex-col gap-1.5 text-xs font-medium">Bidang
                  <select className={inputCalmCls} value={field} onChange={(e) => setField(e.target.value as Bootcamp)}>{BOOTCAMP_FIELDS.map((f) => <option key={f}>{f}</option>)}</select>
                </label>
                <Button size="sm" icon={Plus} type="submit" disabled={!name.trim()}>Tambah</Button>
              </form>
              <p className="mt-2 text-xs text-muted">Skill baru muncul di taksonomi dan bisa dipakai partner di lowongan setelah dipetakan ke kurikulum.</p>
            </Panel>
            {BOOTCAMP_FIELDS.map((f) => {
              const custom = s.customSkills.filter((k) => k.field === f);
              return (
                <Panel key={f} title={f} flush>
                  <ul className="divide-y divide-line">
                    {SKILL_BY_FIELD[f].map((k) => (
                      <li key={k} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <span className="flex-1 font-medium">{k}</span>
                        <span className="text-xs text-muted">{jobsUsing(k)} lowongan · {studentsHaving(k)} student</span>
                      </li>
                    ))}
                    {custom.map((k) => (
                      <li key={k.name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <input aria-label={`Nama skill ${k.name}`} className={`${inputCalmCls} flex-1`} defaultValue={k.name} onBlur={(e) => e.target.value.trim() && e.target.value !== k.name && s.renameSkill(k.name, e.target.value.trim())} />
                        <Pill tone="proc" dot={false}>Baru</Pill>
                        <span className="text-xs text-muted">belum dipakai</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              );
            })}
          </div>
        )}

        {tab === "tag" && (
          <div className="flex flex-col gap-4">
            <p className="max-w-[65ch] text-sm text-muted">Nama tag yang diubah langsung dipakai di modal tutup lamaran partner, feedback student, dan analitik.</p>
            {categories.map((c) => (
              <Panel key={c} title={c} flush>
                <ul className="divide-y divide-line">
                  {TAGS.filter((t) => t.category === c).map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                      <input aria-label={`Nama tag ${t.label}`} className={`${inputCalmCls} min-w-0 flex-1 basis-56`} defaultValue={tagById(t.id)?.label} onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== tagById(t.id)?.label && s.renameTag(t.id, e.target.value.trim())} />
                      {t.triggersRoadmap && <Pill tone="learn" dot={false}>Memicu saran belajar</Pill>}
                      <span className="text-xs text-muted">dipakai {tagUse(t.id)}×</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        )}
      </ScreenGate>
    </>
  );
}
