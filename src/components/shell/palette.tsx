"use client";

import clsx from "clsx";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Kbd } from "@/components/ui/primitives";

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href?: string;
  run?: () => void;
}

export function CommandPalette({ open, onClose, items, placeholder }: { open: boolean; onClose: () => void; items: PaletteItem[]; placeholder: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle ? items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(needle)) : items;
    return list.slice(0, 40);
  }, [items, q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open || typeof document === "undefined") return null;

  const choose = (item?: PaletteItem) => {
    if (!item) return;
    onClose();
    if (item.run) item.run();
    if (item.href) router.push(item.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[idx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  let lastGroup = "";
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12dvh]" onKeyDown={onKey}>
      <div className="anim-fade absolute inset-0 bg-[rgb(19_28_32/0.32)] backdrop-blur-[4px]" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Pencarian cepat" className="anim-rise relative w-full max-w-[640px] overflow-hidden rounded-panel bg-surface shadow-lg">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-subtle" aria-hidden />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Cari" className="h-14 flex-1 bg-transparent text-base outline-none" />
          <Kbd>Esc</Kbd>
        </div>
        <ul className="max-h-[50dvh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">Tidak ada hasil untuk “{q}”.</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-xs font-medium text-muted">{header}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === idx}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => choose(item)}
                  className={clsx("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm", i === idx ? "bg-brand-50 text-brand-700" : "text-ink")}
                >
                  <span className="min-w-0 truncate font-medium">{item.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                    {item.hint}
                    {i === idx && <CornerDownLeft size={13} aria-hidden />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-line bg-canvas px-4 py-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> pilih</span>
          <span className="flex items-center gap-1"><Kbd>Enter</Kbd> buka</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Ctrl/⌘ + K membuka palette. */
export function usePaletteHotkey(toggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);
}
