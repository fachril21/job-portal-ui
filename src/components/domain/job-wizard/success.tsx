"use client";

import { CheckCircle2 } from "lucide-react";
import { Button, Panel } from "@/components/ui/primitives";

interface Props {
  title: string;
  jobId: string;
  talentCount: number;
  revised: boolean;
}

export function SubmittedScreen({ title, jobId, talentCount, revised }: Props) {
  const steps = [
    ["Dikirim", "Lowongan masuk antrean moderasi Dibimbing.", true],
    ["Ditinjau Dibimbing", "Biasanya selesai dalam 1–2 hari kerja. Kamu dapat notifikasi saat tayang atau perlu revisi.", false],
    ["Tayang untuk student", "Student yang cocok melihat lowongan di beranda mereka.", false],
  ] as const;
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Panel>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={28} className="mt-0.5 shrink-0 text-ok-700" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">{revised ? "Revisi terkirim" : "Lowongan terkirim untuk moderasi"}</h2>
            <p className="mt-1 text-muted">{title}</p>
          </div>
        </div>
        <ol className="mt-5 flex flex-col gap-3">
          {steps.map(([label, body, done], i) => (
            <li key={label} className="flex gap-3">
              <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${done ? "bg-ok-100 text-ok-700" : "border border-line-strong text-muted"}`}>{i + 1}</span>
              <div><p className="text-sm font-medium">{label}</p><p className="text-sm text-muted">{body}</p></div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Sambil menunggu">
        <p className="text-sm">
          {talentCount > 0 ? `${talentCount} talent saat ini memenuhi semua skill wajibmu.` : "Belum ada talent yang memenuhi semua skill wajibmu saat ini."}{" "}
          <span className="text-muted">Kamu bisa mengundang mereka melamar begitu lowongan tayang, atau mulai melihat profilnya sekarang.</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" href={`/partner/talent?job=${jobId}`}>Lihat talent yang cocok</Button>
          <Button size="sm" variant="secondary" href="/partner/jobs">Ke daftar lowongan</Button>
          <Button size="sm" variant="quiet" href="/partner/jobs/new">Buat lowongan lain</Button>
        </div>
      </Panel>
    </div>
  );
}
