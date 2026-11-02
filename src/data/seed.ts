import { extraTalent, outsideTalent, withProfiles } from "./profiles";
import type {
  Application,
  Job,
  Partner,
  PassportSkill,
  SkillLevel,
  Student,
} from "@/lib/types";

/**
 * Seluruh nama orang, perusahaan, dan angka di file ini SINTETIS, dibuat untuk prototype.
 * Hari 0 = 4 November 2026 (jam virtual awal Demo Panel).
 */
const sk = (skill: string, level: SkillLevel, evidence: string): PassportSkill => ({ skill, level, evidence });

const ready = (cv: boolean, linkedin: boolean, interview: boolean) => ({ cv, linkedin, interview });

function makeStudentsBase(): Omit<Student, "profile" | "isBootcamp">[] {
  return [
    {
      id: "s1",
      name: "Rani Pramesti",
      initials: "RP",
      bootcamp: "Data Analyst",
      batch: "Batch 24",
      city: "Jakarta",
      status: "lulus",
      openToBeFound: true,
      skillTarget: 6,
      skills: [
        sk("SQL", 2, "Project 2 (skor 82/100) dan catatan Mentor Arif"),
        sk("Excel", 3, "Project 1 (skor 78/100) dan penilaian modul Excel Lanjutan"),
        sk("Python", 2, "Project 2 (skor 82/100), notebook pandas dinilai Mentor Arif"),
        sk("Visualisasi data", 2, "Project 1 (skor 78/100) dan catatan Mentor Sari"),
        sk("Statistik", 2, "Ujian modul Statistik Inferensial (skor 80/100)"),
        sk("Storytelling data", 2, "Presentasi final project, dinilai Mentor Sari"),
      ],
      projects: [
        { id: "pr1", title: "Dashboard Penjualan Ritel", summary: "Dashboard Tableau untuk memantau penjualan harian dan stok di 12 toko fiktif.", score: 78, mentorNote: "Struktur dashboard rapi. Pilihan jenis grafik masih bisa dipertajam.", visible: true },
        { id: "pr2", title: "Analisis Churn Pelanggan Telekomunikasi", summary: "SQL dan Python untuk menemukan pola pelanggan berhenti berlangganan.", score: 82, mentorNote: "Pembersihan data teliti dan interpretasi hasil jelas.", visible: true },
        { id: "pr3", title: "Retensi Kohort E-commerce", summary: "Analisis kohort 6 bulan dengan window function.", score: 74, mentorNote: "Query benar. Narasi rekomendasi bisa lebih tegas.", visible: true },
      ],
      endorsements: [
        { id: "e1", mentor: "Mentor Arif", quote: "Rani teliti dan cepat belajar. Cocok untuk peran analis junior yang banyak bekerja dengan SQL.", visible: true },
        { id: "e2", mentor: "Mentor Sari", quote: "Presentasi hasil analisisnya runtut dan mudah diikuti stakeholder non-teknis.", visible: true },
      ],
      readiness: ready(true, true, true),
    },
    {
      id: "s2",
      name: "Bagas Wicaksono",
      initials: "BW",
      bootcamp: "UI/UX Design",
      batch: "Batch 22",
      city: "Yogyakarta",
      status: "lulus",
      openToBeFound: false,
      skillTarget: 6,
      skills: [
        sk("Figma", 3, "Project 1 (skor 88/100) dan catatan Mentor Laras"),
        sk("Wireframing", 3, "Project 1 (skor 88/100)"),
        sk("Prototyping", 3, "Project 2 (skor 85/100) dan catatan Mentor Laras"),
        sk("Riset user", 2, "Studi kasus final (skor 76/100)"),
        sk("Design system", 2, "Project 2 (skor 85/100)"),
        sk("Usability testing", 1, "Latihan modul Usability Testing"),
      ],
      projects: [
        { id: "pb1", title: "Redesign Aplikasi Booking Klinik", summary: "Alur reservasi dari 7 langkah menjadi 4 langkah.", score: 88, mentorNote: "Alur sangat jelas, detail interaksi matang.", visible: true },
        { id: "pb2", title: "Design System untuk Aplikasi Koperasi", summary: "Komponen, token, dan dokumentasi untuk 30+ layar.", score: 85, mentorNote: "Konsisten dan terdokumentasi baik.", visible: true },
      ],
      endorsements: [
        { id: "e3", mentor: "Mentor Laras", quote: "Bagas punya mata yang tajam untuk detail interaksi.", visible: true },
      ],
      readiness: ready(true, false, false),
    },
    {
      id: "s3",
      name: "Nadira Salsabila",
      initials: "NS",
      bootcamp: "Digital Marketing",
      batch: "Batch 26",
      city: "Bandung",
      status: "belajar",
      openToBeFound: false,
      skillTarget: 8,
      skills: [
        sk("SEO", 2, "Latihan modul SEO On-page (skor 84/100)"),
        sk("Copywriting", 3, "Tugas 3 (skor 90/100) dan catatan Mentor Dika"),
        sk("Content strategy", 2, "Tugas 4 (skor 79/100)"),
        sk("Meta Ads", 2, "Simulasi campaign (skor 77/100)"),
      ],
      projects: [
        { id: "pn1", title: "Kalender Konten UMKM Kopi", summary: "Strategi konten 30 hari untuk merek kopi lokal fiktif.", score: 79, mentorNote: "Ide konten kuat. Metrik evaluasi perlu ditambahkan.", visible: true },
      ],
      endorsements: [],
      readiness: ready(false, false, false),
    },
    ...[
      ["c1", "Yoga Pratama", "YP", "Batch 24", "Bekasi"],
      ["c2", "Dewi Anggraini", "DA", "Batch 23", "Jakarta"],
      ["c3", "Fikri Ramadhan", "FR", "Batch 24", "Depok"],
      ["c4", "Citra Lestari", "CL", "Batch 22", "Tangerang"],
      ["c5", "Hendra Saputra", "HS", "Batch 23", "Bogor"],
      ["c6", "Rizky Maulana", "RM", "Batch 25", "Jakarta"],
      ["c7", "Anindya Putri", "AP", "Batch 25", "Bandung"],
    ].map(([id, name, initials, batch, city], i): Omit<Student, "profile" | "isBootcamp"> => ({
      id,
      name,
      initials,
      bootcamp: "Data Analyst",
      batch,
      city,
      status: "lulus",
      openToBeFound: i % 2 === 0,
      skillTarget: 6,
      skills: [
        sk("SQL", ((i % 3) + 2) as SkillLevel, "Project akhir dan penilaian mentor"),
        sk("Excel", 3, "Penilaian modul Excel Lanjutan"),
        sk("Python", (i % 2 === 0 ? 3 : 2) as SkillLevel, "Project akhir (notebook pandas)"),
        sk("Visualisasi data", (i % 4 === 0 ? 3 : 2) as SkillLevel, "Project akhir dan catatan mentor"),
        sk("Statistik", 2, "Ujian modul Statistik"),
      ],
      projects: [
        { id: `${id}-p1`, title: "Analisis Penjualan Toko Online", summary: "Eksplorasi data penjualan dan rekomendasi promo.", score: 70 + i * 3, mentorNote: "Analisis runtut dan rapi.", visible: true },
        { id: `${id}-p2`, title: "Dashboard Kinerja Layanan Pelanggan", summary: "Dashboard waktu respons dan kepuasan pelanggan.", score: 72 + i * 2, mentorNote: "Visual jelas, insight bisa diperdalam.", visible: true },
      ],
      endorsements: [{ id: `${id}-e1`, mentor: "Mentor Arif", quote: "Disiplin dan konsisten menyelesaikan tugas tepat waktu.", visible: true }],
      readiness: ready(true, i % 2 === 0, i % 3 === 0),
    })),
  ];
}

