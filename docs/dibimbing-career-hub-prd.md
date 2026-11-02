# Dibimbing Career Hub (working title): PRD

**Positioning:** Job portal tertutup untuk student dan alumni bootcamp Dibimbing yang menghapus ghosting lewat *Feedback Loop* dan membuktikan kemampuan lewat *Skill Passport*.

| | |
|---|---|
| Versi | 0.1 |
| Tanggal | 2 November 2026 |
| Status | Draft for review |
| Tipe deliverable | Prototype UI/UX (klikable, mock data). Bukan produk fungsional. |
| Platform | Responsive web (mobile + desktop) |
| Tool prototype | Figma (asumsi, bisa diganti) |

---

## 1. Vision

Dibimbing sudah menjual janji penyaluran kerja lewat layanan Job Connect: konsultasi karier 1-on-1, review CV dan LinkedIn, latihan interview, Talent Showcase, dan akses ke ratusan hiring partner. Tapi proses setelah student lulus masih tercecer. Dari testimoni alumni, ada yang dihubungi HR lewat email dan WhatsApp, dan ada review di Course Report yang menyebut Talent Showcase kurang terstruktur. Belum ada satu tempat di mana student melihat peluang, melamar, dan tahu nasib lamarannya.

Dibimbing Career Hub adalah job portal khusus untuk student bootcamp Dibimbing dan hiring partner-nya. Student melamar dengan bukti kemampuan yang sudah terverifikasi dari proses belajar, hiring partner mereview kandidat dengan batas waktu respons yang jelas, dan setiap lamaran yang ditutup wajib membawa alasan terstruktur yang kemudian berubah menjadi rencana belajar.

**Prinsip pemersatu: setiap lamaran harus berakhir dengan jawaban, dan setiap jawaban harus mengarah ke langkah berikutnya.**

