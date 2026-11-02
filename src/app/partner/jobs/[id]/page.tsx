"use client";

import { ArrowLeft, Check, Clock, Copy, Eye, MapPin, Pencil, Briefcase, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { JobPreview } from "@/components/domain/job-wizard/review";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { Sheet } from "@/components/ui/overlay";
import { Avatar, Banner, Button, Chip, EmptyState, Panel, Pill, StatusPill } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { draftFromJob, estimateTalent } from "@/lib/jobdraft";
import { matchJob } from "@/lib/match";
import { partnerOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, isActive, slaInfo } from "@/lib/time";
import { LEVEL_LABEL, type Job } from "@/lib/types";

const MOD: Record<Job["moderation"], { label: string; tone: "ok" | "proc" | "warn" | "danger" }> = {
  tayang: { label: "Tayang", tone: "ok" },
  menunggu: { label: "Menunggu moderasi", tone: "proc" },
  revisi: { label: "Perlu revisi", tone: "warn" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-xs">
      <p className="font-display text-3xl font-bold leading-none tracking-tight">{value}</p>
      <p className="mt-1.5 text-sm text-muted">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-warn-700">{hint}</p>}
    </div>
  );
}

export default function PartnerJobDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const [preview, setPreview] = useState(false);
  const job = s.jobs.find((j) => j.id === id && j.partnerId === PARTNER_ME);

  if (!job) {
    return <EmptyState title="Lowongan tidak ditemukan" body="Lowongan ini tidak ada atau bukan milik perusahaanmu." action={<Button size="sm" href="/partner/jobs">Kembali ke lowongan</Button>} />;
  }

  const partner = partnerOf(s, PARTNER_ME);
  const apps = s.applications.filter((a) => a.jobId === job.id && !a.draft).sort((a, b) => b.sentDay - a.sentDay);
  const count = (st: string) => apps.filter((a) => a.status === st).length;
  const overdue = apps.filter((a) => slaInfo(a, s.day).state === "overdue").length;
  const draft = draftFromJob(job, `view-${job.id}`, s.day);
  const talent = estimateTalent(s.students, draft);
  const m = MOD[job.moderation];
  const required = job.requirements.filter((r) => r.weight === "wajib");
  const bonus = job.requirements.filter((r) => r.weight === "nilai-tambah");
  const steps = [
    { label: "Dikirim ke Dibimbing", done: true },
    { label: "Ditinjau Dibimbing", done: job.moderation !== "menunggu" },
    { label: "Tayang untuk student", done: job.moderation === "tayang" },
  ];

  return (
    <>
      <Link href="/partner/jobs" className="mb-3 flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden />Semua lowongan</Link>
      <PageHeader
        title={job.title}
        sub={`${job.field} · diposting ${fmtShort(job.postedDay)}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={m.tone}>{m.label}</Pill>
            <Button size="sm" variant="secondary" icon={Eye} onClick={() => setPreview(true)}>Pratinjau student</Button>
            <Button size="sm" variant="secondary" icon={Copy} href={`/partner/jobs/new?from=${job.id}`}>Duplikat</Button>
          </div>
        }
      />

      {job.moderation === "revisi" && (
        <div className="mb-4">
          <Banner tone="warn" action={<Button size="sm" variant="secondary" icon={Pencil} href={`/partner/jobs/new?revise=${job.id}`}>Perbaiki dan kirim ulang</Button>}>
            {s.revision[job.id] ?? "Dibimbing meminta revisi pada lowongan ini."}
          </Banner>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total pelamar" value={apps.length} />
        <Stat label="Perlu direview" value={count("terkirim") + count("direview")} hint={overdue > 0 ? `${overdue} melewati tenggat` : undefined} />
        <Stat label="Tahap interview" value={count("interview")} />
        <Stat label="Penawaran dan diterima" value={count("penawaran") + count("diterima")} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex flex-col gap-4">
          <Panel title={`Pelamar (${apps.length})`} flush action={apps.length > 0 ? <Button size="sm" variant="ghost" href="/partner/pipeline">Buka pipeline</Button> : undefined}>
            {apps.length === 0 ? (
              <p className="p-4 text-sm text-muted">{job.moderation === "tayang" ? "Belum ada pelamar. Undang talent yang cocok supaya lowongan ini cepat terisi." : "Pelamar baru muncul setelah lowongan tayang."}</p>
            ) : (
              <ul className="divide-y divide-line">
                {apps.map((a) => {
                  const st = studentOf(s, a.studentId);
                  if (!st) return null;
                  const match = matchJob(st, job);
                  return (
                    <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar initials={st.initials} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{st.name}</p>
                        <p className="text-xs text-muted">{match.requiredMet} dari {match.requiredTotal} skill wajib · melamar {fmtShort(a.sentDay)}</p>
                      </div>
                      <StatusPill status={a.status} overdue={isActive(a) && slaInfo(a, s.day).state === "overdue"} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Detail lowongan">
            <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
              <li className="flex items-center gap-1.5"><MapPin size={14} aria-hidden />{job.location}</li>
              <li className="flex items-center gap-1.5"><Briefcase size={14} aria-hidden />{job.workType} · {job.level}</li>
              {job.salary && <li className="flex items-center gap-1.5"><Wallet size={14} aria-hidden />{job.salary}</li>}
            </ul>
            <p className="max-w-[65ch] text-[15px] leading-relaxed">{job.description}</p>

            <h3 className="mb-2 mt-5 text-sm font-semibold">Skill wajib</h3>
            <ul className="flex flex-wrap gap-1.5">{required.map((r) => <li key={r.skill}><Chip>{r.skill} · min {LEVEL_LABEL[r.min]}</Chip></li>)}</ul>
            {bonus.length > 0 && (
              <>
                <h3 className="mb-2 mt-4 text-sm font-semibold">Nilai tambah</h3>
                <ul className="flex flex-wrap gap-1.5">{bonus.map((r) => <li key={r.skill}><Chip tone="plain">{r.skill} · min {LEVEL_LABEL[r.min]}</Chip></li>)}</ul>
              </>
            )}

            <h3 className="mb-2 mt-5 text-sm font-semibold">Pertanyaan screening</h3>
            {job.screening.length === 0 ? (
              <p className="text-sm text-muted">Tanpa pertanyaan screening. Student bisa melamar dengan satu tap.</p>
            ) : (
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">{job.screening.map((q) => <li key={q}>{q}</li>)}</ol>
            )}

            <h3 className="mb-1 mt-5 text-sm font-semibold">Lamar ulang</h3>
            <p className="text-sm text-muted">{job.reapplyWaitDays === 0 ? "Kandidat bisa langsung melamar ulang." : `Kandidat bisa melamar ulang ${job.reapplyWaitDays} hari setelah lamaran ditutup karena kemampuan.`}</p>
          </Panel>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Panel title="Status moderasi">
            <ol className="flex flex-col gap-3">
              {steps.map((st) => (
                <li key={st.label} className="flex items-center gap-3 text-sm">
                  <span className={st.done ? "grid size-6 place-items-center rounded-full bg-ok-100 text-ok-700" : "grid size-6 place-items-center rounded-full border border-line-strong text-muted"}>
                    {st.done ? <Check size={14} aria-hidden /> : <Clock size={13} aria-hidden />}
                  </span>
                  <span className={st.done ? "" : "text-muted"}>{st.label}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Talent yang cocok">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Users size={18} aria-hidden /></span>
              <div>
                <p className="font-display text-3xl font-bold leading-none tracking-tight">{talent}</p>
                <p className="mt-1 text-sm text-muted">memenuhi semua skill wajib</p>
              </div>
            </div>
            <div className="mt-4"><Button size="sm" block href={`/partner/talent?job=${job.id}`}>Lihat dan undang talent</Button></div>
          </Panel>
        </aside>
      </div>

      <Sheet open={preview} onClose={() => setPreview(false)} title="Pratinjau untuk student" width="max-w-2xl">
        <JobPreview draft={draft} partner={partner} />
      </Sheet>
    </>
  );
}
