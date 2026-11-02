# Dibimbing Career Hub: Case Study

**Merancang job portal yang menjawab setiap lamaran, dan mengubah penolakan menjadi rencana belajar.**

> **Cara memakai dokumen ini.** Bagian 1-9 dan 11-12 sudah terisi dari desk research dan keputusan desain. Bagian 10 (hasil validasi) dan bagian gambar/screenshot ditandai **[Isi setelah ...]** karena bergantung pada pekerjaan yang belum dilakukan. Jangan menulis angka hasil test sebelum test benar-benar dijalankan. Semua persona di dokumen ini adalah hipotesis dari desk research sampai kamu memvalidasinya lewat wawancara.

---

## 1. Ringkasan singkat (TL;DR)

Dibimbing menjanjikan penyaluran kerja kepada ratusan hiring partner, tapi pengalaman setelah lulus masih tercecer di email, WhatsApp, dan acara showcase. Saya merancang prototype job portal tertutup untuk student Dibimbing dengan dua ide utama:

1. **Skill Passport.** Profil kemampuan yang terisi dari proses belajar di bootcamp, sehingga student melamar dengan bukti, bukan klaim.
2. **Feedback Loop.** Setiap lamaran punya status dan tenggat respons yang terlihat. Saat partner menutup lamaran, ia memilih tag alasan dalam satu klik, dan alasan itu otomatis menjadi roadmap belajar untuk student.

Hasilnya adalah prototype responsive web untuk 3 role (student, hiring partner, admin Dibimbing) dengan ±31 layar utama.

---

## 2. Project snapshot

| | |
|---|---|
| Klien/konteks | Dibimbing (proyek konsep, bukan proyek klien resmi) |
| Peran | UI/UX Designer (riset, strategi, UI, prototyping) |
| Platform | Responsive web, mobile-first untuk student |
| Role pengguna | Student/alumni, hiring partner, admin Dibimbing |
| Tool | Figma |
| Cakupan | Prototype klikable dengan mock data. Tidak ada fitur yang berfungsi. |
| Dokumen pendamping | PRD (`dibimbing-career-hub-prd.md`) |

---

## 3. Konteks dan masalah

### 3.1 Tentang Dibimbing

Dibimbing adalah penyedia bootcamp online di Indonesia. Di halaman programnya, mereka menyebut layanan Job Connect yang mencakup konsultasi karier dan portfolio 1-on-1, review CV dan LinkedIn, latihan interview, Talent Showcase, dan penempatan lewat 840+ hiring partner. Di beberapa halaman angkanya tertulis 1.100+ partner, jadi saya memakai istilah "ratusan hiring partner" dalam dokumen ini. Dibimbing juga mengklaim 96% alumni mendapat kerja. Ini angka dari materi pemasaran mereka sendiri dan belum saya verifikasi independen.

Ada tier lebih tinggi yang disebut Job Connect Plus, yang menurut FAQ mereka mencakup fasilitas tambahan, termasuk program penempatan.

### 3.2 Masalah yang saya lihat

Dari testimoni dan review publik, ada dua tanda bahwa proses setelah lulus belum terpusat:

- Seorang alumni menceritakan bahwa setelah bootcamp beberapa HR menghubunginya lewat email dan WhatsApp. Artinya hubungan student dan partner terjadi di luar satu platform.
- Sebuah review di Course Report menyebut Talent Showcase terasa kurang terorganisir dan bisa distruktur lebih baik agar lulusan mendapat paparan yang lebih bermakna ke hiring partner.

Di tingkat industri, masalahnya lebih besar. Survei LinkedIn (dikutip Bisnis.com, Januari 2025) menemukan **59% pencari kerja di Indonesia pernah di-ghosting**. Sekitar **43%** yang mengirim lebih banyak lamaran dari biasanya tetap tidak mendapat balasan. Rata-rata profesional menghabiskan hingga 4 jam per minggu untuk 5 lamaran. Di sisi rekruter, **80%** menerima lebih banyak lamaran dibanding tahun sebelumnya dan **29%** menghabiskan 3-5 jam per hari menyeleksi, tapi melaporkan tidak ada yang benar-benar memenuhi kualifikasi.

