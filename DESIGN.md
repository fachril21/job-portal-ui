---
name: Dibimbing Career Hub
description: Job portal tertutup Dibimbing yang menjawab setiap lamaran dan mengubah penolakan menjadi rencana belajar.
colors:
  brand-900: "#002D34"
  brand-700: "#005A63"
  brand-600: "#007378"
  brand-500: "#009A9E"
  brand-100: "#D8F5F6"
  brand-50: "#ECFAFB"
  ink: "#131C20"
  muted: "#536067"
  subtle: "#7D888E"
  line: "#DFE6E8"
  line-strong: "#CAD3D5"
  canvas: "#F7FBFC"
  surface: "#FFFFFF"
  ok-100: "#D3F9E3"
  ok-700: "#126B47"
  proc-100: "#D9F3FF"
  proc-700: "#125F94"
  warn-100: "#FFE9D4"
  warn-700: "#984B16"
  learn-100: "#F0EAFF"
  learn-700: "#614A96"
  due-700: "#945A00"
  danger-700: "#B02A2D"
  danger-50: "#FFF0EE"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  page-title:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline-workspace:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  micro:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  panel: "12px"
  2xl: "16px"
  tile: "20px"
  sheet: "28px"
  full: "9999px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand-600}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-700}"
  button-hero:
    backgroundColor: "{colors.brand-900}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 18px"
    height: "44px"
  button-workspace:
    backgroundColor: "{colors.brand-600}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "32px"
  tile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.tile}"
    padding: "20px"
  panel-workspace:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "16px"
  kanban-column:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.panel}"
    padding: "8px"
    width: "264px"
  kanban-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "12px"
  chip:
    backgroundColor: "{colors.brand-50}"
    textColor: "{colors.brand-700}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  pill-ok:
    backgroundColor: "{colors.ok-100}"
    textColor: "{colors.ok-700}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  tag-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "32px"
  tag-chip-selected:
    backgroundColor: "{colors.brand-50}"
    textColor: "{colors.brand-700}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    height: "44px"
  input-workspace:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "36px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.2xl}"
    padding: "12px 16px"
  demo-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.tile}"
    width: "360px"
---

# Design System: Dibimbing Career Hub

> **Status: terekam dari build.** Dokumen ini ditulis ulang dari kode yang sudah jadi (`src/app/globals.css`, `src/components/ui|domain|shell|demo`, halaman di `src/app`). Arah: **Hybrid Soft + Calm**, hanya terang (`color-scheme: light`). Bila seed lama dan build berbeda, build yang menang; selisihnya dicatat di bagian akhir.

## Overview

**Creative North Star: "Pendamping Belajar"**: hangat untuk yang sedang berjuang, tenang untuk yang sedang bekerja.

Satu sistem, dua kepadatan, berbagi token Tailwind v4 (`@theme inline`) dan satu hue teal.

- **Soft (student, mobile-first).** Halaman disusun dari **Tile** putih membulat 20px di atas kanvas teal sangat tipis. Satu tile "pahlawan" per layar boleh berwarna (tone `dark`, `ok`, `proc`, `warn`, `learn`, `brand`). Bricolage Grotesque memberi suara personal pada sapaan, judul tile, judul Sheet, dan empty state. Detail lanjutan (bukti skill, filter, kandidat) berada di dalam Sheet.
- **Calm (partner dan admin, desktop-first).** Sidebar terang 56px (ikon) yang melebar ke 232px di `xl`, top bar 48px dengan tombol pencarian ⌘K / Ctrl K, border hairline 1px, kontrol 32-36px, hampir tanpa dekorasi. Detail kandidat terbuka sebagai Sheet samping 520px, bukan halaman baru. Pintasan `J/K`, `I`, `C` ada di pipeline.

Anti-referensi: tampilan dibimbing.id lama, job board dengan grid kartu seragam, dashboard SaaS generik, glassmorphism dan gradient blob, merah atau emoji sedih di sisi student.

