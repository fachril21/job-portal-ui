import type { Bootcamp, PassportSkill, SkillLevel, Student, StudentProfile, WorkType } from "@/lib/types";

/**
 * Profil student mengikuti struktur data profil yang disimpan Dibimbing.
 * Yang TIDAK dibawa ke sisi partner: email, nomor telepon, NIK, NPWP, tanggal lahir, alamat lengkap,
 * dan akun media sosial pribadi. Semua nama, sekolah, dan angka di sini sintetis.
 */
type Base = Omit<Student, "profile" | "isBootcamp"> & { isBootcamp?: boolean };

const PROVINCE: Record<string, string> = {
  Jakarta: "DKI Jakarta",
  Bekasi: "Jawa Barat",
  Depok: "Jawa Barat",
  Bogor: "Jawa Barat",
  Bandung: "Jawa Barat",
  Tangerang: "Banten",
  Yogyakarta: "DI Yogyakarta",
  Surabaya: "Jawa Timur",
  Semarang: "Jawa Tengah",
};

const SCHOOLS = ["Universitas Nusa Mandala", "Institut Teknologi Pelita Raya", "Universitas Cendana Persada", "Politeknik Garuda Nusantara", "Universitas Kencana Utama"];

interface Track {
  headline: string;
  about: string;
  majors: string[];
  fields: string[];
  base: number;
  selfSkills: string[];
  roles: string[];
  linkLabel: string;
  linkHost: string;
}

const TRACK: Record<Bootcamp, Track> = {
  "Data Analyst": {
    headline: "Junior Data Analyst",
    about: "Lulusan bootcamp Data Analyst yang suka mengubah data penjualan dan perilaku pelanggan menjadi rekomendasi yang bisa dipakai tim non-teknis. Terbiasa dengan SQL, Python, dan dashboard.",
    majors: ["Statistika", "Sistem Informasi", "Matematika", "Manajemen Bisnis"],
    fields: ["Data Analyst", "Business Analyst"],
    base: 5_000_000,
    selfSkills: ["Microsoft Excel", "Google Sheets", "Tableau", "Problem Solving", "Komunikasi"],
    roles: ["Magang Data Analyst", "Asisten Riset Data", "Staf Administrasi Data"],
    linkLabel: "Portfolio",
    linkHost: "https://portfolio.contoh.id/",
  },
  "UI/UX Design": {
    headline: "UI/UX Designer",
    about: "Desainer produk digital yang fokus pada kejelasan, kegunaan, dan pengalaman pengguna yang bermakna. Menggabungkan logika dengan visual storytelling, dengan pengalaman di branding dan ilustrasi.",
    majors: ["Desain Komunikasi Visual", "Informatika", "Desain Produk"],
    fields: ["UI Design", "UIUX Designer"],
    base: 5_500_000,
    selfSkills: ["Adobe Illustrator", "Adobe Photoshop", "Time Management", "Creativity", "Critical Thinking"],
    roles: ["Magang UI Designer", "Desainer Grafis Lepas", "Asisten Desain Branding"],
    linkLabel: "Behance",
    linkHost: "https://www.behance.net/",
  },
  "Digital Marketing": {
    headline: "Digital Marketing Specialist",
    about: "Praktisi pemasaran digital yang senang merancang kampanye berbasis data, dari strategi konten sampai analisis hasil iklan. Terbiasa bekerja dengan target dan tenggat yang jelas.",
    majors: ["Ilmu Komunikasi", "Manajemen", "Bisnis Digital"],
    fields: ["Digital Marketing", "Content Strategist"],
    base: 4_500_000,
    selfSkills: ["Canva", "Google Analytics", "Penulisan Konten", "Kerja Sama Tim", "Time Management"],
    roles: ["Magang Social Media", "Content Writer Lepas", "Asisten Marketing"],
    linkLabel: "Portfolio",
    linkHost: "https://portfolio.contoh.id/",
  },
};

const MODES: WorkType[][] = [["Onsite", "Remote"], ["Hybrid", "Remote"], ["Onsite", "Hybrid", "Remote"]];
const TYPES = [["Full-time"], ["Full-time", "Freelance"], ["Magang", "Full-time"]];

const hash = (s: string): number => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const slug = (name: string): string => name.toLowerCase().replace(/[^a-z]+/g, "");

