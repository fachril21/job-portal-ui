"use client";

import clsx from "clsx";
import { Inbox } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CandidateSheet } from "@/components/domain/candidate";
import { CloseDialog } from "@/components/domain/close";
import { OfferDialog } from "@/components/domain/offer";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Avatar, EmptyState, Pill, inputCalmCls } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { matchJob } from "@/lib/match";
import { jobOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { slaInfo } from "@/lib/time";
import type { AppStatus, Application } from "@/lib/types";

const COLUMNS: { id: string; label: string; statuses: AppStatus[] }[] = [
  { id: "baru", label: "Baru", statuses: ["terkirim"] },
  { id: "review", label: "Direview", statuses: ["direview"] },
  { id: "interview", label: "Interview", statuses: ["interview"] },
  { id: "tawar", label: "Penawaran", statuses: ["penawaran", "diterima"] },
  { id: "tutup", label: "Ditutup", statuses: ["ditutup"] },
];

function isTyping(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
}

export default function PipelinePage() {
  const s = useStore();
  const [jobId, setJobId] = useState("semua");
  const [sel, setSel] = useState<string | null>(null);
  const [closing, setClosing] = useState<string | null>(null);
  const [offering, setOffering] = useState<string | null>(null);

  const myJobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME && j.moderation === "tayang");
  const apps = useMemo(
    () => s.applications.filter((a) => !a.draft && myJobs.some((j) => j.id === a.jobId) && (jobId === "semua" || a.jobId === jobId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s.applications, s.jobs, jobId],
  );
  const order = useMemo(
    () => COLUMNS.flatMap((c) => apps.filter((a) => c.statuses.includes(a.status)).sort((a, b) => (a.slaDue ?? 999) - (b.slaDue ?? 999))),
    [apps],
  );

  const open = useCallback((id: string) => {
    setSel(id);
    useStore.getState().partnerOpen(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || closing || offering || e.metaKey || e.ctrlKey || e.altKey) return;
      const idx = order.findIndex((a) => a.id === sel);
      const k = e.key.toLowerCase();
      if (k === "j" && order.length) open(order[Math.min(idx + 1, order.length - 1)].id);
      else if (k === "k" && order.length) open(order[Math.max(idx - 1, 0)].id);
      else if (k === "i" && sel) useStore.getState().partnerInvite(sel);
      else if (k === "c" && sel) setClosing(sel);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [order, sel, closing, offering, open]);

  const offeringApp = s.applications.find((a) => a.id === offering);
  const offeringJob = offeringApp ? jobOf(s, offeringApp.jobId) : undefined;
  const offeringName = offeringApp ? (studentOf(s, offeringApp.studentId)?.name ?? "kandidat") : "";
  const closingApp = s.applications.find((a) => a.id === closing);
  const closingName = closingApp ? (studentOf(s, closingApp.studentId)?.name ?? "kandidat") : "";

  return (
    <>
      <PageHeader
        title="Pipeline kandidat"
        sub="Setiap lamaran punya tenggat respons 7 hari. Menutup lamaran selalu disertai alasan."
        actions={
          <select aria-label="Filter lowongan" value={jobId} onChange={(e) => setJobId(e.target.value)} className={clsx(inputCalmCls, "w-56")}>
            <option value="semua">Semua lowongan</option>
            {myJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        }
      />
      <ScreenGate empty={<EmptyState icon={Inbox} title="Belum ada kandidat" body="Lamaran akan muncul di sini begitu ada student yang melamar." />}>
        {apps.length === 0 ? (
          <EmptyState icon={Inbox} title="Belum ada kandidat" body="Lamaran akan muncul di sini begitu ada student yang melamar." />
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
            {COLUMNS.map((col) => {
              const list = apps.filter((a) => col.statuses.includes(a.status)).sort((a, b) => (a.slaDue ?? 999) - (b.slaDue ?? 999));
              return (
                <section key={col.id} aria-label={col.label} className="flex w-[264px] shrink-0 flex-col gap-2 rounded-panel bg-canvas p-2 lg:w-0 lg:min-w-0 lg:flex-1">
                  <h2 className="flex items-center justify-between px-2 pt-1 text-xs font-semibold text-muted">{col.label}<span className="rounded-full bg-surface px-2 py-0.5 text-[11px]">{list.length}</span></h2>
                  {list.length === 0 && <p className="px-2 py-4 text-center text-xs text-subtle">Kosong</p>}
                  {list.map((a) => <Card key={a.id} app={a} active={a.id === sel} onOpen={() => open(a.id)} />)}
                </section>
              );
            })}
          </div>
        )}
      </ScreenGate>

      <CandidateSheet appId={closing || offering ? null : sel} onClose={() => setSel(null)} onCloseApp={(id) => setClosing(id)} onOffer={(id) => setOffering(id)} />
      {offeringApp && offeringJob && (
        <OfferDialog
          open
          candidateName={offeringName}
          job={offeringJob}
          today={s.day}
          onClose={() => setOffering(null)}
          onSubmit={(offer) => {
            useStore.getState().partnerOffer(offeringApp.id, offer);
            setOffering(null);
            setSel(null);
          }}
        />
      )}
      <CloseDialog
        open={!!closing}
        candidateName={closingName}
        onClose={() => setClosing(null)}
        onSubmit={(tags, note) => {
          if (closing) useStore.getState().partnerClose(closing, tags, note || undefined);
          setClosing(null);
          setSel(null);
        }}
      />
    </>
  );
}

function Card({ app, active, onOpen }: { app: Application; active: boolean; onOpen: () => void }) {
  const s = useStore();
  const student = studentOf(s, app.studentId);
  const job = jobOf(s, app.jobId);
  if (!student || !job) return null;
  const m = matchJob(student, job);
  const sla = slaInfo(app, s.day);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={active}
      className={clsx(
        "flex flex-col gap-2 rounded-panel border bg-surface p-3 text-left shadow-xs transition-[box-shadow,border-color] hover:shadow-sm",
        active ? "border-brand-600" : "border-line",
      )}
    >
      <span className="flex items-center gap-2">
        <Avatar initials={student.initials} size={28} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{student.name}</span>
      </span>
      <span className="truncate text-xs text-muted">{job.title}</span>
      <span className="flex flex-wrap items-center gap-1.5">
        <Pill tone={m.requiredMet === m.requiredTotal ? "ok" : "muted"} dot={false}>{m.requiredMet}/{m.requiredTotal} wajib</Pill>
        {sla.state !== "none" && sla.state !== "normal" && <Pill tone="due" dot={false}>{sla.pill}</Pill>}
        {sla.state === "normal" && <span className="text-[11px] text-muted">{sla.pill}</span>}
        {app.reapplyOf && <Pill tone="learn" dot={false}>Lamar ulang</Pill>}
        {app.followUpRequested && !app.followUpAnswered && <Pill tone="warn" dot={false}>Follow up</Pill>}
      </span>
    </button>
  );
}
