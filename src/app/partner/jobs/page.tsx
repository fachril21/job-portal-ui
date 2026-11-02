"use client";

import { Copy, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Banner, Button, EmptyState, Panel, Pill } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import type { Job } from "@/lib/types";

const MOD: Record<Job["moderation"], { label: string; tone: "ok" | "proc" | "warn" | "danger" }> = {
  tayang: { label: "Tayang", tone: "ok" },
  menunggu: { label: "Menunggu moderasi", tone: "proc" },
  revisi: { label: "Perlu revisi", tone: "warn" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

export default function PartnerJobs() {
  const s = useStore();
  const jobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME);
  const drafts = Object.values(s.jobDrafts).sort((a, b) => b.updatedDay - a.updatedDay);

  return (
    <>
      <PageHeader title="Lowongan" sub="Lowongan baru ditinjau Dibimbing sebelum tayang." actions={<Button size="sm" icon={Plus} href="/partner/jobs/new">Buat lowongan</Button>} />
      {drafts.length > 0 && (
        <Panel title={`Draft (${drafts.length})`} className="mb-4">
          <ul className="flex flex-col divide-y divide-line">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <FileText size={16} className="text-muted" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.title.trim() || "Draft tanpa judul"}</p>
                  <p className="text-xs text-muted">{d.field} · diubah {fmtShort(d.updatedDay)}</p>
                </div>
                <Button size="sm" variant="secondary" href={`/partner/jobs/new?draft=${d.id}`}>Lanjutkan</Button>
                <button type="button" aria-label="Hapus draft" onClick={() => s.deleteJobDraft(d.id)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-700"><Trash2 size={15} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <ScreenGate empty={<EmptyState title="Belum ada lowongan" body="Buat lowongan pertamamu untuk mulai menerima lamaran." action={<Button size="sm" href="/partner/jobs/new">Buat lowongan</Button>} />}>
        {jobs.length === 0 ? (
          <EmptyState title="Belum ada lowongan" body="Buat lowongan pertamamu untuk mulai menerima lamaran." action={<Button size="sm" href="/partner/jobs/new">Buat lowongan</Button>} />
        ) : (
          <Panel flush>
            <ul className="divide-y divide-line">
              {jobs.map((j) => {
                const count = s.applications.filter((a) => a.jobId === j.id && !a.draft).length;
                const m = MOD[j.moderation];
                return (
                  <li key={j.id} className="flex flex-col gap-2 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <Link href={`/partner/jobs/${j.id}`} className="block truncate font-medium hover:text-brand-700 hover:underline">{j.title}</Link>
                        <p className="text-xs text-muted">{j.location} · {j.workType} · {j.level} · diposting {fmtShort(j.postedDay)}</p>
                      </div>
                      <span className="text-sm text-muted">{count} pelamar</span>
                      <Pill tone={m.tone}>{m.label}</Pill>
                      <Button size="sm" variant="quiet" icon={Copy} href={`/partner/jobs/new?from=${j.id}`}>Duplikat</Button>
                    </div>
                    {j.moderation === "ditolak" && <Banner tone="warn">{s.moderationLog.find((r) => r.jobId === j.id && r.decision === "ditolak")?.note ?? "Lowongan ini ditolak Dibimbing."}</Banner>}
                    {j.moderation === "revisi" && <Banner tone="warn" action={<Button size="sm" variant="secondary" href={`/partner/jobs/new?revise=${j.id}`}>Perbaiki dan kirim ulang</Button>}>{s.revision[j.id] ?? "Dibimbing meminta revisi pada lowongan ini."}</Banner>}
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}
      </ScreenGate>
    </>
  );
}