export function buildProfile(st: Base): StudentProfile {
  const tr = TRACK[st.bootcamp];
  const h = hash(st.id);
  const startYear = 2020 + (h % 2);
  const salaryMin = tr.base + (h % 4) * 500_000;
  const nearby = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya"].filter((c) => c !== st.city);
  return {
    headline: st.isBootcamp === false ? `Calon ${tr.headline}` : tr.headline,
    about: st.isBootcamp === false ? OUTSIDE_ABOUT[st.bootcamp] : tr.about,
    province: PROVINCE[st.city] ?? "Indonesia",
    selfSkills: tr.selfSkills.slice(0, st.isBootcamp === false ? 5 : 3 + (h % 3)),
    education: [{ school: SCHOOLS[h % SCHOOLS.length], major: tr.majors[h % tr.majors.length], years: `${startYear} - ${startYear + 4}` }],
    experience: st.status === "lulus" ? [{ org: ["Studio Lentera", "CV Mitra Karya", "Toko Daring Sinar", "Komunitas Tumbuh"][h % 4], role: tr.roles[h % tr.roles.length], period: `${2024 + (h % 2)} · ${3 + (h % 4)} bulan` }] : [],
    links: [{ label: tr.linkLabel, url: `${tr.linkHost}${slug(st.name)}` }],
    preference: {
      fields: tr.fields,
      jobTypes: TYPES[h % TYPES.length],
      workModes: MODES[(h >> 2) % MODES.length],
      salaryMin,
      salaryMax: salaryMin + 2_000_000,
      locations: [st.city, ...nearby.slice(0, h % 3)],
    },
    cv: h % 5 === 3 ? undefined : { fileName: `CV_${st.name.replace(/\s+/g, "_")}.pdf`, updated: ["Okt 2026", "Sep 2026", "Agu 2026"][h % 3] },
  };
}

const OUTSIDE_ABOUT: Record<Bootcamp, string> = {
  "Data Analyst": "Sedang beralih ke bidang data. Belajar mandiri lewat kelas daring dan event komunitas, terbiasa merapikan data di spreadsheet dan mulai belajar SQL.",
  "UI/UX Design": "Tertarik pada desain produk digital. Belajar lewat kelas daring dan event komunitas, sudah membuat beberapa desain latihan sendiri.",
  "Digital Marketing": "Mendalami pemasaran digital lewat kelas daring dan event komunitas, pernah mengelola akun media sosial usaha kecil.",
};

export const withProfiles = (list: Base[]): Student[] => list.map((s) => ({ ...s, isBootcamp: s.isBootcamp ?? true, profile: buildProfile(s) }));

const sk = (skill: string, level: SkillLevel, evidence: string): PassportSkill => ({ skill, level, evidence });
const proj = (id: string, title: string, summary: string, score: number) => ({ id, title, summary, score, mentorNote: "Pengerjaan rapi dan konsisten dengan brief.", visible: true });