**Key Characteristics:**
- Kanvas `canvas`, permukaan `surface`, kedalaman dari border `line` 1px plus bayangan `xs`.
- Teal satu-satunya warna aksi. Lima tint semantik hanya untuk makna.
- Sudut besar di student (tile 20, pill penuh), sudut kecil di workspace (8-12).
- Seluruh `body` memakai `tabular-nums`. Setiap status disertai teks.
- Gerak pendek dan informatif; semua animasi diredam oleh `prefers-reduced-motion`.

## Colors

Palet disimpan sebagai hex di `@theme inline` pada `globals.css`; nama token di kode adalah `brand-*`, `ok-*`, `proc-*`, `warn-*`, `learn-*`, `due-700`, `danger-*`. Netral berhue teal dengan chroma rendah.

### Primary: Teal
- **brand-600** (#007378): satu-satunya warna aksi. Tombol primary, link ghost, fokus (`outline`), border input saat fokus, Switch aktif, ikon centang.
- **brand-700** (#005A63): hover tombol primary dan hero, teks pada chip/tab aktif.
- **brand-900** (#002D34): tombol hero, tile `dark`.
- **brand-500** (#009A9E): isian saja (segmen SkillMeter, ruas MatchSummary, aksen kontrol di Demo Panel). Bukan teks.
- **brand-100 / brand-50** (#D8F5F6 / #ECFAFB): `::selection`, ring fokus input (3px), avatar/chip, tab dan item nav aktif, hover baris dan sekunder.

### Semantic Tints (latar 100 + teks 700)
- **ok** (#D3F9E3 / #126B47): berhasil. Status Penawaran/Diterima, "Terpenuhi", Banner ok, toast ikon ok.
- **proc** (#D9F3FF / #125F94): berproses. Terkirim/Sedang direview/Interview, Feedback card varian non-kompetensi.
- **warn** (#FFE9D4 / #984B16): perlu perhatian. "Hampir", lencana hitungan, pill SLA (`due`), Banner offline.
- **learn** (#F0EAFF / #614A96): belajar. Feedback card kompetensi, GapNote, tile arah belajar.
- **due-700** (#945A00): teks pill SLA mendekati tenggat, di atas `warn-100`.

### Neutral
- **ink** (#131C20) teks utama, juga latar toast dan Demo Panel. **muted** (#536067) teks sekunder. **subtle** (#7D888E) ikon, placeholder, "Kosong"; bukan teks isi.
- **line** (#DFE6E8) border default dan divider. **line-strong** (#CAD3D5) border input dan tombol secondary.
- **canvas** (#F7FBFC) latar aplikasi dan kolom kanban. **surface** (#FFFFFF) tile, panel, sheet.
- **danger-700 / danger-50** (#B02A2D / #FFF0EE): error validasi; di Demo Panel untuk tombol Reset.

### Named Rules
**Aturan Satu Warna Aksi.** Hanya teal yang bisa diklik. Tint pastel tidak pernah menjadi tombol.

**Aturan Tint Bermakna.** ok = berhasil, proc = berproses, warn = perlu perhatian, learn = belajar. Tint tidak dipakai agar "ramai".

**Aturan Tanpa Merah untuk Student.** `StatusPill` memberi "Belum ada respons" bertone muted untuk SLA lewat; penolakan memakai learn atau proc. Merah di sisi student hanya untuk error input.

## Typography

**Display Font:** Bricolage Grotesque (`--font-display`, fallback Geist, system-ui). Dipakai di sisi student (sapaan, judul halaman, judul tile) dan pada judul Sheet, judul EmptyState, serta logo.
**UI / Body Font:** Geist (`--font-sans`) untuk semua yang lain. Dua keluarga saja.

**Character:** Bricolage hangat dan sedikit tidak sempurna; Geist netral dan rapat untuk data.

### Hierarchy
- **Display** (Bricolage 700, clamp 32→52px, 1.05, -0.03em): satu per layar student (`Halo, {nama}.`).
- **Page title** (Bricolage 700, clamp 28→40px, 1.1, -0.02em): judul halaman student (Lowongan, Perkembangan).
- **Headline** (Bricolage 700, 24px `text-2xl`): judul tile pahlawan dan section student; 20px (`text-xl`) untuk judul Sheet dan EmptyState.
- **Headline workspace** (Geist 600, 20px, tracking-tight): `PageHeader` partner/admin. Bricolage tidak dipakai di judul halaman workspace.
- **Title** (Geist 600, 16px): nama lowongan, judul kartu.
- **Body** (Geist 400, 15px, 1.6): dasar `body`; juga input student dan tombol md.
- **Body-sm** (Geist 500, 13px): tombol sm/workspace, item nav workspace, chip alasan, sel kartu, kontrol Demo Panel.
- **Label** (Geist 500, 12px, sentence case): label form, helper, chip, pill, legend. Tidak ada UPPERCASE tracked.
- **Micro** (Geist 500, 11px): `Kbd`, hitungan pada badge, label bottom nav mobile, metadata kartu kanban, penanda grup di Demo Panel. Hanya untuk teks pendamping pendek; bacaan inti tidak boleh turun ke 11px.

### Named Rules
**Aturan Hitungan, Bukan Persen.** Match selalu "4 dari 6 skill wajib terpenuhi" (`MatchSummary`) atau "4/6 wajib" di kartu kanban.

**Aturan Display untuk Manusia.** Bricolage untuk momen student dan judul overlay; tabel, tombol, dan judul halaman workspace tetap Geist.

## Layout

- **Skala spasi 4px** (gap 6/8/12/16, padding Tile 20px, padding Panel 16px).
- **Student:** konten maks. 1120px (`max-w-[1120px]`), header 64px dengan tab pill di `md`+, pencarian pill 40px, avatar 36px. Di mobile, bottom nav pill melayang (`inset-x-3`, 12px dari tepi + safe-area, 4 ikon + label 11px, target min 44px) dan `main` diberi padding bawah 128px.
- **Workspace:** sidebar 56px / 232px (`xl`), top bar 48px, `main` padding 12px mobile / 24px md. Di bawah `md` sidebar diganti tab teks horizontal di top bar.
- **Kanban pipeline:** kolom 264px dengan scroll horizontal di bawah `lg`, `flex-1` rata di `lg`+. Kolom berlatar `canvas`, padding 8px, gap kartu 8px, header kolom 12px semibold muted dengan hitungan di pill putih. Kolom kosong menampilkan "Kosong". Kartu diurutkan berdasar tenggat SLA.
- **Overlay:** Sheet `max-w-lg` (CloseDialog `max-w-xl`, detail skill `max-w-md`), varian `side` 520px penuh tinggi di desktop; bottom sheet maks. 92dvh di mobile. Palette 640px.
- **Toaster:** tengah-bawah di mobile (96px dari bawah), kanan-bawah 24px di desktop.

## Elevation & Depth

Hybrid: kontras `canvas` → `surface` dan border `line` memberi struktur; bayangan berlapis hanya untuk yang naik.

### Shadow Vocabulary
- **xs** (`0 1px 2px rgb(19 28 32 / .05)`): Tile, Panel, kartu kanban saat diam, tombol primary.
- **sm** (`0 1px 2px rgb(19 28 32 / .06), 0 4px 12px rgb(19 28 32 / .05)`): hover tombol/kartu kanban, tombol hero, bottom nav, knob Switch.
- **md** (`0 2px 4px rgb(19 28 32 / .06), 0 12px 32px rgb(19 28 32 / .10)`): Toast dan FAB Demo.
- **lg** (`0 4px 8px rgb(19 28 32 / .08), 0 24px 64px rgb(19 28 32 / .16)`): Sheet, Command Palette, Demo Panel.

Overlay Sheet: `rgb(19 28 32 / .32)` + `backdrop-blur 4px`. Itu satu-satunya blur.

### Named Rules
**Aturan Bayangan Bertingkat.** Elevasi naik satu tingkat per interaksi (xs → sm saat hover). Tidak melompat dari xs ke lg.

## Shapes

- **Student:** Tile 20px (`--radius-tile`), Sheet sudut atas 28px (`--radius-sheet`), tombol md/lg dan chip/pill penuh, input 12px, bottom nav dan pencarian pill, avatar bulat, `CompanyMark` squircle 12px, logo placeholder 10px, EmptyState ikon 16px.
- **Workspace:** Panel dan kolom/kartu kanban 12px (`--radius-panel`), tombol sm 8px, input workspace 8px, chip alasan 8px, item nav 8px, `Kbd` dan badge hitungan 6px. Sheet samping: 28px di sisi kiri saja.
- **Toast** 16px; Banner dan kotak bukti 12px.
- **SkillMeter:** 4 kapsul (w-6 h-2, atau w-4 h-1.5 ukuran sm) dengan celah 3px.
- Tidak ada clip-path atau bentuk dekoratif.

## Components

### Buttons
- **Student:** pill, tinggi 44px (`md`, 15px, padding 18px) atau 52px (`lg`, 16px, padding 24px). Semibold.
- **Workspace:** tinggi **32px**, radius 8px, 13px, padding 12px (`size="sm"`), ikon 15px; dipakai juga di footer Sheet.
- **Varian:** *primary* brand-600 (hover brand-700, xs → sm); *hero* brand-900 (hover brand-700, bayangan sm), satu per layar untuk aksi bernilai tertinggi; *secondary* surface + border line-strong (hover brand-50 + border brand-500); *ghost* teks brand-600; *quiet* muted.
- **States:** transisi 150ms; `active:scale-[0.97]`; disabled → latar `line`, teks `subtle`, tanpa bayangan; fokus lewat `:focus-visible` global (outline 2px brand-600, offset 2px). Tombol dapat memuat `kbd` kecil (`I`, `C`) di dalamnya.

### Tile, Panel, dan Kartu Kanban
- **Tile:** radius 20, border, padding 20, bayangan xs; tone penuh warna tanpa border.
- **Panel:** radius 12, border `line`, header 44px dengan judul 14px semibold, isi padding 16px (atau `flush`).
- **Kartu kanban:** `<button>` surface, radius 12, padding 12, bayangan xs, hover sm; terpilih = border brand-600. Isi: Avatar 28px + nama 14px medium, judul lowongan 12px muted, lalu baris pill: "4/6 wajib" (ok bila penuh, selain itu muted), pill SLA `due`, "Lamar ulang" (learn), "Follow up" (warn); SLA normal berupa teks micro muted. Belum bisa di-drag.

### Chips, Pills, Badges
- **Chip:** tinggi 24px, pill, 12px medium, brand-50/brand-700 (atau `plain` canvas + border line).
- **Pill:** tinggi 24px, titik 6px opsional, tone proc/ok/warn/learn/muted/danger/due. `StatusPill` memetakan status lamaran ke tone.
- **Chip alasan (CloseDialog):** tinggi 32px, radius 8, 13px medium, dikelompokkan per kategori dalam `fieldset` dengan `legend` 12px muted. Terpilih = brand-50 + border brand-600 + teks brand-700 (`aria-pressed`). Sesudah 3 terpilih, sisanya `opacity-40` dan nonaktif; footer menampilkan "n dari 3 alasan dipilih".
- **Lencana hitungan:** pill warn-100 (student, 20px) atau persegi 6px (sidebar); badge mobile 16px berlatar warn-700.

### Inputs
- **Student:** tinggi 44px, radius 12, border line-strong, 15px. **Workspace:** tinggi 36px, radius 8, 14px. **Textarea** (catatan CloseDialog): radius 8, 3 baris, counter "n/140" 12px muted.
- **Fokus:** border brand-600 + ring 3px brand-100. **Error:** teks 12px danger-700 di bawah Field. Label 12px medium di atas, helper 12px muted.
- **Switch:** 44×24px, aktif brand-600, knob 20px.

### Sheet (overlay)
Dialog modal: pusat di desktop, bottom sheet di mobile, fokus terkunci, Esc menutup, body tidak scroll, fokus dikembalikan. Header judul Bricolage 20px + tombol tutup bulat 36px; badan scroll padding 20px/16px; footer rata kanan dengan border atas. Varian `side` untuk detail kandidat.

### Toaster
Toast ink dengan teks putih 14px, radius 16px, bayangan md, maks. lebar `sm`, ikon 18px (ok/warn/info diwarnai tint 100), auto-dismiss 4.5s, `aria-live="polite"`. Untuk efek dari Demo Panel memuat baris micro "Notifikasi student/partner/admin".

### Navigation
- **Student desktop:** tab pill 36px, aktif brand-50 + brand-700. **Mobile:** bottom nav pill melayang (lihat Layout), aktif sama dengan ikon lebih tebal (stroke 2.4).
- **Workspace:** item 32px radius 8, aktif brand-50 + brand-700, ikon stroke 2.3, label tersembunyi di bawah `xl` (ada `title`). Switcher perusahaan di atas, profil di bawah.
- **Command Palette:** modal 640px, radius 12, bayangan lg, input 56px, hasil dikelompokkan, item aktif brand-50. Dipakai di student (pencarian lowongan) dan workspace.

### Signature: Skill Level Meter
4 kapsul (isi brand-500, kosong `line`) + label teks "Menengah" + "2/4"; `role="img"` dengan aria-label. Klik skill di `SkillList` membuka Sheet bukti: kotak brand-50 berjudul "Bukti".

### Signature: Requirement Match
`MatchSummary`: "**4 dari 6** skill wajib terpenuhi" + ruas brand-500 per skill. `MatchTable`: baris per requirement dengan ikon (centang brand-600, titik warn-700 untuk Hampir, lingkaran putus subtle untuk Belum) dan Pill "Terpenuhi" / "Hampir · 1 level lagi" / "Belum terlihat"; nilai tambah dipisah. `GapNote`: kartu learn-100 "Ada n skill yang belum terlihat".

### Signature: Feedback Card
Header learn-100 (kompetensi) atau proc-100 (non-kompetensi), judul Bricolage 24px "Lamaran ke X sudah ditutup.", tag alasan dalam kotak canvas radius 12, catatan partner dalam blockquote canvas, tombol hero "Lihat rencana belajar" (kompetensi) atau "Cari lowongan lain".

### Signature: Detail Kandidat
Sheet samping: Avatar 48px, StatusPill + pill SLA, daftar kecocokan, skill terverifikasi dengan SkillMeter sm + bukti, project, endorsement, jawaban screening. Footer: "Undang interview" `I`, "Kirim penawaran", "Tutup lamaran" `C` (tombol sm).

### Empty, Loading, Banner
- **EmptyState:** ikon 26px garis tipis brand-600 dalam kotak 56px radius 16 + judul Bricolage + satu kalimat + aksi.
- **Skeleton:** `.skeleton` radius 8, gradien line → #EEF3F4, shimmer 1.4s; statis `line` saat reduced motion.
- **Banner:** radius 12, tone warn/proc/ok, 14px medium, aksi di kanan.

### Demo Panel (di luar produk)
Memakai grammar alat developer: latar ink, teks putih, border `white/10-20`, label 12px `white/60`.
- **FAB:** pill 44px ink "Demo" + titik ok-100, kanan-bawah (di atas bottom nav di mobile). **Shift + D** membuka/menutup saat fokus bukan di input; `?demo=off|on`.
- **Panel:** `aside` 360px melayang (inset 16px) di desktop, bottom sheet maks. 88dvh di mobile, radius 20px, bayangan lg; tidak menutup layar di desktop.
- **Isi berurutan:** header (lencana "DEMO" + tanggal virtual + tutup) → Role (segmented) → Persona (select + toggle Passport parsial) → Skenario (kartu dengan checklist dan langkah berikutnya) → Event mock (tombol 36px, nonaktif dengan alasan 11px) → Waktu (+1/+3/+7 hari, Hari ini) → State layar (Normal/Kosong/Loading/Offline) → Log event → Reset dengan konfirmasi.

## Motion

Utilitas di `globals.css`: `anim-rise` (280ms), `anim-sheet` (280ms), `anim-slide` (280ms), `anim-fade` (200ms), `anim-stamp` (420ms, stempel), `anim-pulse-ring` (1.8s, titik waktu kini), `skeleton` shimmer (1.4s), `confetti`. Easing masuk `--ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1)`. Transisi interaksi 150-200ms. `prefers-reduced-motion` memampatkan semua animasi dan transisi ke 0.01ms dan mematikan shimmer.

## Do's and Don'ts

### Do:
- **Do** memakai teal sebagai satu-satunya warna aksi, dan tint sesuai maknanya (ok/proc/warn/learn).
- **Do** memberi satu tile pahlawan dan satu tombol hero per layar student.
- **Do** menaruh detail di Sheet; gunakan `Sheet` untuk semua modal agar fokus, Esc, dan safe-area konsisten.
- **Do** memakai tinggi 32px / radius 8px untuk kontrol workspace, dan 44px / pill untuk student.
- **Do** menyertai setiap indikator warna dengan teks, dan menjaga target sentuh mobile ≥ 44px.
- **Do** mendesain empty, loading, dan offline setara state normal.
- **Do** menandai semua data mock sebagai sintetis.

### Don't:
- **Don't** kembali ke tampilan dibimbing.id lama (hero teal gelap penuh, blok highlight, oranye, Plus Jakarta Sans).
- **Don't** memakai brand-500 atau subtle untuk teks isi.
- **Don't** menampilkan persentase match.
- **Don't** memakai merah, emoji sedih, atau kata "gagal/ditolak" di layar student.
- **Don't** memakai glassmorphism, gradient blob, atau gradient teks; blur hanya untuk scrim Sheet.
- **Don't** memakai Bricolage di tabel, tombol, atau judul halaman workspace.
- **Don't** membuat Demo Panel meniru gaya produk.

## Dicatat, tidak dikanonkan

- Teks 10px pada lencana bottom nav mobile (di bawah lantai 11px) adalah cacat build, bukan token.
- Logo "d" adalah placeholder sementara (`Logo`), bukan aset resmi; jangan digambar ulang.
- Kartu kanban belum bisa di-drag, dan Toast belum memiliki aksi opsional; seed lama menjanjikan keduanya.
- Chip alasan terpilih berwarna brand-50 (bukan teal solid seperti seed), dan tidak memakai accordion.

## Komponen tambahan: Talent search

- **Panel kriteria** (kiri, sticky di desktop; Sheet "Kriteria (n)" di mobile): grup fieldset dengan pemisah garis, chip toggle `brand-50/brand-700` saat aktif.
- **Kartu talent**: avatar, headline, kisaran gaji di kanan, chip skill (cocok = `brand-50`, hampir = `warn-100/warn-700` berlabel "hampir", lainnya netral), aksi Simpan / CV / Undang.
- **Profil talent dan CV**: side Sheet; CV berupa dokumen putih bergaya kertas di dalam Sheet. Data sensitif tidak pernah tampil, ditegaskan catatan `proc-100`.
- **Offering letter**: dokumen di Sheet dengan nomor surat, ringkasan syarat, dan tenggat penerimaan.
- **Student Bootcamp**: pill `proc` dengan ikon BadgeCheck di kartu dan profil, avatar bercincin brand. Akun non-bootcamp tanpa label dan tanpa cincin; chip keahlian netral dan keterangan "Keahlian diisi sendiri".
- **Wizard lowongan**: stepper 4 langkah (lingkaran 28px, aktif `brand-600`, selesai `brand-100` bercentang), segmented control untuk pilihan kecil (level, model kerja, bobot skill), panel samping sticky "Perkiraan kandidat" dan bar aksi sticky di bawah. Pratinjau student memakai kartu yang sama dengan feed student.
- **Admin**: batang tren mingguan (`brand-100`, minggu ini `brand-600`) dan pill SLA (ok/warn/danger). Detail kasus dan partner memakai side Sheet dan halaman detail dengan panel samping, pola yang sama dengan sisi partner.
