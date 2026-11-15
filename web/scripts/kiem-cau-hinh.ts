/*
 * Kiểm tra cấu hình bản React trước khi công bố: giá trị mẫu trong config.ts (lỗi, thoát mã 1)
 * và vị trí ảnh/video còn trống trong media.ts (chỉ là lưu ý, vì để trống là chủ đích).
 * Chạy:  node scripts/kiem-cau-hinh.ts   (hoặc  pnpm kiem-cau-hinh)
 */
import { config } from "../src/data/config.ts"
import { mediaSlots } from "../src/data/media.ts"

const todo: string[] = []
const c = config.contact
if (/0900\s?000\s?000/.test(c.phoneDisplay) || /0900000000/.test(c.phoneTel)) todo.push("contact.phoneDisplay / phoneTel: số điện thoại mẫu")
if (/^lienhe@firetech\.edu\.vn$/.test(c.email)) todo.push(`contact.email: email mẫu ${c.email}`)
if (/zalo\.me\/0900000000/.test(c.zalo)) todo.push(`contact.zalo: liên kết Zalo mẫu ${c.zalo}`)
config.zaloGroups.forEach((g, i) => {
  if (/thay-ma-nhom/.test(g.url)) todo.push(`zaloGroups[${i}].url: link nhóm "${g.name}" còn là mẫu`)
})

const notes: string[] = []
if (!config.registerEndpoint) notes.push("registerEndpoint để trống: form chuẩn bị nội dung để học viên gửi qua Zalo/email (không lưu đăng ký trên máy chủ).")
const emptySlots = mediaSlots.filter((s) => !s.src.trim())
if (emptySlots.length) notes.push(`${emptySlots.length}/${mediaSlots.length} vị trí ảnh/video đang để trống (xem web/MEDIA.md): ${emptySlots.map((s) => s.id).join(", ")}`)
const noAlt = mediaSlots.filter((s) => s.src.trim() && !(s.alt ?? "").trim())
if (noAlt.length) todo.push(`vị trí có src nhưng thiếu alt/tiêu đề: ${noAlt.map((s) => s.id).join(", ")}`)

if (notes.length) {
  console.log("Lưu ý:")
  notes.forEach((n) => console.log(`  - ${n}`))
}
if (!todo.length) {
  console.log("Cấu hình đã thay hết giá trị mẫu.")
  process.exit(0)
}
console.log(`Còn ${todo.length} mục cần xử lý:`)
todo.forEach((t) => console.log(`  - ${t}`))
process.exit(1)
