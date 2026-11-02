"use client";

import clsx from "clsx";
import { Check, MessageSquareWarning, X } from "lucide-react";
import { useState } from "react";
import { AdminJobDetail } from "@/components/domain/admin-job-detail";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { Sheet } from "@/components/ui/overlay";
import { ScreenGate } from "@/components/ui/gate";
import { Button, EmptyState, Panel, Pill } from "@/components/ui/primitives";
import { MIN_DESCRIPTION } from "@/lib/jobdraft";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import type { Job, ModerationRecord } from "@/lib/types";

const DECISION: Record<ModerationRecord["decision"], { label: string; tone: "ok" | "warn" | "danger" }> = {
  disetujui: { label: "Disetujui", tone: "ok" },
  revisi: { label: "Revisi diminta", tone: "warn" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

const DISCRIMINATING = /\b(usia|umur|berpenampilan|penampilan menarik|status pernikahan|belum menikah|jenis kelamin)\b/i;

/** Pemeriksaan otomatis untuk membantu admin; keputusan tetap di tangan admin. */
function checks(j: Job): { label: string; ok: boolean }[] {
  return [
    { label: "Kisaran gaji tertera", ok: !!j.salary },
    { label: `Deskripsi jelas (min. ${MIN_DESCRIPTION} karakter)`, ok: j.description.trim().length >= MIN_DESCRIPTION },
    { label: "Ada skill wajib", ok: j.requirements.some((r) => r.weight === "wajib") },
    { label: "Tanpa syarat diskriminatif", ok: !DISCRIMINATING.test(j.description) },
  ];
}

type Mode = { id: string; kind: "revisi" | "tolak" } | null;

export default function AdminModeration() {
  const s = useStore();
  const [tab, setTab] = useState<"antrean" | "riwayat">("antrean");
  const [mode, setMode] = useState<Mode>(null);
  const [note, setNote] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = s.jobs.find((j) => j.id === detailId);
  const queue = s.jobs.filter((j) => j.moderation === "menunggu");
  const done = () => { setMode(null); setNote(""); };

  return (
    <>
      <PageHeader title="Moderasi lowongan" sub="Periksa kelengkapan dan kewajaran sebelum lowongan tayang." />
      <div role="tablist" className="mb-4 flex gap-1 border-b border-line">
        {([["antrean", `Antrean (${queue.length})`], ["riwayat", `Riwayat (${s.moderationLog.length})`]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={clsx("-mb-px h-10 border-b-2 px-3 text-sm font-medium", tab === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
        ))}
      </div>

      <ScreenGate empty={<EmptyState title="Antrean kosong" body="Tidak ada lowongan yang menunggu moderasi." />}>
        {tab === "riwayat" ? (
          <Panel flush>
            <ul className="divide-y divide-line">
              {s.moderationLog.map((r, i) => {
                const j = s.jobs.find((x) => x.id === r.jobId);
                const d = DECISION[r.decision];
                return (
                  <li key={i} className="flex flex-col gap-1 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">{j ? <button type="button" onClick={() => setDetailId(j.id)} className="block max-w-full truncate text-left text-sm font-medium hover:text-brand-700 hover:underline">{j.title}</button> : <p className="truncate text-sm font-medium">{r.jobId}</p>}<p className="text-xs text-muted">{partnerOf(s, j?.partnerId ?? "")?.name} · {fmtShort(r.day)}</p></div>
                      <Pill tone={d.tone}>{d.label}</Pill>
                    </div>
                    {r.note && <p className="text-sm text-muted">{r.note}</p>}
                  </li>
                );
              })}
            </ul>
          </Panel>
        ) : queue.length === 0 ? (
          <EmptyState icon={Check} title="Antrean kosong" body="Semua lowongan sudah ditinjau." />
        ) : (
          <div className="flex flex-col gap-3">
            {queue.map((j) => {
              const list = checks(j);
              const active = mode?.id === j.id ? mode : null;
              return (
                <Panel key={j.id} title={j.title} action={<Pill tone="proc">Menunggu · {fmtShort(j.postedDay)}</Pill>}>
                  <p className="text-sm text-muted">{partnerOf(s, j.partnerId)?.name} · {j.field} · {j.location} · {j.workType} · {j.level}{j.salary ? ` · ${j.salary}` : ""}</p>
                  <p className="mt-2 line-clamp-3 text-sm">{j.description}</p>
                  <button type="button" onClick={() => setDetailId(j.id)} className="mt-1 text-sm font-medium text-brand-600 hover:underline">Lihat detail lengkap</button>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {j.requirements.map((r) => <li key={r.skill} className="rounded-full bg-canvas px-2.5 py-1 text-xs">{r.skill} min {r.min}/4{r.weight === "wajib" ? " · wajib" : ""}</li>)}
                  </ul>
                  <ul className="mt-4 grid gap-1.5 sm:grid-cols-2" aria-label="Pemeriksaan otomatis">
                    {list.map((c) => (
                      <li key={c.label} className={clsx("flex items-center gap-2 text-sm", c.ok ? "text-ok-700" : "text-warn-700")}>
                        {c.ok ? <Check size={15} aria-hidden /> : <X size={15} aria-hidden />}{c.label}
                      </li>
                    ))}
                  </ul>
                  {active ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <label htmlFor={`rv-${j.id}`} className="text-xs font-medium">{active.kind === "tolak" ? "Alasan penolakan" : "Catatan revisi untuk partner"}</label>
                      <textarea id={`rv-${j.id}`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-lg border border-line-strong p-3 text-sm outline-none focus:border-brand-600" placeholder={active.kind === "tolak" ? "Contoh: mencantumkan syarat yang melanggar kebijakan." : "Contoh: rentang gaji perlu dicantumkan."} />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={done}>Batal</Button>
                        <Button size="sm" disabled={!note.trim()} onClick={() => { if (active.kind === "tolak") s.rejectJob(j.id, note.trim()); else s.approveJob(j.id, false, note.trim()); done(); }}>{active.kind === "tolak" ? "Tolak lowongan" : "Kirim revisi"}</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="quiet" icon={X} onClick={() => { setMode({ id: j.id, kind: "tolak" }); setNote(""); }}>Tolak</Button>
                      <Button size="sm" variant="secondary" icon={MessageSquareWarning} onClick={() => { setMode({ id: j.id, kind: "revisi" }); setNote(""); }}>Minta revisi</Button>
                      <Button size="sm" icon={Check} onClick={() => s.approveJob(j.id, true)}>Setujui</Button>
                    </div>
                  )}
                </Panel>
              );
            })}
          </div>
        )}
      </ScreenGate>
      <Sheet open={!!detail} onClose={() => setDetailId(null)} variant="side" title={detail?.title ?? "Lowongan"}>{detail && <AdminJobDetail job={detail} />}</Sheet>
    </>
  );
}
