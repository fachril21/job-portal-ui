import type { Job, PassportSkill, Requirement, SkillLevel, Student } from "./types";

export type MatchStatus = "terpenuhi" | "hampir" | "belum";

export interface RequirementMatch {
  requirement: Requirement;
  yourLevel: SkillLevel | 0;
  status: MatchStatus;
}

export interface JobMatch {
  rows: RequirementMatch[];
  requiredTotal: number;
  requiredMet: number;
  /** Skill wajib yang belum terpenuhi (hampir atau belum terlihat) */
  gaps: RequirementMatch[];
}

function levelOf(skills: PassportSkill[], skill: string): SkillLevel | 0 {
  return skills.find((s) => s.skill === skill)?.level ?? 0;
}

export function matchJob(student: Student, job: Job): JobMatch {
  const rows: RequirementMatch[] = job.requirements.map((requirement) => {
    const yourLevel = levelOf(student.skills, requirement.skill);
    const status: MatchStatus =
      yourLevel >= requirement.min ? "terpenuhi" : yourLevel === requirement.min - 1 && yourLevel > 0 ? "hampir" : "belum";
    return { requirement, yourLevel, status };
  });
  const required = rows.filter((r) => r.requirement.weight === "wajib");
  const met = required.filter((r) => r.status === "terpenuhi");
  return {
    rows,
    requiredTotal: required.length,
    requiredMet: met.length,
    gaps: required.filter((r) => r.status !== "terpenuhi"),
  };
}

/** Skor urut feed: banyak skill wajib terpenuhi lebih dulu, lalu yang hampir. Tidak ditampilkan ke pengguna. */
export function matchRank(m: JobMatch): number {
  const near = m.rows.filter((r) => r.requirement.weight === "wajib" && r.status === "hampir").length;
  const ratio = m.requiredTotal === 0 ? 1 : m.requiredMet / m.requiredTotal;
  return ratio * 10 + near * 0.5;
}
