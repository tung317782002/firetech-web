/*
 * Tạo mục tin tức từ các file Markdown trong web/tin-tuc/ (tên YYYY-MM-DD-slug.md).
 * Ghi ra:
 *   - src/data/news.generated.ts : danh sách tin gọn cho trang chủ (nhúng lúc build, không gọi mạng)
 *   - dist-tin/tin-tuc/          : trang danh sách, từng trang bài, feed.xml
 *   - dist-tin/sitemap.xml       : trang chủ, danh sách và từng bài
 *   - dist-tin/assets/fonts/     : font dùng chung cho các trang tĩnh
 * Tin có ngày ở tương lai (múi giờ Việt Nam) chưa hiện: chạy lại hằng ngày để tin hẹn giờ tự lên.
 * File bắt đầu bằng "_" và README.md bị bỏ qua. Lỗi dữ liệu → báo rõ tên file và thoát mã 1.
 * Chạy:  pnpm tao-tin-tuc
 */
import fs from "node:fs"
import path from "node:path"
import { marked } from "marked"
import { config } from "../src/data/config.ts"

const root = path.resolve(import.meta.dirname, "..")
const SRC = path.join(root, "tin-tuc")
const OUT = path.join(root, "dist-tin")
const SITE = "https://firetech.edu.vn/"
const OG_DEFAULT = `${SITE}assets/img/og.png`
const TODAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())

const errors = []
const fail = (file, msg) => errors.push(`${file}: ${msg}`)

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const dateVi = (iso) => iso.split("-").reverse().join("/")
const monthVi = (iso) => `Tháng ${Number(iso.slice(5, 7))}/${iso.slice(0, 4)}`

/** Đọc front matter dạng `khóa: giá trị` giữa hai dòng `---`. */
function parse(raw) {
  const m = raw.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return null
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue
    const i = line.indexOf(":")
    if (i < 0) continue
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, "$2")
  }
  return { meta, body: m[2].trim() }
}

function load() {
  const posts = []
  const seen = new Set()
  for (const file of fs.readdirSync(SRC).sort()) {
    if (!file.endsWith(".md") || file.startsWith("_") || file.toLowerCase() === "readme.md") continue
    const name = file.replace(/\.md$/, "")
    const nm = name.match(/^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/)
    if (!nm) {
      fail(file, "tên file phải dạng YYYY-MM-DD-slug.md (slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang)")
      continue
    }
    const parsed = parse(fs.readFileSync(path.join(SRC, file), "utf8"))
    if (!parsed) {
      fail(file, "thiếu phần đầu --- … --- (front matter)")
      continue
    }
    const { meta, body } = parsed
    const slug = nm[2]
    for (const k of ["tieu_de", "ngay", "tom_tat"]) if (!meta[k]) fail(file, `thiếu "${k}"`)
    if (meta.ngay && (!/^\d{4}-\d{2}-\d{2}$/.test(meta.ngay) || Number.isNaN(Date.parse(meta.ngay)))) fail(file, `"ngay" phải dạng YYYY-MM-DD (đang là "${meta.ngay}")`)
    if (meta.ngay && meta.ngay !== nm[1]) fail(file, `"ngay" (${meta.ngay}) phải trùng ngày trong tên file (${nm[1]})`)
    if (meta.anh && !meta.anh_alt) fail(file, 'có "anh" thì phải có "anh_alt" (mô tả ảnh bằng tiếng Việt)')
    if (meta.anh && /^(https?:)?\/\//.test(meta.anh)) fail(file, '"anh" phải là đường dẫn trong web/public (ví dụ tin-tuc/anh.webp), không dùng liên kết ngoài')
    if (!body) fail(file, "nội dung bài trống")
    if (seen.has(slug)) fail(file, `slug "${slug}" bị trùng`)
    seen.add(slug)
    posts.push({
      slug,
      title: meta.tieu_de,
      date: meta.ngay,
      summary: meta.tom_tat,
      image: meta.anh || "",
      imageAlt: meta.anh_alt || "",
      label: meta.nhan || "",
      source: meta.nguon || "",
      html: body ? marked.parse(body) : "",
    })
  }
  return posts
}

const posts = load()
if (errors.length) {
  console.error(`Tin tức có ${errors.length} lỗi, không tạo trang:`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
const shown = posts.filter((p) => p.date <= TODAY).sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)))
const hidden = posts.length - shown.length

