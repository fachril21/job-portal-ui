"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SlaPill, TrendBars } from "@/components/domain/admin";
import { PageHeader } from "@/components/shell/WorkspaceShell";
import { ScreenGate } from "@/components/ui/gate";
import { Button, EmptyState, Panel, inputCalmCls } from "@/components/ui/primitives";
import { tagById } from "@/data/taxonomy";
import { partnerStats, platformTrend } from "@/lib/admin";
import { studentOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import type { Bootcamp } from "@/lib/types";

const BOOTCAMPS: ("Semua" | Bootcamp)[] = ["Semua", "Data Analyst", "UI/UX Design", "Digital Marketing"];
const PERIODS = [{ id: 0, label: "Semua waktu" }, { id: 30, label: "30 hari terakhir" }, { id: 14, label: "14 hari terakhir" }, { id: 7, label: "7 hari terakhir" }];

function downloadCsv(name: string, rows: (string | number)[][]) {
  const body = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAnalytics() {
  const s = useStore();
  const [bc, setBc] = useState<(typeof BOOTCAMPS)[number]>("Semua");
  const [period, setPeriod] = useState(0);

  const closed = s.applications.filter((a) => {
    if (a.closure?.by !== "perusahaan") return false;
    if (bc !== "Semua" && studentOf(s, a.studentId)?.bootcamp !== bc) return false;
    return period === 0 || a.closure.day >= s.day - period;
  });
  const counts = new Map<string, number>();
  for (const a of closed) for (const t of a.closure?.tagIds ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  const rows = [...counts.entries()].map(([id, n]) => ({ id, label: tagById(id)?.label ?? id, n })).sort((a, b) => b.n - a.n).slice(0, 8);
  const max = Math.max(...rows.map((r) => r.n), 1);
  const withTags = closed.filter((a) => (a.closure?.tagIds.length ?? 0) > 0).length;
  const avgDays = closed.length === 0 ? 0 : Math.round(closed.reduce((n, a) => n + ((a.closure?.day ?? a.sentDay) - a.sentDay), 0) / closed.length);
  const partners = [...s.partners].sort((a, b) => a.slaScore - b.slaScore);

  const tiles = [
    { label: "Lamaran ditutup", value: String(closed.length) },
    { label: "Ditutup dengan alasan", value: closed.length === 0 ? "-" : `${Math.round((withTags / closed.length) * 100)}%` },
    { label: "Rata-rata hari hingga ditutup", value: closed.length === 0 ? "-" : String(avgDays) },
  ];

  return (
    <>
      <PageHeader
        title="Analitik"
        sub="Alasan penutupan dan kepatuhan SLA membantu menyesuaikan kurikulum dan menindak partner."
        actions={
          <Button size="sm" variant="secondary" icon={Download} onClick={() => { downloadCsv("analitik-alasan-penutupan.csv", [["Alasan", "Jumlah"], ...rows.map((r) => [r.label, r.n])]); s.toast("File CSV diunduh.", "ok", "admin"); }}>Ekspor CSV</Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select aria-label="Periode" className={`${inputCalmCls} w-48`} value={period} onChange={(e) => setPeriod(Number(e.target.value))}>{PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
        <select aria-label="Bootcamp" className={`${inputCalmCls} w-48`} value={bc} onChange={(e) => setBc(e.target.value as typeof bc)}>{BOOTCAMPS.map((b) => <option key={b}>{b}</option>)}</select>
        <Link href="/admin/followups" className="ml-auto text-sm font-medium text-brand-600 hover:underline">Lihat antrean follow up</Link>
      </div>

      <ScreenGate empty={<EmptyState title="Belum ada data" body="Analitik muncul setelah ada lamaran yang ditutup." />}>
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-panel border border-line bg-surface p-4 shadow-xs">
                <dd className="font-display text-3xl font-bold leading-none tracking-tight">{t.value}</dd>
                <dt className="mt-1.5 text-sm text-muted">{t.label}</dt>
              </div>
            ))}
          </dl>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Alasan penutupan teratas">
              {rows.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Belum ada lamaran ditutup untuk filter ini.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {rows.map((r) => (
                    <li key={r.id}>
                      <div className="mb-1 flex justify-between text-sm"><span>{r.label}</span><span className="text-muted">{r.n}</span></div>
                      <div className="h-2 rounded-full bg-brand-50"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(r.n / max) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Rata-rata SLA seluruh partner, 8 minggu">
              <TrendBars values={platformTrend(s.partners)} label="Rata-rata skor SLA seluruh partner" />
            </Panel>
          </div>

          <Panel title="Kepatuhan SLA per partner" flush>
            <ul className="divide-y divide-line">
              {partners.map((p) => {
                const st = partnerStats(s, p.id);
                return (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                    <Link href={`/admin/partners/${p.id}`} className="min-w-0 flex-1 basis-48 font-medium hover:text-brand-700 hover:underline">{p.name}</Link>
                    <div className="w-24"><TrendBars compact values={p.slaHistory} label={`Tren ${p.name}`} /></div>
                    <span className="w-28 text-xs text-muted">{st.late.length} lewat tenggat</span>
                    <SlaPill score={p.slaScore} />
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </ScreenGate>
    </>
  );
}
