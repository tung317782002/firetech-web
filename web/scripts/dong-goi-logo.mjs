/*
 * Nhúng logo vào bundle: đọc public/media/logo.webp và ghi src/data/logo.ts (data URI + kích thước thật lấy từ logo.png).
 * Cần để logo hiện cả khi mở web/bundle.html độc lập (Parcel không chép thư mục public).
 * Chạy sau khi thay file logo:  node scripts/dong-goi-logo.mjs
 */
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const dir = path.join(root, "public/media")
const png = fs.readFileSync(path.join(dir, "logo.png"))
const width = png.readUInt32BE(16)
const height = png.readUInt32BE(20)
const b64 = fs.readFileSync(path.join(dir, "logo.webp")).toString("base64")

fs.writeFileSync(
  path.join(root, "src/data/logo.ts"),
  `// File tự sinh bởi scripts/dong-goi-logo.mjs từ public/media/logo.webp. Không sửa tay.
export const LOGO = {
  src: "data:image/webp;base64,${b64}",
  width: ${width},
  height: ${height},
}
`,
)
console.log(`Đã ghi src/data/logo.ts (${width}×${height}, ${Math.round(b64.length / 1024)} KB base64)`)