// ---------- 1. Dữ liệu cho trang chủ ----------
const compact = shown.map(({ slug, title, date, summary, image, imageAlt, label }) => ({ slug, title, date, summary, image, imageAlt, label }))
fs.writeFileSync(
  path.join(root, "src/data/news.generated.ts"),
  `// File tự sinh bởi scripts/tao-tin-tuc.mjs từ web/tin-tuc/*.md. Không sửa tay.
export interface NewsItem {
  slug: string
  title: string
  /** Ngày đăng, dạng YYYY-MM-DD. */
  date: string
  summary: string
  /** Đường dẫn ảnh tính từ gốc trang (ví dụ tin-tuc/anh.webp); trống nếu không có ảnh. */
  image: string
  imageAlt: string
  label: string
}

export const news: NewsItem[] = ${JSON.stringify(compact, null, 2)}
`,
)

// ---------- 2. Trang tĩnh ----------
fs.rmSync(OUT, { recursive: true, force: true })
const write = (rel, content) => {
  const f = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, content)
}

// Logo và icon dùng chung (cũng có trong web/public/media, workflow chép thư mục đó; chép ở đây để dist-tin tự đủ khi chạy thử)
for (const f of ["logo.webp", "apple-touch-icon.png"]) {
  fs.mkdirSync(path.join(OUT, "media"), { recursive: true })
  fs.copyFileSync(path.join(root, "public/media", f), path.join(OUT, "media", f))
}

// Font dùng chung
const fontDir = path.join(root, "node_modules/@fontsource/be-vietnam-pro/files")
const SUBSETS = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  vietnamese: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB",
}
let fontFaces = ""
for (const [subset, range] of Object.entries(SUBSETS)) {
  for (const w of [400, 600, 800]) {
    const f = `be-vietnam-pro-${subset}-${w}-normal.woff2`
    fs.mkdirSync(path.join(OUT, "assets/fonts"), { recursive: true })
    fs.copyFileSync(path.join(fontDir, f), path.join(OUT, "assets/fonts", f))
    fontFaces += `@font-face{font-family:"Be Vietnam Pro";font-style:normal;font-display:swap;font-weight:${w};src:url(FONTS/${f}) format("woff2");unicode-range:${range}}\n`
  }
}

const CSS = `
:root{--paper:#f6f3ec;--ink:#10131c;--ember:#e8501a;--ember-dark:#c2410c;--ember-soft:#fde4d6;--teal:#0f8f6f;--border:#d8d2c4;--muted:#4d5566;--card:#fffdf9}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.7 "Be Vietnam Pro",system-ui,"Segoe UI",sans-serif}
a{color:var(--ember-dark)}a:focus-visible{outline:3px solid var(--ember);outline-offset:2px}
img{max-width:100%;height:auto;display:block}
.wrap{width:100%;max-width:1100px;margin:0 auto;padding:0 16px}
.narrow{max-width:760px}
header.top{position:sticky;top:0;z-index:5;background:rgba(246,243,236,.94);backdrop-filter:blur(6px);border-bottom:1px solid var(--border)}
header.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:64px}
.brand{display:inline-flex;align-items:center;color:var(--ink);text-decoration:none}.brand img{height:32px;width:auto}
nav.links{display:flex;gap:4px;flex-wrap:wrap}
nav.links a{padding:8px 12px;border-radius:999px;color:var(--ink);text-decoration:none;font-weight:600;font-size:15px}
nav.links a:hover,nav.links a[aria-current]{background:var(--ink);color:#fff}
main{padding:32px 0 56px}
.crumbs{font-size:14px;color:var(--muted);margin:0 0 16px}.crumbs a{color:var(--muted)}
h1{font-weight:800;font-size:clamp(1.7rem,5vw,2.6rem);line-height:1.2;margin:0 0 12px;letter-spacing:-.01em}
h2{font-weight:800;font-size:1.5rem;line-height:1.3;margin:2em 0 .5em}
h3{font-weight:800;font-size:1.2rem;margin:1.6em 0 .4em}
.meta{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;font-size:14px;color:var(--muted);margin:0 0 20px}
.tag{background:var(--ember-soft);color:var(--ember-dark);font-weight:700;border-radius:3px;padding:2px 8px;font-size:13px}
.lead{font-size:1.15rem;color:#2c3340;margin:0 0 24px}
.cover{border:1px solid var(--border);border-radius:4px;margin:0 0 28px;overflow:hidden;background:var(--card)}
.prose p,.prose ul,.prose ol{margin:0 0 1.1em}.prose ul,.prose ol{padding-left:1.4em}.prose li{margin:.3em 0}
.prose blockquote{margin:1.2em 0;padding:.2em 1em;border-left:4px solid var(--ember);color:#2c3340}
.prose table{border-collapse:collapse;width:100%;font-size:15px;display:block;overflow-x:auto}.prose th,.prose td{border:1px solid var(--border);padding:8px 10px;text-align:left}.prose th{background:var(--ink);color:#fff}
.src{font-size:14px;color:var(--muted);border-top:1px solid var(--border);margin-top:28px;padding-top:14px}
.related{margin-top:48px;border-top:1px solid var(--border);padding-top:24px}
.cards{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));list-style:none;margin:0;padding:0}
.card{display:block;height:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px;text-decoration:none;color:var(--ink)}
.card:hover{border-color:var(--ink)}.card b{display:block;line-height:1.35;margin:4px 0 6px}.card span{font-size:14px;color:var(--muted)}
.month{font-size:1rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:2em 0 .8em}
.btn{display:inline-block;margin-top:24px;padding:12px 22px;border-radius:999px;background:var(--ember);color:#fff;font-weight:700;text-decoration:none}.btn:hover{background:var(--ember-dark)}
footer.bot{border-top:1px solid var(--border);background:#efeadd;padding:24px 0;font-size:15px;color:var(--muted)}
footer.bot a{color:var(--ink)}
@media (min-width:640px){.brand img{height:40px}}
@media (max-width:480px){body{font-size:16px}nav.links a{padding:8px 9px;font-size:14px}.brand span{font-size:17px}}
`

