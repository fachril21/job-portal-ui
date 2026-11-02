import { isActive, slaInfo } from "./time";
import type { Application, Job, Partner } from "./types";
import type { AppStore } from "./store";

type S = Pick<AppStore, "applications" | "jobs" | "partners" | "day" | "reminders" | "moderationLog">;

export const WEEK_LABELS = ["M-7", "M-6", "M-5", "M-4", "M-3", "M-2", "M-1", "Kini"];

/** Berapa hari lamaran melewati tenggat respons (0 bila belum lewat). */
export const daysLate = (a: Application, today: number): number => (a.slaDue === null ? 0 : Math.max(0, today - a.slaDue));

export const partnerOfJob = (s: Pick<S, "jobs">, jobId: string): string | undefined => s.jobs.find((j) => j.id === jobId)?.partnerId;

export function overdueApps(s: S): Application[] {
  return s.applications
    .filter((a) => !a.draft && isActive(a) && slaInfo(a, s.day).state === "overdue")
    .sort((a, b) => daysLate(b, s.day) - daysLate(a, s.day));
}

export interface FollowUpCases {
  waiting: Application[];
  done: Application[];
}

/** Antrean follow up Talent Support, kasus terlama di atas. */
export function followUpCases(s: Pick<S, "applications">): FollowUpCases {
  const all = s.applications.filter((a) => a.followUpRequested).sort((a, b) => (a.followUpDay ?? 0) - (b.followUpDay ?? 0));
  return { waiting: all.filter((a) => !a.followUpAnswered), done: all.filter((a) => a.followUpAnswered).reverse() };
}

/** Rata-rata skor SLA seluruh partner per minggu. */
export function platformTrend(partners: Partner[]): number[] {
  return WEEK_LABELS.map((_, i) => {
    const vals = partners.map((p) => p.slaHistory[i]).filter((v): v is number => typeof v === "number");
    return vals.length === 0 ? 0 : Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });
}

export interface PartnerStats {
  jobs: Job[];
  live: number;
  active: Application[];
  late: Application[];
  reminders: number[];
}

export function partnerStats(s: S, partnerId: string): PartnerStats {
  const jobs = s.jobs.filter((j) => j.partnerId === partnerId);
  const ids = new Set(jobs.map((j) => j.id));
  const active = s.applications.filter((a) => !a.draft && isActive(a) && ids.has(a.jobId));
  return {
    jobs,
    live: jobs.filter((j) => j.moderation === "tayang").length,
    active,
    late: active.filter((a) => slaInfo(a, s.day).state === "overdue").sort((a, b) => daysLate(b, s.day) - daysLate(a, s.day)),
    reminders: s.reminders.filter((r) => r.partnerId === partnerId).map((r) => r.day).sort((a, b) => b - a),
  };
}

export const slaTone = (score: number): "ok" | "warn" | "danger" => (score >= 85 ? "ok" : score >= 70 ? "warn" : "danger");