Benchmark pengalaman: portal publik seperti Jobstreet dan Glints unggul di volume dan kecepatan melamar. Kami tidak bersaing di volume. Benchmark kualitas kami adalah rasa "ada yang menemani sampai dapat kerja" (#TillYouMakeIt, slogan Dibimbing), yaitu kepastian status seperti tracking paket, tapi untuk karier.

---

## 2. Goals dan success metrics

### 2.1 Product goals

1. Menghilangkan pengalaman "melamar lalu hilang tanpa kabar" bagi student Dibimbing.
2. Mengubah penolakan dari titik akhir menjadi input belajar yang spesifik dan bisa ditindaklanjuti.
3. Memberi hiring partner kandidat yang lebih mudah dinilai lewat bukti skill terverifikasi, tanpa menambah beban kerja yang berarti.
4. Memberi Dibimbing visibilitas atas performa penyaluran dan celah kurikulum.

### 2.2 Metrik keberhasilan prototype (diukur lewat usability test, 2 minggu setelah prototype final)

| Metrik | Target | Cara ukur |
|---|---|---|
| Task success rate, 6 task inti student | ≥ 85% | Moderated test, 5 student |
| Task success rate, 4 task inti hiring partner | ≥ 85% | Moderated test, 3 HR/partner |
| Task success rate, 3 task inti admin | ≥ 85% | Moderated test, 2 admin/Talent Support |
| Waktu median partner menutup lamaran dengan tag alasan | ≤ 15 detik | Stopwatch pada task "tutup lamaran" |
| SUS (System Usability Scale) | ≥ 75 per role | Kuesioner pasca-test |
| Student paham makna status dan countdown SLA tanpa dijelaskan | ≥ 4 dari 5 student | Pertanyaan "jelaskan layar ini dengan kata-katamu" |
| Student menilai feedback penolakan "membantu dan tidak menjatuhkan" | ≥ 4 dari 5 student, skala ≥ 4/5 | Pertanyaan pasca-task |

### 2.3 Metrik produk jika kelak diluncurkan sungguhan (target asumsi, belum ada baseline)

| Metrik | Target 90 hari pertama |
|---|---|
| Lamaran yang menerima update status dalam 7 hari | ≥ 80% |
| Lamaran ditutup yang membawa minimal 1 tag alasan | ≥ 95% |
| Student ditolak yang memulai ≥ 1 item roadmap dalam 14 hari | ≥ 40% |
| Student dengan roadmap selesai yang melamar ulang dalam 30 hari | ≥ 25% |
| Hiring partner dengan kepatuhan SLA ≥ 70% | ≥ 60% dari partner aktif |

---

## 3. Target users

| Role | Siapa | Job-to-be-done | Device dominan |
|---|---|---|---|
| **Student/alumni** (primer) | Peserta atau lulusan bootcamp Dibimbing, umumnya fresh graduate atau career switcher | "Bantu saya melamar ke tempat yang realistis, tahu hasilnya, dan tahu apa yang harus diperbaiki kalau gagal" | Mobile-first |
| **Hiring partner** (primer) | HR/Talent Acquisition di perusahaan mitra Dibimbing | "Beri saya kandidat yang relevan dan terbukti, tanpa saya harus menulis feedback panjang untuk setiap yang gagal" | Desktop-first |
| **Admin Dibimbing** (sekunder) | Tim Talent Support / Career Services, sebagian tim kurikulum | "Pastikan loop berjalan, partner patuh, dan tunjukkan pola penolakan ke tim kurikulum" | Desktop |

Catatan: persona di atas masih berupa proto-persona hasil desk research. Validasi lewat wawancara ada di Epic 12.

---

## 4. Product principles

1. **Tidak ada lamaran yang menggantung.** Setiap lamaran punya status, timeline, dan tenggat respons yang terlihat. Ujiannya: di layar mana pun, student bisa menjawab "lamaran ini sedang di tahap apa dan sampai kapan".
2. **Satu klik untuk partner, tindakan nyata untuk student.** Beban partner harus sekecil mungkin (tag, bukan esai), nilai untuk student harus sebesar mungkin (rencana belajar, bukan sekadar penolakan). Ujiannya: menutup lamaran ≤ 15 detik.
3. **Bukti di atas klaim.** Skill yang tampil harus bersumber dari proses belajar (skor project, penilaian mentor), bukan input bebas. Ujiannya: setiap skill di Passport menunjukkan sumber buktinya.
4. **Kalah itu mengajar, bukan menghukum.** Semua copy feedback harus berorientasi aksi dan menyebut apa yang bisa dilakukan, bukan menyebut kekurangan orangnya. Ujiannya: tidak ada kalimat yang menilai pribadi ("kamu kurang…"); gunakan "skill X belum cukup terlihat di portfolio".
5. **Perusahaan kecil jangan dipersulit.** Partner yang melakukan tindakan wajib harus merasa dibantu, bukan diaudit. Ujiannya: partner tidak pernah melihat label "pelanggar"; skor kepatuhan hanya terlihat di sisi admin.

---

## 5. Feature specs

### 5.1 Skill Passport

**Perilaku.** Profil kemampuan yang terisi otomatis dari data belajar student di Dibimbing, dan dipakai sebagai "CV berbukti" saat melamar.

**Isi Passport:**

| Bagian | Isi | Sumber (dalam skenario nyata) |
|---|---|---|
| Identitas | Nama, foto, kota, bootcamp, batch, status (belajar/lulus) | Data pendaftaran |
| Skill terverifikasi | Daftar skill dengan level 1-4 (Dasar, Menengah, Mahir, Siap Produksi) | Skor project dan penilaian mentor |
| Project unggulan | Maks. 3 project, tiap project: judul, ringkasan, skor, catatan mentor | Final project bootcamp |
| Endorsement mentor | Kutipan singkat maks. 200 karakter | Mentor |
| Kesiapan karier | Checklist: CV direview, LinkedIn direview, latihan interview selesai | Talent Support |
| Badge | "Mentor Reviewed", "Improved" (didapat setelah roadmap selesai) | Sistem |

**Logika tampilan.**
- Level skill ditampilkan sebagai bar 4 segmen dengan label teks (tidak hanya warna).
- Setiap skill bisa di-tap untuk melihat bukti: "SQL Menengah, berdasar Project 2 (skor 82/100) dan catatan Mentor A".
- Student mengontrol visibilitas: tiap project dan endorsement bisa disembunyikan dari partner. Skill terverifikasi tidak bisa disembunyikan agar kredibilitas Passport terjaga.
- Passport punya versi publik (link yang bisa dibagikan) dan versi yang dilihat partner saat menilai lamaran.

**Konten untuk prototype.** 3 student mock dari 3 bootcamp berbeda (Data Analyst, UI/UX Design, Digital Marketing) dengan 5-8 skill, 2-3 project, dan 1-2 endorsement masing-masing.

**Feedback/reveal.** Student melihat gap skill sebelum melamar, yaitu perbandingan Passport vs requirement lowongan (lihat 5.2).

### 5.2 Job feed dan Skill Match

**Perilaku.**
- Feed lowongan dari hiring partner, diurutkan berdasarkan kecocokan dengan Passport.
- Filter: bootcamp/bidang, lokasi, tipe kerja (onsite/hybrid/remote), level (magang/junior), rentang gaji (bila partner mengisi).
- Kartu lowongan menampilkan: logo dan nama perusahaan, posisi, lokasi, tipe kerja, gaji (bila ada), chip "Cocok dengan skill kamu: 4 dari 6".
- Detail lowongan menampilkan tabel requirement vs Passport: tiap requirement berstatus **Terpenuhi**, **Hampir** (level satu tingkat di bawah), atau **Belum terlihat**.

**Logika.** Setiap requirement lowongan punya level minimum (1-4) dan bobot (wajib/nilai tambah). Status per skill = bandingkan level student dengan minimum. Ringkasan di kartu = jumlah requirement wajib yang terpenuhi dari total requirement wajib.

**Keputusan framing.** Prototype tidak menampilkan persentase match telanjang. Yang ditampilkan: "4 dari 6 skill wajib terpenuhi" dan daftar skill yang perlu ditambah. Alasan: angka persen yang rendah dapat menurunkan motivasi, sedangkan daftar skill memberi arah.

**Feedback/reveal.** Student yang belum memenuhi semua skill wajib tetap boleh melamar, tapi melihat catatan: "Ada 2 skill yang belum terlihat. Ambil modul terkait dulu atau lanjut melamar."

### 5.3 Apply dan Application Tracker

**Perilaku apply.** Satu halaman konfirmasi: ringkasan Passport yang akan dikirim, pilihan menyertakan CV (opsional, upload PDF), 0-3 pertanyaan screening dari partner, tombol kirim. Satu tap bila tidak ada pertanyaan screening.

**Tracker.** Daftar lamaran student dengan status, dikelompokkan: Aktif, Perlu tindakan, Ditutup.

Status lamaran:

| Status | Arti | Siapa yang memicu |
|---|---|---|
| Terkirim | Lamaran diterima sistem | Otomatis |
| Sedang direview | Partner sudah membuka lamaran | Partner (otomatis saat dibuka) |
| Interview | Partner mengundang interview | Partner |
| Penawaran | Partner mengirim penawaran | Partner |
| Diterima | Student menerima penawaran | Student |
| Ditutup | Lamaran selesai tanpa lanjut | Partner (wajib tag alasan) atau student (mengundurkan diri) |

**SLA.**
- Tenggat respons pertama: 7 hari kalender sejak Terkirim.
- Tenggat keputusan setelah interview: 7 hari kalender sejak interview ditandai selesai.
- Student melihat countdown netral: "Perusahaan diharapkan merespons sebelum 9 Nov (5 hari lagi)".
- Bila tenggat lewat: status berubah menjadi "Belum ada respons" dengan teks "Dibimbing sedang menindaklanjuti dengan perusahaan." Student bisa menekan "Minta Talent Support bantu follow up" (maks. 1 kali per lamaran).

**Failure path.** Lowongan ditutup oleh partner sebelum lamaran direview: lamaran otomatis Ditutup dengan alasan sistem "Lowongan ditutup perusahaan", tanpa roadmap, plus rekomendasi 3 lowongan serupa.

### 5.4 Feedback Loop

Inti dari fitur ini ada 4 komponen yang berurutan.

**(a) Tutup lamaran dengan tag alasan (sisi partner).** Saat partner memilih "Tutup lamaran", muncul modal wajib berisi:
- Pilih 1-3 tag dari taksonomi (tabel di bawah).
- Opsional: catatan singkat maks. 140 karakter.
- Tombol "Tutup lamaran" tidak aktif sampai ≥ 1 tag dipilih.

**Taksonomi tag alasan (versi prototype):**

| Kategori | Contoh tag | Memicu roadmap? |
|---|---|---|
| Skill teknis | SQL lanjutan, Visualisasi data, Python, Figma/prototyping, Riset user, Analisis campaign, dll. (daftar mengikuti taksonomi skill per bootcamp) | Ya |
| Portfolio | Project kurang relevan dengan posisi, Kedalaman analisis/studi kasus kurang | Ya |
| Komunikasi | Penyampaian saat interview, Struktur jawaban | Ya |
| Pengalaman | Posisi butuh pengalaman lebih panjang | Sebagian (arahkan ke magang/proyek) |
| Kecocokan non-kompetensi | Ekspektasi gaji, Lokasi, Ketersediaan mulai kerja | Tidak |
| Faktor perusahaan | Posisi sudah terisi, Posisi dibatalkan, Hiring dibekukan | Tidak |

Aturan taksonomi: seluruh tag harus terkait pekerjaan. Tidak boleh ada tag yang merujuk pada usia, gender, agama, status pernikahan, penampilan fisik, atau karakteristik pribadi lain yang dilindungi. Catatan bebas dimoderasi lewat template dan dapat ditinjau admin.

**(b) Feedback card (sisi student).** Ketika lamaran ditutup, student menerima kartu dengan struktur tetap:
1. Judul netral: "Lamaran ke [Perusahaan] sudah ditutup."
2. "Yang perlu diperkuat": maks. 3 tag dalam bahasa aksi (contoh: "Visualisasi data belum cukup terlihat di portfolio").
3. Catatan partner (bila ada).
4. Tombol utama: "Lihat rencana belajar". Tombol sekunder: "Cari lowongan lain".
5. Untuk tag non-kompetensi atau faktor perusahaan: tidak ada tombol roadmap, diganti kalimat penenang yang jujur ("Ini bukan tentang kemampuanmu").

**(c) Gap Insight.** Halaman yang mengagregasi tag penolakan dari beberapa lamaran. Muncul setelah student punya ≥ 2 lamaran ditutup dengan tag kompetensi. Menampilkan: "3 dari 4 penolakan terkait Visualisasi data" dalam bentuk bar horizontal sederhana. Di bawah ambang 2 data, halaman menampilkan empty state edukatif ("Setelah 2 lamaran ditutup, kami akan mencari polanya.") agar tidak menarik kesimpulan dari satu titik data.

**(d) Roadmap dan re-apply.**
- Roadmap = daftar 2-5 item yang dipetakan dari tag: modul Dibimbing, sesi dengan mentor, project latihan, atau sesi mock interview.
- Tiap item punya estimasi waktu dan status (belum mulai, berjalan, selesai).
- Item sesi mentor mengarahkan ke fasilitas yang sudah ada (misalnya Job Connect Plus). Prototype menampilkan ini sebagai CTA tanpa alur pembayaran.
- Setelah semua item inti selesai dan mentor memperbarui penilaian skill, Passport mendapat badge "Improved" dan tombol "Lamar ulang" aktif untuk posisi serupa.
- Partner dapat mengatur masa tunggu lamar ulang untuk posisinya (default 30 hari). Ini berlaku bagi lamar ulang ke posisi yang sama, bukan posisi lain.

### 5.5 Sisi hiring partner

**Posting lowongan.** Form: judul, deskripsi, lokasi, tipe kerja, level, rentang gaji (opsional), requirement skill (dipilih dari taksonomi, tiap skill punya level minimum dan bobot wajib/nilai tambah), 0-3 pertanyaan screening, masa tunggu lamar ulang.

**Pipeline kandidat.** Papan kanban: Baru, Direview, Interview, Penawaran, Ditutup. Kartu kandidat menampilkan nama, ringkasan "skill wajib terpenuhi X dari Y", badge, dan indikator SLA (hijau/kuning/merah dengan label teks: "5 hari tersisa", "1 hari tersisa", "Lewat tenggat").

**Detail kandidat.** Passport lengkap dengan tampilan requirement vs kandidat, project, endorsement, dan aksi: Undang interview, Kirim penawaran, Tutup lamaran.

**Talent search (ringan).** Daftar student yang statusnya "terbuka untuk ditemukan", dengan filter bootcamp, skill, level, kota. Aksi: "Undang untuk melamar" ke lowongan aktif. Student yang tidak mengaktifkan opsi ini tidak muncul.

**Dashboard.** Ringkasan: lowongan aktif, kandidat baru, lamaran mendekati tenggat, waktu respons rata-rata sendiri.

### 5.6 Sisi admin Dibimbing

| Modul | Fungsi |
|---|---|
| Overview | Jumlah lamaran, tingkat respons dalam SLA, jumlah lamaran ditutup, jumlah penempatan |
| Partner | Daftar partner, skor kepatuhan SLA, riwayat, tombol "Kirim pengingat" |
| Moderasi lowongan | Antrean lowongan baru: setujui, minta revisi, tolak |
| Mapping tag ke modul | Tabel pemetaan tag alasan ke modul/sesi/project, bisa diedit |
| Analytics penolakan | Alasan penolakan teratas per bootcamp dan per batch, tren 3 bulan, ekspor |
| Antrean follow up | Daftar permintaan "Minta Talent Support bantu follow up" dari student |

Insight kunci: analytics penolakan menjadi masukan ke tim kurikulum, misalnya bila banyak alumni Data Analyst ditolak karena SQL lanjutan, modul SQL perlu diperkuat. Dengan ini loop menutup di dua level: individu dan institusi.

---

## 6. User flows

### 6.1 Flow student, happy path: dari ditolak ke lamar ulang
1. Login, lihat beranda dengan Passport ringkas dan job feed.
2. Buka detail lowongan, lihat tabel requirement vs Passport.
3. Lamar, konfirmasi, lamaran masuk tracker dengan countdown SLA.
4. Partner menutup lamaran dengan tag. Student mendapat notifikasi dan membuka Feedback card.
5. Buka Roadmap, kerjakan item, mentor memperbarui penilaian.
6. Passport mendapat badge "Improved", student melamar ulang.

**Failure/edge path:**
- **Tenggat SLA lewat:** status "Belum ada respons", opsi minta bantuan Talent Support.
- **Student baru (belum ada data Passport):** empty state onboarding. Student yang belum selesai bootcamp melihat Passport parsial ("2 dari 6 skill sudah terverifikasi") dan boleh melamar magang.
- **Penolakan non-kompetensi:** tidak ada roadmap, hanya kartu penenang dan rekomendasi lowongan serupa.
- **Offline/gagal kirim:** lamaran tersimpan sebagai draft dengan pesan "Belum terkirim. Coba lagi."

### 6.2 Flow hiring partner, happy path: dari lowongan ke penutupan lamaran
1. Login, buat lowongan dengan requirement dari taksonomi, kirim ke moderasi.
2. Setelah disetujui admin, lowongan tayang. Kandidat masuk kolom Baru.
3. Buka detail kandidat, lihat Passport, undang interview atau tutup.
4. Tutup lamaran: modal tag alasan (≤ 15 detik).

**Failure/edge path:**
- **Mendekati tenggat:** kartu kuning/merah di pipeline dan banner di dashboard.
- **Belum ada kandidat:** empty state dengan CTA ke talent search.
- **Lewat tenggat tanpa tindakan:** admin menerima notifikasi, partner menerima pengingat. Tidak ada penutupan otomatis atas nama partner.

### 6.3 Flow admin, happy path: dari pemantauan ke tindak lanjut
1. Overview menunjukkan partner dengan kepatuhan SLA rendah.
2. Buka profil partner, kirim pengingat.
3. Buka analytics penolakan, filter bootcamp, ekspor insight untuk tim kurikulum.
4. Edit mapping tag ke modul bila ada modul baru.

**Edge path:** antrean follow up dari student menumpuk (> 10 permintaan), dashboard menampilkan peringatan untuk redistribusi tugas.

---

## 7. Retention dan growth loop

- **Loop utama:** lamar → status jelas → tutup dengan tag → roadmap → Improved → lamar ulang. Tiap putaran membuat student kembali tanpa gimifikasi buatan.
- **Notifikasi (digambarkan di prototype, tidak fungsional):** perubahan status, countdown SLA mendekati habis, item roadmap yang belum disentuh 7 hari.
- **Shareable artifact:** link Passport publik yang bisa ditaruh di LinkedIn/CV.
- **Dimensi partner:** partner dengan kepatuhan SLA tinggi mendapat prioritas tampil di talent search (konsep insentif, perlu divalidasi Dibimbing).

---

## 8. Arsitektur informasi dan tooling prototype

### 8.1 Sitemap

```
Student
├── Beranda (Passport ringkas + job feed)
├── Lowongan
│   ├── Daftar + filter
│   └── Detail lowongan (requirement vs Passport) → Apply
├── Lamaran saya
│   ├── Tracker (Aktif / Perlu tindakan / Ditutup)
│   └── Detail lamaran (timeline + feedback card)
├── Perkembangan
│   ├── Gap Insight
│   └── Roadmap
└── Profil
    ├── Skill Passport (edit visibilitas)
    └── Pengaturan (terbuka untuk ditemukan)

Hiring partner
├── Dashboard
├── Lowongan (daftar, buat/edit)
├── Kandidat
│   ├── Pipeline kanban
│   └── Detail kandidat → Modal tutup dengan tag
├── Talent search
└── Pengaturan perusahaan

Admin Dibimbing
├── Overview
├── Partner (daftar, detail, kepatuhan SLA)
├── Moderasi lowongan
├── Taksonomi & mapping (tag → modul)
├── Analytics penolakan
└── Antrean follow up
```

### 8.2 Entitas data konseptual (untuk mock data, bukan skema database)

| Entitas | Field kunci |
|---|---|
| Student | id, nama, bootcamp, batch, status, kota, terbuka_ditemukan |
| SkillPassportItem | student_id, skill, level (1-4), sumber_bukti, visibilitas |
| Project | student_id, judul, ringkasan, skor, catatan_mentor, visibilitas |
| Partner | id, nama, industri, skor_sla (hanya admin) |
| Lowongan | id, partner_id, judul, lokasi, tipe, level, requirement[], status_moderasi |
| Requirement | skill, level_min, bobot (wajib/nilai tambah) |
| Lamaran | id, student_id, lowongan_id, status, tanggal_kirim, tenggat_sla |
| TutupLamaran | lamaran_id, tag_ids[], catatan, tanggal |
| TagAlasan | id, kategori, label, memicu_roadmap, modul_terkait[] |
| RoadmapItem | student_id, tag_id, tipe (modul/mentor/project/mock interview), status |

### 8.3 Catatan privasi dan keadilan (berlaku untuk desain)

- Student harus memberi persetujuan eksplisit sebelum Passport dibagikan ke partner. Dokumen produksi perlu ditinjau tim legal terkait UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022).
- Taksonomi tag tidak boleh memuat atribut yang dilindungi (lihat 5.4).
- Skor kepatuhan partner hanya tampil di sisi admin dan tidak pernah tampil ke student.