const FAVICON = `data:image/png;base64,${fs.readFileSync(path.join(root, "public/media/favicon-32.png")).toString("base64")}`
const { contact, brand } = config
const png = fs.readFileSync(path.join(root, "public/media/logo.png"))
const LOGO_W = png.readUInt32BE(16)
const LOGO_H = png.readUInt32BE(20)

/** Khung trang chung. rel: đường dẫn tương đối về gốc site (ví dụ "../../"). */
function page({ rel, title, description, canonical, og, jsonLd, body, current }) {
  const ogImage = og.image || OG_DEFAULT
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#10131c">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${FAVICON}" type="image/png">
<link rel="apple-touch-icon" href="${rel}media/apple-touch-icon.png">
<meta property="og:type" content="${og.type}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="${esc(brand.name)}">
<meta property="og:title" content="${esc(og.title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
${og.published ? `<meta property="article:published_time" content="${og.published}">\n` : ""}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(og.title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="alternate" type="application/rss+xml" title="${esc(brand.name)} – Tin tức" href="${rel}tin-tuc/feed.xml">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
<style>${fontFaces.replace(/FONTS\//g, `${rel}assets/fonts/`)}${CSS}</style>
</head>
<body>
<a href="#noi-dung" style="position:absolute;left:-999px" onfocus="this.style.left='8px'">Bỏ qua điều hướng</a>
<header class="top"><div class="wrap">
<a class="brand" href="${rel}" aria-label="${esc(brand.name)}, về trang chủ"><img src="${rel}media/logo.webp" alt="Logo ${esc(brand.name)}" width="${LOGO_W}" height="${LOGO_H}"></a>
<nav class="links" aria-label="Điều hướng chính"><a href="${rel}">Trang chủ</a><a href="${rel}tin-tuc/"${current === "list" ? ' aria-current="page"' : ""}>Tin tức</a><a href="tel:${contact.phoneTel}">${contact.phoneDisplay}</a></nav>
</div></header>
<main id="noi-dung"><div class="wrap narrow">
${body}
</div></main>
<footer class="bot"><div class="wrap">
<p style="margin:0 0 6px"><strong>${esc(brand.name)}</strong> · ${brand.domain}</p>
<p style="margin:0"><a href="tel:${contact.phoneTel}">${contact.phoneDisplay}</a> · <a href="mailto:${contact.email}">${contact.email}</a></p>
</div></footer>
</body>
</html>
`
}

const card = (p, rel) => `<li><a class="card" href="${rel}${p.slug}/">${p.label ? `<span class="tag">${esc(p.label)}</span> ` : ""}<span>${dateVi(p.date)}</span><b>${esc(p.title)}</b><span>${esc(p.summary)}</span></a></li>`

// Trang bài
for (const p of shown) {
  const url = `${SITE}tin-tuc/${p.slug}/`
  const imgUrl = p.image ? `${SITE}${p.image}` : ""
  const related = shown.filter((x) => x.slug !== p.slug).slice(0, 3)
  const body = `<nav class="crumbs" aria-label="Đường dẫn"><a href="../../">Trang chủ</a> › <a href="../">Tin tức</a> › <span aria-current="page">${esc(p.title)}</span></nav>
<article>
<header>
<h1>${esc(p.title)}</h1>
<p class="meta">${p.label ? `<span class="tag">${esc(p.label)}</span>` : ""}<time datetime="${p.date}">${dateVi(p.date)}</time></p>
<p class="lead">${esc(p.summary)}</p>
</header>
${p.image ? `<figure class="cover" style="margin-left:0;margin-right:0"><img src="../../${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy" decoding="async"></figure>` : ""}
<div class="prose">${p.html}</div>
${p.source ? `<p class="src">Nguồn: ${esc(p.source)}</p>` : ""}
</article>
${related.length ? `<section class="related" aria-labelledby="lq"><h2 id="lq" style="margin-top:0">Tin liên quan</h2><ul class="cards">${related.map((r) => card(r, "../")).join("")}</ul></section>` : ""}
<a class="btn" href="../">Xem tất cả tin</a>`
  write(
    `tin-tuc/${p.slug}/index.html`,
    page({
      rel: "../../",
      title: `${p.title} – ${brand.name}`,
      description: p.summary,
      canonical: url,
      og: { type: "article", title: p.title, image: imgUrl, published: p.date },
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NewsArticle",
            headline: p.title,
            description: p.summary,
            datePublished: p.date,
            dateModified: p.date,
            inLanguage: "vi",
            mainEntityOfPage: url,
            image: [imgUrl || OG_DEFAULT],
            author: { "@type": "Organization", name: brand.name, url: SITE },
            publisher: { "@type": "Organization", name: brand.name, url: SITE },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE },
              { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE}tin-tuc/` },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          },
        ],
      },
      body,
    }),
  )
}

