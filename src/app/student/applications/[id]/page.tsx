"use client";

import { ArrowLeft, FileText, LifeBuoy, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FeedbackCard, NextStep, StatusTimeline } from "@/components/domain/application";
import { OfferLetterSheet, OfferTerms } from "@/components/domain/offer";
import { Sheet } from "@/components/ui/overlay";
import { useMe } from "@/lib/hooks";
import { Banner, Button, CompanyMark, EmptyState, StatusPill, Tile } from "@/components/ui/primitives";
import { jobOf, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtShort, isActive, slaInfo } from "@/lib/time";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const app = s.applications.find((a) => a.id === id);
  const me = useMe();
  const [confirm, setConfirm] = useState<"followup" | "withdraw" | null>(null);
  const [letter, setLetter] = useState(false);

  const closed = app?.status === "ditutup";
  useEffect(() => {
    if (closed) useStore.getState().setFlag("feedbackOpened");
  }, [closed]);

  if (!app) return <EmptyState title="Lamaran tidak ditemukan" body="Kembali ke daftar lamaranmu." action={<Button href="/student/applications">Lamaran saya</Button>} />;

  const job = jobOf(s, app.jobId);
  const partner = partnerOf(s, job?.partnerId ?? "");
  if (!job || !partner) return null;
  const sla = slaInfo(app, s.day);
  const overdue = sla.state === "overdue";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/student/applications" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden />Lamaran saya</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <CompanyMark name={partner.name} tone={partner.logoTone} size={52} />
          <div>
            <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.02em]">{job.title}</h1>
            <p className="text-muted">{partner.name} · Dikirim {fmtShort(app.sentDay)}</p>
          </div>
        </div>
        <StatusPill status={app.status} overdue={overdue} />
      </div>

      {closed && <FeedbackCard app={app} job={job} companyName={partner.name} />}

      {(app.status === "penawaran" || app.status === "diterima") && app.offer && me && (
        <Tile tone="ok" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-ok-700"><PartyPopper size={20} aria-hidden /><h2 className="font-semibold">{app.status === "diterima" ? `Kamu menerima penawaran dari ${partner.name}` : `Penawaran dari ${partner.name}`}</h2></div>
          <p className="text-ink">{app.status === "diterima" ? "Semoga langkah barumu lancar. Suratnya tetap bisa kamu baca kapan saja." : "Baca ketentuan dan suratnya dengan tenang, lalu putuskan sebelum batas jawab."}</p>
          <OfferTerms offer={app.offer} today={s.day} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" size="lg" icon={FileText} onClick={() => setLetter(true)}>Baca offering letter</Button>
            {app.status === "penawaran" && (
              <>
                <Button variant="hero" size="lg" onClick={() => { s.acceptOffer(app.id); s.toast("Selamat. Penawaran diterima.", "ok", "student"); }}>Terima penawaran</Button>
                <Button variant="quiet" size="lg" onClick={() => setConfirm("withdraw")}>Tolak dan mundur</Button>
              </>
            )}
          </div>
          <OfferLetterSheet open={letter} onClose={() => setLetter(false)} offer={app.offer} student={me} job={job} partner={partner} onDownload={() => s.toast("Offering letter diunduh (contoh).", "ok", "student")} />
        </Tile>
      )}

      {overdue && (
        <Tile tone="brand" className="flex flex-col gap-3">
          <h2 className="font-semibold">Belum ada respons dari perusahaan</h2>
          <p className="max-w-[60ch] text-ink">Dibimbing sedang menindaklanjuti dengan perusahaan. Kamu juga bisa meminta Talent Support membantu follow up secara langsung.</p>
          {app.followUpRequested ? (
            <p className="flex items-center gap-2 rounded-xl bg-white/70 px-3.5 py-2.5 text-sm font-medium text-brand-700">
              <LifeBuoy size={16} aria-hidden />{app.followUpAnswered ? "Talent Support sudah menghubungi perusahaan." : "Permintaanmu sudah diterima. Talent Support akan menghubungi perusahaan."}
            </p>
          ) : (
            <div><Button variant="primary" icon={LifeBuoy} onClick={() => setConfirm("followup")}>Minta Talent Support bantu follow up</Button></div>
          )}
        </Tile>
      )}

      {!overdue && app.followUpRequested && isActive(app) && (
        <Banner tone={app.followUpAnswered ? "ok" : "proc"}>
          {app.followUpAnswered ? "Talent Support sudah menghubungi perusahaan. Tenggat baru ditetapkan." : "Permintaan follow up sudah dikirim ke Talent Support."}
        </Banner>
      )}

      <Tile className="flex flex-col gap-4">
        <h2 className="font-semibold">Perjalanan lamaran</h2>
        <StatusTimeline app={app} />
        {isActive(app) && app.status !== "penawaran" && (
          <div className="border-t border-line pt-3"><Button variant="quiet" size="sm" onClick={() => setConfirm("withdraw")}>Mundur dari lamaran ini</Button></div>
        )}
      </Tile>

      {isActive(app) && (
        <NextStep
          text={overdue ? "Lamar satu lowongan lain sambil menunggu kabar." : "Sambil menunggu, lengkapi Passport-mu atau lamar lowongan lain."}
          action={<Button variant="secondary" href="/student/jobs">Cari lowongan</Button>}
        />
      )}

      <Sheet
        open={confirm === "followup"}
        onClose={() => setConfirm(null)}
        title="Minta Talent Support follow up?"
        footer={<><Button variant="ghost" onClick={() => setConfirm(null)}>Batal</Button><Button onClick={() => { s.requestFollowUp(app.id); setConfirm(null); s.toast("Permintaan dikirim ke Talent Support.", "ok", "student"); }}>Kirim permintaan</Button></>}
      >
        <p>Tim Talent Support akan menghubungi {partner.name} untuk menanyakan kelanjutan lamaranmu. Kamu hanya bisa meminta follow up satu kali untuk setiap lamaran.</p>
      </Sheet>
      <Sheet
        open={confirm === "withdraw"}
        onClose={() => setConfirm(null)}
        title="Mundur dari lamaran ini?"
        footer={<><Button variant="ghost" onClick={() => setConfirm(null)}>Batal</Button><Button onClick={() => { s.withdraw(app.id); setConfirm(null); }}>Ya, mundur</Button></>}
      >
        <p>Lamaranmu ke {job.title} akan ditutup. Kamu masih bisa melamar lowongan lain kapan saja.</p>
      </Sheet>
    </div>
  );
}
