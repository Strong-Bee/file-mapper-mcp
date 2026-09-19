# file-mapper-mcp

MCP server sederhana untuk memetakan struktur direktori, mencari file, dan membaca isi file secara aman.

## Tools yang tersedia

| Tool             | Fungsi                                                              |
|------------------|----------------------------------------------------------------------|
| `map_directory`  | Memetakan pohon direktori secara rekursif (dengan batas kedalaman). |
| `list_directory` | List isi satu direktori (tidak rekursif).                            |
| `search_files`   | Cari file berdasarkan pola nama (wildcard `*`/`?`) dan/atau isi teks.|
| `file_info`      | Ambil metadata (tipe, ukuran, waktu modifikasi) satu path.           |
| `read_file`      | Baca isi file teks (dengan batas ukuran).                            |

Semua akses path divalidasi lewat `src/utils/security.ts` agar tidak bisa keluar
dari direktori root yang diizinkan (mencegah path traversal seperti `../../etc/passwd`).

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

## Menghubungkan ke Claude Desktop (contoh)

Tambahkan pada `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "node",
      "args": ["/absolute/path/ke/file-mapper-mcp/build/index.js"],
      "env": {
        "FILE_MAPPER_ROOT": "/path/ke/project/yang/ingin/dipetakan"
      }
    }
  }
}
```

Setelah itu restart Claude Desktop, dan tools `map_directory`, `list_directory`,
`search_files`, `file_info`, serta `read_file` akan tersedia.

> Di Windows, tulis path dengan backslash ganda di dalam JSON, contoh:
> `"args": ["D:\\Apk\\file-mapper-mcp\\build\\index.js"]` dan
> `"FILE_MAPPER_ROOT": "D:\\Apk\\project-target"`.
#