// Trang danh sách, nhóm theo tháng
{
  let html = `<nav class="crumbs" aria-label="Đường dẫn"><a href="../">Trang chủ</a> › <span aria-current="page">Tin tức</span></nav>
<h1>Tin tức</h1>
<p class="lead">Tin cập nhật về an toàn cháy, thoát nạn và mô phỏng. Tin mới nhất ở trên cùng.</p>
`
  if (!shown.length) html += `<p>Chưa có tin nào.</p>`
  let month = ""
  for (const p of shown) {
    if (monthVi(p.date) !== month) {
      if (month) html += `</ul>`
      month = monthVi(p.date)
      html += `<h2 class="month">${month}</h2><ul class="cards">`
    }
    html += card(p, "")
  }
  if (shown.length) html += `</ul>`
  write(
    "tin-tuc/index.html",
    page({
      rel: "../",
      title: `Tin tức – ${brand.name}`,
      description: "Tin cập nhật về an toàn cháy, thoát nạn và mô phỏng cháy bằng PyroSim, FDS, Pathfinder.",
      canonical: `${SITE}tin-tuc/`,
      og: { type: "website", title: `Tin tức – ${brand.name}`, image: "" },
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE },
              { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE}tin-tuc/` },
            ],
          },
        ],
      },
      body: html,
      current: "list",
    }),
  )
}

// RSS
write(
  "tin-tuc/feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(brand.name)} – Tin tức</title><link>${SITE}tin-tuc/</link><description>Tin cập nhật về an toàn cháy và thoát nạn</description><language>vi</language>
${shown.slice(0, 30).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}tin-tuc/${p.slug}/</link><guid>${SITE}tin-tuc/${p.slug}/</guid><pubDate>${new Date(`${p.date}T00:00:00+07:00`).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`).join("\n")}
</channel></rss>
`,
)

// Sitemap
const latest = shown[0]?.date
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc>${latest ? `<lastmod>${latest}</lastmod>` : ""}<changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE}tin-tuc/</loc>${latest ? `<lastmod>${latest}</lastmod>` : ""}<changefreq>daily</changefreq><priority>0.8</priority></url>
${shown.map((p) => `  <url><loc>${SITE}tin-tuc/${p.slug}/</loc><lastmod>${p.date}</lastmod><priority>0.6</priority></url>`).join("\n")}
</urlset>
`,
)

console.log(`Tin tức: ${shown.length} tin hiển thị${hidden ? `, ${hidden} tin hẹn ngày (chưa hiện)` : ""}. Hôm nay (giờ Việt Nam): ${TODAY}.`)
