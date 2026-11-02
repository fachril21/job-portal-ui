"use client";

import clsx from "clsx";
import { useState } from "react";
import { Sheet } from "@/components/ui/overlay";
import { Button } from "@/components/ui/primitives";
import { TAG_CATEGORIES, TAGS } from "@/data/taxonomy";

const MAX_TAGS = 3;
const MAX_NOTE = 140;

interface CloseDialogProps {
  open: boolean;
  candidateName: string;
  onClose: () => void;
  onSubmit: (tagIds: string[], note: string) => void;
}

/** Tutup lamaran: pilih 1–3 alasan dari taksonomi, catatan opsional. Tombol aktif setelah ada 1 alasan. */
export function CloseDialog({ open, candidateName, onClose, onSubmit }: CloseDialogProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggle = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_TAGS ? cur : [...cur, id]));

  const reset = () => {
    setPicked([]);
    setNote("");
  };
  const submit = () => {
    onSubmit(picked, note.trim());
    reset();
  };
  const cancel = () => {
    reset();
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={cancel}
      title={`Tutup lamaran ${candidateName}`}
      width="max-w-xl"
      footer={
        <>
          <span className="mr-auto text-xs text-muted">{picked.length} dari {MAX_TAGS} alasan dipilih</span>
          <Button variant="secondary" size="sm" onClick={cancel}>Batal</Button>
          <Button size="sm" disabled={picked.length === 0} onClick={submit}>Tutup lamaran</Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-muted">Pilih 1 sampai 3 alasan. Kandidat menerima alasan ini sebagai umpan balik yang spesifik, tanpa menyebut nama reviewer.</p>
      <div className="flex flex-col gap-4">
        {TAG_CATEGORIES.map((cat) => (
          <fieldset key={cat}>
            <legend className="mb-1.5 text-xs font-medium text-muted">{cat}</legend>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.filter((t) => t.category === cat).map((t) => {
                const on = picked.includes(t.id);
                const locked = !on && picked.length >= MAX_TAGS;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    disabled={locked}
                    onClick={() => toggle(t.id)}
                    className={clsx(
                      "h-8 rounded-lg border px-3 text-[13px] font-medium transition-colors",
                      on ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line-strong bg-surface text-ink hover:bg-canvas",
                      locked && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div>
          <label htmlFor="close-note" className="mb-1.5 block text-xs font-medium">Catatan singkat (opsional)</label>
          <textarea
            id="close-note"
            value={note}
            maxLength={MAX_NOTE}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-line-strong bg-surface p-3 text-sm outline-none focus:border-brand-600 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
            placeholder="Contoh: dashboard di project 2 belum menunjukkan interpretasi."
          />
          <p className="mt-1 text-right text-xs text-muted">{note.length}/{MAX_NOTE}</p>
        </div>
      </div>
    </Sheet>
  );
}