### 8.4 Tooling prototype

| Layer | Pilihan | Alasan |
|---|---|---|
| Desain & prototyping | Figma (components, variants, auto layout, variables) | Standar industri, mudah dibagikan sebagai link untuk usability test |
| Mock data | Tabel Figma/Google Sheets, diisi manual | Prototype tidak butuh backend |
| Uji coba | Moderated test via video call + rekaman layar | Cocok untuk 10 partisipan |
| Dokumentasi | Markdown (PRD dan case study ini) | Mudah diedit dan di-version |

**Caveat jujur:** prototype klikable hanya bisa menguji apakah alur dan copy dipahami. Ia tidak bisa membuktikan bahwa partner benar-benar akan patuh pada SLA dan tag wajib. Itu adalah asumsi bisnis yang butuh pilot nyata dengan beberapa partner.

---

## 9. Epics dan staged delivery

Stage dikerjakan berurutan. Epic di dalam satu stage bisa paralel kecuali dinyatakan lain.

### Stage 1: Fondasi (demoable skeleton: design system + komponen inti)

#### Epic 1: Design system dan token
- US1.1: Sebagai desainer, saya punya token warna, tipografi, spacing, radius, dan elevasi sebagai Figma variables.
- US1.2: Sebagai desainer, saya punya komponen dasar (button, input, chip, card, modal, tabel, tab, toast, empty state) dengan varian state lengkap.
- US1.3: Sebagai desainer, saya punya aturan responsif untuk 3 breakpoint.

