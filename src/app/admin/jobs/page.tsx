"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminJobDetail, JOB_MOD } from "@/components/domain/admin-job-detail";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Sheet } from "@/components/ui/overlay";
import { CompanyMark, EmptyState, Panel, Pill, inputCalmCls } from "@/components/ui/primitives";
import { BOOTCAMP_FIELDS } from "@/data/job-templates";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import type { Job } from "@/lib/types";

const MOD = JOB_MOD;

type Tab = "semua" | "aktif" | "nonaktif";

export default function AdminJobs() {
  const s = useStore();
  const [tab, setTab] = useState<Tab>("semua");
  const [q, setQ] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [field, setField] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const count = (j: Job) => s.applications.filter((a) => a.jobId === j.id && !a.draft).length;
  const counts = { aktif: s.jobs.filter((j) => j.moderation === "tayang").length, menunggu: s.jobs.filter((j) => j.moderation === "menunggu").length, revisi: s.jobs.filter((j) => j.moderation === "revisi").length, ditolak: s.jobs.filter((j) => j.moderation === "ditolak").length };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return s.jobs
      .filter((j) => (tab === "semua" ? true : tab === "aktif" ? j.moderation === "tayang" : j.moderation !== "tayang"))
      .filter((j) => !partnerId || j.partnerId === partnerId)
      .filter((j) => !field || j.field === field)
      .filter((j) => !needle || j.title.toLowerCase().includes(needle) || j.location.toLowerCase().includes(needle))
      .sort((a, b) => b.postedDay - a.postedDay);
  }, [s.jobs, tab, q, partnerId, field]);

  const job = s.jobs.find((j) => j.id === openId);

  const tiles = [
    { label: "Aktif", value: counts.aktif }, { label: "Menunggu moderasi", value: counts.menunggu },
    { label: "Perlu revisi", value: counts.revisi }, { label: "Ditolak", value: counts.ditolak },
  ];

  return (
    <>
      <PageHeader title="Lowongan" sub="Semua lowongan di Career Hub. Aktif berarti tayang untuk student; nonaktif berarti menunggu moderasi, perlu revisi, atau ditolak." />
      <dl className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-panel border border-line bg-surface p-4 shadow-xs">
            <dd className="font-display text-3xl font-bold leading-none tracking-tight">{t.value}</dd>
            <dt className="mt-1.5 text-sm text-muted">{t.label}</dt>
          </div>
        ))}
      </dl>

      <div role="tablist" className="mb-3 flex gap-1 border-b border-line">
        {([["semua", `Semua (${s.jobs.length})`], ["aktif", `Aktif (${counts.aktif})`], ["nonaktif", `Tidak aktif (${s.jobs.length - counts.aktif})`]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={clsx("-mb-px h-10 border-b-2 px-3 text-sm font-medium", tab === id ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink")}>{label}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 basis-56">
          <span className="sr-only">Cari judul atau lokasi</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" aria-hidden />
          <input className={`${inputCalmCls} pl-9`} placeholder="Cari judul atau lokasi" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select aria-label="Partner" className={`${inputCalmCls} w-52`} value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
          <option value="">Semua partner</option>
          {s.partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Bidang" className={`${inputCalmCls} w-44`} value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">Semua bidang</option>
          {BOOTCAMP_FIELDS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      <ScreenGate empty={<EmptyState title="Belum ada lowongan" body="Lowongan dari partner muncul di sini." />}>
        {list.length === 0 ? (
          <EmptyState title="Tidak ada lowongan" body="Coba ubah filter atau kata kunci pencarian." />
        ) : (
          <Panel flush>
            <ul className="divide-y divide-line">
              {list.map((j) => {
                const p = partnerOf(s, j.partnerId);
                const m = MOD[j.moderation];
                return (
                  <li key={j.id}>
                    <button type="button" onClick={() => setOpenId(j.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-canvas">
                      <CompanyMark name={p?.name ?? "?"} tone={p?.logoTone ?? "brand"} size={36} />
                      <div className="min-w-0 flex-1 basis-56">
                        <p className="truncate text-sm font-medium">{j.title}</p>
                        <p className="truncate text-xs text-muted">{[p?.name, j.field, j.location, j.workType, j.level].filter((v, i, a) => v && a.indexOf(v) === i).join(" · ")}</p>
                      </div>
                      <span className="w-20 text-xs text-muted">{count(j)} pelamar</span>
                      <span className="w-20 text-xs text-muted">{fmtShort(j.postedDay)}</span>
                      <Pill tone={m.tone}>{m.label}</Pill>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}
      </ScreenGate>

      <Sheet open={!!job} onClose={() => setOpenId(null)} variant="side" title={job?.title ?? "Lowongan"}>
        {job && (
          <>
            <AdminJobDetail job={job} />
            {job.moderation === "menunggu" && <Link href="/admin/moderation" className="mt-5 inline-block text-sm font-medium text-brand-600 hover:underline">Tinjau di antrean moderasi</Link>}
          </>
        )}
      </Sheet>
    </>
  );
}
