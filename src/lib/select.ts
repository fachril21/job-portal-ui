import { tagById } from "@/data/taxonomy";
import type { AppStore } from "./store";
import type { Application, Job, ModuleMapping, Partner, ReasonTag, Student } from "./types";
import { isActive } from "./time";

type S = Pick<AppStore, "students" | "jobs" | "partners" | "applications" | "mappings" | "day">;

export const studentOf = (s: S, id: string): Student | undefined => s.students.find((x) => x.id === id);
export const jobOf = (s: S, id: string): Job | undefined => s.jobs.find((x) => x.id === id);
export const partnerOf = (s: S, id: string): Partner | undefined => s.partners.find((x) => x.id === id);

export function appsOfStudent(s: S, studentId: string): Application[] {
  return s.applications.filter((a) => a.studentId === studentId && !a.draft);
}

export function groupApps(apps: Application[], today: number) {
  const needsAction = apps.filter(
    (a) => a.status === "penawaran" || (isActive(a) && a.slaDue !== null && a.slaDue < today),
  );
  const needsIds = new Set(needsAction.map((a) => a.id));
  const active = apps.filter((a) => isActive(a) && !needsIds.has(a.id));
  const closed = apps.filter((a) => !isActive(a) && !needsIds.has(a.id));
  return { needsAction, active, closed };
}

/** Pola alasan penutupan kompetensi: hitung tag per label, dari lamaran ditutup partner dengan tag kompetensi. */
export function gapInsight(s: S, studentId: string) {
  const closed = appsOfStudent(s, studentId).filter(
    (a) => a.status === "ditutup" && a.closure?.by === "perusahaan" && a.closure.tagIds.some((t) => tagById(t)?.triggersRoadmap === true),
  );
  const counts = new Map<string, number>();
  for (const a of closed) {
    for (const id of new Set(a.closure?.tagIds ?? [])) {
      const tag = tagById(id);
      if (tag?.triggersRoadmap === true) counts.set(tag.label, (counts.get(tag.label) ?? 0) + 1);
    }
  }
  const rows = [...counts.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
  return { total: closed.length, rows, enough: closed.length >= 2 };
}

export interface LearningDirection {
  tag: ReasonTag;
  items: ModuleMapping["items"];
  /** Jumlah lamaran ditutup yang memuat tag ini */
  count: number;
}

/** Saran arah belajar dari tag kompetensi pada lamaran yang ditutup partner. Tanpa progres. */
export function learningDirections(s: S, studentId: string): LearningDirection[] {
  const counts = new Map<string, number>();
  for (const a of appsOfStudent(s, studentId)) {
    if (a.status !== "ditutup" || a.closure?.by !== "perusahaan") continue;
    for (const id of new Set(a.closure.tagIds)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const out: LearningDirection[] = [];
  for (const [id, count] of counts) {
    const tag = tagById(id);
    if (!tag || tag.triggersRoadmap === false) continue;
    const items = s.mappings.find((m) => m.tagId === id)?.items ?? [];
    if (items.length > 0) out.push({ tag, items, count });
  }
  return out.sort((x, y) => y.count - x.count);
}

export interface ReapplyCheck {
  ok: boolean;
  reason?: string;
  availableDay?: number;
}

/** Student bisa lamar ulang ke lowongan yang sama setelah masa tunggu dari partner lewat. */
export function canReapply(s: S, studentId: string, jobId: string): ReapplyCheck | null {
  const closed = appsOfStudent(s, studentId)
    .filter((a) => a.jobId === jobId && a.status === "ditutup" && a.closure?.by === "perusahaan")
    .sort((a, b) => (b.closure?.day ?? 0) - (a.closure?.day ?? 0))[0];
  if (!closed) return null;
  const competency = closed.closure?.tagIds.some((t) => tagById(t)?.triggersRoadmap === true);
  if (!competency) return null;
  const job = jobOf(s, jobId);
  const hasActive = appsOfStudent(s, studentId).some((a) => a.jobId === jobId && isActive(a));
  if (hasActive) return { ok: false, reason: "Kamu sudah punya lamaran aktif di posisi ini." };
  const availableDay = (closed.closure?.day ?? 0) + (job?.reapplyWaitDays ?? 0);
  if (s.day < availableDay) {
    return { ok: false, reason: "Masa tunggu lamar ulang dari perusahaan belum selesai.", availableDay };
  }
  return { ok: true };
}

export function similarJobs(s: S, job: Job, limit = 3): Job[] {
  return s.jobs
    .filter((j) => j.id !== job.id && j.moderation === "tayang" && j.field === job.field)
    .slice(0, limit);
}

/** Apakah lowongan ini sudah dilamar student (aktif atau pernah)? */
export function appForJob(s: S, studentId: string, jobId: string): Application | undefined {
  return appsOfStudent(s, studentId)
    .filter((a) => a.jobId === jobId)
    .sort((a, b) => b.sentDay - a.sentDay)[0];
}
