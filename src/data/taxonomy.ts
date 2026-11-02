import type { ModuleMapping, ReasonTag } from "@/lib/types";

/** Taksonomi tag alasan (PRD 5.4). Tidak ada atribut personal yang dilindungi. */
export const TAGS: ReasonTag[] = [
  { id: "t-sql", category: "Skill teknis", label: "SQL lanjutan", studentCopy: "SQL lanjutan belum cukup terlihat di portfolio.", triggersRoadmap: true },
  { id: "t-viz", category: "Skill teknis", label: "Visualisasi data", studentCopy: "Visualisasi data belum cukup terlihat di portfolio.", triggersRoadmap: true },
  { id: "t-python", category: "Skill teknis", label: "Python", studentCopy: "Python untuk analisis belum cukup terlihat di project.", triggersRoadmap: true },
  { id: "t-figma", category: "Skill teknis", label: "Figma / prototyping", studentCopy: "Prototyping interaktif belum cukup terlihat di portfolio.", triggersRoadmap: true },
  { id: "t-research", category: "Skill teknis", label: "Riset user", studentCopy: "Proses riset user belum cukup terlihat di studi kasus.", triggersRoadmap: true },
  { id: "t-campaign", category: "Skill teknis", label: "Analisis campaign", studentCopy: "Analisis hasil campaign belum cukup terlihat di portfolio.", triggersRoadmap: true },
  { id: "t-relevan", category: "Portfolio", label: "Project kurang relevan dengan posisi", studentCopy: "Project di portfolio belum sejalan dengan kebutuhan posisi ini.", triggersRoadmap: true },
  { id: "t-depth", category: "Portfolio", label: "Kedalaman analisis atau studi kasus kurang", studentCopy: "Kedalaman analisis di studi kasus belum cukup terlihat.", triggersRoadmap: true },
  { id: "t-interview", category: "Komunikasi", label: "Penyampaian saat interview", studentCopy: "Penyampaian jawaban saat interview masih bisa dilatih.", triggersRoadmap: true },
  { id: "t-struct", category: "Komunikasi", label: "Struktur jawaban", studentCopy: "Struktur jawaban belum konsisten terlihat saat interview.", triggersRoadmap: true },
  { id: "t-exp", category: "Pengalaman", label: "Posisi butuh pengalaman lebih panjang", studentCopy: "Posisi ini mengharapkan pengalaman kerja yang lebih panjang.", triggersRoadmap: "sebagian" },
  { id: "t-gaji", category: "Kecocokan non-kompetensi", label: "Ekspektasi gaji", studentCopy: "Ekspektasi gaji belum bertemu dengan anggaran posisi.", triggersRoadmap: false },
  { id: "t-lokasi", category: "Kecocokan non-kompetensi", label: "Lokasi", studentCopy: "Lokasi kerja belum cocok dengan kebutuhan posisi.", triggersRoadmap: false },
  { id: "t-mulai", category: "Kecocokan non-kompetensi", label: "Ketersediaan mulai kerja", studentCopy: "Tanggal mulai kerja belum bertemu dengan kebutuhan tim.", triggersRoadmap: false },
  { id: "t-terisi", category: "Faktor perusahaan", label: "Posisi sudah terisi", studentCopy: "Posisi ini sudah terisi.", triggersRoadmap: false },
  { id: "t-batal", category: "Faktor perusahaan", label: "Posisi dibatalkan", studentCopy: "Posisi ini dibatalkan oleh perusahaan.", triggersRoadmap: false },
  { id: "t-freeze", category: "Faktor perusahaan", label: "Hiring dibekukan", studentCopy: "Perusahaan sedang membekukan rekrutmen.", triggersRoadmap: false },
];

export const TAG_CATEGORIES = [
  "Skill teknis",
  "Portfolio",
  "Komunikasi",
  "Pengalaman",
  "Kecocokan non-kompetensi",
  "Faktor perusahaan",
] as const;

let LABEL_OVERRIDES: Record<string, string> = {};

/** Nama tag yang diubah admin. Dipanggil dari store agar semua layar memakai nama terbaru. */
export const setTagLabels = (m: Record<string, string>): void => {
  LABEL_OVERRIDES = m;
};

export const tagById = (id: string): ReasonTag | undefined => {
  const tag = TAGS.find((t) => t.id === id);
  return tag && LABEL_OVERRIDES[id] ? { ...tag, label: LABEL_OVERRIDES[id] } : tag;
};

/** Pemetaan awal tag → saran arah belajar. Admin bisa mengubah judulnya. */
export const DEFAULT_MAPPING: ModuleMapping[] = [
  { tagId: "t-sql", items: [
    { type: "modul", title: "SQL Lanjutan: window function dan CTE", estimate: "± 6 jam" },
    { type: "project", title: "Latihan: analisis cohort dengan SQL", estimate: "± 4 jam" },
  ] },
  { tagId: "t-viz", items: [
    { type: "modul", title: "Dasar visualisasi data dengan Tableau", estimate: "± 5 jam" },
    { type: "project", title: "Project latihan: dashboard penjualan ritel", estimate: "± 8 jam" },
    { type: "mentor", title: "Sesi review dashboard bersama mentor (Job Connect Plus)", estimate: "45 menit" },
  ] },
  { tagId: "t-python", items: [
    { type: "modul", title: "Python untuk analisis data: pandas", estimate: "± 8 jam" },
  ] },
  { tagId: "t-figma", items: [
    { type: "modul", title: "Prototyping interaktif di Figma", estimate: "± 5 jam" },
    { type: "project", title: "Project latihan: prototipe alur checkout", estimate: "± 6 jam" },
  ] },
  { tagId: "t-research", items: [
    { type: "modul", title: "Riset user: wawancara dan sintesis", estimate: "± 5 jam" },
    { type: "mentor", title: "Sesi review studi kasus bersama mentor", estimate: "45 menit" },
  ] },
  { tagId: "t-campaign", items: [
    { type: "modul", title: "Analisis performa campaign berbayar", estimate: "± 4 jam" },
    { type: "project", title: "Project latihan: laporan campaign 30 hari", estimate: "± 6 jam" },
  ] },
  { tagId: "t-relevan", items: [
    { type: "project", title: "Project latihan: studi kasus sesuai bidang posisi", estimate: "± 10 jam" },
    { type: "mentor", title: "Sesi pemilihan project unggulan bersama mentor", estimate: "30 menit" },
  ] },
  { tagId: "t-depth", items: [
    { type: "mentor", title: "Sesi memperdalam studi kasus bersama mentor", estimate: "45 menit" },
    { type: "modul", title: "Menyusun narasi analisis yang meyakinkan", estimate: "± 3 jam" },
  ] },
  { tagId: "t-interview", items: [
    { type: "mock-interview", title: "Sesi mock interview dengan mentor", estimate: "60 menit" },
  ] },
  { tagId: "t-struct", items: [
    { type: "modul", title: "Struktur jawaban STAR untuk interview", estimate: "± 2 jam" },
    { type: "mock-interview", title: "Sesi mock interview dengan mentor", estimate: "60 menit" },
  ] },
  { tagId: "t-exp", items: [
    { type: "project", title: "Proyek kolaboratif atau magang untuk menambah pengalaman", estimate: "± 2 minggu" },
  ] },
];

export const TYPE_LABEL = {
  modul: "Modul",
  mentor: "Sesi mentor",
  project: "Project latihan",
  "mock-interview": "Mock interview",
} as const;
