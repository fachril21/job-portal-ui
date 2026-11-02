"use client";

import clsx from "clsx";
import { BarChart3, Home, Search, Send, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Avatar, Logo } from "@/components/ui/primitives";
import { appsOfStudent, groupApps, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { CommandPalette, usePaletteHotkey, type PaletteItem } from "./palette";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
}

const NAV: NavItem[] = [
  { href: "/student", label: "Beranda", icon: Home, match: (p) => p === "/student" },
  { href: "/student/jobs", label: "Lowongan", icon: Search, match: (p) => p.startsWith("/student/jobs") },
  { href: "/student/applications", label: "Lamaran", icon: Send, match: (p) => p.startsWith("/student/applications") },
  { href: "/student/progress", label: "Perkembangan", icon: BarChart3, match: (p) => p.startsWith("/student/progress") },
];

export function StudentShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const s = useStore();
  const me = s.students.find((x) => x.id === s.studentId);
  const needs = groupApps(appsOfStudent(s, s.studentId), s.day).needsAction.length;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const toggle = useCallback(() => setPaletteOpen((o) => !o), []);
  usePaletteHotkey(toggle);

  const items = useMemo<PaletteItem[]>(
    () => [
      ...NAV.map((n) => ({ id: n.href, group: "Navigasi", label: n.label, href: n.href })),
      { id: "/student/passport", group: "Navigasi", label: "Skill Passport", href: "/student/passport" },
      ...s.jobs.filter((j) => j.moderation === "tayang").map((j) => ({
        id: j.id,
        group: "Lowongan",
        label: j.title,
        hint: partnerOf(s, j.partnerId)?.name,
        href: `/student/jobs/${j.id}`,
      })),
    ],
    [s],
  );

  const inProfile = path.startsWith("/student/passport");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-6 px-4 md:px-6">
          <Link href="/student" aria-label="Beranda Career Hub"><Logo /></Link>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = n.match(path);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx("relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors", active ? "bg-brand-50 text-brand-700" : "text-muted hover:text-ink")}
                >
                  {n.label}
                  {n.href === "/student/applications" && needs > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-warn-100 px-1 text-[11px] font-bold text-warn-700">{needs}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Cari lowongan"
              className="flex h-10 items-center gap-2 rounded-full border border-line-strong px-3.5 text-sm text-muted transition-colors hover:border-brand-500 hover:text-ink"
            >
              <Search size={16} aria-hidden />
              <span className="hidden sm:inline">Cari lowongan</span>
              <kbd className="hidden rounded border border-line-strong bg-canvas px-1.5 text-[11px] lg:inline">Ctrl K</kbd>
            </button>
            <Link href="/student/passport" aria-label="Skill Passport saya" aria-current={inProfile ? "page" : undefined} className={clsx("rounded-full p-0.5", inProfile && "ring-2 ring-brand-600")}>
              <Avatar initials={me?.initials ?? "?"} size={36} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-4 pb-32 pt-5 md:px-6 md:pb-16 md:pt-8">{children}</main>

      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 flex items-center justify-around rounded-full border border-line bg-surface px-2 py-1.5 shadow-sm md:hidden"
      >
        {NAV.map((n) => {
          const active = n.match(path);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={clsx("relative flex min-h-11 min-w-[64px] flex-col items-center justify-center rounded-full px-3 text-[11px] font-medium transition-colors", active ? "bg-brand-50 text-brand-700" : "text-muted")}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
              {n.label}
              {n.href === "/student/applications" && needs > 0 && (
                <span className="absolute right-2 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-warn-700 px-1 text-[10px] font-bold text-white">{needs}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={items} placeholder="Cari lowongan atau halaman…" />
    </div>
  );
}

