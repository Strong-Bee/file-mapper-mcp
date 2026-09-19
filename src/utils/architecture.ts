import fs from "node:fs";
import path from "node:path";
import { isIgnoredDir } from "./security.js";

export interface DependencyInfo {
  name: string;
  version: string;
}

export interface EcosystemInfo {
  ecosystem: string; // "Node.js/JavaScript", "Python", "Go", dst.
  manifestFile: string;
  frameworks: string[];
  dependencies: DependencyInfo[];
  devDependencies: DependencyInfo[];
}

export interface ArchitectureAnalysis {
  rootPath: string;
  ecosystems: EcosystemInfo[];
  configFiles: string[];
  entryPoints: string[];
  languageBreakdown: { extension: string; fileCount: number; lineCount: number }[];
  totalFiles: number;
  totalLines: number;
  hasDocker: boolean;
  hasCI: boolean;
  hasTests: boolean;
}

/** Nama file/folder penanda yang dicek di root project. */
const CONFIG_MARKERS = [
  "package.json", "tsconfig.json", "jsconfig.json",
  "requirements.txt", "pyproject.toml", "Pipfile", "setup.py",
  "go.mod", "Cargo.toml",
  "pom.xml", "build.gradle", "build.gradle.kts",
  "composer.json", "Gemfile",
  "Dockerfile", "docker-compose.yml", "docker-compose.yaml",
  ".env.example", ".eslintrc.json", ".eslintrc.js", ".prettierrc",
  "vite.config.ts", "vite.config.js", "next.config.js", "next.config.mjs",
  "webpack.config.js", "tailwind.config.js", "tailwind.config.ts",
  "vercel.json", "netlify.toml", "Makefile",
];

const FRAMEWORK_DEP_MAP: Record<string, string> = {
  react: "React",
  "react-dom": "React",
  next: "Next.js",
  vue: "Vue.js",
  nuxt: "Nuxt.js",
  "@angular/core": "Angular",
  svelte: "Svelte",
  express: "Express",
  fastify: "Fastify",
  "@nestjs/core": "NestJS",
  koa: "Koa",
  "@modelcontextprotocol/sdk": "Model Context Protocol SDK",
  vite: "Vite",
  webpack: "Webpack",
  tailwindcss: "Tailwind CSS",
  prisma: "Prisma ORM",
  typeorm: "TypeORM",
  mongoose: "Mongoose (MongoDB)",
  graphql: "GraphQL",
  jest: "Jest (testing)",
  vitest: "Vitest (testing)",
  mocha: "Mocha (testing)",
  playwright: "Playwright (testing)",
  cypress: "Cypress (testing)",
  electron: "Electron",
  zod: "Zod (validation)",
};

const LANGUAGE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".kt", ".c", ".cpp", ".h", ".hpp",
  ".rb", ".php", ".cs", ".swift", ".dart", ".scala",
  ".css", ".scss", ".html", ".vue", ".svelte",
  ".sql", ".sh", ".json", ".yaml", ".yml", ".md",
]);

