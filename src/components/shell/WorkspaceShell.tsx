"use client";

import clsx from "clsx";
import {
  BarChart3, Briefcase, ClipboardCheck, LayoutDashboard, LifeBuoy, Search, Settings2, ShieldCheck, Users, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Avatar, Kbd, Logo } from "@/components/ui/primitives";
import { PARTNER_ME } from "@/data/seed";
import { jobOf, partnerOf, studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { CommandPalette, usePaletteHotkey, type PaletteItem } from "./palette";

interface NavItem { href: string; label: string; icon: LucideIcon; exact?: boolean }

const PARTNER_NAV: NavItem[] = [
  { href: "/partner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/partner/jobs", label: "Lowongan", icon: Briefcase },
  { href: "/partner/pipeline", label: "Kandidat", icon: Users },
  { href: "/partner/talent", label: "Talent search", icon: Search },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/followups", label: "Antrean follow up", icon: LifeBuoy },
  { href: "/admin/partners", label: "Partner", icon: Users },
  { href: "/admin/jobs", label: "Lowongan", icon: Briefcase },
  { href: "/admin/moderation", label: "Moderasi lowongan", icon: ClipboardCheck },
  { href: "/admin/mapping", label: "Taksonomi dan mapping", icon: Settings2 },
  { href: "/admin/analytics", label: "Analytics penolakan", icon: ShieldCheck },
];

export function WorkspaceShell({ role, children }: { role: "partner" | "admin"; children: ReactNode }) {
  const path = usePathname();
  const s = useStore();
  const nav = role === "partner" ? PARTNER_NAV : ADMIN_NAV;
  const partner = partnerOf(s, PARTNER_ME);
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  usePaletteHotkey(toggle);

  const moderationCount = s.jobs.filter((j) => j.moderation === "menunggu").length;
  const followUps = s.applications.filter((a) => a.followUpRequested && !a.followUpAnswered).length;

  const items = useMemo<PaletteItem[]>(() => {
    const base: PaletteItem[] = nav.map((n) => ({ id: n.href, group: "Navigasi", label: n.label, href: n.href }));
    if (role === "admin") return base;
    const myJobs = s.jobs.filter((j) => j.partnerId === PARTNER_ME);
    const jobIds = new Set(myJobs.map((j) => j.id));
    return [
      { id: "new-job", group: "Aksi", label: "Buat lowongan baru", href: "/partner/jobs/new" },
      ...base,
      ...s.applications
        .filter((a) => jobIds.has(a.jobId))
        .map((a) => ({
          id: a.id,
          group: "Kandidat",
          label: studentOf(s, a.studentId)?.name ?? "Kandidat",
          hint: jobOf(s, a.jobId)?.title,
          href: `/partner/pipeline?c=${a.id}`,
        })),
      ...myJobs.map((j) => ({ id: j.id, group: "Lowongan", label: j.title, hint: j.moderation === "tayang" ? "Tayang" : "Menunggu moderasi", href: "/partner/jobs" })),
    ];
  }, [nav, role, s]);

  const isActive = (n: NavItem) => (n.exact ? path === n.href : path.startsWith(n.href));
  const badge = (n: NavItem): number =>
    role === "admin" && n.href === "/admin/moderation" ? moderationCount : role === "admin" && n.href === "/admin/followups" ? followUps : 0;

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-14 shrink-0 flex-col border-r border-line bg-surface md:flex xl:w-[232px]">
        <div className="flex h-12 items-center px-3.5 xl:px-4">
          <span className="xl:hidden"><Logo compact /></span>
          <span className="hidden xl:block"><Logo /></span>
        </div>
        <div className="mx-2 mb-2 hidden items-center gap-2 rounded-lg border border-line px-2.5 py-2 xl:flex">
          <span className="grid size-6 place-items-center rounded-md bg-brand-100 text-[11px] font-bold text-brand-700">
            {role === "partner" ? "NR" : "DB"}
          </span>
          <span className="truncate text-[13px] font-semibold">{role === "partner" ? partner?.name : "Talent Support Dibimbing"}</span>
        </div>
        <nav aria-label="Navigasi workspace" className="flex flex-1 flex-col gap-0.5 px-2">
          {nav.map((n) => {
            const active = isActive(n);
            const Icon = n.icon;
            const b = badge(n);
            return (
              <Link
                key={n.href}
                href={n.href}
                title={n.label}
                aria-current={active ? "page" : undefined}
                className={clsx("relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors", active ? "bg-brand-50 text-brand-700" : "text-muted hover:bg-canvas hover:text-ink")}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} aria-hidden />
                <span className="hidden xl:inline">{n.label}</span>
                {b > 0 && <span className="ml-auto hidden rounded-md bg-warn-100 px-1.5 text-[11px] font-bold text-warn-700 xl:inline">{b}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2.5 border-t border-line p-3">
          <Avatar initials={role === "partner" ? "DM" : "SN"} size={28} />
          <div className="hidden min-w-0 xl:block">
            <p className="truncate text-[13px] font-semibold">{role === "partner" ? "Dimas Mahendra" : "Sinta Nurhaliza"}</p>
            <p className="truncate text-xs text-muted">{role === "partner" ? "Talent Acquisition" : "Talent Support"}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-line bg-surface/95 px-3 md:px-5">
          <span className="md:hidden"><Logo compact /></span>
          <nav aria-label="Navigasi workspace" className="scroll-hide flex flex-1 gap-1 overflow-x-auto md:hidden">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n) ? "page" : undefined} className={clsx("flex h-8 shrink-0 items-center rounded-lg px-3 text-[13px] font-medium", isActive(n) ? "bg-brand-50 text-brand-700" : "text-muted")}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggle}
            className="ml-auto flex h-8 items-center gap-2 rounded-lg border border-line-strong bg-canvas px-3 text-[13px] text-muted transition-colors hover:border-brand-500 hover:text-ink md:min-w-64"
          >
            <Search size={14} aria-hidden />
            <span className="hidden md:inline">Cari atau jalankan perintah</span>
            <span className="ml-auto hidden items-center gap-1 md:flex"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
          </button>
        </header>
        <main className="min-w-0 flex-1 px-3 pb-24 pt-5 md:px-6 md:pb-10">{children}</main>
      </div>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} placeholder={role === "partner" ? "Cari kandidat, lowongan, atau aksi…" : "Cari halaman…"} />
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
