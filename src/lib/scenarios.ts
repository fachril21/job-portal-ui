import type { AppStore, ScenarioId } from "./store";
import { appsOfStudent } from "./select";
import { isActive } from "./time";

export interface ScenarioStep {
  text: string;
  hint: string;
  /** Rute tujuan bila langkah dilakukan lewat UI produk */
  href?: string;
  done: (s: AppStore) => boolean;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  summary: string;
  start: string;
  steps: ScenarioStep[];
}

const rani = (s: AppStore) => appsOfStudent(s, "s1");

export const SCENARIOS: Scenario[] = [
  {
    id: "A",
    title: "Lamar, ditutup dengan tag, arah belajar, lamar ulang",
    summary: "Alur utama Feedback Loop dari sisi Rani.",
    start: "/student/jobs/j1",
    steps: [
      { text: "Lamar ke Junior Data Analyst", hint: "Buka detail lowongan, baca tabel skill, lalu lamar.", href: "/student/jobs/j1", done: (s) => rani(s).some((a) => a.jobId === "j1") },
      { text: "Partner menutup lamaran (tag Visualisasi data)", hint: "Pakai event 'Partner menutup lamaran' di bawah.", done: (s) => rani(s).some((a) => a.jobId === "j1" && a.status === "ditutup") },
      { text: "Baca Feedback card", hint: "Buka Lamaran saya, pilih lamaran yang ditutup.", href: "/student/applications", done: (s) => !!s.flags.feedbackOpened },
      { text: "Baca arah belajar yang disarankan", hint: "Buka Perkembangan.", href: "/student/progress", done: (s) => !!s.flags.directionsOpened },
      { text: "Lamar ulang ke posisi yang sama", hint: "Tombol aktif bila masa tunggu 2 hari lewat. Majukan waktu bila perlu.", href: "/student/jobs/j1", done: (s) => rani(s).some((a) => !!a.reapplyOf) },
    ],
  },
  {
    id: "B",
    title: "Tenggat terlewat, minta follow up",
    summary: "Perusahaan tidak merespons, Talent Support membantu.",
    start: "/student/applications",
    steps: [
      { text: "Majukan waktu 7 hari", hint: "Pakai tombol +7 hari di bagian Waktu.", done: (s) => rani(s).some((a) => isActive(a) && a.slaDue !== null && a.slaDue < s.day) },
      { text: "Minta Talent Support follow up", hint: "Buka lamaran yang 'Belum ada respons'.", href: "/student/applications", done: (s) => rani(s).some((a) => a.followUpRequested) },
      { text: "Talent Support menanggapi", hint: "Pakai event 'Talent Support menanggapi'.", done: (s) => rani(s).some((a) => a.followUpAnswered) },
    ],
  },
  {
    id: "C",
    title: "Penolakan non-kompetensi",
    summary: "Ditutup karena faktor di luar kemampuan, tanpa saran belajar.",
    start: "/student/applications",
    steps: [
      { text: "Partner menutup lamaran (Ekspektasi gaji)", hint: "Pilih lamaran aktif lalu pakai event 'tag non-kompetensi'.", done: (s) => rani(s).some((a) => a.closure?.tagIds.includes("t-gaji")) },
      { text: "Baca kartu penenang", hint: "Buka lamaran yang ditutup di Lamaran saya.", href: "/student/applications", done: (s) => !!s.flags.feedbackOpened },
      { text: "Buka lowongan serupa", hint: "Pilih salah satu rekomendasi di kartu.", done: (s) => !!s.flags.similarOpened },
    ],
  },
];
