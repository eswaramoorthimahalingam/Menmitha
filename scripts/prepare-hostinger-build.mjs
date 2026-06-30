import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const siteUrl = "https://menmithafoodproducts.com";
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

const sitemapPaths = [
  "/",
  "/about",
  "/shop",
  "/contact",
  "/product/groundnut-oil-1l",
  "/product/sesame-oil-1l",
  "/product/coconut-oil-500ml",
  "/product/sambar-masala-200g",
  "/product/milagai-powder-200g",
  "/product/manjal-powder-200g",
  "/product/jaggery-powder-500g",
  "/product/wheat-flour-1kg",
  "/product/shikakai-powder-200g",
];

writeFileSync(
  path.join(buildDir, "robots.txt"),
  [`User-agent: *`, `Allow: /`, `Sitemap: ${siteUrl}/sitemap.xml`, ""].join("\n"),
);

writeFileSync(
  path.join(buildDir, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapPaths.map((routePath) => {
      const loc = routePath === "/" ? `${siteUrl}/` : `${siteUrl}${routePath}`;
      return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${routePath === "/" ? "1.0" : "0.8"}</priority></url>`;
    }),
    "</urlset>",
    "",
  ].join("\n"),
);

writeFileSync(
  path.join(buildDir, ".htaccess"),
  [
    "Options -Indexes",
    "",
    "<IfModule mod_headers.c>",
    '  Header always set X-Content-Type-Options "nosniff"',
    '  Header always set X-Frame-Options "SAMEORIGIN"',
    '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"',
    "</IfModule>",
    "",
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
