/*
 * Ghép thư mục đăng web (giống nhau cho workflow và kiểm thử cục bộ):
 *   index.html = bundle.html, trang tin/feed/font/sitemap từ dist-tin, public/ (media, ảnh tin), robots.txt,
 *   favicon.svg và ảnh chia sẻ og.png ở gốc repo.
 * Chạy sau `pnpm bundle`:  node scripts/ghep-site.mjs [thư-mục-đích]   (mặc định web/site, không commit)
 */
import fs from "node:fs"
import path from "node:path"

const web = path.resolve(import.meta.dirname, "..")
const repo = path.resolve(web, "..")
const out = path.resolve(process.argv[2] ?? path.join(web, "site"))

for (const f of ["bundle.html", "dist-tin/tin-tuc/index.html", "dist-tin/sitemap.xml"]) {
  if (!fs.existsSync(path.join(web, f))) {
    console.error(`Thiếu web/${f}: chạy pnpm bundle trước.`)
    process.exit(1)
  }
}
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(path.join(out, "assets/img"), { recursive: true })
fs.copyFileSync(path.join(web, "bundle.html"), path.join(out, "index.html"))
for (const f of ["robots.txt", "favicon.svg"]) fs.copyFileSync(path.join(repo, f), path.join(out, f))
fs.copyFileSync(path.join(repo, "assets/img/og.png"), path.join(out, "assets/img/og.png"))
if (fs.existsSync(path.join(web, "public"))) fs.cpSync(path.join(web, "public"), out, { recursive: true })
fs.cpSync(path.join(web, "dist-tin"), out, { recursive: true })

const html = fs.readFileSync(path.join(out, "index.html"), "utf8")
if (!/rel="?canonical"? href="?https:\/\/firetech\.edu\.vn\//.test(html) || !html.includes("application/ld+json")) {
  console.error("index.html thiếu canonical hoặc JSON-LD.")
  process.exit(1)
}
for (const d of fs.readdirSync(path.join(out, "tin-tuc"), { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  const page = fs.readFileSync(path.join(out, "tin-tuc", d.name, "index.html"), "utf8")
  if (!page.includes('rel="canonical" href="https://firetech.edu.vn/tin-tuc/')) {
    console.error(`Thiếu canonical: tin-tuc/${d.name}/index.html`)
    process.exit(1)
  }
}
console.log(`Đã ghép thư mục đăng: ${out}`)