**AC:**
- Variables Figma mencakup minimal 3 kelompok: warna, tipografi, spacing. Tidak ada nilai hardcoded di komponen.
- Setiap komponen interaktif punya varian default, hover/focus, pressed, disabled, dan error bila relevan.
- Breakpoint terdefinisi: mobile 360×800, tablet 768×1024, desktop 1440×900.
- Kontras teks terhadap latar ≥ 4.5:1 (teks biasa) dan ≥ 3:1 (teks besar), diverifikasi dengan plugin kontras untuk seluruh pasangan warna di token.
- Target sentuh elemen interaktif di mobile ≥ 44×44 px.
- Tersedia mode tampilan terang. (Mode gelap ditunda ke Stage 5.)

#### Epic 2: Komponen domain inti
- US2.1: Sebagai desainer, saya punya komponen **Skill Passport card** dalam varian ringkas, lengkap, dan publik.
- US2.2: Sebagai desainer, saya punya komponen **Status timeline** dan **SLA countdown** dengan varian normal, mendekati tenggat, dan lewat tenggat.
- US2.3: Sebagai desainer, saya punya komponen **Reason tag selector** (multi-pilih maks. 3) dan **Feedback card**.
- US2.4: Sebagai desainer, saya punya komponen **Requirement match table**.