/** Talent tambahan dari bootcamp lain agar pencarian punya variasi. */
export function extraTalent(): Base[] {
  const mk = (id: string, name: string, initials: string, bootcamp: Bootcamp, batch: string, city: string, skills: PassportSkill[], scores: [string, string, number][]): Base => ({
    id, name, initials, bootcamp, batch, city,
    status: "lulus",
    openToBeFound: true,
    skillTarget: skills.length,
    skills,
    projects: scores.map(([title, summary, score], i) => proj(`${id}-p${i}`, title, summary, score)),
    endorsements: [{ id: `${id}-e1`, mentor: bootcamp === "UI/UX Design" ? "Mentor Laras" : "Mentor Dika", quote: "Cepat menangkap arahan dan teliti pada detail.", visible: true }],
    readiness: { cv: true, linkedin: true, interview: false },
  });
  return [
    mk("t1", "Salsa Maharani", "SM", "UI/UX Design", "Batch 23", "Bandung",
      [sk("Figma", 3, "Project 1 (skor 86/100)"), sk("Wireframing", 3, "Project 1 (skor 86/100)"), sk("Prototyping", 2, "Project 2 (skor 80/100)"), sk("Riset user", 3, "Studi kasus final (skor 84/100)"), sk("Design system", 2, "Project 2 (skor 80/100)")],
      [["Redesign Aplikasi Donasi", "Alur donasi 5 langkah menjadi 3 langkah.", 86], ["Studi Kasus Onboarding Fintech", "Riset 8 pengguna dan 2 putaran uji kegunaan.", 84]]),
    mk("t2", "Raka Firmansyah", "RF", "UI/UX Design", "Batch 24", "Jakarta",
      [sk("Figma", 4, "Project akhir (skor 92/100)"), sk("Wireframing", 3, "Project 1 (skor 85/100)"), sk("Prototyping", 4, "Project akhir (skor 92/100)"), sk("Usability testing", 2, "Latihan modul Usability Testing"), sk("Design system", 3, "Project 2 (skor 88/100)")],
      [["Design System Marketplace UMKM", "Komponen dan token untuk 40+ layar.", 88], ["Prototipe Aplikasi Reservasi Gym", "Prototipe interaktif dengan animasi mikro.", 92]]),
    mk("t3", "Nabila Kusuma", "NK", "UI/UX Design", "Batch 22", "Yogyakarta",
      [sk("Figma", 2, "Project 1 (skor 75/100)"), sk("Wireframing", 2, "Project 1 (skor 75/100)"), sk("Riset user", 2, "Studi kasus final (skor 74/100)")],
      [["Redesign Situs Perpustakaan Kota", "Penataan ulang navigasi dan pencarian.", 75]]),
    mk("t4", "Dimas Hartono", "DH", "Digital Marketing", "Batch 25", "Surabaya",
      [sk("SEO", 3, "Latihan SEO On-page (skor 88/100)"), sk("Copywriting", 2, "Tugas 3 (skor 80/100)"), sk("Content strategy", 3, "Tugas 4 (skor 86/100)"), sk("Meta Ads", 3, "Simulasi campaign (skor 85/100)"), sk("Analisis campaign", 2, "Simulasi campaign (skor 80/100)")],
      [["Strategi Konten Brand Skincare Lokal", "Kalender konten 60 hari dan rencana iklan.", 86], ["Simulasi Campaign Promo Gajian", "Anggaran fiktif Rp15 juta dengan evaluasi mingguan.", 85]]),
    mk("t5", "Mutiara Handayani", "MH", "Digital Marketing", "Batch 24", "Jakarta",
      [sk("SEO", 2, "Latihan SEO On-page (skor 78/100)"), sk("Copywriting", 4, "Tugas akhir (skor 94/100)"), sk("Content strategy", 3, "Tugas 4 (skor 87/100)"), sk("Meta Ads", 2, "Simulasi campaign (skor 79/100)")],
      [["Rangkaian Email Onboarding Aplikasi Belajar", "Lima email dengan uji A/B subjek.", 94]]),
    mk("t6", "Arif Setiawan", "AS", "Data Analyst", "Batch 25", "Semarang",
      [sk("SQL", 3, "Project akhir (skor 86/100)"), sk("Excel", 4, "Penilaian modul Excel Lanjutan (skor 95/100)"), sk("Python", 2, "Project 2 (skor 78/100)"), sk("Visualisasi data", 3, "Project akhir (skor 85/100)"), sk("Statistik", 3, "Ujian modul Statistik (skor 88/100)"), sk("Storytelling data", 2, "Presentasi final project")],
      [["Dashboard Operasional Logistik", "Dashboard keterlambatan kiriman per rute.", 85], ["Prediksi Stok Gudang dengan Python", "Peramalan permintaan 4 minggu.", 78]]),
  ];
}

/** Akun Dibimbing di luar bootcamp (peserta event, pengguna VOD): tanpa skill terverifikasi, project dinilai, atau endorsement. */
export function outsideTalent(): Base[] {
  const mk = (id: string, name: string, initials: string, bootcamp: Bootcamp, city: string): Base => ({
    id, name, initials, bootcamp, batch: "", city,
    isBootcamp: false,
    status: "lulus",
    openToBeFound: true,
    skillTarget: 0,
    skills: [],
    projects: [],
    endorsements: [],
    readiness: { cv: true, linkedin: true, interview: false },
  });
  return [
    mk("o1", "Farhan Maulana", "FM", "Data Analyst", "Jakarta"),
    mk("o2", "Citra Anggraini", "CA", "UI/UX Design", "Bandung"),
    mk("o3", "Yoga Prasetyo", "YP", "Digital Marketing", "Surabaya"),
    mk("o4", "Intan Permatasari", "IP", "Data Analyst", "Yogyakarta"),
    mk("o5", "Bima Saputra", "BS", "UI/UX Design", "Jakarta"),
  ];
}
