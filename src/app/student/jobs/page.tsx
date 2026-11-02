"use client";

import clsx from "clsx";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { JobCard } from "@/components/domain/job";
import { ScreenGate } from "@/components/ui/gate";
import { Button, EmptyState, inputCls } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/overlay";
import { useMe } from "@/lib/hooks";
import { matchJob, matchRank } from "@/lib/match";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import type { WorkType } from "@/lib/types";

const WORK: WorkType[] = ["Onsite", "Hybrid", "Remote"];
const LEVELS = ["Magang", "Junior"] as const;

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx("flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong bg-surface text-ink hover:border-brand-500")}
    >
      {children}
    </button>
  );
}

export default function JobsPage() {
  const s = useStore();
  const me = useMe();
  const [q, setQ] = useState("");
  const [allFields, setAllFields] = useState(false);
  const [work, setWork] = useState<WorkType[]>([]);
  const [level, setLevel] = useState<string[]>([]);
  const [sheet, setSheet] = useState(false);

  const flip = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return s.jobs
      .filter((j) => j.moderation === "tayang")
      .filter((j) => allFields || j.field === me.bootcamp)
      .filter((j) => (work.length ? work.includes(j.workType) : true))
      .filter((j) => (level.length ? level.includes(j.level) : true))
      .filter((j) => (needle ? `${j.title} ${partnerOf(s, j.partnerId)?.name ?? ""} ${j.location}`.toLowerCase().includes(needle) : true))
      .map((j) => ({ j, m: matchJob(me, j) }))
      .sort((a, b) => matchRank(b.m) - matchRank(a.m));
  }, [s, me, q, allFields, work, level]);

  const activeFilters = work.length + level.length + (allFields ? 1 : 0);
  const clear = () => { setWork([]); setLevel([]); setAllFields(false); setQ(""); };

  const filters = (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-muted">Bidang</legend>
        <div className="flex flex-wrap gap-2">
          <Toggle on={!allFields} onClick={() => setAllFields(false)}>{me.bootcamp}</Toggle>
          <Toggle on={allFields} onClick={() => setAllFields(true)}>Semua bidang</Toggle>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-muted">Tipe kerja</legend>
        <div className="flex flex-wrap gap-2">{WORK.map((w) => <Toggle key={w} on={work.includes(w)} onClick={() => setWork(flip(work, w))}>{w}</Toggle>)}</div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-muted">Level</legend>
        <div className="flex flex-wrap gap-2">{LEVELS.map((l) => <Toggle key={l} on={level.includes(l)} onClick={() => setLevel(flip(level, l))}>{l}</Toggle>)}</div>
      </fieldset>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Lowongan</h1>
        <p className="mt-1 text-muted">Diurutkan dari yang paling banyak cocok dengan Passport-mu. Kamu tetap boleh melamar yang belum sepenuhnya cocok.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari posisi, perusahaan, atau kota" aria-label="Cari lowongan" className={clsx(inputCls, "pl-10")} />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {WORK.map((w) => <Toggle key={w} on={work.includes(w)} onClick={() => setWork(flip(work, w))}>{w}</Toggle>)}
          {LEVELS.map((l) => <Toggle key={l} on={level.includes(l)} onClick={() => setLevel(flip(level, l))}>{l}</Toggle>)}
          <Toggle on={allFields} onClick={() => setAllFields(!allFields)}>Semua bidang</Toggle>
        </div>
        <Button variant="secondary" icon={SlidersHorizontal} className="md:hidden" onClick={() => setSheet(true)}>Filter{activeFilters ? ` (${activeFilters})` : ""}</Button>
      </div>

      <ScreenGate empty={<EmptyState icon={SearchX} title="Belum ada lowongan tayang" body="Lowongan baru dari hiring partner akan muncul di sini setelah disetujui admin." />}>
        {list.length === 0 ? (
          <EmptyState icon={SearchX} title="Tidak ada lowongan yang cocok" body="Coba longgarkan filter atau cari dengan kata lain." action={<Button variant="secondary" onClick={clear}>Hapus filter</Button>} />
        ) : (
          <>
            <p className="text-sm text-muted" aria-live="polite">{list.length} lowongan</p>
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
              {list.map(({ j }) => <JobCard key={j.id} job={j} />)}
            </div>
          </>
        )}
      </ScreenGate>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Filter lowongan" footer={<><Button variant="ghost" onClick={clear}>Hapus</Button><Button onClick={() => setSheet(false)}>Tampilkan {list.length} lowongan</Button></>}>
        {filters}
      </Sheet>
    </div>
  );
}