function makeStudents(): Student[] {
  return withProfiles([...makeStudentsBase(), ...extraTalent(), ...outsideTalent()]);
}

function makePartners(): Partner[] {
  return [
    { id: "p1", name: "Nusantara Retail Analytics", industry: "Ritel dan analitik", city: "Jakarta", slaScore: 88, slaHistory: [82, 84, 83, 86, 85, 87, 88, 88], contact: "Maya Kusumawati", logoTone: "brand" },
    { id: "p2", name: "Kopikita Digital", industry: "F&B digital", city: "Bandung", slaScore: 64, slaHistory: [78, 74, 70, 69, 66, 67, 65, 64], contact: "Dion Prakoso", logoTone: "warn" },
    { id: "p3", name: "Arunika Studio", industry: "Studio kreatif", city: "Yogyakarta", slaScore: 92, slaHistory: [90, 91, 90, 93, 92, 92, 93, 92], contact: "Retno Wulandari", logoTone: "learn" },
    { id: "p4", name: "Bentala Finansial", industry: "Teknologi finansial", city: "Jakarta", slaScore: 41, slaHistory: [62, 58, 55, 52, 49, 46, 44, 41], contact: "Hadi Gunawan", logoTone: "proc" },
    { id: "p5", name: "Lentera Edukasi", industry: "Teknologi pendidikan", city: "Semarang", slaScore: 76, slaHistory: [70, 72, 71, 74, 75, 74, 76, 76], contact: "Sari Anggun", logoTone: "ok" },
    { id: "p6", name: "Sagara Logistik", industry: "Logistik", city: "Surabaya", slaScore: 55, slaHistory: [68, 66, 63, 60, 58, 57, 56, 55], contact: "Teguh Santosa", logoTone: "warn" },
  ];
}

