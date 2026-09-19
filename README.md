<p align="center">
  <img src="public/logo1.png" alt="file-mapper-mcp logo" width="180">
</p>

<h1 align="center">file-mapper-mcp</h1>

<p align="center">
  Secure, lightweight, cross-platform filesystem MCP server for AI coding agents.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lintang16/file-mapper-mcp">
    <img src="https://img.shields.io/npm/v/@lintang16/file-mapper-mcp.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@lintang16/file-mapper-mcp">
    <img src="https://img.shields.io/npm/dm/@lintang16/file-mapper-mcp.svg" alt="npm downloads">
  </a>
  <a href="https://github.com/Strong-Bee/file-mapper-mcp">
    <img src="https://img.shields.io/github/stars/Strong-Bee/file-mapper-mcp?style=social" alt="GitHub stars">
  </a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-green.svg" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/MCP-Model%20Context%20Protocol-purple.svg" alt="Model Context Protocol">
</p>

### 🏛️ Codebase Architect MCP

MCP server untuk memahami sebuah codebase secara cepat: deteksi tech stack &
framework, entry point aplikasi, komposisi kode per bahasa, sampai pemetaan
struktur direktori, pencarian, dan pembacaan file — semua dengan validasi
keamanan supaya tidak bisa keluar dari direktori yang diizinkan.

## Tools yang tersedia

| Tool                  | Fungsi                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------|
| `analyze_architecture` | ⭐ **Tool andalan.** Deteksi tech stack, framework, entry point, komposisi kode per bahasa, file konfigurasi, dan sinyal infrastruktur (Docker/CI/testing). |
| `map_directory`        | Memetakan pohon direktori secara rekursif (dengan batas kedalaman).                       |
| `list_directory`       | List isi satu direktori (tidak rekursif).                                                |
| `search_files`         | Cari file berdasarkan pola nama (wildcard `*`/`?`) dan/atau isi teks.                    |
| `file_info`            | Ambil metadata (tipe, ukuran, waktu modifikasi) satu path.                                |
| `read_file`            | Baca isi file teks (dengan batas ukuran).                                                 |

Semua akses path divalidasi lewat `src/utils/security.ts` agar tidak bisa keluar
dari direktori root yang diizinkan (mencegah path traversal seperti `../../etc/passwd`).

## Kenapa "Codebase Architect"?

Tool `analyze_architecture` dirancang jadi langkah pertama saat AI agent
membuka project baru — bukan cuma melihat daftar file, tapi langsung tahu:

- **Tech stack apa** yang dipakai (Node.js, Python, Go, Rust, Java, PHP, Ruby, dll)
- **Framework/library** apa saja yang terdeteksi dari file manifest (React, Express, Django, dll)
- **Di mana entry point**-nya (file utama, script `start`/`dev`)
- **Komposisi kode** per bahasa (jumlah file & baris)
- **Ada Docker/CI/testing** atau belum

Hasilnya berupa laporan Markdown yang langsung enak dibaca oleh AI agent
maupun manusia.

## Output Markdown

Secara default, semua tool mengembalikan output dalam format **Markdown** yang
enak dibaca (tree berbentuk bullet list, listing berbentuk tabel, isi file
dibungkus fenced code block dengan syntax highlighting sesuai ekstensi, dll).

Kalau butuh data mentah untuk diproses lebih lanjut (mis. oleh script lain),
tambahkan parameter `format: "json"` (atau `"raw"` khusus untuk `read_file`)
saat memanggil tool tersebut.

## Instalasi

```bash
npm install
npm run build
```

## Konfigurasi root direktori

Server hanya boleh mengakses file di dalam satu direktori root. Atur lewat
environment variable `FILE_MAPPER_ROOT`. Jika tidak diset, root default adalah
direktori kerja (`cwd`) saat proses dijalankan.

## Menjalankan langsung

**macOS / Linux (bash):**
```bash
FILE_MAPPER_ROOT=/path/ke/project node build/index.js
```

**Windows (PowerShell):**
```powershell
$env:FILE_MAPPER_ROOT = "D:\path\ke\project"
node build/index.js
```

**Windows (Command Prompt / cmd.exe):**
```cmd
set FILE_MAPPER_ROOT=D:\path\ke\project
node build/index.js
```

> Catatan: di PowerShell, `$env:FILE_MAPPER_ROOT = "..."` hanya berlaku untuk sesi
> terminal itu. Kalau tidak diset sama sekali, server memakai direktori kerja
> (folder tempat kamu menjalankan `node build/index.js`) sebagai root.

## Pakai lewat npm (tanpa clone/install manual)

Package ini sudah dipublish ke npm registry, jadi bisa langsung dipanggil
lewat `npx` di config MCP client mana pun tanpa install manual:

```json
{
  "mcpServers": {
    "codebase-architect": {
      "command": "npx",
      "args": ["-y", "@lintang16/file-mapper-mcp"],
      "env": {
        "FILE_MAPPER_ROOT": "/path/ke/project/yang/ingin/dianalisis"
      }
    }
  }
}
```

## Menghubungkan ke Claude Desktop (contoh)

Tambahkan pada `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "codebase-architect": {
      "command": "node",
      "args": ["/absolute/path/ke/file-mapper-mcp/build/index.js"],
      "env": {
        "FILE_MAPPER_ROOT": "/path/ke/project/yang/ingin/dianalisis"
      }
    }
  }
}
```

Setelah itu restart Claude Desktop, dan tools `analyze_architecture`,
`map_directory`, `list_directory`, `search_files`, `file_info`, serta
`read_file` akan tersedia.

> Di Windows, tulis path dengan backslash ganda di dalam JSON, contoh:
> `"args": ["D:\\Apk\\file-mapper-mcp\\build\\index.js"]` dan
> `"FILE_MAPPER_ROOT": "D:\\Apk\\project-target"`.
