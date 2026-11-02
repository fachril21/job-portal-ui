"use client";

import clsx from "clsx";
import { Clock, Compass, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { tagById } from "@/data/taxonomy";
import { similarJobs } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, slaInfo, STATUS_LABEL } from "@/lib/time";
import type { Application, Job } from "@/lib/types";
import { Button, CompanyMark, Pill, Tile } from "@/components/ui/primitives";

const STEPS: Application["status"][] = ["terkirim", "direview", "interview", "penawaran", "diterima"];

/** Timeline status. Titik lewat terisi, titik kini berdenyut, titik mendatang outline. */
export function StatusTimeline({ app }: { app: Application }) {
  const today = useStore((s) => s.day);
  const sla = slaInfo(app, today);
  const reached = new Set(app.timeline.map((t) => t.status));
  const closed = app.status === "ditutup";
  const rows = [
    ...STEPS.filter((st) => reached.has(st) || (!closed && STEPS.indexOf(st) <= STEPS.indexOf(app.status) + 1)),
    ...(closed ? (["ditutup"] as const) : []),
  ];
  return (
    <ol className="flex flex-col">
      {rows.map((st, i) => {
        const entry = app.timeline.find((t) => t.status === st);
        const isCurrent = st === app.status;
        const isDone = !!entry && !isCurrent;
        return (
          <li key={st} className="relative flex gap-4 pb-6 last:pb-0">
            {i < rows.length - 1 && <span className={clsx("absolute left-[9px] top-5 h-[calc(100%-12px)] w-0.5", isDone || isCurrent ? "bg-brand-500/40" : "bg-line")} aria-hidden />}
            <span
              className={clsx(
                "relative mt-1 size-5 shrink-0 rounded-full border-2",
                isDone && "border-brand-500 bg-brand-500",
                isCurrent && !closed && "anim-pulse-ring border-brand-600 bg-surface",
                isCurrent && closed && "border-subtle bg-subtle",
                !entry && !isCurrent && "border-line-strong bg-surface",
              )}
              aria-hidden
            />
            <div className="min-w-0">
              <p className={clsx("font-semibold", !entry && !isCurrent && "text-subtle")}>{STATUS_LABEL[st]}</p>
              {entry && <p className="text-xs text-muted">{fmtShort(entry.day)}{entry.note ? ` · ${entry.note}` : ""}</p>}
              {!entry && !isCurrent && <p className="text-xs text-subtle">Tahap berikutnya</p>}
              {isCurrent && sla.state !== "none" && <SlaLine app={app} />}
            </div>
          </li>
        );
      })}
      {app.timeline.filter((t) => t.status === "followup" || t.status === "followup-dibalas").map((t, i) => (
        <li key={i} className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Clock size={14} aria-hidden />
          {t.status === "followup" ? `Kamu meminta Talent Support follow up · ${fmtShort(t.day)}` : `Talent Support menghubungi perusahaan · ${fmtShort(t.day)}`}
        </li>
      ))}
    </ol>
  );
}

/** Kalimat countdown netral. Tidak menyalahkan perusahaan. Tidak pernah merah di sisi student. */
export function SlaLine({ app }: { app: Application }) {
  const today = useStore((s) => s.day);
  const sla = slaInfo(app, today);
  if (sla.state === "none") return null;
  return (
    <p className={clsx("mt-1 flex items-start gap-1.5 text-sm", sla.state === "soon" ? "font-medium text-warn-700" : "text-muted")}>
      <Clock size={15} className="mt-0.5 shrink-0" aria-hidden />
      <span>{sla.studentText}</span>
    </p>
  );
}

const FRAME: Record<string, { tone: "learn" | "proc"; title: string }> = {
  kompetensi: { tone: "learn", title: "Yang perlu diperkuat" },
};

