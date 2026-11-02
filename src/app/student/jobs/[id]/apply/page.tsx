"use client";

import { ArrowLeft, CheckCircle2, FileUp, WifiOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MatchSummary } from "@/components/domain/skills";
import { Banner, Button, CompanyMark, EmptyState, Field, Tile } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { matchJob } from "@/lib/match";
import { appForJob, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort } from "@/lib/time";

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const me = useMe();
  const job = s.jobs.find((j) => j.id === id);
  const [answers, setAnswers] = useState<string[]>(() => (job?.screening ?? []).map(() => ""));
  const [withCv, setWithCv] = useState(false);
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  if (!job) return <EmptyState title="Lowongan tidak ditemukan" body="Kembali ke daftar lowongan." action={<Button href="/student/jobs">Lowongan</Button>} />;

  const partner = partnerOf(s, job.partnerId);
  const match = matchJob(me, job);
  const draft = s.draft && s.draft.jobId === job.id && s.draft.studentId === me.id ? s.draft : null;
  const missing = answers.some((a) => a.trim().length === 0);
  const consentError = touched && !consent;
  const visibleProjects = me.projects.filter((p) => p.visible).length;
  const sent = sentId ? s.applications.find((a) => a.id === sentId) : appForJob(s, me.id, job.id);

  const submit = () => {
    setTouched(true);
    if (!consent || missing) return;
    const result = s.apply(job.id, answers, withCv);
    if (result === "ok") {
      const created = useStore.getState().applications.find((a) => a.studentId === me.id && a.jobId === job.id && a.status === "terkirim");
      setSentId(created?.id ?? null);
    }
  };

  if (sentId && sent) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-8 text-center">
        <span className="anim-stamp grid size-20 place-items-center rounded-full bg-ok-100 text-ok-700"><CheckCircle2 size={40} aria-hidden /></span>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Lamaran terkirim.</h1>
          <p className="mt-2 text-muted">{partner?.name} diharapkan merespons sebelum <strong className="text-ink">{fmtShort(sent.slaDue ?? s.day + 7)}</strong>. Kamu bisa memantau statusnya kapan saja.</p>
        </div>
        <Tile className="w-full text-left">
          <div className="flex items-center gap-3.5">
            <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} />
            <div><p className="font-semibold">{job.title}</p><p className="text-sm text-muted">{partner?.name}</p></div>
          </div>
        </Tile>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="hero" size="lg" href={`/student/applications/${sent.id}`}>Lihat status lamaran</Button>
          <Button variant="secondary" size="lg" href="/student/jobs">Cari lowongan lain</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href={`/student/jobs/${job.id}`} className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden />Kembali ke lowongan</Link>
      <div>
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Kirim lamaran</h1>
        <p className="mt-1 text-muted">{job.title} di {partner?.name}</p>
      </div>

      {(draft || s.screenState === "offline") && (
        <Banner tone="warn" action={draft ? <Button size="sm" variant="secondary" icon={WifiOff} onClick={s.retryDraft}>Coba lagi</Button> : undefined}>
          {draft ? "Belum terkirim. Coba lagi. Lamaranmu tersimpan sebagai draft." : "Kamu sedang offline. Lamaran akan tersimpan sebagai draft bila dikirim sekarang."}
        </Banner>
      )}

      <Tile className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-semibold">Yang akan dikirim: Skill Passport</h2><p className="text-sm text-muted">Skill terverifikasi tidak bisa disembunyikan. Project dan endorsement bisa kamu atur di Passport.</p></div>
        </div>
        <MatchSummary match={match} />
        <ul className="flex flex-wrap gap-2 text-sm">
          <li className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{me.skills.length} skill terverifikasi</li>
          <li className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{visibleProjects} project ditampilkan</li>
          <li className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{me.endorsements.filter((e) => e.visible).length} endorsement mentor</li>
        </ul>
        <Link href="/student/passport" className="w-fit text-sm font-semibold text-brand-600 hover:underline">Atur visibilitas di Passport</Link>
      </Tile>

      <Tile className="flex flex-col gap-4">
        <h2 className="font-semibold">CV (opsional)</h2>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line-strong p-3.5 hover:border-brand-500">
          <input type="checkbox" checked={withCv} onChange={(e) => setWithCv(e.target.checked)} className="size-5 accent-[#007378]" />
          <FileUp size={18} className="text-muted" aria-hidden />
          <span className="text-[15px]">{withCv ? "CV_Rani_Pramesti.pdf (contoh, 214 KB)" : "Sertakan CV dalam format PDF"}</span>
        </label>
      </Tile>

      {job.screening.length > 0 && (
        <Tile className="flex flex-col gap-4">
          <h2 className="font-semibold">Pertanyaan dari perusahaan</h2>
          {job.screening.map((q, i) => (
            <Field key={q} label={q} htmlFor={`q${i}`} error={touched && answers[i].trim() === "" ? "Jawaban ini wajib diisi sebelum mengirim." : undefined}>
              <textarea
                id={`q${i}`}
                rows={4}
                value={answers[i]}
                onChange={(e) => setAnswers(answers.map((a, k) => (k === i ? e.target.value : a)))}
                className="w-full rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
              />
            </Field>
          ))}
        </Tile>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-[15px]">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-describedby="consent-err" className="mt-1 size-5 accent-[#007378]" />
          <span>Saya setuju Skill Passport-ku dibagikan ke {partner?.name} untuk keperluan lamaran ini.</span>
        </label>
        {consentError && <p id="consent-err" className="pl-8 text-sm text-danger-700">Persetujuan diperlukan sebelum Passport dibagikan.</p>}
      </div>

      <div className="sticky bottom-24 z-10 md:static">
        <Button variant="hero" size="lg" block onClick={submit}>Kirim lamaran</Button>
      </div>
    </div>
  );
}
