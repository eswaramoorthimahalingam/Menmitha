import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, ".output", "public");
const buildDir = path.join(root, "build");
const fallbackHtml = path.join(sourceDir, ".html");
const indexHtml = path.join(sourceDir, "index.html");

if (!existsSync(sourceDir)) {
  throw new Error("Expected .output/public after vite build, but it was not found.");
}

if (existsSync(fallbackHtml)) {
  cpSync(fallbackHtml, indexHtml);
}

if (!existsSync(indexHtml)) {
  throw new Error("Expected .output/public/index.html after prerender, but it was not found.");
}

rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });
cpSync(sourceDir, buildDir, { recursive: true });

writeFileSync(
  path.join(buildDir, ".htaccess"),
  [
    "<IfModule mod_rewrite.c>",
    "  RewriteEngine On",
    "  RewriteBase /",
    "  RewriteRule ^index\\.html$ - [L]",
    "  RewriteCond %{REQUEST_FILENAME} !-f",
    "  RewriteCond %{REQUEST_FILENAME} !-d",
    "  RewriteRule . /index.html [L]",
    "</IfModule>",
    "",
  ].join("\n"),
);

console.log("Prepared Hostinger static output in build/");
