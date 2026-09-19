# file-mapper-mcp

**Secure, lightweight, cross-platform MCP server for exploring, mapping, searching, and reading project files with AI agents.**

`file-mapper-mcp` adalah **Model Context Protocol (MCP) server** berbasis **Node.js + TypeScript** yang memungkinkan AI agent seperti Claude Desktop, Cursor, dan MCP-compatible clients untuk memahami struktur dan isi project secara aman.

Server menyediakan tools untuk:

* Memetakan struktur direktori secara rekursif
* Menampilkan isi direktori
* Mencari file berdasarkan nama atau pola wildcard
* Mencari teks di dalam file
* Membaca metadata file
* Membaca isi file teks
* Menghasilkan output Markdown atau JSON
* Membatasi akses filesystem menggunakan allowed root directory
* Mencegah path traversal seperti `../../etc/passwd`

Cocok digunakan untuk **AI coding agents, developer tools, repository analysis, codebase exploration, automation, MCP clients, dan local development workflows**.

---

## ✨ Features

* 🔍 **Directory Mapping** — tampilkan struktur project secara rekursif
* 📁 **Directory Listing** — lihat isi direktori tanpa recursive traversal
* 🔎 **File Search** — cari file menggunakan wildcard `*` dan `?`
* 📝 **Content Search** — cari teks di dalam source code dan text files
* 📄 **File Reader** — baca file teks dengan batas ukuran
* 📊 **File Metadata** — ukuran, tipe, path, dan waktu modifikasi
* 🔐 **Filesystem Security** — akses dibatasi ke root directory yang diizinkan
* 🛡️ **Path Traversal Protection** — mencegah akses keluar dari allowed root
* 🧾 **Markdown Output** — output mudah dibaca oleh AI maupun manusia
* 🔧 **JSON Output** — cocok untuk automation dan programmatic processing
* 🌐 **Cross Platform** — Windows, Linux, dan macOS
* ⚡ **Lightweight** — tanpa database dan tanpa external service
* 🤖 **MCP Native** — menggunakan Model Context Protocol SDK
* 📦 **npm Ready** — dapat digunakan sebagai package/CLI

---

## 🧠 Why file-mapper-mcp?

AI coding agents sering membutuhkan konteks project sebelum dapat memahami atau memodifikasi codebase.

Tanpa filesystem tools yang terstruktur, agent dapat:

* membaca terlalu banyak file,
* menghabiskan context window,
* melakukan pencarian berulang,
* menerima informasi yang tidak relevan,
* atau mencoba mengakses path yang tidak seharusnya.

`file-mapper-mcp` menyediakan filesystem interface yang terstruktur sehingga AI agent dapat melakukan workflow:

```text
Project
   │
   ├── map_directory
   │       ↓
   │   Understand structure
   │
   ├── list_directory
   │       ↓
   │   Inspect directory
   │
   ├── search_files
   │       ↓
   │   Find relevant files
   │
   ├── file_info
   │       ↓
   │   Inspect metadata
   │
   └── read_file
           ↓
       Read only required content
```

Pendekatan ini dapat membantu **mengurangi context yang tidak diperlukan dan membuat filesystem exploration lebih terarah**.

---

# 🛠️ Available Tools

| Tool             | Description                                   |
| ---------------- | --------------------------------------------- |
| `map_directory`  | Memetakan struktur direktori secara rekursif  |
| `list_directory` | Menampilkan isi satu direktori                |
| `search_files`   | Mencari file berdasarkan nama dan/atau isi    |
| `file_info`      | Mengambil metadata sebuah file atau directory |
| `read_file`      | Membaca isi file teks                         |

---

## `map_directory`

Memetakan directory tree secara recursive.

Contoh konsep output:

```text
project/
├── src/
│   ├── index.ts
│   ├── server.ts
│   └── utils/
│       └── filesystem.ts
├── package.json
├── tsconfig.json
└── README.md
```

Parameter yang tersedia dapat mencakup:

* root/path
* maximum depth
* include hidden files
* include files
* output format

Contoh:

```json
{
  "path": ".",
  "maxDepth": 3
}
```

---

## `list_directory`

Menampilkan isi langsung sebuah directory tanpa recursive traversal.

Contoh:

```json
{
  "path": "src"
}
```

Cocok untuk agent yang hanya membutuhkan konteks satu directory.

---

## `search_files`

Mencari file menggunakan:

* filename pattern
* wildcard `*`
* wildcard `?`
* optional text/content search
* result limit

Contoh:

```json
{
  "path": ".",
  "pattern": "*.ts"
}
```

