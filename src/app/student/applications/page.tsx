"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { SlaLine } from "@/components/domain/application";
import { ScreenGate } from "@/components/ui/gate";
import { Button, CompanyMark, EmptyState, StatusPill } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { appsOfStudent, groupApps, jobOf, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, slaInfo } from "@/lib/time";
import type { Application } from "@/lib/types";

function Row({ app }: { app: Application }) {
  const s = useStore();
  const job = jobOf(s, app.jobId);
  const partner = partnerOf(s, job?.partnerId ?? "");
  const sla = slaInfo(app, s.day);
  const closedLine = app.status === "ditutup" ? `Ditutup ${fmtShort(app.closure?.day ?? s.day)}` : app.status === "penawaran" ? "Penawaran menunggu jawabanmu" : "";
  return (
    <li>
      <Link
        href={`/student/applications/${app.id}`}
        className="flex items-start gap-4 rounded-tile border border-line bg-surface p-4 shadow-xs transition-[box-shadow,transform,border-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:shadow-sm md:p-5"
      >
        <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h3 className="truncate font-semibold tracking-tight">{job?.title}</h3>
              <p className="truncate text-sm text-muted">{partner?.name} · Dikirim {fmtShort(app.sentDay)}</p>
            </div>
            <StatusPill status={app.status} overdue={sla.state === "overdue"} />
          </div>
          <div className="mt-2 text-sm">
            {sla.state !== "none" ? <SlaLine app={app} /> : <p className="text-muted">{closedLine}</p>}
            {app.followUpRequested && !app.followUpAnswered && <p className="mt-1 text-muted">Permintaan follow up sudah dikirim ke Talent Support.</p>}
          </div>
        </div>
      </Link>
    </li>
  );
}

function Group({ title, note, apps }: { title: string; note?: string; apps: Application[] }) {
  if (apps.length === 0) return null;
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title} <span className="font-normal text-muted">({apps.length})</span></h2>
        {note && <p className="text-sm text-muted">{note}</p>}
      </div>
      <ul className="flex flex-col gap-3">{apps.map((a) => <Row key={a.id} app={a} />)}</ul>
    </section>
  );
}

export default function ApplicationsPage() {
  const s = useStore();
  const me = useMe();
  const apps = appsOfStudent(s, me.id).sort((a, b) => b.sentDay - a.sentDay);
  const g = groupApps(apps, s.day);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Lamaran saya</h1>
        <p className="mt-1 text-muted">Setiap lamaran punya status dan tenggat respons. Tidak ada yang menggantung.</p>
      </div>
      <ScreenGate empty={<EmptyState icon={Send} title="Belum ada lamaran" body="Lamaranmu akan muncul di sini lengkap dengan status dan tenggat respons." action={<Button href="/student/jobs">Cari lowongan</Button>} />}>
        {apps.length === 0 ? (
          <EmptyState icon={Send} title="Belum ada lamaran" body="Lamaranmu akan muncul di sini lengkap dengan status dan tenggat respons." action={<Button href="/student/jobs">Cari lowongan</Button>} />
        ) : (
          <div className="flex flex-col gap-8">
            <Group title="Perlu tindakan" note="Ada kabar atau tenggat yang terlewat." apps={g.needsAction} />
            <Group title="Aktif" apps={g.active} />
            <Group title="Ditutup" note="Setiap lamaran yang ditutup membawa jawaban dan langkah berikutnya." apps={g.closed} />
          </div>
        )}
      </ScreenGate>
    </div>
  );
}
