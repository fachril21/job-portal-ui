"use client";

import { ArrowRight, Briefcase, Clock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Avatar, Button, EmptyState, Panel, Pill, StatusPill } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { jobOf, partnerOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { isActive, slaInfo } from "@/lib/time";

export default function PartnerHome() {
  const s = useStore();
  const partner = partnerOf(s, PARTNER_ME);
  const myJobIds = new Set(s.jobs.filter((j) => j.partnerId === PARTNER_ME).map((j) => j.id));
  const apps = s.applications.filter((a) => !a.draft && myJobIds.has(a.jobId));
  const active = apps.filter(isActive);
  const fresh = apps.filter((a) => a.status === "terkirim");
  const urgent = active
    .filter((a) => ["soon", "overdue"].includes(slaInfo(a, s.day).state))
    .sort((a, b) => (a.slaDue ?? 0) - (b.slaDue ?? 0));
  const queue = [...urgent, ...fresh.filter((a) => !urgent.includes(a))].slice(0, 6);
  const liveJobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME && j.moderation === "tayang").length;
  const pending = s.jobs.filter((j) => j.partnerId === PARTNER_ME && j.moderation === "menunggu").length;

  const stats = [
    { label: "Lamaran baru", value: fresh.length, icon: UserPlus },
    { label: "Mendekati tenggat", value: urgent.length, icon: Clock },
    { label: "Dalam proses", value: active.length, icon: Mail },
    { label: "Lowongan tayang", value: liveJobs, icon: Briefcase },
  ];

  return (
    <>
      <PageHeader title={`Halo, ${partner?.name ?? "Partner"}`} sub="Ringkasan hari ini dan lamaran yang menunggu responsmu." actions={<Button size="sm" href="/partner/pipeline" iconRight={ArrowRight}>Buka pipeline</Button>} />
      <ScreenGate empty={<EmptyState title="Belum ada lamaran" body="Lamaran akan muncul begitu student melamar lowonganmu." />}>
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-panel border border-line bg-surface p-4 shadow-xs">
                <dt className="flex items-center gap-2 text-xs text-muted"><Icon size={14} aria-hidden />{label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>

          {pending > 0 && <p className="rounded-panel bg-proc-100 px-4 py-2.5 text-sm text-proc-700">{pending} lowongan sedang menunggu moderasi Dibimbing.</p>}

          <Panel title="Perlu responsmu" flush action={<Link href="/partner/pipeline" className="text-xs font-medium text-brand-600 hover:underline">Lihat semua</Link>}>
            {queue.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted">Semua lamaran sudah ditanggapi. Kerja bagus.</p>
            ) : (
              <ul className="divide-y divide-line">
                {queue.map((a) => {
                  const st = studentOf(s, a.studentId);
                  const job = jobOf(s, a.jobId);
                  const sla = slaInfo(a, s.day);
                  return (
                    <li key={a.id}>
                      <Link href="/partner/pipeline" className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas">
                        <Avatar initials={st?.initials ?? "?"} size={32} />
                        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{st?.name}</span><span className="block truncate text-xs text-muted">{job?.title}</span></span>
                        <StatusPill status={a.status} />
                        {sla.state !== "none" && <Pill tone={sla.state === "normal" ? "muted" : "due"} dot={false}>{sla.pill}</Pill>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </ScreenGate>
    </>
  );
}
