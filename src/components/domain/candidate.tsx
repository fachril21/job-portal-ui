"use client";

import { Check, CircleDashed, Mail, Send, X } from "lucide-react";
import { Sheet } from "@/components/ui/overlay";
import { Avatar, Button, Kbd, Pill, StatusPill } from "@/components/ui/primitives";
import { SkillMeter } from "@/components/domain/skills";
import { matchJob } from "@/lib/match";
import { jobOf, studentOf } from "@/lib/select";
import { slaInfo } from "@/lib/time";
import { useStore } from "@/lib/store";

interface CandidateSheetProps {
  appId: string | null;
  onClose: () => void;
  onCloseApp: (appId: string) => void;
  onOffer: (appId: string) => void;
}

/** Detail kandidat untuk partner: Passport, kecocokan dengan requirement, jawaban screening, aksi. */
export function CandidateSheet({ appId, onClose, onCloseApp, onOffer }: CandidateSheetProps) {
  const s = useStore();
  const app = s.applications.find((a) => a.id === appId);
  const student = app ? studentOf(s, app.studentId) : undefined;
  const job = app ? jobOf(s, app.jobId) : undefined;

  if (!app || !student || !job) return <Sheet open={false} onClose={onClose} title="Kandidat" children={null} />;

  const match = matchJob(student, job);
  const sla = slaInfo(app, s.day);
  const live = app.status === "terkirim" || app.status === "direview" || app.status === "interview";
  const projects = student.projects.filter((p) => p.visible);
  const endorsements = student.endorsements.filter((e) => e.visible);

  return (
    <Sheet
      open
      onClose={onClose}
      variant="side"
      title={student.name}
      footer={
        live ? (
          <>
            {app.status !== "interview" && (
              <Button size="sm" variant="secondary" icon={Mail} kbd="I" onClick={() => s.partnerInvite(app.id)}>Undang interview</Button>
            )}
            <Button size="sm" variant="secondary" icon={Send} onClick={() => onOffer(app.id)}>Kirim penawaran</Button>
            <Button size="sm" icon={X} kbd="C" onClick={() => onCloseApp(app.id)}>Tutup lamaran</Button>
          </>
        ) : (
          <span className="text-sm text-muted">Lamaran ini sudah selesai.</span>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Avatar initials={student.initials} size={48} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">{student.bootcamp} · {student.batch} · {student.city}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <StatusPill status={app.status} />
              {sla.state !== "none" && <Pill tone={sla.state === "normal" ? "muted" : "due"} dot={false}>{sla.pill}</Pill>}
            </div>
          </div>
        </div>

        <section>
          <h3 className="mb-1 text-sm font-semibold">Kecocokan dengan {job.title}</h3>
          <p className="mb-2 text-sm text-muted">{match.requiredMet} dari {match.requiredTotal} skill wajib terpenuhi.</p>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {match.rows.map((r) => (
              <li key={r.requirement.skill} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  {r.status === "terpenuhi" ? <Check size={15} className="text-ok-700" aria-hidden /> : r.status === "hampir" ? <span className="size-2.5 rounded-full bg-warn-700" aria-hidden /> : <CircleDashed size={15} className="text-subtle" aria-hidden />}
                  {r.requirement.skill}
                  {r.requirement.weight === "nilai-tambah" && <span className="text-xs text-muted">nilai tambah</span>}
                </span>
                <span className="text-xs text-muted">{r.yourLevel ? `${r.yourLevel}/4` : "belum ada"} · min {r.requirement.min}/4</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Skill terverifikasi</h3>
          <ul className="flex flex-col gap-2.5">
            {student.skills.map((k) => (
              <li key={k.skill}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{k.skill}</span>
                  <SkillMeter level={k.level} size="sm" />
                </div>
                <p className="mt-0.5 text-xs text-muted">{k.evidence}</p>
              </li>
            ))}
          </ul>
        </section>

        {projects.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Project</h3>
            <ul className="flex flex-col gap-2">
              {projects.map((p) => (
                <li key={p.id} className="rounded-lg border border-line p-3 text-sm">
                  <div className="flex items-start justify-between gap-2"><span className="font-medium">{p.title}</span><span className="text-xs text-muted">{p.score}/100</span></div>
                  <p className="mt-0.5 text-muted">{p.summary}</p>
                  <p className="mt-1.5 text-xs"><span className="font-medium">Mentor:</span> {p.mentorNote}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {endorsements.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Endorsement mentor</h3>
            {endorsements.map((e) => <p key={e.id} className="mb-1.5 text-sm text-muted">“{e.quote}” <span className="text-xs">— {e.mentor}</span></p>)}
          </section>
        )}

        {app.answers && app.answers.some(Boolean) && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Jawaban screening</h3>
            <dl className="flex flex-col gap-2 text-sm">
              {job.screening.map((q, i) => app.answers?.[i] ? (
                <div key={q}><dt className="text-muted">{q}</dt><dd>{app.answers[i]}</dd></div>
              ) : null)}
            </dl>
          </section>
        )}

        {live && <p className="text-xs text-muted">Pintasan: <Kbd>J</Kbd> <Kbd>K</Kbd> pindah kandidat, <Kbd>I</Kbd> undang interview, <Kbd>C</Kbd> tutup lamaran.</p>}
      </div>
    </Sheet>
  );
}
