"use client";

import Link from "next/link";
import { Chip, Pill } from "@/components/ui/primitives";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import { LEVEL_LABEL, type Job } from "@/lib/types";

export const JOB_MOD: Record<Job["moderation"], { label: string; tone: "ok" | "proc" | "warn" | "danger" }> = {
  tayang: { label: "Aktif", tone: "ok" },
  menunggu: { label: "Menunggu moderasi", tone: "proc" },
  revisi: { label: "Perlu revisi", tone: "warn" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

/** Isi lengkap lowongan untuk admin: dipakai di daftar lowongan dan antrean moderasi. */
export function AdminJobDetail({ job }: { job: Job }) {
  const s = useStore();
  const partner = partnerOf(s, job.partnerId);
  const applicants = s.applications.filter((a) => a.jobId === job.id && !a.draft).length;
  const history = s.moderationLog.filter((r) => r.jobId === job.id);
  const m = JOB_MOD[job.moderation];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={m.tone}>{m.label}</Pill>
        <span className="text-sm text-muted">diposting {fmtShort(job.postedDay)} · {applicants} pelamar</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        <div><dt className="text-xs text-muted">Perusahaan</dt><dd>{partner ? <Link href={`/admin/partners/${partner.id}`} className="hover:text-brand-700 hover:underline">{partner.name}</Link> : "-"}</dd></div>
        <div><dt className="text-xs text-muted">Bidang</dt><dd>{job.field}</dd></div>
        <div><dt className="text-xs text-muted">Lokasi</dt><dd>{job.location} · {job.workType}</dd></div>
        <div><dt className="text-xs text-muted">Level dan gaji</dt><dd>{job.level} · {job.salary ?? "Tidak dicantumkan"}</dd></div>
        <div><dt className="text-xs text-muted">Lamar ulang</dt><dd>{job.reapplyWaitDays === 0 ? "Tanpa masa tunggu" : `Tunggu ${job.reapplyWaitDays} hari`}</dd></div>
        <div><dt className="text-xs text-muted">Kontak partner</dt><dd>{partner?.contact ?? "-"}</dd></div>
      </dl>
      <section><h3 className="mb-1.5 text-sm font-semibold">Deskripsi</h3><p className="whitespace-pre-line text-sm">{job.description}</p></section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Skill yang dibutuhkan</h3>
        <ul className="flex flex-wrap gap-1.5">{job.requirements.map((r) => <li key={r.skill}><Chip tone={r.weight === "wajib" ? "brand" : "plain"}>{r.skill} · min {LEVEL_LABEL[r.min]}{r.weight === "wajib" ? "" : " · nilai tambah"}</Chip></li>)}</ul>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Pertanyaan screening</h3>
        {job.screening.length === 0 ? <p className="text-sm text-muted">Tanpa pertanyaan screening.</p> : (
          <ol className="list-decimal pl-5 text-sm">{job.screening.map((q, i) => <li key={i} className="mb-1">{q}</li>)}</ol>
        )}
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Riwayat moderasi</h3>
        {history.length === 0 ? <p className="text-sm text-muted">{job.moderation === "menunggu" ? "Belum ditinjau." : "Tidak ada catatan."}</p> : (
          <ul className="flex flex-col gap-2">
            {history.map((r, i) => <li key={i} className="text-sm"><span className="font-medium capitalize">{r.decision}</span> <span className="text-xs text-muted">{fmtShort(r.day)}</span>{r.note && <p className="text-muted">{r.note}</p>}</li>)}
          </ul>
        )}
      </section>
    </div>
  );
}
