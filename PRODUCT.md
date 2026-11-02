# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Responsive web. Student mobile-first (360 px) dan desktop (1440 px). Hiring partner desktop-first, mobile hanya untuk daftar kandidat dan modal tutup lamaran. Admin desktop, tetap terbaca di 768 px.

## Stack

Next.js (App Router) + Tailwind CSS. Dipilih user, menggantikan asumsi "Figma" di PRD §8.4 sebagai medium prototype klikable.

- Tanpa backend, database, API route, atau autentikasi sungguhan. Login hanya layar yang langsung meneruskan.
- Mock data berupa modul TypeScript/JSON statis di repo, menjadi "seed".
- State prototype hidup di client (store global, misalnya Zustand) dan disimpan ke `localStorage` agar alur bertahan saat refresh. Reset dilakukan lewat Demo Panel.
- Target deploy belum diputuskan. Vercel adalah opsi alami untuk membagikan link usability test, tapi belum dikonfirmasi.

## Users

| Role | Siapa | Job-to-be-done | Device |
|---|---|---|---|
| **Student/alumni** (primer) | Peserta atau lulusan bootcamp Dibimbing, umumnya fresh graduate atau career switcher | "Bantu saya melamar ke tempat yang realistis, tahu hasilnya, dan tahu apa yang harus diperbaiki kalau gagal" | Hampir selalu ponsel |
| **Hiring partner** (primer) | HR/Talent Acquisition di perusahaan mitra Dibimbing, menangani belasan posisi sekaligus | "Beri saya kandidat yang relevan dan terbukti, tanpa saya harus menulis feedback panjang untuk setiap yang gagal" | Laptop, kadang ponsel untuk tindakan cepat |
| **Admin Dibimbing** (sekunder) | Talent Support / Career Services, sebagian tim kurikulum | "Pastikan loop berjalan, partner patuh, dan tunjukkan pola penolakan ke tim kurikulum" | Laptop |

Audiens keempat untuk prototype ini: **fasilitator usability test dan presenter demo**. Mereka menjalankan alur lintas role lewat Demo Panel dan bukan pengguna produk.

Proto-persona (hipotesis, belum divalidasi): Rani, 24, alumni Data Analyst (student); Dimas, 31, HR Talent Acquisition (partner); Sinta, 28, Talent Support (admin). Sumber: `docs/dibimbing-career-hub-case-study.md` §5.

## Product Purpose

Dibimbing Career Hub adalah job portal tertutup untuk student/alumni bootcamp Dibimbing dan hiring partner-nya. Student melamar dengan bukti skill yang terverifikasi dari proses belajar. Partner wajib merespons dalam tenggat yang terlihat. Setiap lamaran yang ditutup membawa alasan terstruktur yang otomatis menjadi rencana belajar.

**Prinsip pemersatu: setiap lamaran harus berakhir dengan jawaban, dan setiap jawaban harus mengarah ke langkah berikutnya.**

Deliverable-nya adalah **prototype UI/UX klikable dengan mock data, untuk demo dan usability test**. Tidak ada fitur yang benar-benar berfungsi. Keberhasilan prototype diukur lewat usability test (PRD §2.2): task success ≥ 85% per role, SUS ≥ 75, median waktu partner menutup lamaran dengan tag ≤ 15 detik, ≥ 4 dari 5 student paham status dan countdown SLA tanpa dijelaskan, dan ≥ 4 dari 5 student menilai feedback "membantu dan tidak menjatuhkan".

## Positioning

Career Hub adalah **evolusi dari portal yang sudah ada, jobs.dibimbing.id**. Portal itu saat ini berupa etalase lowongan publik: kartu lowongan dengan tag skill, tombol "Daftar Sekarang", tanpa login, tanpa status lamaran, tanpa feedback. Career Hub menambahkan apa yang terjadi *setelah* melamar.

Portal publik (Jobstreet, Glints, Kalibrr, Dealls, LinkedIn) bersaing di volume dan kecepatan melamar, dan AI matching, quick apply, serta review CV sudah menjadi standar. Career Hub tidak bersaing di sana. Mekanisme yang tidak bisa ditiru portal umum dengan jujur:

1. **Skill Passport.** Skill bersumber dari skor project dan penilaian mentor bootcamp, bukan input bebas atau tes sekali jalan.
2. **Feedback Loop.** Hubungan kemitraan tertutup memungkinkan aturan main: tenggat respons (SLA) dan tag alasan wajib saat menutup lamaran. Tag itu dipetakan ke saran arah belajar (modul, sesi mentor, project latihan) tanpa pelacakan progres, lalu student bisa melamar ulang setelah masa tunggu dari partner.

