"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/overlay";
import { Button, CompanyMark, Field, inputCalmCls } from "@/components/ui/primitives";
import { fmtDate } from "@/lib/time";
import type { Job, Offer, Partner, Student } from "@/lib/types";

interface LetterProps {
  open: boolean;
  onClose: () => void;
  offer: Offer;
  student: Student;
  job: Job;
  partner: Partner;
  onDownload: () => void;
}

/** Ringkasan syarat penawaran, dipakai di kartu student dan pratinjau partner. */
export function OfferTerms({ offer, today }: { offer: Offer; today: number }) {
  const left = offer.deadlineDay - today;
  const rows: [string, string][] = [
    ["Gaji", offer.salary],
    ["Model kerja", offer.workType],
    ["Mulai kerja", fmtDate(offer.startDay)],
    ["Masa percobaan", offer.probation],
    ["Batas jawab", `${fmtDate(offer.deadlineDay)}${left >= 0 ? ` (${left === 0 ? "hari ini" : `${left} hari lagi`})` : " (terlewat)"}`],
  ];
  return (
    <dl className="grid gap-x-6 gap-y-2.5 rounded-2xl bg-white/70 p-4 text-sm sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Surat penawaran kerja yang bisa dibaca student. Dokumen contoh, bukan dokumen hukum. */
export function OfferLetterSheet({ open, onClose, offer, student, job, partner, onDownload }: LetterProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Offering letter"
      width="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" size="sm" icon={Download} onClick={onDownload}>Unduh PDF (contoh)</Button>
          <Button size="sm" onClick={onClose}>Tutup</Button>
        </>
      }
    >
      <article className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6 text-[15px] leading-relaxed sm:p-8">
        <header className="flex items-center gap-3 border-b border-line pb-4">
          <CompanyMark name={partner.name} tone={partner.logoTone} size={44} />
          <div>
            <p className="font-semibold">{partner.name}</p>
            <p className="text-xs text-muted">{partner.industry} · {partner.city}</p>
          </div>
        </header>

        <div>
          <h3 className="text-lg font-semibold tracking-tight">Surat Penawaran Kerja</h3>
          <p className="text-sm text-muted">Nomor {offer.letterNo} · {fmtDate(offer.sentDay)}</p>
        </div>

        <p>
          Kepada Yth.<br />
          <span className="font-medium">{student.name}</span><br />
          <span className="text-muted">{student.bootcamp} · {student.batch}</span>
        </p>

        <p>
          Terima kasih telah mengikuti proses seleksi untuk posisi <span className="font-medium">{job.title}</span> di {partner.name}. {offer.note} Dengan ini kami menawarkan posisi tersebut dengan ketentuan berikut.
        </p>

        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["Posisi", `${job.title} (${job.level})`],
              ["Lokasi", `${job.location} · ${offer.workType}`],
              ["Gaji", offer.salary],
              ["Tanggal mulai", fmtDate(offer.startDay)],
              ["Masa percobaan", offer.probation],
            ].map(([k, v]) => (
              <tr key={k} className="border-y border-line">
                <th scope="row" className="w-40 py-2 pr-3 text-left font-normal text-muted">{k}</th>
                <td className="py-2 font-medium">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          Mohon konfirmasi penerimaan penawaran ini paling lambat <span className="font-medium">{fmtDate(offer.deadlineDay)}</span>. Setelah tanggal tersebut penawaran dapat dianggap tidak berlaku.
        </p>

        <footer className="flex flex-col gap-1 pt-2">
          <p>Hormat kami,</p>
          <p className="mt-6 font-medium">Tim HR</p>
          <p className="text-sm text-muted">{partner.name}</p>
        </footer>
        <p className="border-t border-line pt-3 text-xs text-subtle">Dokumen contoh untuk prototipe. Nama, angka, dan isi surat bersifat sintetis.</p>
      </article>
    </Sheet>
  );
}

const START_OPTIONS = [14, 21, 30];
const DEADLINE_OPTIONS = [3, 7, 14];

interface DialogProps {
  open: boolean;
  candidateName: string;
  job: Job;
  today: number;
  onClose: () => void;
  onSubmit: (offer: Partial<Offer>) => void;
}

/** Partner mengisi syarat penawaran. Surat dibuat otomatis dari template. */
export function OfferDialog({ open, candidateName, job, today, onClose, onSubmit }: DialogProps) {
  const [salary, setSalary] = useState(job.salary ?? "");
  const [start, setStart] = useState(21);
  const [deadline, setDeadline] = useState(7);
  const [probation, setProbation] = useState("3 bulan");
  const [note, setNote] = useState("");

  const submit = () => {
    onSubmit({
      salary: salary.trim() || "Sesuai kesepakatan",
      startDay: today + start,
      deadlineDay: today + deadline,
      probation,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Penawaran untuk ${candidateName}`}
      width="max-w-lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Batal</Button>
          <Button size="sm" icon={FileText} onClick={submit}>Kirim penawaran</Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-muted">Offering letter dibuat otomatis dari template dan bisa dibaca kandidat langsung di lamarannya.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Gaji" htmlFor="of-salary"><input id="of-salary" className={inputCalmCls} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Rp 8 juta / bulan" /></Field>
        </div>
        <Field label="Mulai kerja" htmlFor="of-start">
          <select id="of-start" className={inputCalmCls} value={start} onChange={(e) => setStart(Number(e.target.value))}>
            {START_OPTIONS.map((d) => <option key={d} value={d}>{d} hari dari sekarang</option>)}
          </select>
        </Field>
        <Field label="Batas jawab" htmlFor="of-deadline">
          <select id="of-deadline" className={inputCalmCls} value={deadline} onChange={(e) => setDeadline(Number(e.target.value))}>
            {DEADLINE_OPTIONS.map((d) => <option key={d} value={d}>{d} hari</option>)}
          </select>
        </Field>
        <Field label="Masa percobaan" htmlFor="of-prob">
          <select id="of-prob" className={inputCalmCls} value={probation} onChange={(e) => setProbation(e.target.value)}>
            {["Tanpa masa percobaan", "3 bulan", "6 bulan"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Catatan untuk kandidat (opsional)" htmlFor="of-note">
            <textarea id="of-note" rows={3} maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} className="w-full resize-none rounded-lg border border-line-strong p-3 text-sm outline-none focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]" />
          </Field>
        </div>
      </div>
    </Sheet>
  );
}
