"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SlaPill, TrendBars, daysAgo } from "@/components/domain/admin";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { Avatar, Button, CompanyMark, EmptyState, Panel, Pill } from "@/components/ui/primitives";
import { daysLate, partnerStats } from "@/lib/admin";
import { jobOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import type { Job } from "@/lib/types";

const MOD: Record<Job["moderation"], { label: string; tone: "ok" | "proc" | "warn" | "danger" }> = {
  tayang: { label: "Tayang", tone: "ok" },
  menunggu: { label: "Menunggu moderasi", tone: "proc" },
  revisi: { label: "Perlu revisi", tone: "warn" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

export default function AdminPartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const p = s.partners.find((x) => x.id === id);
  if (!p) return <EmptyState title="Partner tidak ditemukan" body="Partner ini tidak ada di data demo." action={<Button size="sm" href="/admin/partners">Kembali</Button>} />;

  const st = partnerStats(s, p.id);
  const reminded = s.reminded[p.id] === s.day;
  const delta = p.slaHistory[p.slaHistory.length - 1] - p.slaHistory[0];

  return (
    <>
      <Link href="/admin/partners" className="mb-3 flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden />Semua partner</Link>
      <PageHeader
        title={p.name}
        sub={`${p.industry} · ${p.city} · PIC ${p.contact}`}
        actions={<div className="flex items-center gap-2"><SlaPill score={p.slaScore} /><Button size="sm" variant="secondary" icon={Bell} disabled={reminded} onClick={() => s.sendReminder(p.id)}>{reminded ? "Pengingat terkirim" : "Kirim pengingat SLA"}</Button></div>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Lowongan tayang", st.live], ["Lamaran aktif", st.active.length], ["Lewat tenggat", st.late.length], ["Pengingat dikirim", st.reminders.length]].map(([label, v]) => (
          <div key={label} className="rounded-panel border border-line bg-surface p-4 shadow-xs">
            <p className="font-display text-3xl font-bold leading-none tracking-tight">{v}</p>
            <p className="mt-1.5 text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-4">
          <Panel title="Lamaran melewati tenggat" flush>
            {st.late.length === 0 ? (
              <p className="p-4 text-sm text-muted">Tidak ada lamaran yang melewati tenggat.</p>
            ) : (
              <ul className="divide-y divide-line">
                {st.late.map((a) => {
                  const stu = studentOf(s, a.studentId);
                  return (
                    <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar initials={stu?.initials ?? "?"} size={32} />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{stu?.name}</p><p className="truncate text-xs text-muted">{jobOf(s, a.jobId)?.title} · dikirim {fmtShort(a.sentDay)}</p></div>
                      {a.followUpRequested && !a.followUpAnswered && <Pill tone="proc" dot={false}>Follow up diminta</Pill>}
                      <Pill tone="due" dot={false}>{daysLate(a, s.day)} hari lewat</Pill>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title={`Lowongan (${st.jobs.length})`} flush>
            <ul className="divide-y divide-line">
              {st.jobs.map((j) => {
                const m = MOD[j.moderation];
                const n = s.applications.filter((a) => a.jobId === j.id && !a.draft).length;
                return (
                  <li key={j.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{j.title}</p><p className="text-xs text-muted">{j.field} · {j.location} · diposting {fmtShort(j.postedDay)}</p></div>
                    <span className="text-sm text-muted">{n} pelamar</span>
                    <Pill tone={m.tone}>{m.label}</Pill>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <aside className="flex flex-col gap-4">
          <Panel title="Tren SLA 8 minggu">
            <TrendBars values={p.slaHistory} label={`Tren SLA ${p.name}`} />
            <p className="mt-3 text-xs text-muted">{delta === 0 ? "Stabil dalam 8 minggu terakhir." : delta > 0 ? `Naik ${delta} poin dalam 8 minggu.` : `Turun ${Math.abs(delta)} poin dalam 8 minggu.`}</p>
          </Panel>
          <Panel title="Riwayat pengingat">
            {st.reminders.length === 0 ? (
              <p className="text-sm text-muted">Belum pernah diberi pengingat.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {st.reminders.map((d, i) => <li key={i} className="flex justify-between"><span>Pengingat SLA</span><span className="text-muted">{fmtShort(d)} · {daysAgo(d, s.day)}</span></li>)}
              </ul>
            )}
          </Panel>
          <div className="flex items-center gap-2 text-xs text-muted"><CompanyMark name={p.name} tone={p.logoTone} size={24} />Skor SLA tidak ditampilkan ke student.</div>
        </aside>
      </div>
    </>
  );
}
