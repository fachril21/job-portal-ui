"use client";

import { ArrowUpRight, Building2, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/primitives";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const ENTRIES: { role: Role; href: string; icon: typeof GraduationCap; who: string; title: string; text: string }[] = [
  { role: "student", href: "/student", icon: GraduationCap, who: "Rani Pramesti", title: "Masuk sebagai student", text: "Lihat Skill Passport, lamar lowongan, dan pantau setiap lamaran sampai ada jawaban." },
  { role: "partner", href: "/partner", icon: Building2, who: "Dimas Mahendra", title: "Masuk sebagai hiring partner", text: "Review kandidat berbukti dan tutup lamaran dengan satu tag dalam hitungan detik." },
  { role: "admin", href: "/admin", icon: ShieldCheck, who: "Sinta Nurhaliza", title: "Masuk sebagai admin Dibimbing", text: "Pantau kepatuhan SLA partner dan pola penolakan untuk tim kurikulum." },
];

export default function EntryPage() {
  const router = useRouter();
  const setRole = useStore((s) => s.setRole);

  return (
    <main className="mx-auto grid min-h-dvh max-w-[1120px] items-center gap-12 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:px-6">
      <div className="flex flex-col gap-8">
        <Logo />
        <h1 className="font-display text-[clamp(2.25rem,1.5rem+3.4vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
          Setiap lamaran dapat jawaban.
        </h1>
        <p className="max-w-[46ch] text-lg text-muted">
          Job portal tertutup untuk student dan alumni bootcamp Dibimbing. Lamaranmu punya status dan tenggat yang terlihat, dan setiap penutupan membawa langkah belajar berikutnya.
        </p>
        <p className="max-w-[46ch] rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Ini prototype untuk demo dan usability test. Semua nama, perusahaan, dan angka adalah data sintetis. Pakai tombol <strong>Demo</strong> di pojok kanan bawah untuk menjalankan alurnya.
        </p>
      </div>

      <section aria-label="Pilih peran untuk masuk" className="flex flex-col gap-3">
        {ENTRIES.map((e) => {
          const Icon = e.icon;
          return (
            <button
              key={e.role}
              type="button"
              onClick={() => {
                setRole(e.role);
                router.push(e.href);
              }}
              className="group flex items-start gap-4 rounded-tile border border-line bg-surface p-5 text-left shadow-xs transition-[box-shadow,transform,border-color] duration-150 hover:-translate-y-px hover:border-brand-500 hover:shadow-sm"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon size={22} aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-semibold tracking-tight">{e.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{e.text}</span>
                <span className="mt-2 block text-xs text-subtle">Akun demo: {e.who}</span>
              </span>
              <ArrowUpRight size={20} className="mt-1 shrink-0 text-subtle transition-colors group-hover:text-brand-600" aria-hidden />
            </button>
          );
        })}
      </section>
    </main>
  );
}
