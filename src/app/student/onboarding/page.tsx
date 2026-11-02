"use client";

import clsx from "clsx";
import { ArrowRight, BadgeCheck, Compass, Hourglass } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Tile } from "@/components/ui/primitives";
import { useMe } from "@/lib/hooks";
import { useStore } from "@/lib/store";

const STEPS = [
  {
    icon: BadgeCheck,
    tone: "bg-brand-50 text-brand-700",
    title: "Passport-mu terisi dari proses belajar.",
    body: "Skill Passport adalah profil kemampuan yang bersumber dari skor project dan penilaian mentor, bukan isian bebas. Setiap skill punya bukti yang bisa dilihat partner.",
  },
  {
    icon: Hourglass,
    tone: "bg-proc-100 text-proc-700",
    title: "Setiap lamaran punya tenggat.",
    body: "SLA adalah batas waktu respons perusahaan, 7 hari kalender sejak lamaranmu terkirim. Kamu selalu bisa melihat status dan sisa waktunya, tanpa perlu bertanya.",
  },
  {
    icon: Compass,
    tone: "bg-learn-100 text-learn-700",
    title: "Setiap jawaban punya langkah berikutnya.",
    body: "Bila lamaran ditutup karena kemampuan, kamu menerima rencana belajar yang spesifik. Bila karena faktor lain, kamu akan diberi tahu bahwa itu bukan tentang kemampuanmu.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const me = useMe();
  const setFlag = useStore((s) => s.setFlag);
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [building, setBuilding] = useState(false);
  const last = step === STEPS.length;

  const finish = () => {
    setBuilding(true);
    setFlag("onboarded");
    setTimeout(() => router.push("/student/passport"), 1400);
  };

  if (building) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center" aria-live="polite">
        <span className="size-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600 motion-reduce:animate-none" aria-hidden />
        <h1 className="font-display text-2xl font-bold tracking-tight">Menyusun Passport-mu…</h1>
        <p className="text-muted">Mengambil skor project dan penilaian mentor dari proses belajarmu.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <ol className="flex gap-2" aria-label={`Langkah ${Math.min(step + 1, 4)} dari 4`}>
          {[0, 1, 2, 3].map((i) => <li key={i} className={clsx("h-1.5 w-10 rounded-full transition-colors", i <= step ? "bg-brand-600" : "bg-line")} />)}
        </ol>
        <Button variant="quiet" size="sm" onClick={() => { setFlag("onboarded"); router.push("/student"); }}>Lewati</Button>
      </div>

      {!last ? (
        (() => {
          const st = STEPS[step];
          const Icon = st.icon;
          return (
            <Tile key={step} className="anim-rise flex flex-col gap-5 p-7">
              <span className={clsx("grid size-14 place-items-center rounded-2xl", st.tone)}><Icon size={28} aria-hidden /></span>
              <h1 className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">{st.title}</h1>
              <p className="max-w-[48ch] text-lg text-muted">{st.body}</p>
              <div className="flex gap-2 pt-2">
                {step > 0 && <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>Kembali</Button>}
                <Button size="lg" iconRight={ArrowRight} onClick={() => setStep(step + 1)}>Lanjut</Button>
              </div>
            </Tile>
          );
        })()
      ) : (
        <Tile className="anim-rise flex flex-col gap-5 p-7">
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Siap membuat Passport, {me.name.split(" ")[0]}?</h1>
          <p className="text-lg text-muted">Kami akan mengisi {me.skills.length} skill terverifikasi, {me.projects.length} project, dan endorsement mentor dari data belajarmu. Kamu yang mengatur apa yang terlihat oleh partner.</p>
          <label className="flex cursor-pointer items-start gap-3 text-[15px]">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-5 accent-[#007378]" />
            <span>Saya setuju data belajarku dipakai untuk menyusun Passport dan dibagikan ke partner hanya saat aku melamar.</span>
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>Kembali</Button>
            <Button variant="hero" size="lg" disabled={!consent} onClick={finish}>Buat Passport</Button>
          </div>
          {!consent && <p className="text-sm text-muted">Centang persetujuan untuk melanjutkan.</p>}
        </Tile>
      )}
    </div>
  );
}