**AC:**
- Setiap komponen domain punya minimal 3 varian state yang tercantum dan terdokumentasi di halaman komponen Figma.
- Indikator SLA tidak mengandalkan warna saja: setiap warna disertai label teks.
- Level skill tidak mengandalkan warna saja: setiap level disertai label teks dan jumlah segmen.
- Komponen digunakan ulang (instance) di ≥ 2 layar berbeda.

### Stage 2: Pembangunan layar inti (3 epic paralel)

#### Epic 3: Student, onboarding dan Skill Passport
- US3.1: Sebagai student, saya melihat onboarding singkat yang menjelaskan Passport dan SLA dalam ≤ 3 layar.
- US3.2: Sebagai student, saya bisa melihat Passport saya beserta bukti tiap skill.
- US3.3: Sebagai student, saya bisa mengatur visibilitas project dan opsi "terbuka untuk ditemukan".
- US3.4: Sebagai student, saya melihat Passport parsial ketika belum semua skill terverifikasi.

**AC:**
- Frame mobile dan desktop tersedia untuk: onboarding (3 langkah), Passport lengkap, Passport publik, pengaturan visibilitas, Passport parsial.
- Tap skill menampilkan panel bukti (sumber dan skor) dalam ≤ 1 interaksi.
- Alur dari login ke Passport lengkap bisa ditempuh dalam ≤ 4 tap/klik pada prototype.

