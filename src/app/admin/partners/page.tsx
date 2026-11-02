"use client";

import clsx from "clsx";
import { Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SlaPill, TrendBars } from "@/components/domain/admin";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Button, CompanyMark, EmptyState, Panel, Pill } from "@/components/ui/primitives";
import { partnerStats } from "@/lib/admin";
import { useStore } from "@/lib/store";

const ATTENTION_BELOW = 70;

export default function AdminPartners() {
  const s = useStore();
  const [filter, setFilter] = useState<"semua" | "perhatian">("semua");
  const rows = s.partners
    .filter((p) => filter === "semua" || p.slaScore < ATTENTION_BELOW)
    .sort((a, b) => a.slaScore - b.slaScore);
  const attention = s.partners.filter((p) => p.slaScore < ATTENTION_BELOW).length;

  return (
    <>
      <PageHeader title="Partner" sub="Skor SLA hanya terlihat oleh admin. Student melihat tenggat, bukan skor. Partner dengan skor terendah di atas." />
      <div role="tablist" className="mb-4 flex gap-1 border-b border-line">
        {([["semua", `Semua (${s.partners.length})`], ["perhatian", `Perlu perhatian (${attention})`]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)} className={clsx("-mb-px h-10 border-b-2 px-3 text-sm font-medium", filter === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
        ))}
      </div>
      <ScreenGate empty={<EmptyState title="Belum ada partner" body="Partner akan muncul di sini." />}>
        <Panel flush>
          <ul className="divide-y divide-line">
            {rows.map((p) => {
              const st = partnerStats(s, p.id);
              const reminded = s.reminded[p.id] === s.day;
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <CompanyMark name={p.name} tone={p.logoTone} size={36} />
                  <Link href={`/admin/partners/${p.id}`} className="min-w-0 flex-1 basis-56">
                    <p className="font-medium hover:text-brand-700 hover:underline">{p.name}</p>
                    <p className="text-xs text-muted">{p.industry} · {p.city} · {st.live} lowongan tayang · {st.active.length} lamaran aktif</p>
                  </Link>
                  <div className="hidden w-24 sm:block"><TrendBars compact values={p.slaHistory} label={`Tren SLA ${p.name}`} /></div>
                  <SlaPill score={p.slaScore} />
                  {st.late.length > 0 && <Pill tone="due" dot={false}>{st.late.length} lewat tenggat</Pill>}
                  <Button size="sm" variant="secondary" icon={Bell} disabled={reminded} onClick={() => s.sendReminder(p.id)}>{reminded ? "Terkirim" : "Ingatkan"}</Button>
                  <Link href={`/admin/partners/${p.id}`} aria-label={`Detail ${p.name}`} className="grid size-8 place-items-center rounded-lg text-subtle hover:bg-canvas"><ChevronRight size={16} aria-hidden /></Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </ScreenGate>
    </>
  );
}