Benchmark rasa: "ada yang menemani sampai dapat kerja" (#TillYouMakeIt), yaitu kepastian status seperti tracking paket, tapi untuk karier.

## Operating Context

- **Bahasa:** Bahasa Indonesia, nada santai-profesional. Istilah teknis (Passport, SLA) selalu disertai penjelasan satu kalimat saat pertama kali muncul.
- **Alur inti:** lamar → status dan tenggat terlihat → partner menutup dengan tag → Feedback card → arah belajar → lamar ulang setelah masa tunggu.
- **SLA:** respons pertama 7 hari kalender sejak Terkirim, dan keputusan 7 hari setelah interview selesai. Bila tenggat lewat, status di sisi student menjadi "Belum ada respons" dan student bisa meminta Talent Support follow up (maks. 1× per lamaran).
- **Status lamaran:** Terkirim, Sedang direview, Interview, Penawaran, Diterima, Ditutup (+ "Belum ada respons" sebagai turunan SLA).
- **Level skill:** 1 Dasar, 2 Menengah, 3 Mahir, 4 Siap Produksi.
- **Match:** "4 dari 6 skill wajib terpenuhi" + daftar gap. Per requirement: Terpenuhi, Hampir, Belum terlihat. **Tidak pernah dalam bentuk persentase.**
- **Taksonomi tag alasan (6 kategori):** Skill teknis, Portfolio, Komunikasi, Pengalaman, Kecocokan non-kompetensi, Faktor perusahaan. Hanya tiga kategori pertama (dan Pengalaman sebagian) yang memicu saran arah belajar.
- **Skenario uji (PRD Epic 10):** (A) lamar → tutup dengan tag → arah belajar → lamar ulang; (B) SLA terlewat → follow up Talent Support; (C) penolakan non-kompetensi.
- **Fasilitas Dibimbing yang dirujuk:** Job Connect, Job Connect Plus (sesi mentor ditampilkan sebagai CTA tanpa alur pembayaran).

## Capabilities and Constraints

**Cakupan layar** (PRD §13, ±31 frame utama + state):
- Student (mobile + desktop): S-01 Onboarding + Passport, S-02 Beranda/job feed, S-03 Detail lowongan, S-04 Konfirmasi apply, S-05 Tracker, S-06 Detail lamaran + Feedback card, S-07 Perkembangan (Gap Insight + arah belajar), S-09 Passport privat/publik.
- Hiring partner (desktop, P-03 dan P-05 juga mobile): P-01 Dashboard, P-02 Buat lowongan (wizard 4 langkah: Dasar, Skill, Seleksi, Tinjau; titik awal kosong/template per bidang/duplikat/draft; perkiraan talent cocok; pratinjau student; layar terkirim; revisi dari catatan moderasi), P-03 Pipeline kanban, P-04 Detail kandidat, P-05 Modal tutup lamaran, P-06 Talent search (filter kriteria, isi otomatis dari lowongan, skill "hampir" 1 level di bawah, shortlist, profil talent, pratinjau CV).
- Admin (desktop): A-01 Overview, A-02 Partner + skor SLA, A-03 Moderasi lowongan, A-03b Daftar lowongan (semua status: aktif/tayang, menunggu, revisi, ditolak; filter partner dan bidang, detail dengan riwayat moderasi), A-04 Mapping tag ke modul, A-05 Analytics penolakan + antrean follow up.

**Demo Panel (wajib, khusus prototype).** Karena tidak ada backend, aksi pihak lain dan perjalanan waktu disimulasikan lewat panel kontrol di luar produk. Panel ini bukan bagian dari produk yang diuji.

| Grup | Aksi |
|---|---|
| **Role** | Pindah ke Student / Hiring partner / Admin dengan satu klik; tiap role mendarat di halaman utamanya (PRD US10.2). State lintas role tetap sama: lamaran yang ditutup partner muncul di tracker student. |
| **Persona** | Ganti student aktif: Rani (Data Analyst), student UI/UX Design, student Digital Marketing (nama dua terakhir mock, label sintetis). Toggle "belum lulus" untuk Passport parsial. |
| **Skenario** | Mulai Skenario A / B / C: menyiapkan state awal, mengarahkan ke layar pertama, dan menampilkan checklist langkah dengan petunjuk "langkah berikutnya". |
| **Event mock** (berperan sebagai pihak lain) | Partner membuka lamaran · Partner mengundang interview · Partner mengirim penawaran · Partner menutup lamaran dengan preset tag (kompetensi / non-kompetensi / faktor perusahaan) · Lowongan ditutup perusahaan · Admin menyetujui lowongan · Talent Support menanggapi follow up · Kandidat baru melamar (mengisi pipeline partner). Setiap event memunculkan notifikasi in-app di role yang terkena. |
| **Waktu** | Jam demo virtual dengan tanggal awal 4 November 2026 (konsisten dengan contoh PRD "sebelum 9 Nov, 5 hari lagi"). Majukan +1 / +3 / +7 hari untuk menggerakkan countdown SLA ke state mendekati tenggat dan lewat tenggat. Kembalikan ke hari ini. |
| **State layar** | Paksa state halaman aktif: normal, kosong, loading (skeleton), gagal kirim/offline (draft "Belum terkirim. Coba lagi."). |
| **Reset** | Reset skenario aktif, atau reset semua data ke seed. |
| **Log** | Riwayat singkat event yang sudah dipicu beserta waktu virtualnya. |

Visibilitas Demo Panel: tersembunyi di balik tombol kecil di pojok dan shortcut keyboard. Bisa dihilangkan total lewat parameter URL (`?demo=off`) agar partisipan usability test tidak terganggu, dan dimunculkan kembali dengan `?demo=on`. Preferensi ini disimpan per browser.

**Batasan tetap:**
- Tidak ada fitur fungsional: tidak ada backend, auth sungguhan, matching sungguhan, upload file sungguhan, notifikasi email/WhatsApp, atau pembayaran.
- Skor kepatuhan SLA partner **hanya** terlihat di layar admin. Tidak pernah di layar student atau partner mana pun.
- Taksonomi tag tidak boleh memuat usia, gender, agama, status pernikahan, penampilan, atau atribut personal yang dilindungi.
- Gap Insight hanya menampilkan pola bila ada ≥ 2 lamaran ditutup dengan tag kompetensi. Di bawahnya, tampilkan empty state edukatif.
- Modal tutup lamaran: 1-3 tag, catatan opsional ≤ 140 karakter dengan penghitung, tombol aktif hanya setelah ≥ 1 tag dipilih, selesai ≤ 3 klik dari kartu kandidat.
- Data mock minimum: 3 student (5-8 skill, 2-3 project, 1-2 endorsement), ≥ 6 lowongan dengan kombinasi match tinggi/sedang/rendah, skenario "3 dari 4 penolakan terkait Visualisasi data".
- Hanya mode terang. Mode gelap dan bahasa Inggris di luar cakupan.

**Talent search dan profil:** data profil student (headline, tentang, pengalaman, pendidikan, keahlian, preferensi kerja, CV) disimpan Dibimbing. Partner hanya melihat versi aman: email, telepon, NIK, NPWP, tanggal lahir, alamat, dan media sosial pribadi tidak pernah ditampilkan; kontak dibagikan setelah kandidat menerima undangan. Skill terverifikasi Dibimbing dibedakan dari keahlian yang diisi sendiri. Data profil Dibimbing juga mencakup akun non-bootcamp (peserta event, pengguna VOD). Mereka tetap bisa dicari dan diundang sama seperti lulusan bootcamp, tetapi hanya student bootcamp yang diberi label "Student Bootcamp" dan punya data lengkap (skill terverifikasi, project dinilai mentor, endorsement); non-bootcamp tidak diberi label apa pun dan hanya menampilkan data isian sendiri. Student bootcamp diurutkan lebih dulu. Semua filter bersifat wajib; tombol "Sertakan yang 1 level di bawah" menampilkan kandidat hampir cocok. Penawaran punya dokumen offering letter yang bisa dibaca student.

**Admin (Talent Support):** Overview (tren SLA 8 minggu, lamaran terlambat, follow up menunggu), Antrean follow up (daftar menunggu/selesai, detail kasus, catatan internal, hubungi perusahaan, pengingat SLA), Partner (daftar urut skor SLA, detail dengan tren, lowongan, lamaran terlambat, riwayat pengingat), Moderasi lowongan (antrean dengan pemeriksaan otomatis, setujui/minta revisi/tolak, riwayat keputusan), Taksonomi dan mapping (pemetaan saran belajar, skill, tag alasan yang bisa diganti namanya), Analytics (filter periode dan bidang, ekspor CSV, kepatuhan SLA per partner).

**Out of scope** (PRD §14): aplikasi native, integrasi LMS/portal lain, pembayaran, chat, penjadwalan interview, AI matching, Mentor-Checked Apply, Digital Talent Showcase penuh, pembuat CV, negosiasi gaji.

**Belum diputuskan:** target deploy; nama dua student mock selain Rani; daftar perusahaan mock (gunakan nama fiktif yang jelas, jangan memakai nama perusahaan nyata sebagai partner).

## Brand Commitments

- **Brand Dibimbing dipertahankan terbatas:** logo resmi dan hue teal saja. Tampilan dibimbing.id/jobs.dibimbing.id dinilai sudah ketinggalan zaman oleh user, jadi palet, font, bentuk, dan komponen dirancang ulang mengikuti pola UI terkini (keputusan 2 November 2026; detail di DESIGN.md). Secara produk, Career Hub tetap evolusi dari jobs.dibimbing.id. Nama produk: "Dibimbing Career Hub" (working title).
- **Kenyamanan dua audiens:** student mendapat tampilan yang hangat dan ringan (mobile-first); hiring partner dan admin mendapat workspace yang tenang, padat, dan cepat dioperasikan (desktop-first, keyboard-friendly).
- **Logo:** file logo resmi akan disediakan user dan ditaruh di `public/`. Sampai tersedia, gunakan placeholder yang jelas, jangan gambar ulang logo.
- **Slogan:** #TillYouMakeIt. Tagline situs saat ini: "Belajar dari awal, ditemenin sampe dapat kerja".
- **Suara:** santai-profesional, menemani, berorientasi aksi. Feedback penolakan mengikuti checklist PRD §11: judul netral tanpa "gagal/ditolak/sayang sekali"; subjek kalimat adalah skill/portfolio, bukan orang; setiap masalah diikuti satu langkah; maksimal 3 poin dan 1 tombol utama; tanpa emoji sedih atau ilustrasi negatif.
- Proyek konsep, bukan proyek klien resmi. Prototype tidak boleh mengklaim afiliasi resmi di luar konteks portofolio.

## Evidence on Hand

- `docs/dibimbing-career-hub-prd.md`: PRD v0.1, feature specs, flows, sitemap, entitas data, epics dan AC.
- `docs/dibimbing-career-hub-case-study.md`: konteks, benchmark, proto-persona, keputusan desain, sumber.
- Situs incumbent: dibimbing.id dan jobs.dibimbing.id (rujukan visual brand, diambil 2 November 2026).
- Statistik industri (dikutip, bukan data Dibimbing): survei LinkedIn via Bisnis.com Januari 2025, 59% pencari kerja Indonesia pernah di-ghosting.

**Tidak ada dan tidak boleh dikarang:** hasil usability test, kutipan partisipan, angka SUS, testimoni, logo perusahaan partner nyata, metrik penempatan. Angka pemasaran Dibimbing (840+/1.100+ partner, 96% alumni bekerja) belum diverifikasi; jangan tampilkan sebagai fakta di UI. Semua nama orang, perusahaan, dan angka di mock data adalah sintetis.

## Product Principles

1. **Tidak ada lamaran yang menggantung.** Di layar mana pun, student bisa menjawab "lamaran ini sedang di tahap apa dan sampai kapan".
2. **Satu klik untuk partner, tindakan nyata untuk student.** Partner memberi tag, bukan esai. Student menerima rencana belajar, bukan sekadar penolakan.
3. **Bukti di atas klaim.** Setiap skill di Passport menunjukkan sumber buktinya.
4. **Kalah itu mengajar, bukan menghukum.** Tidak ada kalimat yang menilai pribadi; setiap masalah menyebut langkah berikutnya.
5. **Perusahaan kecil jangan dipersulit.** Partner merasa dibantu, bukan diaudit. Label "pelanggar" tidak pernah muncul di sisi partner.

## Accessibility & Inclusion

Target WCAG 2.1 AA (PRD §10): kontras teks ≥ 4.5:1 (≥ 3:1 untuk teks besar), fokus terlihat pada semua elemen interaktif, makna tidak bergantung pada warna saja (status SLA dan level skill selalu disertai label teks atau jumlah segmen), target sentuh ≥ 44×44 px di mobile, label terlihat dan pesan error spesifik di setiap input. Urutan fokus keyboard harus terdokumentasi untuk modal tutup lamaran, form apply, dan form buat lowongan. Layar admin di 768 px memakai scroll horizontal di dalam kontainer tabel, bukan scroll halaman.