#### Epic 4: Student, temukan dan melamar
- US4.1: Sebagai student, saya melihat job feed dengan filter dan ringkasan "X dari Y skill wajib terpenuhi".
- US4.2: Sebagai student, saya melihat detail lowongan dengan tabel requirement vs Passport.
- US4.3: Sebagai student, saya bisa melamar dalam ≤ 3 langkah.
- US4.4: Sebagai student, saya melihat catatan jelas bila ada skill wajib yang belum terpenuhi.

**AC:**
- Frame mobile dan desktop tersedia untuk: feed, filter, detail lowongan, konfirmasi apply, state sukses, state gagal kirim (draft).
- Dari feed ke lamaran terkirim bisa ditempuh dalam ≤ 5 tap/klik pada prototype.
- Tidak ada tampilan persentase match; yang ada hanya hitungan skill dan daftar gap.
- Minimal 6 lowongan mock dengan 3 kombinasi match berbeda (tinggi, sedang, rendah).

#### Epic 5: Hiring partner, posting dan pipeline
- US5.1: Sebagai partner, saya bisa membuat lowongan dengan requirement dari taksonomi skill.
- US5.2: Sebagai partner, saya melihat pipeline kanban dengan indikator SLA.
- US5.3: Sebagai partner, saya melihat dashboard ringkas.
- US5.4: Sebagai partner, saya bisa menjalankan pipeline dari ponsel untuk tugas cepat.

**AC:**
- Frame desktop tersedia untuk: dashboard, daftar lowongan, form buat lowongan, pipeline, empty state pipeline.
- Frame mobile tersedia untuk: daftar kandidat dan modal tutup lamaran.
- Form lowongan menggunakan pemilih skill bertaksonomi (bukan teks bebas) dengan level minimum dan bobot.
- Indikator SLA muncul di kartu kandidat dan dashboard dengan 3 state (normal, mendekati tenggat ≤ 2 hari, lewat tenggat).

### Stage 3: Menutup loop (butuh Stage 1 dan Epic 5 selesai)

#### Epic 6: Hiring partner, detail kandidat dan tutup lamaran
- US6.1: Sebagai partner, saya melihat Passport kandidat beserta tabel requirement.
- US6.2: Sebagai partner, saya mengundang interview atau mengirim penawaran.
- US6.3: Sebagai partner, saya menutup lamaran dengan 1-3 tag alasan dalam satu modal.
- US6.4: Sebagai partner, saya bisa mencari talenta dan mengundang untuk melamar.

**AC:**
- Modal tutup lamaran: tombol aktif hanya setelah ≥ 1 tag dipilih; maksimal 3 tag; catatan opsional ≤ 140 karakter dengan penghitung karakter.
- Prototype memungkinkan skenario "tutup lamaran" selesai dalam ≤ 3 klik dari kartu kandidat.
- Taksonomi tag di modal memuat 6 kategori sesuai spesifikasi 5.4 tanpa tag atribut personal.
- Frame untuk talent search (daftar, filter, undang) dan empty state tersedia.

#### Epic 7: Student, tracker dan feedback
- US7.1: Sebagai student, saya melihat tracker lamaran dengan status dan countdown SLA.
- US7.2: Sebagai student, saya melihat detail lamaran dengan timeline.
- US7.3: Sebagai student, saya menerima Feedback card yang suportif ketika lamaran ditutup.
- US7.4: Sebagai student, saya bisa meminta Talent Support follow up ketika SLA terlewat.

**AC:**
- Frame mobile dan desktop tersedia untuk: tracker (3 grup), detail lamaran, Feedback card (versi kompetensi, versi non-kompetensi, versi faktor perusahaan), state "Belum ada respons", konfirmasi minta follow up.
- Seluruh copy Feedback card lolos checklist UX writing di bagian 11 (tidak ada kalimat yang menilai pribadi).
- Setiap lamaran di tracker menampilkan status dan tenggat dalam satu pandang tanpa membuka detail.

#### Epic 8: Student, Gap Insight, roadmap, dan lamar ulang
- US8.1: Sebagai student, saya melihat pola penolakan lewat Gap Insight.
- US8.2: Sebagai student, saya mendapat roadmap yang dipetakan dari tag alasan.
- US8.3: Sebagai student, saya melihat progres roadmap dan mendapat badge "Improved".
- US8.4: Sebagai student, saya bisa melamar ulang setelah roadmap selesai.

**AC:**
- Frame mobile dan desktop tersedia untuk: Gap Insight (state ≥ 2 data dan state kosong), Roadmap (belum mulai, berjalan, selesai), badge Improved, lamar ulang.
- Gap Insight hanya menampilkan pola bila ≥ 2 lamaran ditutup dengan tag kompetensi; selain itu muncul empty state.
- Tiap item roadmap menampilkan tipe, estimasi waktu, dan status.
- Skenario mock "3 dari 4 penolakan terkait Visualisasi data" tersedia dan bisa diklik sampai lamar ulang.

#### Epic 9: Admin Dibimbing
- US9.1: Sebagai admin, saya melihat overview performa loop.
- US9.2: Sebagai admin, saya memantau kepatuhan SLA partner dan mengirim pengingat.
- US9.3: Sebagai admin, saya memoderasi lowongan.
- US9.4: Sebagai admin, saya mengedit mapping tag ke modul.
- US9.5: Sebagai admin, saya melihat analytics alasan penolakan per bootcamp.
- US9.6: Sebagai admin, saya mengelola antrean follow up dari student.