Contoh pencarian berdasarkan nama:

```text
*.ts
*.tsx
*.js
*.json
README*
```

Contoh konsep content search:

```json
{
  "path": "src",
  "pattern": "*.ts",
  "content": "McpServer"
}
```

---

## `file_info`

Mengambil metadata file atau directory.

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

---

## `read_file`

Membaca isi file teks.

Contoh:

```json
{
  "path": "src/index.ts"
}
```

Dapat digunakan dengan batas ukuran dan line range untuk menghindari pembacaan file yang terlalu besar.

Contoh konsep:

```json
{
  "path": "src/index.ts",
  "startLine": 1,
  "endLine": 100
}
```

Untuk kebutuhan machine processing, tool dapat menggunakan format:

```text
markdown
json
raw
```

`raw` khusus digunakan untuk kebutuhan pembacaan isi file tanpa formatting Markdown.

---

# 🔐 Security

Security adalah salah satu bagian utama dari `file-mapper-mcp`.

Semua path divalidasi melalui:

```text
src/utils/security.ts
```

Server memastikan path yang diminta berada di dalam directory root yang diizinkan.

Contoh path yang seharusnya ditolak:

```text
../../etc/passwd
```

atau:

```text
../../../secret.txt
```

atau path lain yang mencoba keluar dari allowed root.

## Allowed Root

Gunakan environment variable:

```text
FILE_MAPPER_ROOT
```

Contoh:

```bash
FILE_MAPPER_ROOT=/home/user/projects/my-app
```

Jika environment variable tidak diberikan, server menggunakan:

```text
process.cwd()
```

sebagai root directory.

> **Security recommendation:** gunakan root directory sesempit mungkin. Jangan memberikan root seperti `/`, `C:\`, atau home directory jika agent hanya membutuhkan satu project.

---

# 📦 Installation

## Clone repository

```bash
git clone https://github.com/Strong-Bee/file-mapper-mcp.git
cd file-mapper-mcp
```

## Install dependencies

```bash
npm install
```

## Build project

```bash
npm run build
```

Setelah build berhasil:

```text
build/index.js
```

akan menjadi entry point MCP server.

---

# ▶️ Running

## Linux / macOS

```bash
FILE_MAPPER_ROOT=/path/to/project node build/index.js
```

Contoh:

```bash
FILE_MAPPER_ROOT=/home/user/projects/my-app node build/index.js
```

## Windows PowerShell

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\my-app"
node build/index.js
```

## Windows CMD

```cmd
set FILE_MAPPER_ROOT=D:\Projects\my-app
node build/index.js
```

### PowerShell note

Environment variable dengan format:

```powershell
$env:FILE_MAPPER_ROOT = "D:\Projects\my-app"
```

hanya berlaku untuk sesi terminal tersebut.

Jika tidak dikonfigurasi:

```text
FILE_MAPPER_ROOT
```

server menggunakan current working directory.

---

# 🤖 Claude Desktop Configuration

Tambahkan MCP server ke konfigurasi Claude Desktop.

Contoh:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "node",
      "args": [
        "/absolute/path/to/file-mapper-mcp/build/index.js"
      ],
      "env": {
        "FILE_MAPPER_ROOT": "/path/to/project"
      }
    }
  }
}
```

Contoh Windows:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "node",
      "args": [
        "D:\\Apk\\file-mapper-mcp\\build\\index.js"
      ],
      "env": {
        "FILE_MAPPER_ROOT": "D:\\Projects\\my-app"
      }
    }
  }
}
```

Setelah konfigurasi selesai, restart Claude Desktop.

Tools berikut akan tersedia:

```text
map_directory
list_directory
search_files
file_info
read_file
```

---

# 🧩 MCP Client Configuration

Karena server menggunakan **stdio transport**, server dapat digunakan oleh MCP-compatible clients yang mendukung local stdio servers.

Konsep konfigurasi:

```json
{
  "command": "node",
  "args": [
    "/path/to/file-mapper-mcp/build/index.js"
  ],
  "env": {
    "FILE_MAPPER_ROOT": "/path/to/project"
  }
}
```

---

# 🏗️ Project Structure