function readJsonSafe(filePath: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function toDependencyList(obj: Record<string, string> | undefined): DependencyInfo[] {
  if (!obj) return [];
  return Object.entries(obj).map(([name, version]) => ({ name, version }));
}

function detectFrameworksFromDeps(deps: DependencyInfo[]): string[] {
  const found = new Set<string>();
  for (const dep of deps) {
    if (FRAMEWORK_DEP_MAP[dep.name]) found.add(FRAMEWORK_DEP_MAP[dep.name]);
  }
  return Array.from(found);
}

/** Mendeteksi ekosistem/bahasa utama project berdasarkan file manifest yang ada. */
function detectEcosystems(rootPath: string): EcosystemInfo[] {
  const ecosystems: EcosystemInfo[] = [];

  const pkgJsonPath = path.join(rootPath, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = readJsonSafe(pkgJsonPath);
    if (pkg) {
      const dependencies = toDependencyList(pkg.dependencies);
      const devDependencies = toDependencyList(pkg.devDependencies);
      ecosystems.push({
        ecosystem: "Node.js / JavaScript-TypeScript",
        manifestFile: "package.json",
        frameworks: detectFrameworksFromDeps([...dependencies, ...devDependencies]),
        dependencies,
        devDependencies,
      });
    }
  }

  if (fs.existsSync(path.join(rootPath, "requirements.txt"))) {
    const content = fs.readFileSync(path.join(rootPath, "requirements.txt"), "utf-8");
    const deps = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const match = l.match(/^([A-Za-z0-9_.\-]+)\s*([=<>!~]+.*)?$/);
        return { name: match?.[1] ?? l, version: match?.[2] ?? "" };
      });
    const frameworkNamesLower = ["django", "flask", "fastapi", "numpy", "pandas", "torch", "tensorflow"];
    const frameworks = deps
      .filter((d) => frameworkNamesLower.includes(d.name.toLowerCase()))
      .map((d) => d.name);
    ecosystems.push({
      ecosystem: "Python",
      manifestFile: "requirements.txt",
      frameworks,
      dependencies: deps,
      devDependencies: [],
    });
  } else if (fs.existsSync(path.join(rootPath, "pyproject.toml"))) {
    ecosystems.push({
      ecosystem: "Python",
      manifestFile: "pyproject.toml",
      frameworks: [],
      dependencies: [],
      devDependencies: [],
    });
  }

  if (fs.existsSync(path.join(rootPath, "go.mod"))) {
    ecosystems.push({
      ecosystem: "Go",
      manifestFile: "go.mod",
      frameworks: [],
      dependencies: [],
      devDependencies: [],
    });
  }

  if (fs.existsSync(path.join(rootPath, "Cargo.toml"))) {
    ecosystems.push({
      ecosystem: "Rust",
      manifestFile: "Cargo.toml",
      frameworks: [],
      dependencies: [],
      devDependencies: [],
    });
  }

  if (
    fs.existsSync(path.join(rootPath, "pom.xml")) ||
    fs.existsSync(path.join(rootPath, "build.gradle")) ||
    fs.existsSync(path.join(rootPath, "build.gradle.kts"))
  ) {
    ecosystems.push({
      ecosystem: "Java / Kotlin (JVM)",
      manifestFile: fs.existsSync(path.join(rootPath, "pom.xml")) ? "pom.xml" : "build.gradle",
      frameworks: [],
      dependencies: [],
      devDependencies: [],
    });
  }

  if (fs.existsSync(path.join(rootPath, "composer.json"))) {
    const pkg = readJsonSafe(path.join(rootPath, "composer.json"));
    ecosystems.push({
      ecosystem: "PHP",
      manifestFile: "composer.json",
      frameworks: pkg?.require?.["laravel/framework"] ? ["Laravel"] : [],
      dependencies: toDependencyList(pkg?.require),
      devDependencies: toDependencyList(pkg?.["require-dev"]),
    });
  }

  if (fs.existsSync(path.join(rootPath, "Gemfile"))) {
    ecosystems.push({
      ecosystem: "Ruby",
      manifestFile: "Gemfile",
      frameworks: [],
      dependencies: [],
      devDependencies: [],
    });
  }

  return ecosystems;
}

function findEntryPoints(rootPath: string, pkg: any | null): string[] {
  const entries = new Set<string>();

  if (pkg?.main) entries.add(pkg.main);
  if (pkg?.module) entries.add(pkg.module);
  if (pkg?.bin) {
    if (typeof pkg.bin === "string") entries.add(pkg.bin);
    else Object.values(pkg.bin).forEach((v) => entries.add(String(v)));
  }
  if (pkg?.scripts?.start) entries.add(`npm start -> ${pkg.scripts.start}`);
  if (pkg?.scripts?.dev) entries.add(`npm run dev -> ${pkg.scripts.dev}`);

  const commonEntryFiles = [
    "src/index.ts", "src/index.js", "src/main.ts", "src/main.js",
    "index.ts", "index.js", "main.py", "app.py", "manage.py",
    "main.go", "src/main.rs", "Program.cs",
  ];
  for (const file of commonEntryFiles) {
    if (fs.existsSync(path.join(rootPath, file))) entries.add(file);
  }

  return Array.from(entries);
}

