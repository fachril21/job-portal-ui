"use client";

import { ArrowLeft, Clock, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { JobMeta } from "@/components/domain/job";
import { GapNote, MatchSummary, MatchTable } from "@/components/domain/skills";
import { Button, CompanyMark, EmptyState, Pill, Tile } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { matchJob } from "@/lib/match";
import { appForJob, canReapply, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, isActive, STATUS_LABEL } from "@/lib/time";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const me = useMe();
  const job = s.jobs.find((j) => j.id === id);

  if (!job || job.moderation !== "tayang") {
    return <EmptyState title="Lowongan tidak ditemukan" body="Lowongan ini mungkin sudah ditutup atau belum tayang." action={<Button href="/student/jobs">Kembali ke lowongan</Button>} />;
  }

  const partner = partnerOf(s, job.partnerId);
  const match = matchJob(me, job);
  const existing = appForJob(s, me.id, job.id);
  const re = canReapply(s, me.id, job.id);
  const hasActive = existing && isActive(existing);
  const closedNonCompetency = existing?.status === "ditutup" && !re;
  const applyHref = `/student/jobs/${job.id}/apply`;

  const cta = hasActive ? (
    <div className="flex flex-col gap-2">
      <Pill tone="proc">Sudah dilamar · {STATUS_LABEL[existing.status]}</Pill>
      <Button variant="secondary" size="lg" block href={`/student/applications/${existing.id}`}>Lihat status lamaran</Button>
    </div>
  ) : re ? (
    <div className="flex flex-col gap-2">
      <Button variant="hero" size="lg" block disabled={!re.ok} href={applyHref}>Lamar ulang</Button>
      {!re.ok && (
        <p className="flex items-start gap-1.5 text-sm text-muted"><Info size={15} className="mt-0.5 shrink-0" aria-hidden />{re.reason}{re.availableDay !== undefined ? ` Bisa lamar ulang mulai ${fmtShort(re.availableDay)}.` : ""}</p>
      )}
      {re.ok && <p className="text-sm text-ok-700">Masa tunggu dari perusahaan sudah selesai. Kamu bisa melamar ulang.</p>}
    </div>
  ) : (
    <Button variant="hero" size="lg" block href={applyHref}>Lamar sekarang</Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <Link href="/student/jobs" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden />Semua lowongan</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} size={56} />
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">{job.title}</h1>
              <p className="text-muted">{partner?.name} · {partner?.industry}</p>
              <JobMeta job={job} />
            </div>
          </div>

          <Tile className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">Skill-mu untuk posisi ini</h2>
              <p className="text-sm text-muted">Dibandingkan langsung dengan Skill Passport-mu. Tidak ada persentase, hanya skill mana yang sudah terlihat.</p>
            </div>
            <MatchSummary match={match} size="lg" />
            <MatchTable match={match} />
            <GapNote match={match} />
          </Tile>

          <Tile className="flex flex-col gap-3">
            <h2 className="font-semibold">Tentang posisi</h2>
            <p className="max-w-[65ch] text-[15px]">{job.description}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted"><Clock size={15} aria-hidden />Perusahaan berkomitmen merespons dalam 7 hari kalender sejak lamaran terkirim.</p>
          </Tile>
        </div>

        <aside className="fixed inset-x-3 bottom-24 z-20 rounded-tile border border-line bg-surface p-3 shadow-md lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-24 lg:p-5 lg:shadow-xs">
          <div className="hidden lg:mb-4 lg:block">
            <p className="font-semibold">{match.requiredMet} dari {match.requiredTotal} skill wajib terpenuhi</p>
            <p className="text-sm text-muted">{closedNonCompetency ? "Lamaran sebelumnya sudah ditutup. Kamu bisa mencari lowongan serupa." : "Satu tap bila tidak ada pertanyaan screening."}</p>
          </div>
          {cta}
        </aside>
        <div className="h-20 lg:hidden" aria-hidden />
      </div>
    </div>
  );
}