const req = (skill: string, min: SkillLevel, wajib = true) => ({
  skill,
  min,
  weight: wajib ? ("wajib" as const) : ("nilai-tambah" as const),
});

function makeJobs(): Job[] {
  const base = { screening: [] as string[], reapplyWaitDays: 30 };
  return [
    { ...base, id: "j1", partnerId: "p1", title: "Junior Data Analyst", field: "Data Analyst", location: "Jakarta Selatan", workType: "Hybrid", level: "Junior", salary: "Rp 7–9 juta / bulan", description: "Menganalisis data penjualan dan perilaku pelanggan untuk tim merchandising. Kamu akan menulis query, membangun dashboard mingguan, dan mempresentasikan temuan ke tim non-teknis.", requirements: [req("SQL", 2), req("Excel", 2), req("Python", 2), req("Visualisasi data", 3), req("Statistik", 2), req("Storytelling data", 2, false)], screening: ["Ceritakan satu analisis yang pernah kamu buat dan keputusan apa yang bisa diambil dari hasilnya."], reapplyWaitDays: 2, moderation: "tayang", postedDay: -12 },
    { ...base, id: "j2", partnerId: "p1", title: "Data Analyst Intern", field: "Data Analyst", location: "Jakarta Selatan", workType: "Hybrid", level: "Magang", salary: "Rp 3 juta / bulan", description: "Mendampingi analis senior menyiapkan data dan laporan harian. Cocok untuk yang ingin tumbuh cepat di tim analitik ritel.", requirements: [req("SQL", 1), req("Excel", 2), req("Visualisasi data", 1), req("Statistik", 1, false)], moderation: "tayang", postedDay: -9 },
    { ...base, id: "j3", partnerId: "p4", title: "Business Intelligence Analyst", field: "Data Analyst", location: "Jakarta Pusat", workType: "Onsite", level: "Junior", salary: "Rp 10–13 juta / bulan", description: "Mengelola pipeline pelaporan dan dashboard eksekutif untuk produk pembayaran.", requirements: [req("SQL", 3), req("Python", 3), req("Visualisasi data", 3), req("Excel", 3), req("Statistik", 3)], moderation: "tayang", postedDay: -20 },
    { ...base, id: "j4", partnerId: "p2", title: "Marketing Data Analyst", field: "Data Analyst", location: "Bandung", workType: "Remote", level: "Junior", salary: "Rp 6–8 juta / bulan", description: "Menghubungkan data campaign dan penjualan untuk menemukan kanal yang paling efektif.", requirements: [req("SQL", 2), req("Excel", 2), req("Google Analytics", 2), req("Visualisasi data", 2), req("Analisis campaign", 2, false)], moderation: "tayang", postedDay: -6 },
    { ...base, id: "j5", partnerId: "p3", title: "Junior Product Designer", field: "UI/UX Design", location: "Yogyakarta", workType: "Hybrid", level: "Junior", salary: "Rp 7–9 juta / bulan", description: "Merancang alur dan antarmuka produk klien bersama tim kecil yang lincah.", requirements: [req("Figma", 3), req("Prototyping", 3), req("Riset user", 3), req("Design system", 2), req("Usability testing", 2, false)], moderation: "tayang", postedDay: -8 },
    { ...base, id: "j6", partnerId: "p3", title: "UI Designer Intern", field: "UI/UX Design", location: "Remote", workType: "Remote", level: "Magang", salary: "Rp 2,5 juta / bulan", description: "Membantu menyiapkan layar, komponen, dan aset desain untuk proyek klien.", requirements: [req("Figma", 2), req("Wireframing", 2), req("Design system", 1, false)], moderation: "tayang", postedDay: -15 },
    { ...base, id: "j7", partnerId: "p2", title: "Digital Marketing Associate", field: "Digital Marketing", location: "Bandung", workType: "Hybrid", level: "Junior", salary: "Rp 5–7 juta / bulan", description: "Menjalankan kampanye media sosial dan iklan berbayar untuk jaringan kedai kopi.", requirements: [req("SEO", 2), req("Copywriting", 2), req("Meta Ads", 2), req("Analisis campaign", 2), req("Content strategy", 2, false)], moderation: "tayang", postedDay: -5 },
    { ...base, id: "j8", partnerId: "p2", title: "Analytics Intern", field: "Data Analyst", location: "Remote", workType: "Remote", level: "Magang", salary: "Rp 2,5 juta / bulan", description: "Merapikan data dan menyiapkan laporan mingguan untuk tim pertumbuhan.", requirements: [req("SQL", 1), req("Excel", 2), req("Statistik", 1), req("Google Analytics", 1, false)], moderation: "tayang", postedDay: -30 },
    { ...base, id: "j9", partnerId: "p1", title: "Retail Operations Analyst", field: "Data Analyst", location: "Jakarta Selatan", workType: "Onsite", level: "Junior", salary: "Rp 6–8 juta / bulan", description: "Memantau efisiensi operasional toko dan rantai pasok lewat laporan harian.", requirements: [req("SQL", 2), req("Excel", 3), req("Visualisasi data", 2)], moderation: "menunggu", postedDay: -1 },
    { ...base, id: "j10", partnerId: "p2", title: "Content Marketer", field: "Digital Marketing", location: "Bandung", workType: "Hybrid", level: "Junior", salary: "Rp 5–6 juta / bulan", description: "Menulis dan menjadwalkan konten untuk blog dan media sosial merek kopi.", requirements: [req("Copywriting", 3), req("SEO", 2), req("Content strategy", 2)], moderation: "menunggu", postedDay: -2 },
    { ...base, id: "j11", partnerId: "p4", title: "Data Analyst Junior", field: "Data Analyst", location: "Jakarta Pusat", workType: "Hybrid", level: "Junior", salary: "Rp 7–9 juta / bulan", description: "Menyiapkan laporan risiko dan analisis perilaku nasabah untuk tim produk.", requirements: [req("SQL", 2), req("Excel", 2), req("Visualisasi data", 2), req("Python", 2)], moderation: "tayang", postedDay: -25 },
    { ...base, id: "j12", partnerId: "p5", title: "UI Designer", field: "UI/UX Design", location: "Semarang", workType: "Hybrid", level: "Junior", salary: "Rp 5–7 juta / bulan", description: "Merancang antarmuka aplikasi belajar untuk siswa SMA, dari wireframe sampai handoff ke tim engineering.", requirements: [req("Figma", 2), req("Wireframing", 2), req("Prototyping", 2), req("Design system", 2, false)], moderation: "tayang", postedDay: -10 },
    { ...base, id: "j13", partnerId: "p6", title: "Logistics Data Analyst", field: "Data Analyst", location: "Surabaya", workType: "Onsite", level: "Junior", salary: "Rp 6–8 juta / bulan", description: "Menganalisis keterlambatan pengiriman dan efisiensi rute untuk tim operasional gudang.", requirements: [req("SQL", 2), req("Excel", 3), req("Visualisasi data", 2), req("Python", 2, false)], moderation: "tayang", postedDay: -16 },
    { ...base, id: "j14", partnerId: "p6", title: "Data Entry Analyst", field: "Data Analyst", location: "Surabaya", workType: "Onsite", level: "Magang", description: "Mengisi dan merapikan data manual. Wajib berusia maksimal 23 tahun dan berpenampilan menarik.", requirements: [req("Excel", 1)], moderation: "ditolak", postedDay: -5 },
    { ...base, id: "j15", partnerId: "p2", title: "Social Media Specialist", field: "Digital Marketing", location: "Bandung", workType: "Hybrid", level: "Junior", description: "Mengelola akun media sosial merek kopi dan menyiapkan laporan kinerja.", requirements: [req("Copywriting", 2), req("Content strategy", 2), req("Meta Ads", 2, false)], moderation: "revisi", postedDay: -4 },
  ] as Job[];
}

