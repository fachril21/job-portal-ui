"use client";

import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ReviewStep } from "@/components/domain/job-wizard/review";
import { StartScreen } from "@/components/domain/job-wizard/start";
import { StepBasics, StepScreening, StepSkills } from "@/components/domain/job-wizard/steps";
import { WizardSummary } from "@/components/domain/job-wizard/summary";
import { SubmittedScreen } from "@/components/domain/job-wizard/success";
import { STEPS, Stepper } from "@/components/domain/job-wizard/ui";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { Button } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { TEMPLATES } from "@/data/job-templates";
import { draftFromJob, draftToInput, emptyDraft, estimateTalent, firstInvalidStep, validateStep, type JobDraft } from "@/lib/jobdraft";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import type { Bootcamp } from "@/lib/types";

const newId = (): string => `d${Date.now().toString(36)}`;

interface Init { draft: JobDraft | null; reviseId: string | null }

function initialFromParams(params: URLSearchParams): Init {
  const s = useStore.getState();
  const own = s.jobs.filter((j) => j.partnerId === PARTNER_ME);
  const draftId = params.get("draft");
  if (draftId && s.jobDrafts[draftId]) return { draft: s.jobDrafts[draftId], reviseId: null };
  const from = own.find((j) => j.id === params.get("from"));
  if (from) return { draft: draftFromJob(from, newId(), s.day), reviseId: null };
  const rev = own.find((j) => j.id === params.get("revise"));
  if (rev) return { draft: draftFromJob(rev, `rev-${rev.id}`, s.day), reviseId: rev.id };
  return { draft: null, reviseId: null };
}

function Wizard() {
  const router = useRouter();
  const params = useSearchParams();
  const s = useStore();
  const [init] = useState<Init>(() => initialFromParams(params));
  const [draft, setDraft] = useState<JobDraft | null>(init.draft);
  const [step, setStep] = useState(init.draft ? 1 : 0);
  const [reached, setReached] = useState(1);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<{ id: string; title: string; count: number } | null>(null);

  const partner = partnerOf(s, PARTNER_ME);
  const ownJobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME);
  const drafts = Object.values(s.jobDrafts).sort((a, b) => b.updatedDay - a.updatedDay);
  const errors = draft && tried ? validateStep(draft, step) : {};

  // Autosave draft; revisi lowongan yang sudah ada tidak disimpan sebagai draft.
  useEffect(() => {
    if (!draft || init.reviseId || done) return;
    const t = setTimeout(() => useStore.getState().saveJobDraft(draft), 500);
    return () => clearTimeout(t);
  }, [draft, init.reviseId, done]);

  const begin = (d: JobDraft) => { setDraft(d); setStep(1); setReached(1); setTried(false); };
  const patch = (p: Partial<JobDraft>) => setDraft((d) => (d ? { ...d, ...p } : d));
  const startTemplate = (f: Bootcamp) => begin({ ...emptyDraft(newId(), s.day, f), ...TEMPLATES[f], field: f });

  const go = (n: number) => { setStep(n); setTried(false); setReached((r) => Math.max(r, n)); window.scrollTo({ top: 0 }); };
  const next = () => {
    if (!draft) return;
    setTried(true);
    if (Object.keys(validateStep(draft, step)).length > 0) return;
    go(step + 1);
  };
  const saveAndExit = () => {
    if (!draft) return;
    s.saveJobDraft(draft);
    s.toast("Draft disimpan.", "ok", "partner");
    router.push("/partner/jobs");
  };
  const submit = () => {
    if (!draft) return;
    const bad = firstInvalidStep(draft);
    if (bad) { go(bad); setTried(true); return; }
    const input = draftToInput(draft);
    const store = useStore.getState();
    const id = init.reviseId ?? store.createJob(input);
    if (init.reviseId) store.reviseJob(init.reviseId, input);
    store.deleteJobDraft(draft.id);
    store.toast(init.reviseId ? "Revisi dikirim ulang untuk moderasi." : "Lowongan dikirim untuk moderasi.", "ok", "partner");
    setDone({ id, title: input.title, count: estimateTalent(store.students, draft) });
  };

  if (done) {
    return (
      <>
        <PageHeader title="Lowongan terkirim" sub="Satu langkah lagi sampai tayang untuk student." />
        <SubmittedScreen title={done.title} jobId={done.id} talentCount={done.count} revised={!!init.reviseId} />
      </>
    );
  }

  if (!draft || step === 0) {
    return (
      <>
        <PageHeader title="Buat lowongan" sub="Pilih titik awal. Kamu bisa mengubah semuanya sebelum dikirim." />
        <StartScreen
          jobs={ownJobs}
          drafts={drafts}
          onBlank={() => begin(emptyDraft(newId(), s.day))}
          onTemplate={startTemplate}
          onDuplicate={(j) => begin(draftFromJob(j, newId(), s.day))}
          onResume={begin}
        />
      </>
    );
  }

  const isLast = step === STEPS.length;
  return (
    <>
      <PageHeader title={init.reviseId ? "Revisi lowongan" : "Buat lowongan"} sub={init.reviseId ? "Perbaiki sesuai catatan Dibimbing, lalu kirim ulang." : "Draft tersimpan otomatis."} />
      <div className="mb-5"><Stepper current={step} maxReached={reached} onJump={go} /></div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          {step === 1 && <StepBasics draft={draft} patch={patch} errors={errors} />}
          {step === 2 && <StepSkills draft={draft} patch={patch} errors={errors} />}
          {step === 3 && <StepScreening draft={draft} patch={patch} errors={errors} />}
          {step === 4 && <ReviewStep draft={draft} partner={partner} onEdit={go} />}

          <div className="sticky bottom-0 -mx-1 mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line bg-canvas/95 px-1 py-3">
            <Button size="sm" variant="quiet" icon={ArrowLeft} onClick={() => (step === 1 ? setStep(0) : go(step - 1))}>{step === 1 ? "Ganti titik awal" : "Kembali"}</Button>
            <div className="flex items-center gap-2">
              {!init.reviseId && <Button size="sm" variant="secondary" icon={Save} onClick={saveAndExit}>Simpan draft</Button>}
              {isLast ? <Button size="sm" icon={Send} onClick={submit}>{init.reviseId ? "Kirim ulang" : "Kirim untuk moderasi"}</Button> : <Button size="sm" iconRight={ArrowRight} onClick={next}>Lanjut</Button>}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-4"><WizardSummary draft={draft} partner={partner} students={s.students} /></aside>
      </div>
    </>
  );
}

export default function NewJobPage() {
  return (
    <Suspense fallback={null}>
      <Wizard />
    </Suspense>
  );
}