Kedua pihak sama-sama lelah: kandidat tidak tahu nasib lamarannya, rekruter tenggelam dalam lamaran yang kurang relevan. Salah satu penyebab minimnya feedback, menurut artikel loker.id, adalah banyak perusahaan belum punya sistem terstruktur untuk memberi feedback, tanpa pedoman jelas soal bagaimana dan kapan memberikannya.

### 3.3 Problem statement

> Student bootcamp Dibimbing yang melamar lewat berbagai kanal tidak punya kepastian status dan tidak tahu apa yang harus diperbaiki saat ditolak, sementara hiring partner kesulitan menilai kemampuan kandidat dan tidak punya cara ringan untuk memberi feedback.

---

## 4. Riset

### 4.1 Pendekatan

Karena proyek ini konsep, riset utama adalah desk research dan benchmark kompetitor. Validasi lewat wawancara dan usability test direncanakan di bagian 10.

**Metode yang sudah dilakukan:**
- Telaah halaman program dan testimoni Dibimbing.
- Telaah ulasan alumni di Course Report.
- Benchmark 5 portal: Jobstreet, Glints, Kalibrr, Dealls, LinkedIn (dan KitaLulus sebagai pembanding segmen).
- Telaah data survei soal ghosting dan beban rekruter.

### 4.2 Benchmark kompetitor

| Platform | Positioning | Fitur menonjol | Celah untuk konteks Dibimbing |
|---|---|---|---|
| **Jobstreet** | Mass market, terbesar | Lamar cepat (Express), filter gaji, review perusahaan, rekomendasi berbasis AI | Volume tinggi berarti persaingan pelamar sangat ketat |
| **Glints** | Gen Z, startup dan tech | Lamar sekali tap, ExpertClass dan Academy | Belajar dan melamar masih terpisah |
| **Kalibrr** | Profesional muda, lowongan terkurasi | Matching AI, skill assessment, rekomendasi AI untuk deskripsi pengalaman | Skill dinilai lewat tes sekali, bukan dari proses belajar |
| **Dealls** | Fresh graduate | AI CV review, mentoring, transparansi gaji | Mentoring generik, tidak terhubung ke lamaran tertentu |
| **LinkedIn** | Networking profesional | Fitur job match skill vs lowongan, Easy Apply | Bukan ekosistem tertutup |
| **KitaLulus** | Pasar luas termasuk non-white collar | Skala dan jangkauan | Segmen berbeda |

### 4.3 Insight dari benchmark

1. **AI matching, review CV, quick apply, dan mock interview sudah jadi standar.** Fitur seperti itu tidak membedakan. Kalau solusi saya hanya "AI CV checker", tidak ada alasan memakai portal baru.
2. **Tidak ada yang menyambungkan alasan penolakan ke materi belajar.** Dari riset ini saya tidak menemukan portal Indonesia yang melakukannya secara otomatis. (Catatan: ini hasil pencarian terbatas, bukan audit menyeluruh. Verifikasi manual sebelum mengklaim sebagai "yang pertama".)
3. **Dibimbing punya dua keunggulan yang tidak dimiliki portal umum:**
   - Data belajar nyata: skor project, penilaian mentor, progres modul.
   - Hubungan kemitraan tertutup dengan partner, sehingga aturan main (misalnya kewajiban memberi alasan) bisa disepakati.

### 4.4 Peluang

| Pihak | Kebutuhan yang belum terpenuhi | Peluang desain |
|---|---|---|
| Student | Kepastian status dan alasan penolakan | Tracker + tenggat respons + feedback terstruktur |
| Student | Arah perbaikan konkret | Roadmap dari tag alasan |
| Partner | Kandidat yang mudah dinilai | Passport dengan bukti |
| Partner | Cara ringan memberi feedback | Tag 1 klik |
| Dibimbing | Visibilitas performa penyaluran | Dashboard admin dan analytics alasan penolakan |
| Dibimbing | Sinyal untuk kurikulum | Agregasi alasan penolakan per bootcamp |

### 4.5 How Might We

