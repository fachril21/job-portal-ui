"use client";

import clsx from "clsx";
import { BadgeCheck, Check, Copy, Eye, EyeOff, Link2, Lock } from "lucide-react";
import { useState } from "react";
import { SkillList } from "@/components/domain/skills";
import { Avatar, Button, Pill, Switch, Tile } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { useStore } from "@/lib/store";

const READY_LABEL = { cv: "CV direview", linkedin: "LinkedIn direview", interview: "Latihan interview selesai" } as const;

export default function PassportPage() {
  const s = useStore();
  const me = useMe();
  const [view, setView] = useState<"privat" | "publik">("privat");
  const partial = me.status === "belajar";
  const isPublic = view === "publik";
  const projects = isPublic ? me.projects.filter((p) => p.visible) : me.projects;
  const endorsements = isPublic ? me.endorsements.filter((e) => e.visible) : me.endorsements;
  const slug = me.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Skill Passport</h1>
          <p className="mt-1 max-w-[52ch] text-muted">Profil kemampuanmu yang terisi dari proses belajar, lengkap dengan bukti di tiap skill.</p>
        </div>
        <div role="tablist" aria-label="Tampilan Passport" className="flex rounded-full border border-line bg-surface p-1 shadow-xs">
          {([["privat", "Milikku", Lock], ["publik", "Tampilan publik", Eye]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)} className={clsx("flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors", view === id ? "bg-brand-600 text-white" : "text-muted hover:text-ink")}>
              <Icon size={15} aria-hidden />{label}
            </button>
          ))}
        </div>
      </div>

      {isPublic && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-proc-100 px-4 py-3 text-sm text-proc-700">
          <span className="flex items-center gap-2"><Link2 size={16} aria-hidden />dibimbing.id/passport/{slug} <span className="text-xs">(contoh tautan)</span></span>
          <Button size="sm" variant="secondary" icon={Copy} onClick={() => s.toast("Tautan Passport disalin (contoh).", "ok")}>Salin tautan</Button>
        </div>
      )}

      <Tile className="flex flex-wrap items-center gap-5">
        <Avatar initials={me.initials} size={72} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-bold tracking-tight">{me.name}</h2>
          <p className="text-muted">{me.bootcamp} · {me.batch} · {me.city}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Pill tone={me.status === "lulus" ? "ok" : "proc"}>{me.status === "lulus" ? "Lulus" : "Masih belajar"}</Pill>
            <Pill tone="proc" dot={false}><BadgeCheck size={13} aria-hidden />Mentor Reviewed</Pill>
          </div>
        </div>
      </Tile>

      {partial && (
        <div className="rounded-2xl bg-warn-100 px-4 py-3 text-warn-700">
          <p className="font-semibold">{me.skills.length} dari {me.skillTarget} skill sudah terverifikasi.</p>
          <p className="text-sm">Passport-mu masih parsial karena belum selesai bootcamp. Kamu tetap bisa melamar posisi magang.</p>
        </div>
      )}

      <Tile className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">Skill terverifikasi</h2>
          <p className="text-sm text-muted">Tap skill untuk melihat buktinya.</p>
        </div>
        <SkillList skills={me.skills} />
      </Tile>

      <section className="flex flex-col gap-3" aria-label="Project unggulan">
        <h2 className="text-lg font-semibold tracking-tight">Project unggulan</h2>
        {projects.length === 0 && <p className="rounded-2xl border border-dashed border-line-strong p-5 text-sm text-muted">Belum ada project yang ditampilkan.</p>}
        {projects.map((p) => (
          <Tile key={p.id} className={clsx("flex flex-col gap-3", !p.visible && "opacity-70")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{p.summary}</p>
              </div>
              <span className="shrink-0 rounded-xl bg-brand-50 px-3 py-1.5 text-center"><span className="block text-lg font-bold leading-none text-brand-700">{p.score}</span><span className="text-[11px] text-muted">dari 100</span></span>
            </div>
            <p className="rounded-xl bg-canvas p-3 text-sm"><span className="font-medium">Catatan mentor:</span> {p.mentorNote}</p>
            {!isPublic && (
              <label className="flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                <span className="flex items-center gap-2 text-muted">{p.visible ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}{p.visible ? "Terlihat oleh partner" : "Disembunyikan dari partner"}</span>
                <Switch checked={p.visible} onChange={() => s.toggleProjectVisible(me.id, p.id)} label={`Tampilkan project ${p.title}`} />
              </label>
            )}
          </Tile>
        ))}
      </section>

      {(endorsements.length > 0 || !isPublic) && (
        <section className="flex flex-col gap-3" aria-label="Endorsement mentor">
          <h2 className="text-lg font-semibold tracking-tight">Endorsement mentor</h2>
          {endorsements.length === 0 && <p className="rounded-2xl border border-dashed border-line-strong p-5 text-sm text-muted">Endorsement dari mentor akan muncul setelah penilaian project selesai.</p>}
          {endorsements.map((e) => (
            <Tile key={e.id} className={clsx("flex flex-col gap-3", !e.visible && "opacity-70")}>
              <blockquote className="text-[15px]">“{e.quote}”</blockquote>
              <p className="text-sm font-medium text-muted">{e.mentor}</p>
              {!isPublic && (
                <label className="flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                  <span className="text-muted">{e.visible ? "Terlihat oleh partner" : "Disembunyikan dari partner"}</span>
                  <Switch checked={e.visible} onChange={() => s.toggleEndorsementVisible(me.id, e.id)} label="Tampilkan endorsement" />
                </label>
              )}
            </Tile>
          ))}
        </section>
      )}

      <Tile className="flex flex-col gap-3">
        <h2 className="font-semibold">Kesiapan karier</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(READY_LABEL) as (keyof typeof READY_LABEL)[]).map((k) => (
            <li key={k} className={clsx("flex items-center gap-2 rounded-xl p-3 text-sm", me.readiness[k] ? "bg-ok-100 text-ok-700" : "bg-canvas text-muted")}>
              {me.readiness[k] ? <Check size={16} aria-hidden /> : <span className="size-4 rounded-full border-2 border-line-strong" aria-hidden />}
              {READY_LABEL[k]}
              <span className="sr-only">{me.readiness[k] ? " (selesai)" : " (belum)"}</span>
            </li>
          ))}
        </ul>
      </Tile>

      {!isPublic && (
        <Tile tone="brand" className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Terbuka untuk ditemukan</h2>
            <p className="mt-0.5 max-w-[50ch] text-sm text-ink">Hiring partner bisa menemukan Passport-mu di talent search dan mengundangmu melamar. Bila dimatikan, kamu tidak akan muncul.</p>
          </div>
          <Switch checked={me.openToBeFound} onChange={() => s.toggleOpenToBeFound(me.id)} label="Terbuka untuk ditemukan" />
        </Tile>
      )}
    </div>
  );
}
