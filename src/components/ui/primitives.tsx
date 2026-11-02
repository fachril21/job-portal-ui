"use client";

import Link from "next/link";
import clsx from "clsx";
import { Inbox, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { AppStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/time";

type Variant = "primary" | "hero" | "secondary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-xs hover:shadow-sm",
  hero: "bg-brand-900 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-brand-50 hover:border-brand-500",
  ghost: "text-brand-600 hover:bg-brand-50",
  quiet: "text-muted hover:bg-brand-50 hover:text-ink",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
  md: "h-11 px-[18px] text-[15px] rounded-full gap-2",
  lg: "h-[52px] px-6 text-base rounded-full gap-2",
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  block?: boolean;
  kbd?: string;
  className?: string;
}

export function Button({ variant = "primary", size = "md", href, icon: Icon, iconRight: IconR, block, kbd, className, children, ...rest }: ButtonProps) {
  const cls = clsx(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap select-none transition-[background-color,box-shadow,transform,border-color] duration-150 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:bg-line disabled:text-subtle disabled:border-transparent disabled:shadow-none",
    VARIANT[variant],
    SIZE[size],
    block && "w-full",
    className,
  );
  const inner = (
    <>
      {Icon && <Icon size={size === "sm" ? 15 : 18} strokeWidth={2} aria-hidden />}
      {children}
      {IconR && <IconR size={size === "sm" ? 15 : 18} strokeWidth={2} aria-hidden />}
      {kbd && <kbd className="ml-1 rounded bg-white/20 px-1.5 text-[11px] font-medium">{kbd}</kbd>}
    </>
  );
  if (href && !rest.disabled) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}

export function Chip({ children, tone = "brand", className }: { children: ReactNode; tone?: "brand" | "plain"; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
        tone === "brand" ? "bg-brand-50 text-brand-700" : "bg-canvas text-muted border border-line",
        className,
      )}
    >
      {children}
    </span>
  );
}

const TONE: Record<string, string> = {
  proc: "bg-proc-100 text-proc-700",
  ok: "bg-ok-100 text-ok-700",
  warn: "bg-warn-100 text-warn-700",
  learn: "bg-learn-100 text-learn-700",
  muted: "bg-canvas text-muted border border-line",
  danger: "bg-danger-50 text-danger-700",
  due: "bg-warn-100 text-due-700",
};

export function Pill({ tone, children, dot = true, className }: { tone: keyof typeof TONE; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={clsx("inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap", TONE[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

const STATUS_TONE: Record<AppStatus, string> = {
  terkirim: "proc",
  direview: "proc",
  interview: "proc",
  penawaran: "ok",
  diterima: "ok",
  ditutup: "muted",
};

export function StatusPill({ status, overdue }: { status: AppStatus; overdue?: boolean }) {
  if (overdue) return <Pill tone="muted">Belum ada respons</Pill>;
  return <Pill tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Pill>;
}

export function Avatar({ initials, size = 40, tone = "brand" }: { initials: string; size?: number; tone?: "brand" | "ok" | "proc" | "warn" | "learn" }) {
  const toneCls = {
    brand: "bg-brand-100 text-brand-700",
    ok: "bg-ok-100 text-ok-700",
    proc: "bg-proc-100 text-proc-700",
    warn: "bg-warn-100 text-warn-700",
    learn: "bg-learn-100 text-learn-700",
  }[tone];
  return (
    <span
      className={clsx("inline-grid shrink-0 place-items-center rounded-full font-semibold", toneCls)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Inisial perusahaan sintetis di squircle 12px. Bukan logo asli. */
export function CompanyMark({ name, tone, size = 44 }: { name: string; tone: "brand" | "ok" | "proc" | "warn" | "learn"; size?: number }) {
  const toneCls = {
    brand: "bg-brand-100 text-brand-700",
    ok: "bg-ok-100 text-ok-700",
    proc: "bg-proc-100 text-proc-700",
    warn: "bg-warn-100 text-warn-700",
    learn: "bg-learn-100 text-learn-700",
  }[tone];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={clsx("inline-grid shrink-0 place-items-center rounded-xl border border-black/5 font-bold", toneCls)}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/**
 * Placeholder logo. Ganti dengan file resmi dari tim: taruh di public/logo-dibimbing.svg
 * lalu ganti isi komponen ini dengan <Image src="/logo-dibimbing.svg" ... />.
 */
export function Logo({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="Dibimbing Career Hub (logo sementara)">
      <span className="grid size-8 place-items-center rounded-[10px] bg-brand-600 font-display text-lg font-bold text-white">d</span>
      {!compact && (
        <span className={clsx("flex flex-col leading-none", dark ? "text-white" : "text-ink")}>
          <span className="font-display text-[17px] font-bold tracking-tight">dibimbing</span>
          <span className={clsx("mt-0.5 text-[11px] font-medium", dark ? "text-brand-100" : "text-muted")}>Career Hub</span>
        </span>
      )}
    </span>
  );
}

export function Tile({ children, className, tone = "plain", as: As = "div", ...rest }: { children: ReactNode; className?: string; tone?: "plain" | "dark" | "ok" | "proc" | "warn" | "learn" | "brand"; as?: "div" | "section" | "article" } & React.HTMLAttributes<HTMLElement>) {
  const toneCls = {
    plain: "bg-surface border-line",
    dark: "bg-brand-900 text-white border-brand-900",
    ok: "bg-ok-100 border-transparent",
    proc: "bg-proc-100 border-transparent",
    warn: "bg-warn-100 border-transparent",
    learn: "bg-learn-100 border-transparent",
    brand: "bg-brand-50 border-transparent",
  }[tone];
  return (
    <As className={clsx("rounded-tile border p-5 shadow-xs", toneCls, className)} {...rest}>
      {children}
    </As>
  );
}

export function Panel({ title, action, children, className, flush }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <section className={clsx("rounded-panel border border-line bg-surface shadow-xs", className)}>
      {(title || action) && (
        <header className="flex h-11 items-center justify-between gap-3 border-b border-line px-4">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={flush ? "" : "p-4"}>{children}</div>
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} aria-hidden />;
}

export function EmptyState({ title, body, action, icon: Icon = Inbox }: { title: string; body: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface text-brand-600">
        <Icon size={26} strokeWidth={1.5} aria-hidden />
      </span>
      <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted">{body}</p>
      {action}
    </div>
  );
}

export function Banner({ tone = "warn", children, action }: { tone?: "warn" | "proc" | "ok"; children: ReactNode; action?: ReactNode }) {
  const cls = { warn: "bg-warn-100 text-warn-700", proc: "bg-proc-100 text-proc-700", ok: "bg-ok-100 text-ok-700" }[tone];
  return (
    <div role="status" className={clsx("flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium", cls)}>
      <span>{children}</span>
      {action}
    </div>
  );
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-danger-700">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const inputCls =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]";
export const inputCalmCls =
  "h-9 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]";

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line-strong bg-canvas px-1.5 py-px text-[11px] font-medium text-muted">{children}</kbd>;
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-brand-600" : "bg-line-strong")}
    >
      <span className={clsx("absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200", checked && "translate-x-5")} />
    </button>
  );
}
