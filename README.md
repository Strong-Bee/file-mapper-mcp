<p align="center">
  <img src="./public/logo.png" alt="file-mapper-mcp logo" width="180">
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

---

## 🔎 file-mapper-mcp

`@lintang16/file-mapper-mcp` adalah **Model Context Protocol (MCP) server** berbasis Node.js dan TypeScript yang memberikan AI agent akses terstruktur dan aman ke filesystem project.
# file-mapper-mcp

[![npm version](https://img.shields.io/npm/v/@lintang16/file-mapper-mcp.svg)](https://www.npmjs.com/package/@lintang16/file-mapper-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@lintang16/file-mapper-mcp.svg)](https://www.npmjs.com/package/@lintang16/file-mapper-mcp)
[![GitHub](https://img.shields.io/github/stars/Strong-Bee/file-mapper-mcp?style=social)](https://github.com/Strong-Bee/file-mapper-mcp)
[![License](https://img.shields.io/github/license/Strong-Bee/file-mapper-mcp)](https://github.com/Strong-Bee/file-mapper-mcp)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-MCP-purple.svg)](https://modelcontextprotocol.io/)

# 🔎 file-mapper-mcp

**Secure, lightweight, cross-platform filesystem MCP server for AI coding agents.**

`@lintang16/file-mapper-mcp` adalah **Model Context Protocol (MCP) server** berbasis Node.js dan TypeScript yang memberikan AI agent akses terstruktur dan aman ke filesystem project.

Dengan server ini, MCP-compatible AI clients dapat:

* 📁 Memetakan struktur project
* 🔍 Mencari file
* 📝 Mencari teks di dalam file
* 📄 Membaca source code
* 📊 Membaca metadata file
* 🧠 Memahami codebase secara bertahap
* 🔐 Mengakses filesystem hanya pada root directory yang diizinkan

Project ini dirancang untuk **AI coding agents, Claude Desktop, Cursor, developer tools, local AI agents, repository analysis, dan automated codebase exploration**.

---

# ✨ Features

* 🔎 Recursive directory mapping
* 📁 Non-recursive directory listing
* 🔍 Filename search
* 📝 Text/content search
* 📄 Text file reader
* 📊 File metadata inspection
* 🔐 Root directory access control
* 🛡️ Path traversal protection
* 🧾 Markdown output
* 🗂️ JSON output
* ⚡ Lightweight architecture
* 🌐 Windows / Linux / macOS
* 🤖 Native MCP server
* 📦 npm package
* 🧩 Compatible with MCP clients supporting stdio
* 🛠️ Built with TypeScript
* 🚫 Ignores common build/cache directories

---

# 🧠 Why file-mapper-mcp?

AI coding agents membutuhkan konteks codebase sebelum dapat melakukan analisis atau perubahan kode.

Daripada memberikan seluruh project kepada AI sekaligus, `file-mapper-mcp` memungkinkan agent mengeksplorasi project secara bertahap:

```text
┌──────────────────────┐
│     Project Root     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   map_directory      │
│ Understand structure │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   list_directory     │
│ Inspect directories  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    search_files      │
│ Find relevant files  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      file_info       │
│ Inspect metadata     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      read_file       │
│ Read required code   │
└──────────────────────┘
```

Pendekatan ini membantu agent mendapatkan **konteks yang relevan tanpa harus membaca seluruh repository**.

---

# 📦 Installation

## Install from npm

```bash
npm i @lintang16/file-mapper-mcp
```

atau:

```bash
npm install @lintang16/file-mapper-mcp
```

Package:

```text
@lintang16/file-mapper-mcp
```

---

# 🌍 Global Installation

Untuk menggunakan CLI secara global:

```bash
npm i -g @lintang16/file-mapper-mcp
```

Kemudian:

```bash
file-mapper-mcp
```

Periksa instalasi:

```bash
npm list -g @lintang16/file-mapper-mcp
```

---

# 🚀 Quick Start

Install:

```bash
npm i @lintang16/file-mapper-mcp
```

Tentukan directory project:

### Linux / macOS

```bash
FILE_MAPPER_ROOT=/path/to/project file-mapper-mcp
```

### Windows PowerShell

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\my-project"
file-mapper-mcp
```

### Windows CMD

```cmd
set FILE_MAPPER_ROOT=D:\Projects\my-project
file-mapper-mcp
```

Jika `FILE_MAPPER_ROOT` tidak ditentukan, server menggunakan current working directory sebagai root.

---

# 🛠️ MCP Tools

`file-mapper-mcp` menyediakan lima tools utama.

| Tool             | Description                                   |
| ---------------- | --------------------------------------------- |
| `map_directory`  | Memetakan struktur directory secara recursive |
| `list_directory` | Menampilkan isi directory                     |
| `search_files`   | Mencari file berdasarkan nama dan isi         |
| `file_info`      | Mengambil metadata file/directory             |
| `read_file`      | Membaca isi file teks                         |

---

# 📁 map_directory

Memetakan struktur directory secara recursive.

Contoh:

```text
project/
├── src/
│   ├── index.ts
│   ├── server.ts
│   └── utils/
│       └── filesystem.ts
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
└── README.md
```

Contoh penggunaan:

```json
{
  "path": ".",
  "maxDepth": 3
}
```

Cocok digunakan ketika AI agent pertama kali mempelajari sebuah repository.

---

# 📂 list_directory

Menampilkan isi langsung sebuah directory tanpa recursive traversal.

Contoh:

```json
{
  "path": "src"
}
```

Output konseptual:

```text
src/
├── index.ts
├── server.ts
├── tools/
└── utils/
```

Tool ini berguna ketika agent hanya membutuhkan konteks satu directory.

---

# 🔍 search_files

Mencari file berdasarkan pola nama.

Mendukung wildcard:

```text
*
?
```

Contoh:

```json
{
  "path": ".",
  "pattern": "*.ts"
}
```

Contoh pattern:

```text
*.ts
*.tsx
*.js
*.jsx
*.json
*.md
README*
.env*
```

Content search juga dapat digunakan untuk menemukan teks tertentu di dalam file.

Contoh:

```json
{
  "path": "src",
  "pattern": "*.ts",
  "content": "McpServer"
}
```

Ini berguna untuk menemukan:

* function
* class
* imports
* API endpoint
* configuration
* environment variable
* component
* service
* database query

---

# 📄 file_info

Mengambil informasi metadata sebuah file atau directory.

Informasi dapat mencakup:

```text
Path
Type
Size
Modified time
```

Contoh:

```json
{
  "path": "package.json"
}
```

Tool ini berguna sebelum agent membaca file yang besar atau menentukan jenis resource.

---

# 📖 read_file

Membaca isi file teks.

Contoh:

```json
{
  "path": "src/index.ts"
}
```

Untuk file besar, pembacaan dapat dibatasi menggunakan line range atau maximum size sesuai parameter yang tersedia.

Contoh:

```json
{
  "path": "src/index.ts",
  "startLine": 1,
  "endLine": 100
}
```

Hal ini memungkinkan AI agent membaca hanya bagian code yang dibutuhkan.

---

# 🧾 Output Format

Secara default, output dibuat dalam format **Markdown** agar mudah dibaca oleh AI agent dan developer.

Contoh directory tree:

```markdown
- src/
  - index.ts
  - tools/
    - search-files.ts
  - utils/
    - security.ts
- package.json
- tsconfig.json
```

Untuk kebutuhan programmatic processing, tool dapat menggunakan:

```text
format: "json"
```

Contoh:

```json
{
  "format": "json"
}
```

Untuk `read_file`, tersedia mode:

```text
raw
```

jika membutuhkan isi file tanpa Markdown formatting.

---

# 🔐 Security

Security merupakan bagian penting dari `file-mapper-mcp`.

Semua filesystem path divalidasi melalui:

```text
src/utils/security.ts
```

Server membatasi akses filesystem berdasarkan:

```text
FILE_MAPPER_ROOT
```

Contoh:

```text
D:\Projects\my-project
```

Jika agent mencoba:

```text
../../secret.txt
```

atau:

```text
../../../etc/passwd
```

path tersebut akan ditolak apabila berada di luar allowed root.

---

# 🛡️ Path Traversal Protection

Server dirancang untuk mencegah filesystem traversal seperti:

```text
../../etc/passwd
../../../private/key
../../.ssh/id_rsa
```

Akses hanya diperbolehkan pada directory yang telah ditentukan.

### Recommended

Gunakan root yang spesifik:

```text
D:\Projects\my-project
```

Hindari:

```text
C:\
```

atau:

```text
/
```

jika agent tidak benar-benar membutuhkan seluruh filesystem.

---

# ⚙️ Configuration

Environment variable utama:

| Variable           | Required | Description                                   |
| ------------------ | -------- | --------------------------------------------- |
| `FILE_MAPPER_ROOT` | No       | Root filesystem yang dapat diakses MCP server |

Contoh Linux:

```bash
export FILE_MAPPER_ROOT=/home/user/projects/my-app
```

Contoh macOS:

```bash
export FILE_MAPPER_ROOT=/Users/user/projects/my-app
```

Contoh Windows:

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\my-app"
```

Jika tidak diset:

```text
FILE_MAPPER_ROOT
```

akan menggunakan:

```text
process.cwd()
```

---

# 🤖 Claude Desktop

Setelah package di-install:

```bash
npm i -g @lintang16/file-mapper-mcp
```

Gunakan konfigurasi MCP:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "file-mapper-mcp",
      "env": {
        "FILE_MAPPER_ROOT": "D:\\Projects\\my-project"
      }
    }
  }
}
```

Restart Claude Desktop.

Tools yang tersedia:

```text
map_directory
list_directory
search_files
file_info
read_file
```

---

# 🪟 Windows Claude Desktop

Contoh konfigurasi:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "file-mapper-mcp",
      "env": {
        "FILE_MAPPER_ROOT": "D:\\Apk\\my-project"
      }
    }
  }
}
```

Perhatikan bahwa backslash dalam JSON harus ditulis sebagai:

```text
\\
```

Contoh:

```text
D:\\Apk\\my-project
```

bukan:

```text
D:\Apk\my-project
```

---

# 🧩 Local npm Installation

Jika package hanya di-install pada project:

```bash
npm i @lintang16/file-mapper-mcp
```

Anda dapat menggunakan binary dari:

```text
node_modules/.bin/file-mapper-mcp
```

atau melalui konfigurasi client:

```json
{
  "command": "npx",
  "args": [
    "@lintang16/file-mapper-mcp"
  ],
  "env": {
    "FILE_MAPPER_ROOT": "/path/to/project"
  }
}
```

> Untuk penggunaan production/local development yang stabil, instalasi package secara eksplisit lebih disarankan daripada mengandalkan package resolution secara dinamis.

---

# 🧠 AI Agent Workflow

Workflow yang direkomendasikan:

```text
1. map_directory
       ↓
2. list_directory
       ↓
3. search_files
       ↓
4. file_info
       ↓
5. read_file
```

Contoh:

```text
AI Agent
   │
   ├── "Saya perlu memahami project"
   │
   ▼
map_directory
   │
   ▼
"src/, app/, lib/, package.json..."
   │
   ▼
search_files
   │
   ▼
"Temukan authentication service"
   │
   ▼
file_info
   │
   ▼
read_file
   │
   ▼
Analyze code
```

Workflow ini memungkinkan agent melakukan **progressive codebase exploration**.

---

# 🚫 Ignored Directories

Untuk mengurangi noise ketika melakukan repository exploration, filesystem traversal mengabaikan directory yang umumnya tidak diperlukan:

```text
.git
node_modules
.next
dist
build
.dart_tool
.gradle
.idea
coverage
__pycache__
```

Directory tersebut biasanya berisi:

* dependencies
* build artifacts
* cache
* IDE metadata
* generated files
* test coverage
* compiled output

---

# 💻 Supported Platforms

`file-mapper-mcp` dirancang cross-platform.

### Windows

```text
Windows 10+
Windows 11
```

### Linux

```text
Ubuntu
Debian
Fedora
Arch Linux
dan distribusi Linux lainnya
```

### macOS

```text
Intel
Apple Silicon
```

---

# 🏗️ Project Structure

```text
file-mapper-mcp/
│
├── src/
│   ├── index.ts
│   │
│   ├── tools/
│   │   ├── file-info.ts
│   │   ├── list-directory.ts
│   │   ├── map-directory.ts
│   │   ├── read-file.ts
│   │   └── search-files.ts
│   │
│   └── utils/
│       ├── filesystem.ts
│       ├── markdown.ts
│       └── security.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── .gitignore
```

---

# 🧑‍💻 Development

Clone repository:

```bash
git clone https://github.com/Strong-Bee/file-mapper-mcp.git
```

Masuk directory:

```bash
cd file-mapper-mcp
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run:

```bash
npm start
```

Development/watch:

```bash
npm run dev
```

---

# 📜 NPM Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm install`   | Install dependencies     |
| `npm run build` | Compile TypeScript       |
| `npm start`     | Run compiled MCP server  |
| `npm run dev`   | Watch TypeScript changes |

---

# 📦 NPM Package

Official package:

```text
@lintang16/file-mapper-mcp
```

Install:

```bash
npm i @lintang16/file-mapper-mcp
```

NPM package:

```text
https://www.npmjs.com/package/@lintang16/file-mapper-mcp
```

GitHub repository:

```text
https://github.com/Strong-Bee/file-mapper-mcp
```

---

# 🧪 Testing Installation

Set root:

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\test-project"
```

Run:

```powershell
file-mapper-mcp
```

Jika server berhasil berjalan, MCP client dapat melakukan discovery terhadap tools:

```text
map_directory
list_directory
search_files
file_info
read_file
```

---

# 🐛 Troubleshooting

## `file-mapper-mcp` is not recognized

Jika Windows menampilkan:

```text
'file-mapper-mcp' is not recognized
```

pastikan package di-install secara global:

```bash
npm i -g @lintang16/file-mapper-mcp
```

Kemudian periksa:

```bash
npm list -g @lintang16/file-mapper-mcp
```

---

## `build/index.js` tidak ditemukan

Jika menjalankan source repository:

```bash
npm run build
```

Kemudian:

```bash
node build/index.js
```

---

## Root directory tidak ditemukan

Periksa environment variable.

PowerShell:

```powershell
echo $env:FILE_MAPPER_ROOT
```

Linux/macOS:

```bash
echo $FILE_MAPPER_ROOT
```

Pastikan directory benar-benar ada.

---

## Claude Desktop tidak menampilkan tools

Periksa:

1. Package sudah terinstall
2. `file-mapper-mcp` tersedia di PATH
3. `FILE_MAPPER_ROOT` valid
4. JSON configuration valid
5. Claude Desktop sudah direstart
6. Node.js sudah terinstall
7. Root directory memiliki permission yang sesuai

---

# 🔒 Security Recommendations

Jangan memberikan filesystem access lebih luas daripada yang diperlukan.

### Recommended

```text
D:\Projects\my-project
```

### Avoid

```text
D:\
```

atau:

```text
C:\
```

atau:

```text
/
```

Terutama jika agent dapat membaca file sensitif.

Perhatikan juga file seperti:

```text
.env
.env.production
credentials.json
service-account.json
id_rsa
id_ed25519
*.pem
*.key
database.sql
```

Sebaiknya directory yang mengandung secret tidak diberikan sebagai root MCP.

---

# 🎯 Use Cases

## AI Coding Agents

Membantu agent memahami repository sebelum melakukan perubahan kode.

## Codebase Analysis

Menganalisis struktur aplikasi dan hubungan antar file.

## Repository Exploration

Menemukan source code yang relevan secara cepat.

## Local AI Agents

Memberikan filesystem tools kepada AI agent lokal.

## Developer Automation

Menggunakan MCP sebagai interface filesystem untuk automation.

## AI Code Review

Membantu agent menemukan file dan membaca bagian kode yang relevan.

## Project Documentation

Mengeksplorasi struktur project untuk menghasilkan dokumentasi.

---

# 🧰 Technology Stack

Project ini menggunakan:

* Node.js
* TypeScript
* Model Context Protocol SDK
* Zod
* stdio transport

Dependencies utama:

```text
@modelcontextprotocol/sdk
zod
```

Development dependencies:

```text
typescript
@types/node
```

---

# 🗺️ Roadmap

* [x] Directory mapping
* [x] Directory listing
* [x] Filename search
* [x] Content search
* [x] File metadata
* [x] File reading
* [x] Markdown output
* [x] JSON output
* [x] Root directory security
* [x] Path traversal protection
* [x] Windows support
* [x] Linux support
* [x] macOS support
* [x] npm package
* [ ] Comprehensive automated tests
* [ ] Git-aware exploration
* [ ] `.gitignore` aware filtering
* [ ] Configurable ignore patterns
* [ ] Multiple allowed roots
* [ ] File change watcher
* [ ] Streaming large files
* [ ] Performance optimization for very large repositories
* [ ] More MCP client examples
* [ ] CI/CD pipeline
* [ ] Automated npm publishing

---

# 🤝 Contributing

Contributions are welcome.

Clone repository:

```bash
git clone https://github.com/Strong-Bee/file-mapper-mcp.git
cd file-mapper-mcp
```

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Create branch:

```bash
git checkout -b feature/my-feature
```

After making changes:

```bash
npm run build
```

Submit a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👤 Author

**Lintang Syahdewo**

GitHub:

```text
https://github.com/Strong-Bee
```

Project:

```text
https://github.com/Strong-Bee/file-mapper-mcp
```

NPM:

```text
https://www.npmjs.com/package/@lintang16/file-mapper-mcp
```

---

# ⭐ Support the Project

Jika `file-mapper-mcp` membantu workflow AI atau development Anda:

* ⭐ Star repository
* 🐛 Report bugs
* 💡 Request features
* 🔧 Submit Pull Request
* 📢 Share project

---

# 🔎 SEO Keywords

```text
MCP server
Model Context Protocol
MCP filesystem
filesystem MCP
filesystem MCP server
file mapper MCP
file system MCP
AI filesystem
AI filesystem tools
AI coding agent
AI coding assistant
AI developer tools
AI codebase explorer
AI repository analyzer
AI project analyzer
codebase analysis
repository analysis
source code analysis
MCP file reader
MCP file search
MCP directory mapper
MCP filesystem server
Claude MCP
Claude Desktop MCP
Cursor MCP
Node.js MCP
Node.js MCP server
TypeScript MCP server
TypeScript filesystem
secure filesystem MCP
local filesystem MCP
local AI agent
developer MCP
MCP developer tools
MCP automation
Model Context Protocol filesystem
secure MCP server
cross-platform MCP
AI coding tools
```

---

# 🏷️ Recommended GitHub Topics

Tambahkan topic berikut pada GitHub repository:

```text
mcp
model-context-protocol
mcp-server
filesystem
file-system
ai
ai-agent
ai-tools
coding-agent
codebase
codebase-analysis
developer-tools
typescript
nodejs
claude
claude-desktop
cursor
automation
repository-analysis
file-search
```

---

# 📈 SEO Description

### Short Description

> Secure and lightweight MCP filesystem server for AI coding agents to map directories, search files, inspect metadata, and read project files.

### Long Description

> `@lintang16/file-mapper-mcp` is a secure, lightweight, cross-platform Model Context Protocol server for AI coding agents. It provides structured filesystem tools for directory mapping, file listing, filename and content search, file metadata inspection, and text file reading with configurable root access and path traversal protection.

---

# 🚀 Quick Reference

Install:

```bash
npm i @lintang16/file-mapper-mcp
```

Global:

```bash
npm i -g @lintang16/file-mapper-mcp
```

Run:

```bash
file-mapper-mcp
```

Configure root:

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\my-project"
```

Available tools:

```text
map_directory
list_directory
search_files
file_info
read_file
```

---

## Built for AI Agents

**`file-mapper-mcp` gives AI agents a structured, secure, and efficient way to explore project files through the Model Context Protocol.**

⭐ **Star the repository:** `Strong-Bee/file-mapper-mcp`