- Bagaimana kami membuat student selalu tahu posisi lamarannya tanpa harus bertanya?
- Bagaimana kami membuat partner memberi alasan penolakan tanpa menambah beban berarti?
- Bagaimana kami mengubah penolakan menjadi langkah belajar berikutnya, bukan titik berhenti?
- Bagaimana kami membantu partner menilai kemampuan kandidat dengan cepat dan percaya pada buktinya?

---

## 5. Proto-persona (hipotesis, belum divalidasi)

### Rani, 24, alumni bootcamp Data Analyst (student)
- **Situasi:** lulus 2 bulan lalu, sudah mengirim 20+ lamaran lewat berbagai portal, hanya 3 yang membalas.
- **Kebutuhan:** tahu hasil lamaran, tahu apa yang kurang, tidak merasa sendirian.
- **Frustrasi:** menunggu tanpa kabar, tidak tahu apakah masalahnya CV, skill, atau cuma tidak cocok.
- **Perangkat:** hampir seluruhnya ponsel.

### Dimas, 31, HR Talent Acquisition di perusahaan menengah (hiring partner)
- **Situasi:** menangani belasan posisi sekaligus, ratusan lamaran masuk, hanya sebagian kecil relevan.
- **Kebutuhan:** menyaring cepat, percaya pada bukti kemampuan, tidak menulis feedback panjang.
- **Frustrasi:** CV yang klaimnya tidak terbukti, tekanan untuk membalas semua kandidat.
- **Perangkat:** laptop, kadang ponsel untuk tindakan cepat.

### Sinta, 28, Talent Support di Dibimbing (admin)
- **Situasi:** mendampingi alumni dan menjaga hubungan dengan partner.
- **Kebutuhan:** melihat partner mana yang lambat, melihat pola alasan penolakan, memberi masukan ke tim kurikulum.
- **Frustrasi:** data penyaluran tersebar, sulit menunjukkan dampak.
- **Perangkat:** laptop.

---

## 6. Konsep solusi

### 6.1 Prinsip pemersatu

**Setiap lamaran harus berakhir dengan jawaban, dan setiap jawaban harus mengarah ke langkah berikutnya.**

### 6.2 Skill Passport

Profil yang terisi otomatis dari proses belajar: skill dengan level 1-4 beserta sumber buktinya (skor project, penilaian mentor), project unggulan, endorsement mentor, dan kesiapan karier. Student mengontrol apa yang terlihat oleh partner. Tujuannya mengganti "klaim di CV" dengan "bukti dari proses belajar".

### 6.3 Feedback Loop

Alurnya:

1. **Lamar dan lihat tenggat.** Setiap lamaran punya timeline dan tenggat respons (asumsi 7 hari) yang terlihat.
2. **Partner menutup dengan tag.** Saat menutup lamaran, partner wajib memilih 1-3 tag dari taksonomi. Target waktu ≤ 15 detik.
3. **Student menerima Feedback card.** Isinya "yang perlu diperkuat" dalam bahasa aksi, bukan penilaian pribadi.
4. **Roadmap.** Tag dipetakan ke modul, sesi mentor, project latihan, atau mock interview.
5. **Lamar ulang.** Setelah roadmap selesai dan mentor memperbarui penilaian, Passport mendapat badge "Improved" dan student bisa melamar ulang.

### 6.4 Pelengkap

- **Skill match transparan.** Detail lowongan membandingkan requirement dengan Passport: Terpenuhi, Hampir, atau Belum terlihat.
- **Gap Insight.** Pola penolakan lintas lamaran, hanya muncul setelah ≥ 2 data.
- **Talent search ringan.** Partner bisa menemukan dan mengundang student yang membuka diri untuk ditemukan.
- **Insight untuk kurikulum.** Admin melihat alasan penolakan teratas per bootcamp, sehingga loop menutup di level institusi.

![Diagram alur Feedback Loop dan Skill Passport]

**[Isi setelah desain jadi: ekspor diagram alur dari Figma/FigJam dan taruh di sini.]**

---

## 7. User flow dan arsitektur informasi

### 7.1 Flow student (skenario utama)
Login → lihat beranda dan Passport → buka detail lowongan (requirement vs Passport) → lamar → pantau di tracker → terima Feedback card → buka roadmap → selesaikan item → badge Improved → lamar ulang.