function makeApplications(): Application[] {
  const t = (status: Application["status"], day: number) => ({ status, day });
  const base = { followUpRequested: false, followUpAnswered: false, withCv: true };
  return [
    // Rani (s1)
    { ...base, id: "a1", studentId: "s1", jobId: "j3", status: "ditutup", sentDay: -34, slaDue: null, timeline: [t("terkirim", -34), t("direview", -30), t("ditutup", -27)], closure: { tagIds: ["t-viz", "t-depth"], note: "Dashboard di portfolio belum menunjukkan pemilihan grafik yang tepat.", day: -27, by: "perusahaan" } },
    { ...base, id: "a2", studentId: "s1", jobId: "j8", status: "ditutup", sentDay: -26, slaDue: null, timeline: [t("terkirim", -26), t("direview", -23), t("ditutup", -19)], closure: { tagIds: ["t-sql"], day: -19, by: "perusahaan" } },
    { ...base, id: "a3", studentId: "s1", jobId: "j11", status: "ditutup", sentDay: -18, slaDue: null, timeline: [t("terkirim", -18), t("direview", -15), t("ditutup", -11)], closure: { tagIds: ["t-viz"], day: -11, by: "perusahaan" } },
    { ...base, id: "a5", studentId: "s1", jobId: "j2", status: "direview", sentDay: -3, slaDue: 4, timeline: [t("terkirim", -3), t("direview", -2)] },
    { ...base, id: "a6", studentId: "s1", jobId: "j4", status: "terkirim", sentDay: -4, slaDue: 3, timeline: [t("terkirim", -4)] },
    // Bagas (s2)
    { ...base, id: "b1", studentId: "s2", jobId: "j6", status: "ditutup", sentDay: -20, slaDue: null, timeline: [t("terkirim", -20), t("direview", -17), t("ditutup", -14)], closure: { tagIds: ["t-terisi"], day: -14, by: "perusahaan" } },
    { ...base, id: "b2", studentId: "s2", jobId: "j5", status: "terkirim", sentDay: -2, slaDue: 5, timeline: [t("terkirim", -2)] },
    // Nadira (s3)
    { ...base, id: "n1", studentId: "s3", jobId: "j7", status: "terkirim", sentDay: -1, slaDue: 6, timeline: [t("terkirim", -1)] },
    // Kandidat sintetis untuk pipeline partner Nusantara (p1)
    { ...base, id: "k1", studentId: "c1", jobId: "j1", status: "terkirim", sentDay: -1, slaDue: 6, timeline: [t("terkirim", -1)] },
    { ...base, id: "k2", studentId: "c2", jobId: "j1", status: "direview", sentDay: -5, slaDue: 2, timeline: [t("terkirim", -5), t("direview", -4)] },
    { ...base, id: "k3", studentId: "c3", jobId: "j1", status: "interview", sentDay: -9, slaDue: 1, timeline: [t("terkirim", -9), t("direview", -8), t("interview", -6)] },
    { ...base, id: "k4", studentId: "c4", jobId: "j2", status: "terkirim", sentDay: -8, slaDue: -1, timeline: [t("terkirim", -8)] },
    { ...base, id: "k5", studentId: "c5", jobId: "j1", status: "penawaran", sentDay: -12, slaDue: null, timeline: [t("terkirim", -12), t("direview", -10), t("interview", -8), t("penawaran", -2)], offer: { letterNo: "OL/DCC/2026/0412", salary: "Rp 8 juta / bulan", workType: "Hybrid", startDay: 14, deadlineDay: 5, probation: "3 bulan", note: "Kami senang dengan proses seleksi bersamamu.", sentDay: -2 } },
    // Lamaran terlambat dan follow up untuk antrean Talent Support
    { ...base, id: "f1", studentId: "t6", jobId: "j3", status: "terkirim", sentDay: -12, slaDue: -5, timeline: [t("terkirim", -12), { status: "followup", day: -3 }], followUpRequested: true, followUpDay: -3, followUpMessage: "Sudah 12 hari sejak melamar dan belum ada kabar. Mohon dibantu cek statusnya." },
    { ...base, id: "f2", studentId: "c6", jobId: "j4", status: "direview", sentDay: -15, slaDue: -7, timeline: [t("terkirim", -15), t("direview", -13), { status: "followup", day: -6 }], followUpRequested: true, followUpDay: -6, followUpMessage: "Status direview sejak 13 hari lalu. Apakah masih diproses?", followUpNote: "Sudah dua kali pengingat ke partner tanpa respons. Perlu eskalasi." },
    { ...base, id: "f3", studentId: "c7", jobId: "j11", status: "terkirim", sentDay: -9, slaDue: -2, timeline: [t("terkirim", -9), { status: "followup", day: -1 }], followUpRequested: true, followUpDay: -1, followUpMessage: "Belum ada respons setelah 9 hari. Mohon bantuannya." },
    { ...base, id: "f4", studentId: "t4", jobId: "j7", status: "interview", sentDay: -20, slaDue: 1, timeline: [t("terkirim", -20), t("direview", -17), t("interview", -12), { status: "followup", day: -9 }, { status: "followup-dibalas", day: -8 }], followUpRequested: true, followUpAnswered: true, followUpDay: -9, followUpAnsweredDay: -8, followUpMessage: "Interview sudah selesai 4 hari lalu tapi belum ada keputusan.", followUpNote: "Partner berjanji memberi keputusan dalam 3 hari. Dipantau." },
    { ...base, id: "g1", studentId: "t3", jobId: "j12", status: "terkirim", sentDay: -10, slaDue: -3, timeline: [t("terkirim", -10)] },
    { ...base, id: "g2", studentId: "c1", jobId: "j13", status: "terkirim", sentDay: -13, slaDue: -6, timeline: [t("terkirim", -13)] },
    { ...base, id: "g3", studentId: "t1", jobId: "j12", status: "direview", sentDay: -6, slaDue: 1, timeline: [t("terkirim", -6), t("direview", -4)] },
  ] as Application[];
}

export interface SeedState {
  students: Student[];
  partners: Partner[];
  jobs: Job[];
  applications: Application[];
}

export function makeSeed(): SeedState {
  return {
    students: makeStudents(),
    partners: makePartners(),
    jobs: makeJobs(),
    applications: makeApplications(),
  };
}

export const PARTNER_ME = "p1";
export const BASE_DATE = new Date(2026, 10, 4);

export const SKILL_TAXONOMY: string[] = [
  "SQL", "Excel", "Python", "Visualisasi data", "Statistik", "Storytelling data", "Google Analytics", "Analisis campaign",
  "Figma", "Wireframing", "Prototyping", "Riset user", "Design system", "Usability testing",
  "SEO", "Copywriting", "Content strategy", "Meta Ads",
];