**AC:**
- Frame desktop tersedia untuk: overview, daftar partner, detail partner, antrean moderasi, mapping tag, analytics, antrean follow up.
- Layar admin tetap terbaca di lebar tablet 768 px (tabel scroll horizontal di dalam kontainer, bukan halaman).
- Analytics menampilkan minimal: 5 alasan penolakan teratas, filter bootcamp dan rentang waktu, dan tombol ekspor.
- Skor kepatuhan partner tidak muncul di layar student maupun partner mana pun.

### Stage 4: Integrasi dan validasi

#### Epic 10: Penyambungan prototype dan skenario mock
- US10.1: Sebagai penguji, saya bisa menelusuri satu skenario utuh lintas 3 role.
- US10.2: Sebagai penguji, saya bisa memulai prototype dari tiap role dengan satu klik.

**AC:**
- Tersedia 3 skenario terdokumentasi: (A) lamar → tutup dengan tag → roadmap → lamar ulang; (B) SLA terlewat → follow up Talent Support; (C) penolakan non-kompetensi.
- Seluruh elemen interaktif dalam jalur skenario terhubung. Tidak ada dead-end saat penelusuran jalur utama.
- Setiap role punya titik masuk prototype tersendiri.

#### Epic 11: Pengecekan aksesibilitas dan konsistensi
- US11.1: Sebagai desainer, saya mengaudit seluruh layar terhadap checklist aksesibilitas.

**AC:**
- 100% layar utama lolos audit kontras (lihat Epic 1).
- Urutan fokus keyboard terdokumentasi untuk modal tutup lamaran, form apply, dan form buat lowongan.
- Setiap input form punya label yang terlihat dan pesan error yang spesifik.

#### Epic 12: Riset validasi dan iterasi
- US12.1: Sebagai peneliti, saya mewawancarai pihak-pihak kunci untuk memvalidasi proto-persona.
- US12.2: Sebagai peneliti, saya menjalankan usability test dan mencatat temuan.
- US12.3: Sebagai desainer, saya mengiterasi desain berdasarkan temuan.

**AC:**
- Wawancara: ≥ 5 student/alumni, ≥ 3 HR/partner, ≥ 2 Talent Support/Career Services.
- Usability test: 5 student, 3 partner, 2 admin, dengan task sesuai bagian 2.2.
- Setiap temuan severity "kritis" atau "mayor" punya perubahan desain yang tercatat sebelum pengepakan case study.
- Hasil ringkas (success rate, SUS, kutipan) tercatat di dokumen case study.

#### Epic 13: Pengepakan case study
- US13.1: Sebagai desainer, saya menyusun case study portofolio dari seluruh proses.

**AC:**
- Dokumen case study memuat seluruh bagian pada outline dan hasil validasi Epic 12.
- Minimal 8 gambar layar kunci dan 1 diagram alur ada di dalam case study.

### Stage 5: Epic pasca-prototype (dinamai, belum dirinci)

| Epic | Bentuk dan prasyarat |
|---|---|
| Mentor-Checked Apply | Student meminta mentor mengecek CV atau jawaban screening sebelum melamar posisi tertentu, lamaran dapat badge "Mentor Reviewed". Butuh kapasitas mentor dan selaras dengan fasilitas Job Connect Plus. |
| Digital Talent Showcase penuh | Versi lengkap showcase per batch dengan event, ranking, dan undangan massal. Prototype hanya memuat talent search ringan. |
| Integrasi data belajar | Menghubungkan Passport ke sistem LMS Dibimbing agar skor dan penilaian mentor terisi otomatis. Butuh akses data dan persetujuan student. |
| Notifikasi multi-kanal | Email dan WhatsApp untuk perubahan status dan pengingat SLA. Prototype hanya menggambarkan notifikasi in-app. |
| Pesan antara partner dan student | Chat atau pesan terstruktur untuk menjadwalkan interview. |
| Rekomendasi cerdas | Pencocokan berbasis AI dan roadmap yang dipersonalisasi lebih jauh dari pemetaan tag. |
| Mode gelap dan lokalisasi | Mode gelap serta bahasa Inggris. |
| Aplikasi native | iOS/Android jika data penggunaan membenarkan. |

---

## 10. Non-functional requirements

| Area | Persyaratan |
|---|---|
| Responsif | Student: mobile 360 px dan desktop 1440 px untuk semua layar utama. Partner: desktop untuk semua layar, mobile hanya daftar kandidat dan modal tutup lamaran. Admin: desktop, tetap terbaca di 768 px. |
| Aksesibilitas | Target WCAG 2.1 AA: kontras 4.5:1, fokus terlihat pada semua elemen interaktif, tidak mengandalkan warna saja untuk makna, target sentuh ≥ 44 px, label terlihat pada setiap input. |
| Konsistensi | 100% layar memakai komponen dari design system. Maksimal 5% elemen custom, semuanya terdokumentasi. |
| Bahasa | Bahasa Indonesia, nada santai-profesional. Istilah teknis (Passport, SLA) selalu disertai penjelasan satu kalimat saat pertama kali muncul. |
| Performa (konseptual, untuk spesifikasi handoff) | Daftar lowongan dan tracker ditargetkan tampil < 2 detik pada koneksi 4G; skeleton loading didesain untuk keduanya. |
| Privasi | Student memberi persetujuan eksplisit sebelum Passport dibagikan. Data penolakan hanya terlihat oleh student terkait, partner terkait, dan admin. |
| Biaya | Rp 0: seluruh tooling menggunakan paket gratis. |