### 7.2 Flow hiring partner
Buat lowongan dengan requirement bertaksonomi → lolos moderasi → kandidat masuk pipeline → buka Passport kandidat → undang interview atau tutup dengan tag.

### 7.3 Flow admin
Overview → cek kepatuhan SLA partner → kirim pengingat → buka analytics penolakan → ekspor insight untuk tim kurikulum → edit mapping tag ke modul.

### 7.4 Sitemap ringkas

- **Student:** Beranda, Lowongan, Lamaran saya (tracker, detail), Perkembangan (Gap Insight, Roadmap), Profil (Passport, pengaturan).
- **Partner:** Dashboard, Lowongan, Kandidat (pipeline, detail), Talent search, Pengaturan.
- **Admin:** Overview, Partner, Moderasi lowongan, Taksonomi dan mapping, Analytics penolakan, Antrean follow up.

Detail lengkap ada di PRD bagian 8 dan 13.

---

## 8. Prinsip desain dan keputusan penting

### 8.1 Lima prinsip desain

1. **Tidak ada lamaran yang menggantung.**
2. **Satu klik untuk partner, tindakan nyata untuk student.**
3. **Bukti di atas klaim.**
4. **Kalah itu mengajar, bukan menghukum.**
5. **Perusahaan kecil jangan dipersulit.**

### 8.2 Keputusan desain dan trade-off

| Keputusan | Alternatif yang dipertimbangkan | Alasan memilih | Trade-off yang diterima |
|---|---|---|---|
| Menampilkan "4 dari 6 skill terpenuhi" + daftar gap, bukan persen match | Skor persentase | Persen yang rendah bisa menurunkan motivasi, daftar skill memberi arah | Kurang ringkas dibanding satu angka |
| Tag alasan wajib saat menutup lamaran | Feedback teks bebas, atau opsional | Teks bebas memberatkan partner, opsional membuat loop bolong | Butuh dukungan kebijakan kemitraan |
| Tag dibatasi 1-3 dan taksonomi tertutup | Daftar tag terbuka | Mencegah tag berlebihan dan atribut personal yang bias | Kurang fleksibel untuk kasus unik |
| Gap Insight baru muncul setelah ≥ 2 data | Tampil sejak 1 lamaran | Menghindari kesimpulan dari satu titik data | Student baru melihat empty state dulu |
| Skor kepatuhan partner hanya terlihat di admin | Tampilkan ke student | Menjaga hubungan dengan partner dan fokus student pada tindakan, bukan menyalahkan | Student tidak melihat transparansi sisi partner |
| Tombol "Minta Talent Support follow up" maksimal 1 kali per lamaran | Tak terbatas | Melindungi kapasitas admin | Student tidak bisa mendesak berkali-kali |
| Passport parsial untuk student yang belum lulus | Hanya untuk lulusan | Memungkinkan melamar magang selama belajar | Passport tidak seragam kuat antar student |
| Penolakan non-kompetensi tidak memicu roadmap | Selalu buat roadmap | Tidak adil menyuruh student belajar untuk alasan yang bukan kemampuan | Perlu copy yang jujur dan menenangkan |

### 8.3 Pertimbangan etika

- Taksonomi tag hanya memuat alasan terkait pekerjaan. Tidak ada tag untuk usia, gender, agama, status pernikahan, penampilan, atau atribut pribadi lain.
- Student memberi persetujuan eksplisit sebelum Passport dibagikan. Implementasi nyata perlu kajian hukum terkait UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022).

---

## 9. Desain: sorotan layar dan sistem

**[Isi setelah desain jadi: untuk tiap sorotan di bawah, taruh screenshot dan 2-3 kalimat tentang apa yang kamu ubah dan kenapa.]**

