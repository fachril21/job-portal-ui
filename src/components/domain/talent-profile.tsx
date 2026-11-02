"use client";

import { BadgeCheck, Bookmark, FileText, Link2, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CvSheet } from "@/components/domain/cv";
import { SkillMeter } from "@/components/domain/skills";
import { Sheet } from "@/components/ui/overlay";
import { Avatar, Button, Chip, Pill } from "@/components/ui/primitives";
import { avgProjectScore, salaryRange } from "@/lib/talent";
import { useStore } from "@/lib/store";
import { LEVEL_LABEL, type Student } from "@/lib/types";

interface Props {
  student: Student | null;
  onClose: () => void;
  onInvite: (s: Student) => void;
  invited: boolean;
}

/** Profil talent untuk partner. Data pribadi yang sensitif tidak pernah ditampilkan. */
export function TalentProfileSheet({ student, onClose, onInvite, invited }: Props) {
  const shortlist = useStore((s) => s.shortlist);
  const toggle = useStore((s) => s.toggleShortlist);
  const [cvOpen, setCvOpen] = useState(false);

  if (!student) return <Sheet open={false} onClose={onClose} title="Profil" children={null} />;
  const p = student.profile;
  const saved = shortlist.includes(student.id);
  const projects = student.projects.filter((x) => x.visible);
  const endorsements = student.endorsements.filter((e) => e.visible);

  return (
    <>
      <Sheet
        open={!cvOpen}
        onClose={onClose}
        variant="side"
        title={student.name}
        footer={
          <>
            <Button size="sm" variant="secondary" icon={Bookmark} onClick={() => toggle(student.id)}>{saved ? "Tersimpan" : "Simpan"}</Button>
            {p.cv && <Button size="sm" variant="secondary" icon={FileText} onClick={() => setCvOpen(true)}>Lihat CV</Button>}
            <Button size="sm" icon={Send} disabled={invited} onClick={() => onInvite(student)}>{invited ? "Undangan terkirim" : "Undang melamar"}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Avatar initials={student.initials} size={52} />
            <div className="min-w-0">
              <p className="font-medium">{p.headline}</p>
              <p className="text-sm text-muted">{student.isBootcamp ? `${student.bootcamp} · ${student.batch} · ${student.city}, ${p.province}` : `${student.city}, ${p.province} · minat ${student.bootcamp}`}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {student.isBootcamp && <Pill tone="proc" dot={false}><BadgeCheck size={12} aria-hidden />Student Bootcamp</Pill>}
                {student.isBootcamp && <Pill tone="muted" dot={false}>Rata-rata project {avgProjectScore(student)}/100</Pill>}
              </div>
            </div>
          </div>

          <p className="text-sm">{p.about}</p>

          <section>
            {!student.isBootcamp && <p className="mb-3 rounded-xl bg-canvas p-3 text-sm text-muted">Belum ada penilaian mentor atau skill terverifikasi Dibimbing. Semua data di profil ini diisi sendiri oleh pemiliknya.</p>}
            {student.isBootcamp && <><h3 className="mb-2 text-sm font-semibold">Skill terverifikasi Dibimbing</h3>
            <ul className="flex flex-col gap-2.5">
              {student.skills.map((k) => (
                <li key={k.skill}>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{k.skill}</span><span className="flex items-center gap-2"><span className="text-xs text-muted">{LEVEL_LABEL[k.level]}</span><SkillMeter level={k.level} showLabel={false} size="sm" /></span></div>
                  <p className="text-xs text-muted">{k.evidence}</p>
                </li>
              ))}
            </ul></>}
            <h3 className="mb-1.5 mt-4 text-sm font-semibold">{student.isBootcamp ? "Keahlian lain" : "Keahlian"} <span className="font-normal text-muted">(diisi sendiri)</span></h3>
            <div className="flex flex-wrap gap-1.5">{p.selfSkills.map((k) => <Chip key={k} tone="plain">{k}</Chip>)}</div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">Preferensi kerja</h3>
            <dl className="grid gap-x-4 gap-y-2 rounded-xl bg-canvas p-3.5 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-muted">Bidang</dt><dd>{p.preference.fields.join(", ")}</dd></div>
              <div><dt className="text-xs text-muted">Tipe kerja</dt><dd>{p.preference.jobTypes.join(", ")}</dd></div>
              <div><dt className="text-xs text-muted">Model kerja</dt><dd>{p.preference.workModes.join(", ")}</dd></div>
              <div><dt className="text-xs text-muted">Ekspektasi gaji</dt><dd>{salaryRange(p.preference.salaryMin, p.preference.salaryMax)} / bulan</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs text-muted">Bersedia bekerja di</dt><dd>{p.preference.locations.join(", ")}</dd></div>
            </dl>
          </section>

          {projects.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold">Project</h3>
              <ul className="flex flex-col gap-2">
                {projects.map((x) => (
                  <li key={x.id} className="rounded-lg border border-line p-3 text-sm">
                    <div className="flex items-start justify-between gap-2"><span className="font-medium">{x.title}</span><span className="text-xs text-muted">{x.score}/100</span></div>
                    <p className="mt-0.5 text-muted">{x.summary}</p>
                    <p className="mt-1.5 text-xs"><span className="font-medium">Mentor:</span> {x.mentorNote}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {endorsements.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold">Endorsement mentor</h3>
              {endorsements.map((e) => <p key={e.id} className="mb-1.5 text-sm text-muted">“{e.quote}” <span className="text-xs">— {e.mentor}</span></p>)}
            </section>
          )}

          <section>
            <h3 className="mb-2 text-sm font-semibold">Latar belakang</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {p.experience.map((e) => <li key={e.org}><span className="font-medium">{e.role}</span><span className="block text-xs text-muted">{e.org} · {e.period}</span></li>)}
              {p.education.map((e) => <li key={e.school}><span className="font-medium">{e.major}</span><span className="block text-xs text-muted">{e.school} · {e.years}</span></li>)}
            </ul>
            {p.links.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><Link2 size={14} aria-hidden />{p.links.map((l) => `${l.label}: ${l.url.replace("https://", "")}`).join(" · ")}</p>}
          </section>

          <p className="flex items-start gap-2 rounded-xl bg-proc-100 p-3 text-xs text-proc-700"><ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden />Email, nomor telepon, alamat, dan data identitas tidak ditampilkan. Kontak dibagikan lewat Dibimbing setelah kandidat menerima undanganmu.</p>
        </div>
      </Sheet>
      <CvSheet student={student} open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}
