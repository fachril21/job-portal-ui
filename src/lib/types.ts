export type Role = "student" | "partner" | "admin";

export type Bootcamp = "Data Analyst" | "UI/UX Design" | "Digital Marketing";

export type SkillLevel = 1 | 2 | 3 | 4;

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  1: "Dasar",
  2: "Menengah",
  3: "Mahir",
  4: "Siap Produksi",
};

export interface PassportSkill {
  skill: string;
  level: SkillLevel;
  /** Sumber bukti, mis. "Project 2 (skor 82/100) dan catatan Mentor A" */
  evidence: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  score: number;
  mentorNote: string;
  visible: boolean;
}

export interface Endorsement {
  id: string;
  mentor: string;
  quote: string;
  visible: boolean;
}

export interface StudentProfile {
  headline: string;
  about: string;
  province: string;
  /** Keahlian yang diisi sendiri. Berbeda dari skill Passport yang terverifikasi. */
  selfSkills: string[];
  education: { school: string; major: string; years: string }[];
  experience: { org: string; role: string; period: string }[];
  links: { label: string; url: string }[];
  preference: {
    fields: string[];
    jobTypes: string[];
    workModes: WorkType[];
    salaryMin: number;
    salaryMax: number;
    /** Kota atau negara yang mau dijadikan tempat kerja */
    locations: string[];
  };
  cv?: { fileName: string; updated: string };
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  /** Lulusan bootcamp punya data terverifikasi mentor; akun event/VOD tidak. */
  isBootcamp: boolean;
  /** Bidang bootcamp; untuk non-bootcamp berarti bidang yang diminati */
  bootcamp: Bootcamp;
  /** Kosong untuk non-bootcamp */
  batch: string;
  city: string;
  status: "lulus" | "belajar";
  openToBeFound: boolean;
  skills: PassportSkill[];
  /** Total skill terverifikasi yang ditargetkan kurikulum (untuk Passport parsial) */
  skillTarget: number;
  projects: Project[];
  endorsements: Endorsement[];
  readiness: { cv: boolean; linkedin: boolean; interview: boolean };
  profile: StudentProfile;
}

export interface Requirement {
  skill: string;
  min: SkillLevel;
  weight: "wajib" | "nilai-tambah";
}

export type WorkType = "Onsite" | "Hybrid" | "Remote";

export interface Partner {
  id: string;
  name: string;
  industry: string;
  city: string;
  /** Hanya tampil di sisi admin */
  slaScore: number;
  /** Skor SLA 8 minggu terakhir, terlama dulu. Hanya tampil di admin */
  slaHistory: number[];
  /** Nama PIC rekrutmen di perusahaan */
  contact: string;
  logoTone: "brand" | "ok" | "proc" | "warn" | "learn";
}

export interface Job {
  id: string;
  partnerId: string;
  title: string;
  field: Bootcamp;
  location: string;
  workType: WorkType;
  level: "Magang" | "Junior";
  salary?: string;
  description: string;
  requirements: Requirement[];
  screening: string[];
  reapplyWaitDays: number;
  moderation: "menunggu" | "tayang" | "revisi" | "ditolak";
  postedDay: number;
}

export type AppStatus =
  | "terkirim"
  | "direview"
  | "interview"
  | "penawaran"
  | "diterima"
  | "ditutup";

export interface TimelineEntry {
  status: AppStatus | "followup" | "followup-dibalas";
  day: number;
  note?: string;
}

export interface Closure {
  tagIds: string[];
  note?: string;
  day: number;
  /** "perusahaan" = ditutup partner dengan tag, "sistem" = lowongan ditutup, "student" = mengundurkan diri */
  by: "perusahaan" | "sistem" | "student";
}

export interface Offer {
  letterNo: string;
  salary: string;
  workType: WorkType;
  /** Hari virtual mulai kerja */
  startDay: number;
  /** Hari virtual batas jawab */
  deadlineDay: number;
  probation: string;
  note: string;
  sentDay: number;
}

export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  status: AppStatus;
  sentDay: number;
  /** Hari virtual tenggat respons berikutnya. null bila tidak ada tenggat. */
  slaDue: number | null;
  timeline: TimelineEntry[];
  closure?: Closure;
  offer?: Offer;
  followUpRequested: boolean;
  followUpAnswered: boolean;
  /** Hari virtual follow up diminta */
  followUpDay?: number;
  /** Pesan student saat meminta follow up */
  followUpMessage?: string;
  /** Catatan internal Talent Support */
  followUpNote?: string;
  /** Hari virtual Talent Support menghubungi perusahaan */
  followUpAnsweredDay?: number;
  reapplyOf?: string;
  answers?: string[];
  withCv: boolean;
  /** Draft belum terkirim (offline) */
  draft?: boolean;
}

export type TagCategory =
  | "Skill teknis"
  | "Portfolio"
  | "Komunikasi"
  | "Pengalaman"
  | "Kecocokan non-kompetensi"
  | "Faktor perusahaan";

export interface ReasonTag {
  id: string;
  category: TagCategory;
  label: string;
  /** Kalimat berorientasi aksi untuk Feedback card (subjek: skill/portfolio) */
  studentCopy: string;
  triggersRoadmap: boolean | "sebagian";
}

export type RoadmapType = "modul" | "mentor" | "project" | "mock-interview";

export interface ModuleMapping {
  tagId: string;
  items: { type: RoadmapType; title: string; estimate: string }[];
}

export interface ToastMsg {
  id: string;
  text: string;
  tone: "info" | "ok" | "warn";
  who?: Role;
}

export interface LogEntry {
  id: string;
  day: number;
  text: string;
}

export type ScreenState = "normal" | "empty" | "loading" | "offline";

export interface ModerationRecord {
  jobId: string;
  decision: "disetujui" | "revisi" | "ditolak";
  note?: string;
  day: number;
}

export interface ReminderRecord {
  partnerId: string;
  day: number;
}

export interface CustomSkill {
  name: string;
  field: Bootcamp;
}
