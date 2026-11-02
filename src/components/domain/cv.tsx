"use client";

import { Download } from "lucide-react";
import { Sheet } from "@/components/ui/overlay";
import { Button } from "@/components/ui/primitives";
import { LEVEL_LABEL, type Student } from "@/lib/types";
import { useStore } from "@/lib/store";

/**
 * Pratinjau CV student. Di produk ini berkas PDF asli yang diunggah student;
 * di prototipe, isinya disusun dari data profil. Tanpa email, telepon, NIK, atau alamat.
 */
export function CvSheet({ student, open, onClose }: { student: Student; open: boolean; onClose: () => void }) {
  const toast = useStore((s) => s.toast);
  const p = student.profile;
  if (!p.cv) return null;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={p.cv.fileName}
      width="max-w-2xl"
      footer={
        <>
          <span className="mr-auto text-xs text-muted">Diperbarui {p.cv.updated}</span>
          <Button variant="secondary" size="sm" icon={Download} onClick={() => toast("CV diunduh (contoh).", "ok", "partner")}>Unduh PDF (contoh)</Button>
          <Button size="sm" onClick={onClose}>Tutup</Button>
        </>
      }
    >
      <article className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6 text-[15px] leading-relaxed sm:p-8">
        <header className="border-b border-line pb-4">
          <h3 className="text-2xl font-semibold tracking-tight">{student.name}</h3>
          <p className="text-muted">{p.headline} · {student.city}, {p.province}</p>
        </header>

        <section>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Tentang saya</h4>
          <p>{p.about}</p>
        </section>

        {p.experience.length > 0 && (
          <section>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Pengalaman kerja</h4>
            <ul className="flex flex-col gap-2">
              {p.experience.map((e) => (
                <li key={e.org}><p className="font-medium">{e.role}</p><p className="text-sm text-muted">{e.org} · {e.period}</p></li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Pendidikan</h4>
          <ul className="flex flex-col gap-2">
            {p.education.map((e) => (
              <li key={e.school}><p className="font-medium">{e.major}</p><p className="text-sm text-muted">{e.school} · {e.years}</p></li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Keahlian</h4>
          <p className="text-sm">{[...student.skills.map((k) => `${k.skill} (${LEVEL_LABEL[k.level]})`), ...p.selfSkills].join(" · ")}</p>
        </section>

        {student.projects.some((x) => x.visible) && (
        <section>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Project</h4>
          <ul className="flex flex-col gap-2">
            {student.projects.filter((x) => x.visible).map((x) => (
              <li key={x.id}><p className="font-medium">{x.title}</p><p className="text-sm text-muted">{x.summary}</p></li>
            ))}
          </ul>
        </section>
        )}

        {p.links.length > 0 && (
          <section>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Tautan</h4>
            <ul className="text-sm">{p.links.map((l) => <li key={l.url}>{l.label}: {l.url.replace("https://", "")}</li>)}</ul>
          </section>
        )}
        <p className="border-t border-line pt-3 text-xs text-subtle">Dokumen contoh untuk prototipe. Semua isi bersifat sintetis.</p>
      </article>
    </Sheet>
  );
}