---

## 11. Panduan UX writing untuk feedback penolakan

Checklist copy yang harus dipenuhi setiap Feedback card:

1. Judul netral dan faktual. Tidak memakai kata "gagal", "ditolak", atau "sayang sekali".
2. Subjek kalimat adalah portfolio/skill, bukan orang. Contoh benar: "Visualisasi data belum cukup terlihat di portfolio." Contoh salah: "Kamu kurang bisa visualisasi data."
3. Setiap kalimat masalah diikuti satu langkah yang bisa dilakukan.
4. Untuk tag non-kompetensi dan faktor perusahaan, tegaskan bahwa keputusan tidak terkait kemampuan, tanpa janji berlebihan.
5. Panjang maksimum 3 poin utama dan 1 tombol utama.
6. Tidak memakai emoji sedih atau ilustrasi negatif.

---

## 12. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Partner menolak kewajiban tag dan SLA | Loop tidak berjalan, fitur utama kehilangan nilai | Desain 1 klik (≤ 15 detik), insentif visibilitas di talent search, dan pengingat otomatis. Ketentuan perlu dimasukkan dalam kesepakatan kemitraan, di luar cakupan desain. |
| Prototype tidak dapat membuktikan perubahan perilaku partner | Klaim "menghapus ghosting" tidak teruji | Case study menyebut ini sebagai asumsi dan merekomendasikan pilot dengan 3-5 partner. Gunakan wawancara HR untuk menguji kemauan, bukan hanya pemahaman UI. |
| Data Skill Passport belum tentu tersedia atau seragam di sistem Dibimbing | Passport tidak bisa diwujudkan | Dokumentasikan kebutuhan data (skor project, penilaian mentor) sebagai prasyarat; di prototype gunakan mock data. |
| Feedback terasa menjatuhkan atau tag disalahgunakan menjadi bias | Student demotivasi, risiko diskriminasi | Taksonomi tag hanya kompetensi dan faktor pekerjaan, panduan UX writing, template catatan, moderasi admin. |
| Gap Insight menarik kesimpulan dari sampel kecil | Roadmap menyesatkan | Ambang minimum 2 lamaran bertag kompetensi, empty state edukatif di bawah ambang. |
| Student merasa minder melihat gap skill | Student enggan melamar | Framing hitungan skill dan arah tindakan, bukan persen; student tetap boleh melamar meski ada gap. |
| Admin kewalahan oleh antrean follow up dan moderasi | SLA internal Dibimbing sendiri terlewat | Batas 1 follow up per lamaran, peringatan antrean di dashboard admin. |
| Scope 20+ layar × 2 ukuran terlalu besar untuk waktu yang ada | Prototype tidak selesai | Prioritas jalur: Skenario A dulu (Epic 3, 4, 5, 6, 7, 8), admin terakhir, layar sekunder boleh berupa state kosong atau stub. |

---

## 13. Inventaris layar

**Student (9 layar, masing-masing mobile + desktop)**

| ID | Layar |
|---|---|
| S-01 | Onboarding + generate Passport |
| S-02 | Beranda / job feed |
| S-03 | Detail lowongan (requirement vs Passport) |
| S-04 | Konfirmasi apply + state sukses |
| S-05 | Tracker lamaran |
| S-06 | Detail lamaran + Feedback card |
| S-07 | Gap Insight |
| S-08 | Roadmap |
| S-09 | Passport (privat dan publik) |

**Hiring partner (6 layar desktop, 2 di antaranya juga mobile)**

| ID | Layar |
|---|---|
| P-01 | Dashboard |
| P-02 | Buat/edit lowongan |
| P-03 | Pipeline kandidat (juga mobile) |
| P-04 | Detail kandidat |
| P-05 | Modal tutup lamaran dengan tag (juga mobile) |
| P-06 | Talent search |

**Admin (5 layar desktop)**

| ID | Layar |
|---|---|
| A-01 | Overview |
| A-02 | Manajemen partner + skor SLA |
| A-03 | Moderasi lowongan |
| A-04 | Mapping tag ke modul |
| A-05 | Analytics penolakan (+ antrean follow up sebagai tab) |

Total: 9×2 + 6 + 2 + 5 = 31 frame utama, belum termasuk state (kosong, error, loading).

---

## 14. Out of scope

- Backend, database, autentikasi sungguhan, atau logika matching yang berfungsi.
- Aplikasi native iOS/Android.
- Integrasi ke LMS Dibimbing dan ke portal lain (Jobstreet, Glints, Kemnaker).
- Pembayaran, tagihan partner, atau paket berlangganan.
- Chat/pesan langsung, penjadwalan interview otomatis, video interview.
- Pencocokan berbasis AI dan roadmap yang dipersonalisasi lebih jauh dari pemetaan tag.
- Mentor-Checked Apply dan Digital Talent Showcase penuh (lihat Stage 5).
- Mode gelap, bahasa Inggris, dan lokalisasi lain.
- Pembuat CV, penilai CV otomatis, dan fitur mock interview di dalam platform.
- Negosiasi gaji dan manajemen penawaran detail.
- Studi hukum formal soal data pribadi (hanya dicatat sebagai prasyarat).

---

**Langkah berikutnya:** memecah Stage 1 (Epic 1 dan 2) menjadi tiket kerja harian, lalu mulai dari design system dan komponen Passport serta Status timeline.