```text
file-mapper-mcp/
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
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# 🧑‍💻 Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Development/watch mode:

```bash
npm run dev
```

Build command:

```bash
npm run build
```

menghasilkan:

```text
build/
└── index.js
```

---

# ⚙️ Environment Variables

| Variable           | Required | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| `FILE_MAPPER_ROOT` | No       | Root directory yang boleh diakses server |

Contoh:

```env
FILE_MAPPER_ROOT=D:\Projects\my-app
```

atau:

```env
FILE_MAPPER_ROOT=/home/user/projects/my-app
```

---

# 📊 Output Formats

Secara default, tools menggunakan output **Markdown** yang mudah dibaca oleh AI agent dan developer.

Contoh directory tree:

```markdown
- src/
  - index.ts
  - server.ts
- package.json
- tsconfig.json
```

Contoh metadata:

```markdown
| Property | Value |
|---|---|
| Type | file |
| Size | 2048 bytes |
| Modified | 2026-09-19 |
```

Untuk kebutuhan automation atau programmatic processing, gunakan:

```text
format: "json"
```

Contoh konsep:

```json
{
  "format": "json"
}
```

Untuk `read_file`, tersedia mode:

```text
format: "raw"
```

jika diperlukan output isi file tanpa Markdown wrapping.

---

# 🧠 AI Agent Workflow

Contoh workflow yang direkomendasikan untuk AI coding agent:

### 1. Map project

```text
map_directory
```

Agent mendapatkan gambaran struktur project.

### 2. Inspect relevant directory

```text
list_directory
```

Agent mempersempit konteks.

### 3. Search relevant files

```text
search_files
```

Agent menemukan file yang relevan.

### 4. Inspect metadata

```text
file_info
```

Agent memeriksa file sebelum membacanya.

### 5. Read required content

```text
read_file
```

Agent hanya membaca file yang diperlukan.

Workflow tersebut membantu menghindari kebutuhan untuk memasukkan seluruh codebase ke context AI sekaligus.

---

# 🚫 Ignored Directories

Filesystem traversal mengabaikan directory yang umumnya tidak relevan untuk codebase exploration, seperti:

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

Hal ini membantu mengurangi noise ketika AI agent melakukan repository exploration.

---

# 🎯 Use Cases

`file-mapper-mcp` dapat digunakan untuk:

* AI coding assistants
* MCP development
* Claude Desktop
* Cursor workflows
* Repository analysis
* Codebase exploration
* Local AI agents
* Autonomous coding agents
* Developer automation
* Project documentation
* Source code analysis
* Debugging workflows
* Software architecture analysis
* AI-powered code review
* Local filesystem inspection
* Monorepo exploration

---

# 🚀 Example Use Case

Misalnya sebuah AI agent perlu memahami project:

```text
D:\Projects\my-next-app
```

Konfigurasi:

```json
{
  "mcpServers": {
    "file-mapper": {
      "command": "node",
      "args": [
        "D:\\Apk\\file-mapper-mcp\\build\\index.js"
      ],
      "env": {
        "FILE_MAPPER_ROOT": "D:\\Projects\\my-next-app"
      }
    }
  }
}
```

Agent kemudian dapat melakukan:

```text
map_directory
        ↓
src/
app/
components/
lib/
package.json
        ↓
search_files
        ↓
components/**/*.tsx
        ↓
read_file
        ↓
