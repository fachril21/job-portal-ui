import type { JobDraft } from "@/lib/jobdraft";
import type { Bootcamp, SkillLevel } from "@/lib/types";

export const BOOTCAMP_FIELDS: Bootcamp[] = ["Data Analyst", "UI/UX Design", "Digital Marketing"];

/** Skill taksonomi Dibimbing yang relevan per bidang, urut dari yang paling sering diminta. */
export const SKILL_BY_FIELD: Record<Bootcamp, string[]> = {
  "Data Analyst": ["SQL", "Excel", "Python", "Visualisasi data", "Statistik", "Storytelling data", "Google Analytics"],
  "UI/UX Design": ["Figma", "Wireframing", "Prototyping", "Riset user", "Design system", "Usability testing"],
  "Digital Marketing": ["SEO", "Copywriting", "Content strategy", "Meta Ads", "Analisis campaign", "Google Analytics"],
};

export const LEVEL_HELP: Record<SkillLevel, string> = {
  1: "Pernah berlatih lewat modul dan bisa mengikuti arahan.",
  2: "Bisa mengerjakan tugas yang jelas dengan sedikit bimbingan.",
  3: "Bisa mengerjakan mandiri dan hasilnya dinilai baik mentor.",
  4: "Hasilnya konsisten sangat baik, bisa jadi rujukan tim.",
};

export const SCREENING_IDEAS = [
  "Ceritakan satu project yang paling kamu banggakan.",
  "Mengapa kamu tertarik dengan posisi ini?",
  "Kapan kamu bisa mulai bekerja?",
];

type Template = Pick<JobDraft, "title" | "level" | "workType" | "salaryMin" | "salaryMax" | "description" | "reqs" | "screening">;

export const TEMPLATES: Record<Bootcamp, Template> = {
  "Data Analyst": {
    title: "Junior Data Analyst", level: "Junior", workType: "Hybrid", salaryMin: 6, salaryMax: 8,
    description: "Menganalisis data operasional dan perilaku pelanggan, membangun dashboard mingguan, dan mempresentasikan temuan ke tim non-teknis.",
    reqs: [{ skill: "SQL", min: 2, weight: "wajib" }, { skill: "Excel", min: 2, weight: "wajib" }, { skill: "Visualisasi data", min: 2, weight: "wajib" }, { skill: "Python", min: 2, weight: "nilai-tambah" }],
    screening: ["Ceritakan satu analisis yang pernah kamu buat dan keputusan apa yang bisa diambil dari hasilnya."],
  },
  "UI/UX Design": {
    title: "Junior Product Designer", level: "Junior", workType: "Hybrid", salaryMin: 6, salaryMax: 8,
    description: "Merancang alur dan antarmuka produk bersama tim lintas fungsi, dari riset singkat sampai prototipe yang siap diuji.",
    reqs: [{ skill: "Figma", min: 3, weight: "wajib" }, { skill: "Prototyping", min: 2, weight: "wajib" }, { skill: "Riset user", min: 2, weight: "wajib" }, { skill: "Usability testing", min: 2, weight: "nilai-tambah" }],
    screening: ["Ceritakan satu keputusan desain yang kamu ubah setelah mendapat masukan pengguna."],
  },
  "Digital Marketing": {
    title: "Digital Marketing Associate", level: "Junior", workType: "Hybrid", salaryMin: 5, salaryMax: 7,
    description: "Menjalankan kampanye media sosial dan iklan berbayar, menyusun kalender konten, dan melaporkan hasil kampanye setiap pekan.",
    reqs: [{ skill: "Copywriting", min: 2, weight: "wajib" }, { skill: "Meta Ads", min: 2, weight: "wajib" }, { skill: "Analisis campaign", min: 2, weight: "wajib" }, { skill: "SEO", min: 2, weight: "nilai-tambah" }],
    screening: [],
  },
};
