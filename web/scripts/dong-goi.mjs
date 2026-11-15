/*
 * Đóng gói thành MỘT file HTML (web/bundle.html): chạy Parcel như script của skill web-artifacts-builder,
 * rồi ghép CSS, JS và font woff2 (data URI) vào index.html. Khác script mẫu: không đụng tới các thẻ
 * <link> không phải stylesheet (canonical, icon) nên giữ nguyên SEO, và nhúng cả font để file chạy độc lập.
 * Chạy:  pnpm bundle
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const dist = path.join(root, "dist")

fs.rmSync(dist, { recursive: true, force: true })
execSync("pnpm exec parcel build index.html --dist-dir dist --no-source-maps", { cwd: root, stdio: "inherit" })

let html = fs.readFileSync(path.join(dist, "index.html"), "utf8")
const read = (p) => fs.readFileSync(path.join(dist, p.replace(/^\//, "")))

// 1. Stylesheet: nhúng, bỏ font .woff dự phòng, đổi font .woff2 sang data URI
html = html.replace(/<link\b[^>]*\brel=["']?stylesheet["']?[^>]*>/i, (tag) => {
  const href = tag.match(/\bhref=["']?([^"'\s>]+)/i)[1]
  let css = read(href).toString("utf8")
  css = css.replace(/,\s*url\([^)]*\.woff\)\s*format\(["']?woff["']?\)/g, "")
  css = css.replace(/url\(["']?([^"')]+\.woff2)["']?\)/g, (_, u) => `url(data:font/woff2;base64,${read(u.replace(/^\.\//, "")).toString("base64")})`)
  return `<style>${css}</style>`
})

// 2. Script: nhúng và đặt cuối body để chạy sau khi có #root
let moduleAttr = ""
html = html.replace(/<script\b[^>]*\bsrc=["']?([^"'\s>]+)["']?[^>]*><\/script>/i, (tag, src) => {
  if (/\btype=["']?module/i.test(tag)) moduleAttr = ' type="module"'
  return `<!--JS:${src}-->`
})
html = html.replace(/<!--JS:([^>]+)-->/, "")
const srcMatch = fs.readdirSync(dist).find((f) => f.endsWith(".js"))
const js = read(srcMatch).toString("utf8").replace(/<\/script/gi, "<\\/script")
const scriptTag = `<script${moduleAttr}>${js}</script>`
// Parcel nén HTML và có thể bỏ thẻ đóng </body>: chèn trước nếu có, nếu không thì thêm vào cuối
html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${scriptTag}</body>`) : `${html}${scriptTag}`

fs.writeFileSync(path.join(root, "bundle.html"), html)
const kb = Math.round(fs.statSync(path.join(root, "bundle.html")).size / 1024)
console.log(`\nĐã tạo web/bundle.html (${kb} KB)`)
