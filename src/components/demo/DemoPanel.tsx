"use client";

import clsx from "clsx";
import { Check, ChevronRight, Clock, FlaskConical, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { SCENARIOS } from "@/lib/scenarios";
import { appsOfStudent, jobOf, partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import { fmtDate, isActive, STATUS_LABEL } from "@/lib/time";
import type { Role, ScreenState } from "@/lib/types";

const ROLE_HOME: Record<Role, string> = { student: "/student", partner: "/partner", admin: "/admin" };
const ROLE_LABEL: Record<Role, string> = { student: "Student", partner: "Partner", admin: "Admin" };
const STATE_LABEL: Record<ScreenState, string> = { normal: "Normal", empty: "Kosong", loading: "Loading", offline: "Offline" };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 px-4 py-3.5">
      <h3 className="mb-2.5 text-xs font-medium text-white/60">{title}</h3>
      {children}
    </section>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-lg bg-white/10 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={clsx("h-8 flex-1 rounded-md text-[13px] font-medium transition-colors", value === o.id ? "bg-white text-ink" : "text-white/70 hover:text-white")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EventBtn({ label, onClick, disabled, reason, primary }: { label: string; onClick: () => void; disabled?: boolean; reason?: string; primary?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "flex h-9 items-center justify-between gap-2 rounded-lg border px-3 text-left text-[13px] font-medium transition-colors",
          disabled ? "cursor-not-allowed border-white/10 text-white/35" : primary ? "border-brand-500 bg-brand-500/20 text-white hover:bg-brand-500/30" : "border-white/20 text-white hover:bg-white/10",
        )}
      >
        {label}
        {!disabled && <ChevronRight size={14} className="shrink-0 text-white/50" aria-hidden />}
      </button>
      {disabled && reason && <p className="px-1 text-[11px] text-white/45">{reason}</p>}
    </div>
  );
}

export function DemoPanel() {
  const router = useRouter();
  const s = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [target, setTarget] = useState<string>("");

  const myApps = useMemo(() => appsOfStudent(s, s.studentId).filter(isActive), [s]);
  const targetApp = myApps.find((a) => a.id === target) ?? myApps[0];
  const pendingJob = s.jobs.find((j) => j.moderation === "menunggu");
  const scenario = SCENARIOS.find((x) => x.id === s.scenario);
  const nextStepIdx = scenario ? scenario.steps.findIndex((st) => !st.done(s)) : -1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      if (e.shiftKey && e.key.toLowerCase() === "d") useStore.getState().setDemoOpen(!useStore.getState().demoOpen);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!s.demoEnabled || typeof document === "undefined") return null;

  const go = (role: Role) => {
    s.setRole(role);
    router.push(ROLE_HOME[role]);
  };

  const me = s.students.find((x) => x.id === s.studentId);
  const toggleGraduated = () =>
    useStore.setState((st) => ({
      students: st.students.map((x) => (x.id === st.studentId ? { ...x, status: x.status === "lulus" ? "belajar" : "lulus" } : x)),
    }));

  const targetLabel = (a: (typeof myApps)[number]) => {
    const j = jobOf(s, a.jobId);
    return `${j?.title ?? "Lowongan"} · ${partnerOf(s, j?.partnerId ?? "")?.name ?? ""} (${STATUS_LABEL[a.status]})`;
  };
  const noTarget = !targetApp;
  const noTargetReason = "Student ini belum punya lamaran aktif.";

  return createPortal(
    <>
      {!s.demoOpen && (
        <button
          type="button"
          onClick={() => s.setDemoOpen(true)}
          aria-label="Buka Demo Panel (Shift D)"
          className="fixed bottom-24 right-4 z-[55] flex h-11 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-[13px] font-semibold text-white shadow-md transition-transform hover:scale-[1.03] active:scale-[0.97] md:bottom-6"
        >
          <FlaskConical size={16} aria-hidden />
          Demo
          <span className="size-2 rounded-full bg-ok-100" aria-hidden />
        </button>
      )}

      {s.demoOpen && (
        <div className="fixed inset-0 z-[65] md:pointer-events-none">
          <div className="anim-fade absolute inset-0 bg-black/30 md:hidden" onClick={() => s.setDemoOpen(false)} aria-hidden />
          <aside
            aria-label="Demo Panel"
            className="anim-sheet pointer-events-auto absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-tile bg-ink text-white shadow-lg md:inset-x-auto md:bottom-4 md:right-4 md:top-4 md:max-h-none md:w-[360px] md:rounded-tile"
          >
            <header className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-ok-100 px-1.5 py-0.5 text-[11px] font-bold text-ok-700">DEMO</span>
                <span className="flex items-center gap-1.5 text-[13px] text-white/80"><Clock size={14} aria-hidden />{fmtDate(s.day)}</span>
              </div>
              <button type="button" onClick={() => s.setDemoOpen(false)} aria-label="Tutup Demo Panel" className="grid size-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                <X size={16} aria-hidden />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto pb-4">
              <p className="px-4 pb-3 text-xs text-white/55">Alat bantu prototype. Bukan bagian dari produk. Semua nama dan angka adalah data sintetis.</p>

              <Group title="Role">
                <Segmented label="Role" value={s.role} onChange={go} options={(["student", "partner", "admin"] as Role[]).map((r) => ({ id: r, label: ROLE_LABEL[r] }))} />
              </Group>

              <Group title="Persona student">
                <select
                  aria-label="Persona student"
                  value={s.studentId}
                  onChange={(e) => { s.setStudent(e.target.value); if (s.role === "student") router.push("/student"); }}
                  className="h-9 w-full rounded-lg border border-white/20 bg-ink px-2.5 text-[13px] text-white"
                >
                  {s.students.filter((x) => ["s1", "s2", "s3"].includes(x.id)).map((x) => (
                    <option key={x.id} value={x.id}>{x.name} · {x.bootcamp}</option>
                  ))}
                </select>
                <label className="mt-2.5 flex cursor-pointer items-center justify-between gap-3 text-[13px] text-white/80">
                  Belum lulus (Passport parsial)
                  <input type="checkbox" checked={me?.status === "belajar"} onChange={toggleGraduated} className="size-4 accent-[#009a9e]" />
                </label>
              </Group>

              <Group title="Skenario">
                <div className="flex flex-col gap-2">
                  {SCENARIOS.map((sc) => {
                    const active = s.scenario === sc.id;
                    return (
                      <div key={sc.id} className={clsx("rounded-xl border p-3", active ? "border-brand-500 bg-brand-500/10" : "border-white/15")}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[13px] font-semibold">Skenario {sc.id}: {sc.title}</p>
                            <p className="mt-0.5 text-xs text-white/55">{sc.summary}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { s.startScenario(sc.id); router.push(sc.start); }}
                            className="h-7 shrink-0 rounded-md bg-white px-2.5 text-xs font-semibold text-ink hover:bg-brand-100"
                          >
                            {active ? "Ulang" : "Mulai"}
                          </button>
                        </div>
                        {active && (
                          <ol className="mt-3 flex flex-col gap-1.5">
                            {sc.steps.map((st, i) => {
                              const done = st.done(s);
                              const isNext = i === nextStepIdx;
                              return (
                                <li key={i} className={clsx("flex items-start gap-2 rounded-lg p-1.5 text-[13px]", isNext && "bg-white/10")}>
                                  <span className={clsx("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border", done ? "border-ok-100 bg-ok-100 text-ok-700" : "border-white/40")}>
                                    {done && <Check size={11} strokeWidth={3} aria-hidden />}
                                  </span>
                                  <span className="min-w-0">
                                    <span className={clsx(done && "text-white/50 line-through")}>{st.text}</span>
                                    {isNext && <span className="mt-0.5 block text-xs text-white/65">{st.hint}</span>}
                                    {isNext && st.href && (
                                      <Link href={st.href} onClick={() => s.setRole("student")} className="mt-1 inline-block text-xs font-semibold text-brand-100 underline">
                                        Buka layarnya
                                      </Link>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Group>

              <Group title="Event mock (berperan sebagai pihak lain)">
                <label className="mb-2 block text-xs text-white/60" htmlFor="demo-target">Lamaran yang dikenai event</label>
                <select
                  id="demo-target"
                  value={targetApp?.id ?? ""}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={noTarget}
                  className="mb-3 h-9 w-full rounded-lg border border-white/20 bg-ink px-2.5 text-[13px] text-white disabled:opacity-50"
                >
                  {noTarget && <option value="">Tidak ada lamaran aktif</option>}
                  {myApps.map((a) => <option key={a.id} value={a.id}>{targetLabel(a)}</option>)}
                </select>
                <div className="flex flex-col gap-1.5">
                  <p className="mt-1 text-[11px] font-medium text-white/45">Partner</p>
                  <EventBtn label="Partner membuka lamaran" disabled={noTarget || targetApp?.status !== "terkirim"} reason={noTarget ? noTargetReason : "Hanya untuk lamaran berstatus Terkirim."} onClick={() => targetApp && s.partnerOpen(targetApp.id)} />
                  <EventBtn label="Partner mengundang interview" disabled={noTarget || !["terkirim", "direview"].includes(targetApp?.status ?? "")} reason={noTarget ? noTargetReason : "Lamaran harus Terkirim atau Sedang direview."} onClick={() => targetApp && s.partnerInvite(targetApp.id)} />
                  <EventBtn label="Partner mengirim penawaran" disabled={noTarget || !["direview", "interview"].includes(targetApp?.status ?? "")} reason={noTarget ? noTargetReason : "Lamaran harus Sedang direview atau Interview."} onClick={() => targetApp && s.partnerOffer(targetApp.id)} />
                  <EventBtn primary label="Tutup: Visualisasi data (kompetensi)" disabled={noTarget} reason={noTargetReason} onClick={() => targetApp && s.partnerClose(targetApp.id, ["t-viz"], "Dashboard di portfolio belum menunjukkan pemilihan grafik yang tepat.")} />
                  <EventBtn label="Tutup: Ekspektasi gaji (non-kompetensi)" disabled={noTarget} reason={noTargetReason} onClick={() => targetApp && s.partnerClose(targetApp.id, ["t-gaji"])} />
                  <EventBtn label="Tutup: Posisi sudah terisi (perusahaan)" disabled={noTarget} reason={noTargetReason} onClick={() => targetApp && s.partnerClose(targetApp.id, ["t-terisi"])} />
                  <EventBtn label="Lowongan ditutup perusahaan" disabled={noTarget} reason={noTargetReason} onClick={() => targetApp && s.jobClosedByCompany(targetApp.id)} />
                  <EventBtn label="Kandidat baru melamar (ke partner)" onClick={s.newCandidate} />
                  <p className="mt-2 text-[11px] font-medium text-white/45">Mentor, Talent Support, admin</p>
                  <EventBtn label="Talent Support menanggapi follow up" disabled={noTarget || !targetApp?.followUpRequested || targetApp.followUpAnswered} reason="Student belum meminta follow up pada lamaran ini." onClick={() => targetApp && s.talentSupportReply(targetApp.id)} />
                  <EventBtn label="Admin menyetujui lowongan menunggu" disabled={!pendingJob} reason="Tidak ada lowongan di antrean moderasi." onClick={() => pendingJob && s.approveJob(pendingJob.id, true)} />
                </div>
              </Group>

              <Group title="Waktu">
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 3, 7].map((n) => (
                    <button key={n} type="button" onClick={() => s.advanceDays(n)} className="h-9 rounded-lg border border-white/20 text-[13px] font-medium hover:bg-white/10">+{n} hari</button>
                  ))}
                  <button type="button" onClick={s.resetDay} className="h-9 rounded-lg border border-white/20 text-[13px] font-medium hover:bg-white/10">Hari ini</button>
                </div>
              </Group>

              <Group title="State layar">
                <Segmented label="State layar" value={s.screenState} onChange={s.setScreenState} options={(Object.keys(STATE_LABEL) as ScreenState[]).map((k) => ({ id: k, label: STATE_LABEL[k] }))} />
                <p className="mt-2 text-xs text-white/50">Berlaku untuk halaman yang sedang dibuka: daftar, tracker, pipeline, Gap Insight.</p>
              </Group>

              <Group title="Log event">
                {s.log.length === 0 ? (
                  <p className="text-xs text-white/50">Belum ada event. Jalankan skenario atau event di atas.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {s.log.slice(0, 6).map((l) => (
                      <li key={l.id} className="flex gap-2 text-xs text-white/75">
                        <span className="shrink-0 text-white/40">{fmtDate(l.day).slice(5, 11)}</span>
                        <span>{l.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Group>

              <Group title="Reset">
                {!confirmReset ? (
                  <button type="button" onClick={() => setConfirmReset(true)} className="flex h-9 items-center gap-2 rounded-lg px-1 text-[13px] font-medium text-danger-50 hover:underline">
                    <RotateCcw size={14} aria-hidden /> Reset semua data ke awal
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-white/80">Yakin? Semua perubahan hilang.</span>
                    <button type="button" onClick={() => { s.resetAll(); setConfirmReset(false); router.push(ROLE_HOME[s.role]); }} className="h-8 rounded-md bg-danger-50 px-3 text-xs font-semibold text-danger-700">Reset</button>
                    <button type="button" onClick={() => setConfirmReset(false)} className="h-8 rounded-md px-2 text-xs text-white/70 hover:text-white">Batal</button>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-white/40">Sembunyikan panel: tambahkan ?demo=off di URL. Tampilkan lagi: ?demo=on.</p>
              </Group>
            </div>
          </aside>
        </div>
      )}
    </>,
    document.body,
  );
}