Analyze required code
```

---

# 🔧 Troubleshooting

## `build/index.js` tidak ditemukan

Jalankan:

```bash
npm run build
```

Kemudian:

```bash
node build/index.js
```

---

## Permission denied

Pastikan user yang menjalankan Node.js mempunyai permission membaca directory target.

Linux/macOS:

```bash
ls -la /path/to/project
```

Windows:

```powershell
Get-Acl "D:\Projects\my-app"
```

---

## Server tidak menemukan file

Periksa:

```text
FILE_MAPPER_ROOT
```

Contoh PowerShell:

```powershell
echo $env:FILE_MAPPER_ROOT
```

Linux/macOS:

```bash
echo $FILE_MAPPER_ROOT
```

Jika tidak diset, pastikan command dijalankan dari directory yang benar.

---

## Claude Desktop tidak menampilkan tools

Periksa:

1. Path `build/index.js`
2. Node.js tersedia di PATH
3. `FILE_MAPPER_ROOT` valid
4. JSON configuration valid
5. Claude Desktop sudah direstart
6. Project sudah menjalankan `npm run build`

Tes server secara manual:

```bash
node build/index.js
```

---

# 🛡️ Security Recommendations

Untuk production atau penggunaan bersama AI agents:

### Gunakan root directory spesifik

Disarankan:

```text
D:\Projects\my-app
```

Tidak disarankan:

```text
C:\
```

atau:

```text
/
```

### Jangan expose secret directory

Hindari memberikan akses ke directory yang berisi:

```text
.env
SSH keys
credentials
API keys
private certificates
database dumps
password files
```

Gunakan project root yang memang diperlukan oleh agent.

---

# 📚 Technology Stack

Built with:

* **Node.js**
* **TypeScript**
* **Model Context Protocol SDK**
* **Zod**
* **stdio transport**

Core dependencies:

```text
@modelcontextprotocol/sdk
zod
```

---

# 📦 NPM Package

Package name:

```text
file-mapper-mcp
```

CLI name:

```text
file-mapper-mcp
```

Package configuration menggunakan:

```json
{
  "bin": {
    "file-mapper-mcp": "build/index.js"
  }
}
```

Setelah package dipublish ke npm, penggunaan global dapat dilakukan dengan:

```bash
npm install -g file-mapper-mcp
```

Kemudian:

```bash
file-mapper-mcp
```

> Jika package belum dipublish ke npm, gunakan repository build/install workflow terlebih dahulu.

---

# 🔍 SEO Keywords

Keywords yang relevan untuk project ini:

```text
MCP server
Model Context Protocol
MCP filesystem
MCP filesystem server
filesystem MCP
file mapper MCP
file system MCP
AI filesystem tools
AI coding agent
AI coding assistant
Claude MCP
Claude Desktop MCP
Cursor MCP
Node.js MCP server
TypeScript MCP server
secure filesystem MCP
local filesystem MCP
MCP file reader
MCP directory mapper
MCP file search
MCP codebase explorer
AI codebase explorer
AI repository analysis
AI project analyzer
source code MCP
local AI agent tools
developer MCP server
MCP tools for developers
MCP server TypeScript
MCP server Node.js
Model Context Protocol filesystem
secure MCP server
cross platform MCP
```

---

# 🔎 Search Engine Description

**Short description:**

> Secure and lightweight MCP server for mapping directories, searching files, inspecting metadata, and reading project files with AI agents.

**Long description:**

> file-mapper-mcp is a lightweight, secure, cross-platform Model Context Protocol server for AI coding agents. It provides structured filesystem tools for directory mapping, file listing, filename and content search, metadata inspection, and text file reading with path traversal protection and configurable root directories.

---

# 🏷️ Topics

Recommended GitHub repository topics:

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
```

---

# 📈 SEO-Friendly Project Title

Recommended title:

```text
file-mapper-mcp — Secure Filesystem MCP Server for AI Coding Agents
```

Alternative:

```text
file-mapper-mcp — Model Context Protocol Filesystem & Codebase Explorer
```

---

# 🤝 Contributing

Contributions, bug reports, feature requests, and improvements are welcome.

Typical workflow:

```bash
git clone https://github.com/Strong-Bee/file-mapper-mcp.git

cd file-mapper-mcp

npm install

npm run build
```

Create a feature branch:

```bash
git checkout -b feature/my-feature
```

Make your changes and verify:

```bash
npm run build
```

Then submit a pull request.

---

# 🗺️ Roadmap

Potential future improvements:

* [ ] npm package publishing
* [ ] Additional MCP filesystem tools
* [ ] Advanced glob filtering
* [ ] Git-aware project mapping
* [ ] `.gitignore` aware traversal
* [ ] Binary file detection
* [ ] Better large-file handling
* [ ] Streaming file reads
* [ ] Configurable ignore patterns
* [ ] Multiple allowed roots
* [ ] Config file support
* [ ] More MCP clients examples
* [ ] Automated test suite
* [ ] Performance benchmarks
* [ ] File change watching
* [ ] Optional project indexing
* [ ] Large repository optimization

---

# 📄 License

This project is licensed under the **MIT License**.

See:

```text
LICENSE
```

for more information.

---

# 👤 Author

Created and maintained by **Strong-Bee / Cyber Technology Project**.

GitHub:

```text
https://github.com/Strong-Bee/file-mapper-mcp
```

---

# ⭐ Support

If this project is useful for your AI agent, MCP workflow, or development environment:

* ⭐ Star the repository
* 🐛 Report bugs
* 💡 Suggest features
* 🔧 Submit pull requests
* 📢 Share the project with other MCP developers

---

## Keywords

**MCP Server · Model Context Protocol · Filesystem MCP · File Mapper · AI Coding Agent · AI Coding Assistant · Claude MCP · Claude Desktop · Cursor MCP · Node.js · TypeScript · Codebase Explorer · Repository Analysis · File Search · Directory Mapper · Secure Filesystem · Local AI Agent · Developer Tools · AI Developer Tools**

---

**Built for AI agents that need structured, secure, and efficient access to project files.**
