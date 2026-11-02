"use client";

import { ArrowRight, BriefcaseBusiness, Clock, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { TrendBars, daysAgo } from "@/components/domain/admin";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Avatar, EmptyState, Panel, Pill } from "@/components/ui/primitives";
import { daysLate, followUpCases, overdueApps, platformTrend } from "@/lib/admin";
import { jobOf, partnerOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { isActive } from "@/lib/time";

export default function AdminHome() {
  const s = useStore();
  const apps = s.applications.filter((a) => !a.draft);
  const active = apps.filter(isActive);
  const late = overdueApps(s);
  const closedByCompany = apps.filter((a) => a.status === "ditutup" && a.closure?.by === "perusahaan");
  const withTags = closedByCompany.filter((a) => a.closure && a.closure.tagIds.length > 0);
  const pendingJobs = s.jobs.filter((j) => j.moderation === "menunggu").length;
  const cases = followUpCases(s);
  const onTime = active.length === 0 ? 100 : Math.round(((active.length - late.length) / active.length) * 100);
  const reasonRate = closedByCompany.length === 0 ? 100 : Math.round((withTags.length / closedByCompany.length) * 100);
  const trend = platformTrend(s.partners);

  const stats = [
    { label: "Lamaran aktif", value: String(active.length), icon: Users },
    { label: "Dalam batas SLA", value: `${onTime}%`, icon: Clock },
    { label: "Ditutup dengan alasan", value: `${reasonRate}%`, icon: ShieldCheck },
    { label: "Lowongan menunggu", value: String(pendingJobs), icon: BriefcaseBusiness },
  ];
  const todo = [
    { n: pendingJobs, label: "lowongan perlu dimoderasi", href: "/admin/moderation" },
    { n: cases.waiting.length, label: "follow up student menunggu Talent Support", href: "/admin/followups" },
    { n: late.length, label: "lamaran melewati tenggat", href: "/admin/partners" },
  ];

  return (
    <>
      <PageHeader title="Ringkasan" sub="Kesehatan marketplace hari ini. Angka dihitung dari data demo." />
      <ScreenGate empty={<EmptyState title="Belum ada data" body="Metrik muncul setelah ada lamaran." />}>
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-panel border border-line bg-surface p-4 shadow-xs">
                <dt className="flex items-center gap-2 text-xs text-muted"><Icon size={14} aria-hidden />{label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <Panel title="Perlu tindakan" flush>
              <ul className="divide-y divide-line">
                {todo.map((t) => (
                  <li key={t.label}>
                    <Link href={t.href} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-canvas">
                      <span className="grid size-7 place-items-center rounded-lg bg-brand-50 font-semibold text-brand-700">{t.n}</span>
                      <span className="flex-1">{t.label}</span>
                      <ArrowRight size={15} className="text-subtle" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Rata-rata SLA partner, 8 minggu"><TrendBars values={trend} label="Rata-rata skor SLA seluruh partner" /></Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <Panel title="Terlambat paling lama" flush action={<Link href="/admin/partners" className="text-xs font-medium text-brand-600 hover:underline">Semua partner</Link>}>
              {late.length === 0 ? <p className="p-4 text-sm text-muted">Tidak ada lamaran yang melewati tenggat.</p> : (
                <ul className="divide-y divide-line">
                  {late.slice(0, 5).map((a) => {
                    const j = jobOf(s, a.jobId);
                    return (
                      <li key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <div className="min-w-0 flex-1"><p className="truncate font-medium">{j?.title}</p><p className="truncate text-xs text-muted">{partnerOf(s, j?.partnerId ?? "")?.name} · {studentOf(s, a.studentId)?.name}</p></div>
                        <Pill tone="due" dot={false}>{daysLate(a, s.day)} hari</Pill>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
            <Panel title="Follow up menunggu" flush action={<Link href="/admin/followups" className="text-xs font-medium text-brand-600 hover:underline">Buka antrean</Link>}>
              {cases.waiting.length === 0 ? <p className="p-4 text-sm text-muted">Antrean follow up kosong.</p> : (
                <ul className="divide-y divide-line">
                  {cases.waiting.slice(0, 4).map((a) => {
                    const st = studentOf(s, a.studentId);
                    return (
                      <li key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <Avatar initials={st?.initials ?? "?"} size={30} />
                        <div className="min-w-0 flex-1"><p className="truncate font-medium">{st?.name}</p><p className="truncate text-xs text-muted">{jobOf(s, a.jobId)?.title}</p></div>
                        <span className="text-xs text-muted">{a.followUpDay !== undefined ? daysAgo(a.followUpDay, s.day) : ""}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </ScreenGate>
    </>
  );
}
