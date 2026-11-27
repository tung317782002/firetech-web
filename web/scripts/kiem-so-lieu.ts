/*
 * Kiểm tra số liệu: máy tính nhanh trong thư viện, dữ liệu 5 tình huống mô phỏng, tin tức và phương pháp chung.
 * Không thay thế việc đối chiếu với tài liệu nguồn.
 * Chạy:  node scripts/kiem-so-lieu.ts   (Node 22+, không cần build)
 */
import { calcs } from "../src/data/calcs.ts"
import { docs } from "../src/data/library.ts"
import { topics } from "../src/data/topics.ts"
import { scenarios } from "../src/data/scenarios.ts"
import { method } from "../src/data/method.ts"
import { XLSX_FILES } from "../src/data/files.ts"
import { news } from "../src/data/news.generated.ts"

let fail = 0
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) fail++
  console.log(`${ok ? "✓" : "✗"} ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (cần ${JSON.stringify(expected)})`}`)
}
const run = (id: string, v: Record<string, number>) => calcs[id].run(v).map((r) => r.value)
const defaults = (id: string) => Object.fromEntries(calcs[id].inputs.map((i) => [i.id, Number(i.value)]))

// Máy tính nhanh
eq(run("dstar", { q: 1000 })[0], "0,959 m", "D* với Q = 1000 kW")
eq(run("hrr", { alpha: 0.0469, t: 100 })[0], "469 kW", "Q = 0,0469 × 100²")
eq(run("rset", defaults("rset"))[0], "195 s", "RSET mặc định")
eq(run("flow", { d: 1.5 })[0], "0,841 m/s", "vận tốc dòng người tại D = 1,5")
eq(run("vis", { c: 3, k: 0.3 })[0], "10 m", "tầm nhìn C = 3, K = 0,3")

// Thư viện
eq(docs.length, 21, "số tài liệu")
eq(topics.length, 9, "số đề tài")
eq(Object.keys(XLSX_FILES).length, 4, "số file Excel nhúng")
eq(docs.filter((d) => d.type === "excel").every((d) => d.type === "excel" && d.file in XLSX_FILES), true, "mọi tài liệu Excel đều có file nhúng")

// Tình huống (chữ khái quát, không có bảng số liệu) và phương pháp chung
eq(scenarios.length, 5, "số tình huống")
eq(scenarios.every((sc) => sc.simulation.length > 0 && sc.observations.length > 0 && sc.lessons.length > 0), true, "mỗi tình huống đủ nội dung mô phỏng, quan sát, bài học")
eq(Math.round(0.0469 * 173 ** 2), 1404, "đường cong t²: đỉnh khoảng 1.400 kW tại 173 s (dùng trong bài viết HRR)")
eq(method.criteria.rows.length, 4, "số tiêu chí an toàn")

// Tin tức: dữ liệu sinh từ web/tin-tuc/*.md
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())
eq(news.every((n, i) => i === 0 || news[i - 1].date >= n.date), true, "tin xếp từ mới tới cũ")
eq(news.every((n) => n.date <= today), true, "không có tin hẹn ngày trong danh sách hiển thị")
eq(new Set(news.map((n) => n.slug)).size, news.length, "slug tin không trùng")
eq(news.every((n) => !n.image || n.imageAlt), true, "tin có ảnh đều có alt")

console.log(fail ? `\n${fail} lỗi` : "\nSố liệu nhất quán.")
process.exit(fail ? 1 : 0)
