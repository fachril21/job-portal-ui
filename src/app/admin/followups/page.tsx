"use client";

import clsx from "clsx";
import { Bell, CheckCircle2, LifeBuoy, PhoneCall } from "lucide-react";
import { useState } from "react";
import { SlaPill, daysAgo } from "@/components/domain/admin";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { Sheet } from "@/components/ui/overlay";
import { Avatar, Button, EmptyState, Panel, Pill, StatusPill } from "@/components/ui/primitives";
import { daysLate, followUpCases } from "@/lib/admin";
import { jobOf, partnerOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, STATUS_LABEL } from "@/lib/time";
import type { Application } from "@/lib/types";

const URGENT_DAYS = 5;
const ENTRY_LABEL = (st: string): string => (st === "followup" ? "Student meminta follow up" : st === "followup-dibalas" ? "Talent Support menghubungi perusahaan" : STATUS_LABEL[st as Application["status"]]);

export default function AdminFollowUps() {
  const s = useStore();
  const [tab, setTab] = useState<"waiting" | "done">("waiting");
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const cases = followUpCases(s);
  const list = tab === "waiting" ? cases.waiting : cases.done;
  const current = s.applications.find((a) => a.id === openId);

  const open = (a: Application) => { setOpenId(a.id); setNote(a.followUpNote ?? ""); };
  const job = current ? jobOf(s, current.jobId) : undefined;
  const partner = job ? partnerOf(s, job.partnerId) : undefined;
  const student = current ? studentOf(s, current.studentId) : undefined;
  const reminders = partner ? s.reminders.filter((r) => r.partnerId === partner.id) : [];
  const remindedToday = partner ? s.reminded[partner.id] === s.day : false;

  return (
    <>
      <PageHeader title="Antrean follow up" sub="Student yang meminta Talent Support menghubungi perusahaan karena lamarannya melewati tenggat. Kasus terlama di atas." />
      <div role="tablist" className="mb-4 flex gap-1 border-b border-line">
        {([["waiting", `Menunggu (${cases.waiting.length})`], ["done", `Sudah ditangani (${cases.done.length})`]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={clsx("-mb-px h-10 border-b-2 px-3 text-sm font-medium", tab === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={LifeBuoy} title={tab === "waiting" ? "Antrean kosong" : "Belum ada kasus selesai"} body={tab === "waiting" ? "Tidak ada follow up dari student yang menunggu." : "Kasus yang sudah dihubungi ke perusahaan muncul di sini."} />
      ) : (
        <Panel flush>
          <ul className="divide-y divide-line">
            {list.map((a) => {
              const j = jobOf(s, a.jobId);
              const p = j ? partnerOf(s, j.partnerId) : undefined;
              const st = studentOf(s, a.studentId);
              const age = s.day - (a.followUpDay ?? s.day);
              return (
                <li key={a.id}>
                  <button type="button" onClick={() => open(a)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-canvas">
                    <Avatar initials={st?.initials ?? "?"} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{st?.name}</p>
                      <p className="truncate text-xs text-muted">{j?.title} · {p?.name}</p>
                    </div>
                    <span className="text-xs text-muted">{a.followUpDay !== undefined ? `diminta ${daysAgo(a.followUpDay, s.day)}` : ""}</span>
                    {tab === "waiting" && age >= URGENT_DAYS && <Pill tone="due" dot={false}>Mendesak</Pill>}
                    {tab === "waiting" ? <Pill tone="muted" dot={false}>{daysLate(a, s.day)} hari lewat tenggat</Pill> : <Pill tone="ok" dot={false}>Dihubungi {a.followUpAnsweredDay !== undefined ? fmtShort(a.followUpAnsweredDay) : ""}</Pill>}
                    {p && <SlaPill score={p.slaScore} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      <Sheet
        open={!!current}
        onClose={() => setOpenId(null)}
        variant="side"
        title={student ? `Follow up: ${student.name}` : "Follow up"}
        footer={
          current && (
            <>
              <Button size="sm" variant="secondary" onClick={() => s.saveFollowNote(current.id, note)}>Simpan catatan</Button>
              {!current.followUpAnswered && partner && (
                <Button size="sm" variant="secondary" icon={Bell} disabled={remindedToday} onClick={() => s.sendReminder(partner.id)}>{remindedToday ? "Pengingat terkirim" : "Kirim pengingat SLA"}</Button>
              )}
              {!current.followUpAnswered ? (
                <Button size="sm" icon={PhoneCall} onClick={() => { s.saveFollowNote(current.id, note); s.talentSupportReply(current.id); }}>Hubungi perusahaan</Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setOpenId(null)}>Tutup</Button>
              )}
            </>
          )
        }
      >
        {current && job && partner && student && (
          <div className="flex flex-col gap-5">
            <section>
              <h3 className="mb-1.5 text-sm font-semibold">Pesan student</h3>
              <p className="rounded-xl bg-canvas p-3.5 text-sm">{current.followUpMessage ?? "Student meminta bantuan follow up."}</p>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold">Lamaran</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <div><dt className="text-xs text-muted">Posisi</dt><dd>{job.title}</dd></div>
                <div><dt className="text-xs text-muted">Status</dt><dd><StatusPill status={current.status} /></dd></div>
                <div><dt className="text-xs text-muted">Dikirim</dt><dd>{fmtShort(current.sentDay)}</dd></div>
                <div><dt className="text-xs text-muted">Tenggat respons</dt><dd>{current.slaDue === null ? "-" : `${fmtShort(current.slaDue)}${daysLate(current, s.day) > 0 ? ` · lewat ${daysLate(current, s.day)} hari` : ""}`}</dd></div>
              </dl>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold">Partner</h3>
              <div className="rounded-xl border border-line p-3.5">
                <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{partner.name}</p><SlaPill score={partner.slaScore} /></div>
                <p className="mt-0.5 text-xs text-muted">PIC: {partner.contact}</p>
                <p className="mt-2 text-xs text-muted">{reminders.length === 0 ? "Belum pernah diberi pengingat." : `${reminders.length} pengingat sebelumnya, terakhir ${daysAgo(Math.max(...reminders.map((r) => r.day)), s.day)}.`}</p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold">Riwayat kasus</h3>
              <ol className="flex flex-col gap-2 border-l border-line-strong pl-4">
                {current.timeline.map((e, i) => (
                  <li key={i} className="relative text-sm">
                    <span aria-hidden className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-brand-600" />
                    {ENTRY_LABEL(e.status)}<span className="ml-2 text-xs text-muted">{fmtShort(e.day)}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <label htmlFor="fu-note" className="mb-1.5 block text-sm font-semibold">Catatan internal</label>
              <textarea id="fu-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hanya terlihat oleh tim Talent Support." className="w-full rounded-lg border border-line-strong bg-surface p-3 text-sm outline-none focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]" />
            </section>

            {current.followUpAnswered && (
              <p className="flex items-start gap-2 rounded-xl bg-ok-100 p-3 text-sm text-ok-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden />Perusahaan sudah dihubungi{current.followUpAnsweredDay !== undefined ? ` pada ${fmtShort(current.followUpAnsweredDay)}` : ""}. Tenggat baru ditetapkan untuk lamaran ini.</p>
            )}
          </div>
        )}
      </Sheet>
    </>
  );
}
