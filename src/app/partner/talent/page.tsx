"use client";

import clsx from "clsx";
import { BadgeCheck, Bookmark, FileText, Search, SlidersHorizontal, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { CvSheet } from "@/components/domain/cv";
import { TalentFilterPanel } from "@/components/domain/talent-filters";
import { TalentProfileSheet } from "@/components/domain/talent-profile";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Sheet } from "@/components/ui/overlay";
import { Avatar, Button, EmptyState, Pill, inputCalmCls } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import {
  EMPTY_FILTERS, activeFilterCount, avgProjectScore, filtersFromJob, matchTalent, salaryRange, sortTalent,
  type TalentFilters, type TalentSort,
} from "@/lib/talent";
import { useStore } from "@/lib/store";
import type { Student } from "@/lib/types";

const SORTS: { id: TalentSort; label: string }[] = [
  { id: "cocok", label: "Skill terkuat" },
  { id: "skor", label: "Skor project tertinggi" },
  { id: "gaji", label: "Ekspektasi gaji terendah" },
];

export default function TalentPage() {
  return (
    <Suspense fallback={null}>
      <TalentInner />
    </Suspense>
  );
}

function TalentInner() {
  const s = useStore();
  const jobParam = useSearchParams().get("job") ?? "";
  const [filters, setFilters] = useState<TalentFilters>(() => {
    const st = useStore.getState();
    const job = st.jobs.find((j) => j.id === jobParam && j.partnerId === PARTNER_ME);
    const cities = [...new Set(st.students.flatMap((x) => [x.city, ...x.profile.preference.locations]))];
    return job ? filtersFromJob(job, cities) : EMPTY_FILTERS;
  });
  const [sort, setSort] = useState<TalentSort>("cocok");
  const [tab, setTab] = useState<"semua" | "tersimpan">("semua");
  const [jobId, setJobId] = useState(jobParam);
  const [open, setOpen] = useState<Student | null>(null);
  const [cvOf, setCvOf] = useState<Student | null>(null);
  const [panel, setPanel] = useState(false);

  const pool = useMemo(() => s.students.filter((st) => st.openToBeFound && st.status === "lulus"), [s.students]);
  const cities = useMemo(() => [...new Set(pool.flatMap((st) => [st.city, ...st.profile.preference.locations]))].sort(), [pool]);
  const myJobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME && (j.moderation === "tayang" || j.moderation === "menunggu"));

  const results = useMemo(() => {
    const hits = pool
      .map((st) => ({ st, m: matchTalent(st, filters) }))
      .filter((x) => x.m.ok && (tab === "semua" || s.shortlist.includes(x.st.id)));
    const order = sortTalent(hits.map((x) => x.st), sort);
    return order.map((st) => {
      const m = hits.find((x) => x.st.id === st.id)?.m;
      return { st, met: m?.metSkills ?? [], near: m?.nearSkills ?? [] };
    });
  }, [pool, filters, sort, tab, s.shortlist]);

  const invited = (id: string) => !!s.flags[`invited-${id}`];
  const invite = (st: Student) => {
    const store = useStore.getState();
    store.setFlag(`invited-${st.id}`);
    store.toast(`Undangan melamar dikirim ke ${st.name}.`, "ok", "partner");
    store.addLog(`Partner mengundang ${st.name} untuk melamar`);
  };
  const applyJob = (id: string) => {
    setJobId(id);
    const job = myJobs.find((j) => j.id === id);
    setFilters(job ? filtersFromJob(job, cities) : EMPTY_FILTERS);
  };
  const reset = () => { setFilters(EMPTY_FILTERS); setJobId(""); };
  const count = activeFilterCount(filters);
  const panelNode = <TalentFilterPanel filters={filters} onChange={(f) => { setFilters(f); setJobId(""); }} cities={cities} onReset={reset} />;

  return (
    <>
      <PageHeader
        title="Talent"
        sub="Lulusan yang membuka Passport-nya untuk ditemukan. Kontak pribadi baru dibagikan setelah kandidat menerima undanganmu."
        actions={
          <select aria-label="Isi kriteria dari lowongan" value={jobId} onChange={(e) => applyJob(e.target.value)} className={clsx(inputCalmCls, "w-56")}>
            <option value="">Isi kriteria dari lowongan…</option>
            {myJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-4 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-panel border border-line bg-surface p-4 shadow-xs">{panelNode}</div></aside>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-0 flex-1 basis-56">
              <span className="sr-only">Cari nama, headline, atau skill</span>
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" aria-hidden />
              <input className={`${inputCalmCls} pl-9`} placeholder="Cari nama, headline, atau skill" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
            </label>
            <select aria-label="Urutkan" className={`${inputCalmCls} w-52`} value={sort} onChange={(e) => setSort(e.target.value as TalentSort)}>
              {SORTS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <Button size="sm" variant="secondary" icon={SlidersHorizontal} className="lg:hidden" onClick={() => setPanel(true)}>Kriteria{count > 0 ? ` (${count})` : ""}</Button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div role="tablist" className="flex gap-1 border-b border-line">
              {([["semua", "Semua talent"], ["tersimpan", `Tersimpan (${s.shortlist.length})`]] as const).map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={clsx("-mb-px h-9 border-b-2 px-3 text-sm font-medium", tab === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
              ))}
            </div>
            <p className="text-sm text-muted" aria-live="polite">{results.length} talent cocok</p>
          </div>

          <ScreenGate empty={<EmptyState icon={Users} title="Belum ada talent" body="Talent muncul di sini bila lulusan membuka Passport-nya untuk ditemukan." />}>
            {results.length === 0 ? (
              <EmptyState
                icon={Users}
                title={tab === "tersimpan" ? "Belum ada talent tersimpan" : "Tidak ada talent yang memenuhi semua kriteria"}
                body={tab === "tersimpan" ? "Simpan talent dari daftar untuk membandingkannya nanti." : "Coba turunkan level minimal skill, lepas satu kriteria, atau perluas anggaran."}
                action={count > 0 && tab === "semua" ? <Button size="sm" variant="secondary" onClick={reset}>Hapus semua kriteria</Button> : undefined}
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {results.map(({ st, met, near }) => <TalentRow key={st.id} st={st} met={met} near={near} saved={s.shortlist.includes(st.id)} invited={invited(st.id)} onOpen={() => setOpen(st)} onCv={() => setCvOf(st)} onSave={() => s.toggleShortlist(st.id)} onInvite={() => invite(st)} />)}
              </ul>
            )}
          </ScreenGate>
        </div>
      </div>

      <Sheet open={panel} onClose={() => setPanel(false)} title="Kriteria talent" footer={<Button size="sm" onClick={() => setPanel(false)}>Lihat {results.length} talent</Button>}>
        {panelNode}
      </Sheet>
      <TalentProfileSheet student={cvOf ? null : open} onClose={() => setOpen(null)} onInvite={invite} invited={open ? invited(open.id) : false} />
      {cvOf && <CvSheet student={cvOf} open onClose={() => setCvOf(null)} />}
    </>
  );
}

interface RowProps {
  st: Student;
  met: string[];
  near: string[];
  saved: boolean;
  invited: boolean;
  onOpen: () => void;
  onCv: () => void;
  onSave: () => void;
  onInvite: () => void;
}

function TalentRow({ st, met, near, saved, invited, onOpen, onCv, onSave, onInvite }: RowProps) {
  const p = st.profile;
  const top = [...st.skills].sort((a, b) => Number(met.includes(b.skill) || near.includes(b.skill)) - Number(met.includes(a.skill) || near.includes(a.skill)) || b.level - a.level).slice(0, 5);
  return (
    <li className="flex flex-col gap-3 rounded-panel border border-line bg-surface p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span className={clsx("rounded-full", st.isBootcamp && "ring-2 ring-brand-600 ring-offset-2 ring-offset-surface")}><Avatar initials={st.initials} size={44} /></span>
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <span className="flex items-center gap-2"><span className="truncate font-medium hover:underline">{st.name}</span>{st.isBootcamp && <Pill tone="proc" dot={false}><BadgeCheck size={12} aria-hidden />Student Bootcamp</Pill>}</span>
          <span className="block truncate text-sm text-muted">{p.headline}</span>
          <span className="block truncate text-xs text-muted">{st.isBootcamp ? `${st.bootcamp} · ${st.batch} · ${st.city}` : `${st.city} · minat ${st.bootcamp}`}</span>
        </button>
        <div className="shrink-0 text-right">
          <p className="text-sm font-medium">{salaryRange(p.preference.salaryMin, p.preference.salaryMax)}</p>
          <p className="text-xs text-muted">per bulan</p>
        </div>
      </div>

      {!st.isBootcamp && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Keahlian diisi sendiri">
          {p.selfSkills.map((k) => <li key={k} className="flex h-7 items-center rounded-full border border-line bg-canvas px-2.5 text-xs font-medium text-muted">{k}</li>)}
        </ul>
      )}
      {st.isBootcamp && <ul className="flex flex-wrap gap-1.5" aria-label="Skill terverifikasi">
        {top.map((k) => (
          <li key={k.skill} className={clsx("flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium", met.includes(k.skill) ? "bg-brand-50 text-brand-700" : near.includes(k.skill) ? "bg-warn-100 text-warn-700" : "border border-line bg-canvas text-muted")}>
            {k.skill}<span className="font-normal opacity-80">{k.level}/4{near.includes(k.skill) ? " · hampir" : ""}</span>
          </li>
        ))}
      </ul>}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          {st.isBootcamp ? <Pill tone="muted" dot={false}>Project {avgProjectScore(st)}/100</Pill> : <span>Keahlian diisi sendiri</span>}
          <span>{p.preference.workModes.join(", ")}</span><span aria-hidden>·</span><span>{p.preference.jobTypes.join(", ")}</span>
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="quiet" icon={Bookmark} aria-pressed={saved} onClick={onSave}>{saved ? "Tersimpan" : "Simpan"}</Button>
          {p.cv && <Button size="sm" variant="secondary" icon={FileText} onClick={onCv}>CV</Button>}
          <Button size="sm" variant={invited ? "secondary" : "primary"} disabled={invited} onClick={onInvite}>{invited ? "Terkirim" : "Undang"}</Button>
        </div>
      </div>
    </li>
  );
}