function listConfigFiles(rootPath: string): string[] {
  return CONFIG_MARKERS.filter((f) => fs.existsSync(path.join(rootPath, f)));
}

function countLinesOfFile(filePath: string, maxBytes: number): number {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > maxBytes) return 0;
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

interface LanguageStats {
  fileCount: number;
  lineCount: number;
}

/** Menghitung jumlah file & baris kode per ekstensi, berjalan rekursif dengan batas kedalaman. */
function computeLanguageBreakdown(
  rootPath: string,
  maxDepth: number
): { breakdown: { extension: string; fileCount: number; lineCount: number }[]; totalFiles: number; totalLines: number } {
  const stats = new Map<string, LanguageStats>();
  let totalFiles = 0;
  let totalLines = 0;

  function visit(dirPath: string, depth: number) {
    if (depth > maxDepth) return;
    let names: string[];
    try {
      names = fs.readdirSync(dirPath);
    } catch {
      return;
    }

    for (const name of names) {
      if (name.startsWith(".")) continue;
      if (isIgnoredDir(name)) continue;

      const fullPath = path.join(dirPath, name);
      let stat: fs.Stats;
      try {
        stat = fs.lstatSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        visit(fullPath, depth + 1);
        continue;
      }
      if (!stat.isFile()) continue;

      const ext = path.extname(name).toLowerCase();
      if (!LANGUAGE_EXTENSIONS.has(ext)) continue;

      const lines = countLinesOfFile(fullPath, 2_000_000);
      const existing = stats.get(ext) ?? { fileCount: 0, lineCount: 0 };
      existing.fileCount += 1;
      existing.lineCount += lines;
      stats.set(ext, existing);

      totalFiles += 1;
      totalLines += lines;
    }
  }

  visit(rootPath, 0);

  const breakdown = Array.from(stats.entries())
    .map(([extension, s]) => ({ extension, fileCount: s.fileCount, lineCount: s.lineCount }))
    .sort((a, b) => b.lineCount - a.lineCount);

  return { breakdown, totalFiles, totalLines };
}

/** Analisis arsitektur menyeluruh: tech stack, dependencies, entry point, komposisi bahasa. */
export function analyzeArchitecture(rootPath: string, maxDepth = 4): ArchitectureAnalysis {
  const ecosystems = detectEcosystems(rootPath);
  const pkg = readJsonSafe(path.join(rootPath, "package.json"));
  const configFiles = listConfigFiles(rootPath);
  const entryPoints = findEntryPoints(rootPath, pkg);
  const { breakdown, totalFiles, totalLines } = computeLanguageBreakdown(rootPath, maxDepth);

  const hasDocker =
    fs.existsSync(path.join(rootPath, "Dockerfile")) ||
    fs.existsSync(path.join(rootPath, "docker-compose.yml")) ||
    fs.existsSync(path.join(rootPath, "docker-compose.yaml"));
  const hasCI =
    fs.existsSync(path.join(rootPath, ".github", "workflows")) ||
    fs.existsSync(path.join(rootPath, ".gitlab-ci.yml"));
  const hasTests =
    fs.existsSync(path.join(rootPath, "test")) ||
    fs.existsSync(path.join(rootPath, "tests")) ||
    fs.existsSync(path.join(rootPath, "__tests__")) ||
    (pkg?.devDependencies &&
      Object.keys(pkg.devDependencies).some((d) =>
        ["jest", "vitest", "mocha", "playwright", "cypress"].includes(d)
      ));

  return {
    rootPath,
    ecosystems,
    configFiles,
    entryPoints,
    languageBreakdown: breakdown,
    totalFiles,
    totalLines,
    hasDocker,
    hasCI,
    hasTests: Boolean(hasTests),
  };
}