/** Feedback card: tiga varian (kompetensi, non-kompetensi, faktor perusahaan). Tanpa merah, tanpa emoji sedih. */
export function FeedbackCard({ app, job, companyName }: { app: Application; job: Job; companyName: string }) {
  const s = useStore();
  const closure = app.closure;
  if (!closure) return null;
  const tags = closure.tagIds.map((id) => tagById(id)).filter(Boolean) as NonNullable<ReturnType<typeof tagById>>[];
  const competency = tags.filter((t) => t.triggersRoadmap === true || t.triggersRoadmap === "sebagian");
  const company = tags.filter((t) => t.category === "Faktor perusahaan");
  const nonComp = tags.filter((t) => t.category === "Kecocokan non-kompetensi");
  const bySystem = closure.by === "sistem";
  const byStudent = closure.by === "student";
  const variant = byStudent ? "student" : bySystem || (company.length > 0 && competency.length === 0) ? "company" : competency.length > 0 ? "kompetensi" : "noncomp";
  const hasDirections = competency.length > 0;
  const similar = similarJobs(s, job, 3);
  const headTone = variant === "kompetensi" ? "bg-learn-100 text-learn-700" : "bg-proc-100 text-proc-700";
  void FRAME;

  return (
    <Tile className="overflow-hidden p-0">
      <div className={clsx("flex items-center gap-3 px-5 py-4", headTone)}>
        {variant === "kompetensi" ? <Compass size={22} aria-hidden /> : <Heart size={22} aria-hidden />}
        <p className="text-sm font-semibold">{variant === "kompetensi" ? "Ada arah belajar dari lamaran ini" : "Lamaran ini selesai"}</p>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">Lamaran ke {companyName} sudah ditutup.</h2>

        {variant === "student" && <p className="text-muted">Kamu mengundurkan diri dari lamaran ini. Lowongan lain masih terbuka kapan saja.</p>}
        {variant === "company" && (
          <p className="text-muted">
            {bySystem ? "Lowongan ditutup oleh perusahaan sebelum sempat direview. " : `${company.map((t) => t.studentCopy).join(" ")} `}
            <strong className="font-semibold text-ink">Ini bukan tentang kemampuanmu.</strong>
          </p>
        )}
        {variant === "noncomp" && (
          <p className="text-muted">
            {nonComp.map((t) => t.studentCopy).join(" ")} <strong className="font-semibold text-ink">Ini bukan tentang kemampuanmu.</strong> Portfoliomu tidak perlu diubah karena ini.
          </p>
        )}

        {variant === "kompetensi" && (
          <div>
            <p className="mb-2 text-sm font-semibold">Yang perlu diperkuat</p>
            <ul className="flex flex-col gap-2">
              {competency.slice(0, 3).map((t) => (
                <li key={t.id} className="rounded-xl bg-canvas p-3.5">
                  <p className="font-medium">{t.studentCopy}</p>
                  <p className="mt-0.5 text-sm text-muted">Lihat saran belajar yang sesuai di Perkembangan.</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {closure.note && (
          <blockquote className="rounded-xl border border-line bg-canvas p-3.5 text-[15px] text-ink">
            <p className="mb-1 text-xs font-medium text-muted">Catatan dari perusahaan</p>“{closure.note}”
          </blockquote>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {variant === "kompetensi" && hasDirections ? (
            <Button variant="hero" size="lg" href="/student/progress" iconRight={Sparkles}>Lihat arah belajar</Button>
          ) : (
            <Button variant="hero" size="lg" href="/student/jobs">Cari lowongan lain</Button>
          )}
          {variant === "kompetensi" && hasDirections && <Button variant="ghost" size="lg" href="/student/jobs">Cari lowongan lain</Button>}
        </div>

        {variant !== "kompetensi" && similar.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Lowongan serupa untukmu</p>
            <ul className="flex flex-col gap-2">
              {similar.map((j) => {
                const p = s.partners.find((x) => x.id === j.partnerId);
                return (
                  <li key={j.id}>
                    <Link
                      href={`/student/jobs/${j.id}`}
                      onClick={() => s.setFlag("similarOpened")}
                      className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-brand-500 hover:bg-brand-50"
                    >
                      <CompanyMark name={p?.name ?? "?"} tone={p?.logoTone ?? "brand"} size={36} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{j.title}</span>
                        <span className="block truncate text-xs text-muted">{p?.name} · {j.location}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Tile>
  );
}

export function NextStep({ text, action }: { text: string; action: React.ReactNode }) {
  return (
    <Tile tone="dark" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium text-brand-100">Langkah berikutnya</p>
        <p className="mt-0.5 text-lg font-semibold leading-snug">{text}</p>
      </div>
      {action}
    </Tile>
  );
}

export { Pill };
