---
name: codebase-architect
description: Use this skill whenever the user asks to explore, understand, map, document, or analyze a codebase or project directory — including questions like "what does this project use", "explain this repo's structure", "what framework is this", "find where X is defined", "show me this project's architecture", or when starting work on an unfamiliar codebase for the first time. Also use when the user asks to search files by name/content, list a folder, inspect file metadata, or read a specific file's contents. Requires the codebase-architect-mcp / file-mapper-mcp MCP server to be connected, with FILE_MAPPER_ROOT pointing at the target project.
license: MIT
---

# Codebase Architect — Panduan Penggunaan

Skill ini mendampingi MCP server **Codebase Architect** (`@lintang16/file-mapper-mcp`),
yang menyediakan 6 tools untuk mengeksplorasi dan memahami sebuah codebase secara
aman (dibatasi ke satu direktori root lewat `FILE_MAPPER_ROOT`).

## Alur kerja yang direkomendasikan

Ikuti urutan ini saat pertama kali membuka/menganalisis sebuah project — jangan
langsung baca file satu-satu tanpa konteks:

1. **`analyze_architecture`** — SELALU panggil ini duluan saat membuka project baru.
   Satu panggilan ini langsung memberi gambaran: tech stack, framework, entry point,
   komposisi kode per bahasa, file konfigurasi, dan sinyal infrastruktur
   (Docker/CI/testing). Ini menghemat banyak tool call dibanding menebak-nebak
   lewat `read_file` satu per satu.

2. **`map_directory`** — setelah tahu tech stack-nya, pakai ini untuk melihat
   struktur folder secara keseluruhan (default `maxDepth: 3`). Naikkan `maxDepth`
   kalau project-nya dalam/kompleks, tapi jangan langsung pakai depth besar
   (>5) di project besar karena outputnya bisa terlalu panjang — mulai dari
   depth kecil, perbesar bertahap kalau perlu detail lebih dalam di folder
   tertentu.

3. **`list_directory`** — untuk melihat isi SATU folder spesifik secara detail
   (ukuran file, waktu modifikasi) tanpa perlu me-render seluruh tree lagi.
   Lebih murah daripada `map_directory` kalau cuma butuh satu level.

4. **`search_files`** — kalau user menyebut nama file/fungsi/kata kunci
   tertentu ("di mana fungsi `handleLogin` didefinisikan?", "cari semua file
   `.test.ts`"), jangan menebak lokasinya — langsung `search_files` dengan
   `namePattern` (wildcard `*`/`?`) dan/atau `contentPattern`.

5. **`file_info`** — untuk cek cepat metadata satu path (tipe, ukuran, apakah
   bisa dibaca sebagai teks) sebelum memutuskan mau `read_file` atau tidak,
   terutama kalau ukurannya tidak diketahui.

6. **`read_file`** — baca isi file HANYA setelah tahu file itu relevan (dari
   hasil `search_files` atau `map_directory`). File biner otomatis ditolak.
   Untuk file besar, pertimbangkan menaikkan `maxBytes` daripada memanggil
   berkali-kali dengan offset (tool ini tidak mendukung pagination — sekali
   baca, dari awal file).

## Aturan penting

- **Semua path relatif** dihitung terhadap `FILE_MAPPER_ROOT` — jangan
  mengarang path absolut di luar root, request akan ditolak
  (`SecurityError: Akses ditolak`).
- **Format output default adalah Markdown** (`format: "markdown"`) — sudah
  dioptimalkan untuk dibaca langsung tanpa perlu diparse lagi. Pakai
  `format: "json"` HANYA kalau butuh data terstruktur untuk diproses lebih
  lanjut (misal menghitung agregat sendiri), bukan untuk ditampilkan ke user.
- **Jangan panggil `map_directory` berulang dengan depth yang sama** — kalau
  sudah punya hasilnya, gunakan itu; jangan re-fetch kecuali strukturnya
  mungkin berubah (misal setelah user mengedit file).
- **Folder umum sudah otomatis di-skip** (`node_modules`, `.git`, `dist`,
  `build`, `__pycache__`, `.venv`, dll) — tidak perlu exclude manual.
- Kalau `analyze_architecture` melaporkan ekosistem/framework yang tidak
  dikenali (`ecosystems: []`), itu tandanya project pakai stack yang tidak
  ada di daftar deteksi (jarang, tapi mungkin) — lanjutkan dengan
  `map_directory` untuk eksplorasi manual.

## Contoh alur percakapan

**User**: "Jelaskan project ini pakai apa aja"
→ Panggil `analyze_architecture` sekali, ringkas hasilnya ke user. Tidak perlu
tool lain kecuali user minta detail lebih lanjut.

**User**: "Di mana file yang handle autentikasi?"
→ `search_files` dengan `contentPattern: "auth"` atau `namePattern: "*auth*"`
tergantung konteks, lalu `read_file` pada hasil yang paling relevan.

**User**: "Tunjukkan struktur folder src"
→ `map_directory` dengan `path: "src"`.

**User**: "Ada berapa baris kode TypeScript di project ini?"
→ `analyze_architecture` sudah memberi jawaban ini lewat tabel komposisi kode —
tidak perlu tool tambahan.

## Instalasi & konfigurasi

Server ini dipasang lewat `npx` (tidak perlu install manual):

```json
{
  "mcpServers": {
    "codebase-architect": {
      "command": "npx",
      "args": ["-y", "@lintang16/file-mapper-mcp"],
      "env": { "FILE_MAPPER_ROOT": "/path/ke/project" }
    }
  }
}
```

Ganti `FILE_MAPPER_ROOT` tiap kali pindah project yang mau dianalisis.