| Sorotan | Apa yang ditunjukkan | Hal yang perlu diceritakan |
|---|---|---|
| Skill Passport (S-09) | Level skill dengan bar 4 segmen + label teks, panel bukti | Kenapa level tidak hanya berupa warna |
| Detail lowongan (S-03) | Tabel requirement vs Passport | Kenapa tidak memakai persen match |
| Tracker + SLA (S-05) | Status, countdown netral | Kenapa countdown memakai bahasa netral, bukan menyalahkan perusahaan |
| Feedback card (S-06) | Tiga varian: kompetensi, non-kompetensi, faktor perusahaan | Proses menulis copy yang suportif |
| Gap Insight dan Roadmap (S-07, S-08) | Bar pola penolakan, daftar item dengan estimasi waktu | Ambang minimum 2 data dan empty state |
| Modal tutup lamaran (P-05) | Pemilih tag 1-3, catatan 140 karakter | Cara menjaga waktu ≤ 15 detik |
| Pipeline kanban (P-03) | Kartu dengan indikator SLA | Indikator tidak mengandalkan warna saja |
| Analytics penolakan (A-05) | Alasan teratas per bootcamp | Cara data ini bermanfaat bagi tim kurikulum |

### Design system
- Token (warna, tipografi, spacing, radius) sebagai Figma variables, 3 breakpoint (360, 768, 1440).
- Komponen domain: Skill Passport card, Status timeline, SLA countdown, Reason tag selector, Feedback card, Requirement match table.
- Aksesibilitas: kontras ≥ 4.5:1, target sentuh ≥ 44 px, makna tidak bergantung pada warna saja.

### Panduan UX writing untuk feedback
Subjek kalimat adalah portfolio atau skill, bukan orang. Setiap masalah diikuti satu langkah aksi. Contoh arah: "Visualisasi data belum cukup terlihat di portfolio" dan bukan "Kamu kurang bisa visualisasi data".

---

## 10. Validasi

### 10.1 Rencana

| Kegiatan | Peserta | Tujuan |
|---|---|---|
| Wawancara | ≥ 5 student/alumni, ≥ 3 HR/partner, ≥ 2 Talent Support | Validasi proto-persona dan kemauan partner memakai tag wajib |
| Usability test, student | 5 orang | 6 task inti |
| Usability test, partner | 3 orang | 4 task inti |
| Usability test, admin | 2 orang | 3 task inti |

**Task student:** (1) lihat bukti satu skill di Passport, (2) cari lowongan dan nilai apakah cocok, (3) lamar, (4) cari status lamaran dan jelaskan sampai kapan harus menunggu, (5) baca Feedback card dan jelaskan langkah berikutnya, (6) mulai satu item roadmap dan lamar ulang.

**Task partner:** (1) buat lowongan dengan requirement, (2) cari kandidat yang tenggatnya paling dekat, (3) buka Passport dan nilai kandidat, (4) tutup lamaran dengan tag alasan.

**Task admin:** (1) temukan partner dengan kepatuhan paling rendah dan kirim pengingat, (2) temukan alasan penolakan teratas untuk bootcamp tertentu, (3) ubah mapping satu tag ke modul.

**Target:** success rate ≥ 85% per role, SUS ≥ 75, median waktu tutup lamaran ≤ 15 detik, pemahaman status dan SLA ≥ 4 dari 5 student, penilaian feedback "membantu dan tidak menjatuhkan" ≥ 4 dari 5 student.

### 10.2 Hasil

**[Isi setelah usability test dijalankan. Jangan mengisi angka sebelum test benar-benar dilakukan.]**

| Metrik | Target | Hasil |
|---|---|---|
| Success rate student | ≥ 85% | [isi] |
| Success rate partner | ≥ 85% | [isi] |
| Success rate admin | ≥ 85% | [isi] |
| Waktu median tutup lamaran | ≤ 15 detik | [isi] |
| SUS | ≥ 75 | [isi] |

### 10.3 Temuan dan perubahan desain

| Temuan | Severity | Perubahan | Sebelum/sesudah |
|---|---|---|---|
| [isi] | [kritis/mayor/minor] | [isi] | [gambar] |

### 10.4 Kutipan partisipan
**[Isi 3-5 kutipan paling informatif dari sesi test.]**

---

## 11. Keterbatasan

