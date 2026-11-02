import type { Bootcamp, Job, SkillLevel, Student, WorkType } from "./types";

export interface SkillCriterion {
  skill: string;
  min: SkillLevel;
}

export interface TalentFilters {
  query: string;
  bootcamps: Bootcamp[];
  skills: SkillCriterion[];
  /** Domisili, atau kota yang kandidat bersedia bekerja di sana */
  city: string;
  workModes: WorkType[];
  jobTypes: string[];
  /** Anggaran gaji maksimal per bulan, null = bebas */
  budget: number | null;
  hasCv: boolean;
  /** Terima skill yang satu level di bawah minimal, ditandai "hampir" */
  allowNear: boolean;
  /** Hanya student bootcamp (data terverifikasi mentor) */
  onlyBootcamp: boolean;
}

export const EMPTY_FILTERS: TalentFilters = {
  query: "",
  bootcamps: [],
  skills: [],
  city: "",
  workModes: [],
  jobTypes: [],
  budget: null,
  hasCv: false,
  allowNear: false,
  onlyBootcamp: false,
};

export type TalentSort = "cocok" | "skor" | "gaji";

export const avgProjectScore = (s: Student): number => {
  const vis = s.projects.filter((p) => p.visible);
  return vis.length === 0 ? 0 : Math.round(vis.reduce((a, p) => a + p.score, 0) / vis.length);
};

export function activeFilterCount(f: TalentFilters): number {
  return (
    f.bootcamps.length + f.skills.length + f.workModes.length + f.jobTypes.length +
    (f.city ? 1 : 0) + (f.budget !== null ? 1 : 0) + (f.hasCv ? 1 : 0) + (f.onlyBootcamp ? 1 : 0)
  );
}

/** Kriteria yang terpenuhi, untuk disorot di kartu. Semua filter bersifat wajib. */
export interface TalentMatch {
  ok: boolean;
  metSkills: string[];
  nearSkills: string[];
}

export function matchTalent(s: Student, f: TalentFilters): TalentMatch {
  const miss: TalentMatch = { ok: false, metSkills: [], nearSkills: [] };
  const p = s.profile;
  const q = f.query.trim().toLowerCase();
  if (q) {
    const hay = [s.name, p.headline, s.bootcamp, ...s.skills.map((k) => k.skill), ...p.selfSkills].join(" ").toLowerCase();
    if (!hay.includes(q)) return miss;
  }
  if (f.bootcamps.length > 0 && !f.bootcamps.includes(s.bootcamp)) return miss;
  if (f.city && s.city !== f.city && !p.preference.locations.includes(f.city)) return miss;
  if (f.workModes.length > 0 && !f.workModes.some((m) => p.preference.workModes.includes(m))) return miss;
  if (f.jobTypes.length > 0 && !f.jobTypes.some((t) => p.preference.jobTypes.includes(t))) return miss;
  if (f.budget !== null && p.preference.salaryMin > f.budget) return miss;
  if (f.hasCv && !p.cv) return miss;
  if (f.onlyBootcamp && !s.isBootcamp) return miss;

  const metSkills: string[] = [];
  const nearSkills: string[] = [];
  for (const c of f.skills) {
    const have = s.skills.find((k) => k.skill === c.skill);
    if (have && have.level >= c.min) metSkills.push(c.skill);
    else if (f.allowNear && have && have.level === c.min - 1) nearSkills.push(c.skill);
    else return miss;
  }
  return { ok: true, metSkills, nearSkills };
}

export function sortTalent(list: Student[], by: TalentSort): Student[] {
  const out = [...list];
  if (by === "skor") return out.sort((a, b) => avgProjectScore(b) - avgProjectScore(a));
  if (by === "gaji") return out.sort((a, b) => a.profile.preference.salaryMin - b.profile.preference.salaryMin);
  // "cocok": skill terverifikasi terbanyak dengan level tertinggi lebih dulu
  const weight = (s: Student) => s.skills.reduce((a, k) => a + k.level, 0);
  return out.sort((a, b) => Number(b.isBootcamp) - Number(a.isBootcamp) || weight(b) - weight(a));
}

/** Isi filter dari kebutuhan sebuah lowongan: skill wajib, model kerja, bidang. */
export function filtersFromJob(job: Job, knownCities: string[]): TalentFilters {
  const city = knownCities.find((c) => job.location.includes(c)) ?? "";
  return {
    ...EMPTY_FILTERS,
    bootcamps: [job.field],
    skills: job.requirements.filter((r) => r.weight === "wajib").map((r) => ({ skill: r.skill, min: r.min })),
    city,
    workModes: job.workType === "Onsite" ? [] : [job.workType],
    allowNear: true,
  };
}

export const rupiahJuta = (n: number): string => `${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
export const salaryRange = (min: number, max: number): string => `Rp${rupiahJuta(min).replace(" jt", "")}–${rupiahJuta(max)}`;
