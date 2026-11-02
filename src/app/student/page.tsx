"use client";

import { ArrowRight, Compass, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/domain/job";
import { NextStep, SlaLine } from "@/components/domain/application";
import { SkillMeter } from "@/components/domain/skills";
import { ScreenGate } from "@/components/ui/gate";
import { Button, CompanyMark, EmptyState, StatusPill, Tile } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { matchJob, matchRank } from "@/lib/match";
import { appsOfStudent, gapInsight, groupApps, jobOf, learningDirections, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, isActive, slaInfo } from "@/lib/time";

export default function StudentHome() {
  const s = useStore();
  const me = useMe();
  const apps = appsOfStudent(s, me.id);
  const groups = groupApps(apps, s.day);
  const focusApp = groups.needsAction[0] ?? groups.active.sort((a, b) => (a.slaDue ?? 99) - (b.slaDue ?? 99))[0];
  const focusJob = focusApp ? jobOf(s, focusApp.jobId) : undefined;
  const focusPartner = focusJob ? partnerOf(s, focusJob.partnerId) : undefined;
  const sla = focusApp ? slaInfo(focusApp, s.day) : null;
  const gap = gapInsight(s, me.id);
  const directions = learningDirections(s, me.id);
  const feed = s.jobs
    .filter((j) => j.moderation === "tayang" && j.field === me.bootcamp)
    .filter((j) => !apps.some((a) => a.jobId === j.id && isActive(a)))
    .map((j) => ({ j, m: matchJob(me, j) }))
    .sort((a, b) => matchRank(b.m) - matchRank(a.m))
    .slice(0, 4);
  const partial = me.status === "belajar";
  const first = me.name.split(" ")[0];

  return (
    <ScreenGate empty={<EmptyState title={`Halo, ${first}. Belum ada apa-apa di sini.`} body="Mulai dari melihat lowongan yang cocok dengan Passport-mu." action={<Button href="/student/jobs">Lihat lowongan</Button>} />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">Halo, {first}.</h1>
          <p className="mt-2 max-w-[52ch] text-lg text-muted">
            {groups.needsAction.length > 0
              ? `Ada ${groups.needsAction.length} lamaran yang perlu perhatianmu.`
              : focusApp
                ? "Semua lamaranmu punya status dan tenggat yang jelas."
                : "Mulai dari satu lowongan yang cocok dengan skill-mu."}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-12 md:gap-4">
          <Tile tone={focusApp ? "dark" : "plain"} className="md:col-span-8 md:row-span-1 flex flex-col justify-between gap-6">
            {focusApp && focusJob ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <CompanyMark name={focusPartner?.name ?? "?"} tone={focusPartner?.logoTone ?? "brand"} size={48} />
                    <div>
                      <p className="text-sm text-brand-100">{groups.needsAction.includes(focusApp) ? "Perlu perhatian" : "Lamaran terdekat"}</p>
                      <h2 className="text-xl font-semibold tracking-tight">{focusJob.title}</h2>
                      <p className="text-sm text-brand-100">{focusPartner?.name}</p>
                    </div>
                  </div>
                  <StatusPill status={focusApp.status} overdue={sla?.state === "overdue"} />
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white [&_*]:!text-white/90">
                  {sla && sla.state !== "none" ? <SlaLine app={focusApp} /> : <p className="text-sm">Status terakhir diperbarui {fmtShort(focusApp.timeline.at(-1)?.day ?? s.day)}.</p>}
                </div>
                <div>
                  <Button variant="secondary" href={`/student/applications/${focusApp.id}`} iconRight={ArrowRight}>Lihat lamaran</Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">Belum ada lamaran aktif.</h2>
                  <p className="mt-1 text-muted">Lamaranmu akan muncul di sini lengkap dengan status dan tenggat respons.</p>
                </div>
                <div><Button href="/student/jobs">Cari lowongan</Button></div>
              </>
            )}
          </Tile>

          <Tile className="md:col-span-4 flex flex-col gap-4">
            <h2 className="font-semibold">Skill Passport</h2>
            {partial && (
              <p className="rounded-xl bg-warn-100 px-3 py-2 text-sm text-warn-700">
                {me.skills.length} dari {me.skillTarget} skill sudah terverifikasi. Kamu tetap bisa melamar magang.
              </p>
            )}
            <ul className="flex flex-col gap-3">
              {me.skills.slice(0, 3).map((k) => (
                <li key={k.skill} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{k.skill}</span>
                  <SkillMeter level={k.level} size="sm" showLabel={false} />
                </li>
              ))}
            </ul>
            <Link href="/student/passport" className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              Lihat semua {me.skills.length} skill <ArrowRight size={15} aria-hidden />
            </Link>
          </Tile>

          <Tile tone="learn" className="md:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-learn-700"><Compass size={18} aria-hidden /><h2 className="font-semibold">Gap Insight</h2></div>
            {gap.enough && gap.rows[0] ? (
              <>
                <p className="font-display text-2xl font-bold leading-tight tracking-tight text-ink">{gap.rows[0].n} dari {gap.total} penutupan terkait {gap.rows[0].label}.</p>
                <p className="text-sm text-learn-700">Pola ini muncul dari lamaranmu yang sudah ditutup.</p>
              </>
            ) : (
              <p className="text-ink">Setelah 2 lamaran ditutup, kami akan mencari polanya. Satu titik data belum cukup untuk menarik kesimpulan.</p>
            )}
            <Link href="/student/progress" className="mt-auto flex items-center gap-1 text-sm font-semibold text-learn-700 hover:underline">Buka Perkembangan <ArrowRight size={15} aria-hidden /></Link>
          </Tile>

          <Tile tone="brand" className="md:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-brand-700"><Layers size={18} aria-hidden /><h2 className="font-semibold">Arah belajar</h2></div>
            {directions.length > 0 ? (
              <>
                <p className="font-display text-2xl font-bold leading-tight tracking-tight">{directions.length} hal yang bisa diperkuat</p>
                <p className="text-sm text-brand-700">{directions.slice(0, 2).map((d) => d.tag.label).join(" dan ")}{directions.length > 2 ? `, dan ${directions.length - 2} lainnya` : ""}.</p>
              </>
            ) : (
              <p>Saran belajar muncul setelah ada lamaran yang ditutup dengan alasan kemampuan.</p>
            )}
            <Link href="/student/progress" className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">Lihat arah belajar <ArrowRight size={15} aria-hidden /></Link>
          </Tile>
        </div>

        <section aria-labelledby="feed-title" className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="feed-title" className="font-display text-2xl font-bold tracking-tight">Lowongan untukmu</h2>
              <p className="text-sm text-muted">Diurutkan dari yang paling banyak cocok dengan skill-mu.</p>
            </div>
            <Link href="/student/jobs" className="text-sm font-semibold text-brand-600 hover:underline">Lihat semua</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            {feed.map(({ j }) => <JobCard key={j.id} job={j} />)}
          </div>
        </section>

        <NextStep
          text={focusApp ? "Cek tenggat lamaranmu, lalu lamar satu lowongan lagi." : "Pilih satu lowongan dan lihat skill mana yang sudah terpenuhi."}
          action={<Button variant="secondary" href={focusApp ? "/student/applications" : "/student/jobs"} icon={Sparkles}>{focusApp ? "Buka Lamaran saya" : "Cari lowongan"}</Button>}
        />
      </div>
    </ScreenGate>
  );
}
