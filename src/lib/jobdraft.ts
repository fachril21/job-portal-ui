import { EMPTY_FILTERS, matchTalent } from "./talent";
import type { Bootcamp, Job, Requirement, Student } from "./types";

/** Draft lowongan di wizard. Gaji dalam juta rupiah per bulan. */
export interface JobDraft {
  id: string;
  updatedDay: number;
  title: string;
  field: Bootcamp;
  level: Job["level"];
  workType: Job["workType"];
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  reqs: Requirement[];
  screening: string[];
  wait: number;
}

export const MAX_SCREENING = 3;
export const MAX_REQUIRED = 5;
export const MIN_DESCRIPTION = 60;
export const WAIT_OPTIONS = [0, 2, 7, 14, 30];
export const CITIES = ["Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Bekasi", "Depok", "Tangerang", "Bogor", "Remote"];

export const emptyDraft = (id: string, day: number, field: Bootcamp = "Data Analyst"): JobDraft => ({
  id, updatedDay: day, title: "", field, level: "Junior", workType: "Hybrid", location: "Jakarta Selatan",
  salaryMin: null, salaryMax: null, description: "", reqs: [], screening: [], wait: 7,
});

const juta = (n: number): string => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

export function formatSalary(min: number | null, max: number | null): string | undefined {
  if (min === null && max === null) return undefined;
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? 0;
  return lo === hi ? `Rp ${juta(lo)} juta / bulan` : `Rp ${juta(Math.min(lo, hi))}–${juta(Math.max(lo, hi))} juta / bulan`;
}

function parseSalary(s?: string): [number | null, number | null] {
  const nums = [...(s ?? "").matchAll(/\d+(?:,\d+)?/g)].map((m) => Number(m[0].replace(",", ".")));
  return nums.length === 0 ? [null, null] : [nums[0], nums[1] ?? null];
}

/** Salin lowongan yang sudah ada menjadi draft baru. */
export function draftFromJob(job: Job, id: string, day: number): JobDraft {
  const [salaryMin, salaryMax] = parseSalary(job.salary);
  return {
    id, updatedDay: day, title: job.title, field: job.field, level: job.level, workType: job.workType,
    location: job.location, salaryMin, salaryMax, description: job.description,
    reqs: job.requirements.map((r) => ({ ...r })), screening: [...job.screening], wait: job.reapplyWaitDays,
  };
}

export function draftToInput(d: JobDraft) {
  return {
    title: d.title.trim(),
    field: d.field,
    location: d.location,
    workType: d.workType,
    level: d.level,
    salary: formatSalary(d.salaryMin, d.salaryMax),
    description: d.description.trim(),
    requirements: d.reqs,
    screening: d.screening.map((q) => q.trim()).filter(Boolean),
    reapplyWaitDays: d.wait,
  };
}

export type DraftErrors = Partial<Record<"title" | "salary" | "description" | "reqs" | "screening", string>>;

/** Galat per langkah (1 dasar, 2 skill, 3 seleksi). */
export function validateStep(d: JobDraft, step: number): DraftErrors {
  const e: DraftErrors = {};
  if (step === 1) {
    if (!d.title.trim()) e.title = "Judul posisi wajib diisi.";
    if (d.salaryMin !== null && d.salaryMax !== null && d.salaryMin > d.salaryMax) e.salary = "Gaji minimal tidak boleh lebih besar dari maksimal.";
    if (d.description.trim().length < MIN_DESCRIPTION) e.description = `Deskripsi minimal ${MIN_DESCRIPTION} karakter agar student paham pekerjaannya.`;
  }
  if (step === 2 && !d.reqs.some((r) => r.weight === "wajib")) e.reqs = "Tambahkan minimal satu skill wajib.";
  if (step === 3 && d.screening.some((q) => !q.trim())) e.screening = "Isi pertanyaan atau hapus yang kosong.";
  return e;
}

export const firstInvalidStep = (d: JobDraft): number | null =>
  [1, 2, 3].find((s) => Object.keys(validateStep(d, s)).length > 0) ?? null;

/** Perkiraan talent yang memenuhi semua skill wajib. Akun non-bootcamp tidak punya skill terverifikasi. */
export function estimateTalent(students: Student[], d: JobDraft): number {
  const skills = d.reqs.filter((r) => r.weight === "wajib").map((r) => ({ skill: r.skill, min: r.min }));
  const f = { ...EMPTY_FILTERS, bootcamps: [d.field], skills };
  return students.filter((s) => s.openToBeFound && s.status === "lulus" && matchTalent(s, f).ok).length;
}
