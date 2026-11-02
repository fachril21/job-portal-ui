"use client";

import { BookOpen, Compass, Hammer, Hourglass, Mic, Users } from "lucide-react";
import { useEffect } from "react";
import { ScreenGate } from "@/components/ui/gate";
import { Button, EmptyState, Tile } from "@/components/ui/primitives";
import { TYPE_LABEL } from "@/data/taxonomy";
import { useMe } from "@/lib/hooks";
import { appsOfStudent, canReapply, gapInsight, jobOf, learningDirections, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";
import type { RoadmapType } from "@/lib/types";

const ICON: Record<RoadmapType, typeof BookOpen> = { modul: BookOpen, mentor: Users, project: Hammer, "mock-interview": Mic };

export default function ProgressPage() {
  const s = useStore();
  const me = useMe();
  const gap = gapInsight(s, me.id);
  const directions = learningDirections(s, me.id);
  const hasDirections = directions.length > 0;
  useEffect(() => {
    if (hasDirections) useStore.getState().setFlag("directionsOpened");
  }, [hasDirections]);
  const top = gap.rows[0];
  const max = Math.max(...gap.rows.map((r) => r.n), 1);
  const reapply = [...new Set(appsOfStudent(s, me.id).filter((a) => a.status === "ditutup").map((a) => a.jobId))]
    .map((id) => ({ id, check: canReapply(s, me.id, id) }))
    .filter((x) => x.check !== null);

  const empty = (
    <EmptyState
      icon={Hourglass}
      title="Saran belajar muncul setelah ada lamaran ditutup."
      body="Saat perusahaan menutup lamaran karena kemampuan, kami menyusun hal yang bisa diperkuat dari alasan yang mereka pilih."
      action={<Button href="/student/jobs">Cari lowongan</Button>}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Perkembangan</h1>
        <p className="mt-1 text-muted">Dari jawaban lamaran menjadi arah belajar.</p>
      </div>

      <ScreenGate empty={empty}>
        {directions.length === 0 ? (
          empty
        ) : (
          <div className="flex flex-col gap-5">
            {gap.enough && top ? (
              <Tile tone="learn" className="flex flex-col gap-2">
                <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.6vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
                  {top.n} dari {gap.total} lamaran yang ditutup terkait {top.label}.
                </h2>
                <p className="max-w-[60ch] text-learn-700">Pola ini muncul dari {gap.total} lamaran yang ditutup dengan alasan kemampuan. Itu arah yang paling berdampak untuk dikerjakan lebih dulu.</p>
              </Tile>
            ) : (
              <Tile tone="learn" className="flex flex-col gap-1">
                <h2 className="font-semibold text-ink">Baru satu titik data</h2>
                <p className="text-learn-700">Setelah 2 lamaran ditutup, kami akan mencari polanya. Sementara itu, ini saran dari lamaran yang sudah ada.</p>
              </Tile>
            )}

            {gap.enough && (
              <Tile className="flex flex-col gap-4">
                <h2 className="font-semibold">Alasan yang paling sering muncul</h2>
                <ul className="flex flex-col gap-4">
                  {gap.rows.map((r) => (
                    <li key={r.label}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="font-medium">{r.label}</span>
                        <span className="text-sm text-muted">{r.n} dari {gap.total} lamaran</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-learn-100" role="img" aria-label={`${r.label}: ${r.n} dari ${gap.total} lamaran`}>
                        <div className="h-full rounded-full bg-learn-700 transition-[width] duration-700" style={{ width: `${(r.n / max) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Tile>
            )}

            <section aria-labelledby="dir-title" className="flex flex-col gap-3">
              <div className="flex items-center gap-2"><Compass size={20} className="text-brand-700" aria-hidden /><h2 id="dir-title" className="text-lg font-semibold tracking-tight">Arah belajar yang disarankan</h2></div>
              <p className="-mt-1 text-sm text-muted">Saran, bukan kewajiban. Pilih yang paling kamu butuhkan.</p>
              {directions.map(({ tag, items, count }) => (
                <Tile key={tag.id} className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{tag.label}</h3>
                    {count > 1 && <span className="text-xs text-muted">Muncul di {count} lamaran</span>}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {items.map((it) => {
                      const Icon = ICON[it.type];
                      return (
                        <li key={it.title} className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-learn-100 text-learn-700"><Icon size={18} aria-hidden /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{it.title}</span>
                            <span className="block text-xs text-muted">{TYPE_LABEL[it.type]} · {it.estimate}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Tile>
              ))}
            </section>

            {reapply.length > 0 && (
              <Tile tone="brand" className="flex flex-col gap-3">
                <h2 className="font-semibold">Lamar ulang</h2>
                <p className="text-sm text-ink">Kamu bisa melamar ulang ke posisi yang sama setelah masa tunggu dari perusahaan selesai.</p>
                <ul className="flex flex-col gap-2">
                  {reapply.map(({ id, check }) => {
                    const job = jobOf(s, id);
                    const partner = partnerOf(s, job?.partnerId ?? "");
                    return (
                      <li key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 p-3.5">
                        <div>
                          <p className="font-medium">{job?.title}</p>
                          <p className="text-sm text-muted">{partner?.name}{check && !check.ok && check.availableDay !== undefined ? ` · bisa mulai ${fmtShort(check.availableDay)}` : ""}</p>
                        </div>
                        <Button variant={check?.ok ? "hero" : "secondary"} href={`/student/jobs/${id}`}>{check?.ok ? "Lamar ulang" : "Lihat lowongan"}</Button>
                      </li>
                    );
                  })}
                </ul>
              </Tile>
            )}
          </div>
        )}
      </ScreenGate>
    </div>
  );
}
