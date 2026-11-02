"use client";

import clsx from "clsx";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/lib/store";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** "side" = panel kanan di desktop, tetap bottom sheet di mobile */
  variant?: "center" | "side";
  width?: string;
  labelledBy?: string;
}

/** Modal di desktop, bottom sheet di mobile. Fokus terkunci di dalam, Esc menutup. */
export function Sheet({ open, onClose, title, children, footer, variant = "center", width = "max-w-lg" }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusables = () =>
      node?.querySelectorAll<HTMLElement>('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        const list = Array.from(focusables()).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="presentation">
      <div className="anim-fade absolute inset-0 bg-[rgb(19_28_32/0.32)] backdrop-blur-[4px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          "relative flex max-h-[92dvh] w-full flex-col bg-surface shadow-lg",
          "rounded-t-sheet md:rounded-panel anim-sheet",
          variant === "side" ? "md:ml-auto md:h-dvh md:max-h-dvh md:max-w-[520px] md:rounded-none md:rounded-l-sheet" : width,
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-brand-50 hover:text-ink"
          >
            <X size={18} aria-hidden />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

const TOAST_ICON = { info: Info, ok: CheckCircle2, warn: TriangleAlert };

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), 4500));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:bottom-6 md:right-6 md:items-end"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = TOAST_ICON[t.tone];
        return (
          <div key={t.id} className="anim-rise pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-md">
            <Icon size={18} className={clsx("mt-0.5 shrink-0", t.tone === "ok" ? "text-ok-100" : t.tone === "warn" ? "text-warn-100" : "text-proc-100")} aria-hidden />
            <div>
              {t.who && (
                <p className="text-[11px] font-medium text-white/60">
                  Notifikasi {t.who === "student" ? "student" : t.who === "partner" ? "partner" : "admin"}
                </p>
              )}
              <p>{t.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