- **Prototype tidak bisa membuktikan perubahan perilaku partner.** Kami hanya bisa menguji apakah alur dan copy dipahami. Apakah partner sungguh mematuhi SLA dan tag wajib adalah asumsi bisnis yang baru bisa diuji lewat pilot nyata.
- **Ketersediaan data Passport belum dipastikan.** Desain mengasumsikan skor project dan penilaian mentor tersedia dan seragam di sistem Dibimbing. Prototype memakai mock data.
- **Benchmark kompetitor berasal dari sumber sekunder** (artikel dan halaman publik), bukan pengujian langsung tiap platform. Klaim fitur kompetitor perlu dicek ulang sebelum dipublikasikan.
- **Angka klaim Dibimbing** (jumlah partner, persentase alumni bekerja) berasal dari materi pemasaran mereka dan bervariasi antar halaman.
- **Persona masih hipotesis** sampai wawancara dilakukan.
- **Statistik ghosting** berasal dari survei LinkedIn yang dikutip media, bukan data Dibimbing sendiri.

---

## 12. Refleksi dan langkah berikutnya

**Yang saya pelajari (isi dengan pengalaman pribadimu setelah proyek selesai):** pertanyaan pemandu yang bisa kamu jawab: bagian mana dari alur yang paling berubah setelah user testing? keputusan desain mana yang paling sulit dipertahankan? apa yang akan kamu kerjakan berbeda?

**Langkah berikutnya bila proyek dilanjutkan:**
1. Pilot dengan 3-5 hiring partner untuk menguji kepatuhan SLA dan tag.
2. Memetakan kebutuhan data Passport bersama tim LMS dan tim Talent Support.
3. Mengembangkan Mentor-Checked Apply dan Digital Talent Showcase penuh.
4. Menambah notifikasi multi-kanal (email dan WhatsApp).

---

## Lampiran A: Sumber

**Dibimbing**
- Halaman bootcamp Dibimbing (Human Resources, Data Science, Digital Marketing, Business Analyst, Backend Development, dan lainnya): https://dibimbing.id/en/layanan/bootcamp
- Ulasan Dibimbing di Course Report: https://www.coursereport.com/schools/dibimbing
- Liputan Talent Connect Dibimbing di Mojok: https://mojok.co/kilas/talent-connect-dibimbingid-beri-pemahaman-dunia-kerja-sebelum-kejar-karier/amp/

**Ghosting dan beban rekruter**
- Bisnis.com, "70% Masyarakat RI Aktif Cari Kerja, Mayoritas Ditinggalkan Tanpa Kepastian" (16 Januari 2025): https://teknologi.bisnis.com/read/20250116/84/1832114/70-masyarakat-ri-aktif-cari-kerja-mayoritas-ditinggalkan-tanpa-kepastian
- Indotelko, "Waspada, ghosting dari perekrut tenaga kerja" (20 Januari 2025): https://www.indotelko.com/read/1737327468/waspada-ghostingdari-perekrut-tenaga-kerja
- Loker.id, "Kenapa Banyak Rekruter di Indonesia Jarang Transparan Memberikan Feedback Hasil Interview?": https://www.loker.id/artikel/kenapa-banyak-rekruter-di-indonesia-jarang-transparan-memberikan-feedback-hasil-interview

**Kompetitor**
- Industry.co.id, "5 Website Terbaik untuk Cari Lowongan Kerja": https://www.industry.co.id/read/155874/5-website-terbaik-untuk-cari-lowongan-kerja-jobstreet-glints-linkedin-kalibrr-dan-indeed
- Dealls, "14 Job Portal Indonesia": https://dealls.com/pengembangan-karir/job-portal-indonesia
- Kalibrr AI Recommendation (Kontan/MomsMoney): https://momsmoney.kontan.co.id/news/kalibrr-hadirkan-fitur-rekomendasi-ai-begini-cara-menggunakannya
- Jobstreet by SEEK berbasis AI (Infokomputer): https://infokomputer.grid.id/read/123970129/platform-jobstreet-by-seek-diperbarui-kini-dibekali-teknologi-ai
- CareerBoom, "Best Job Search Sites in Indonesia for 2026": https://careerboom.ai/en/us/blog/tool-review/best-indonesia-job-platforms
- Kiakrikil, "10 Website Cari Kerja Terbaik 2026": https://kiakrikil.com/?p=2308

*Catatan sumber: beberapa artikel perbandingan di atas ditulis oleh pihak yang punya kepentingan (misalnya Dealls menulis tentang Dealls, CareerBoom menjual produk sendiri). Perlakukan sebagai indikasi, bukan fakta mutlak.*
