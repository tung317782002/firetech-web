/*
 * Kiểm tra số liệu: máy tính nhanh trong thư viện và các bảng RSET/ASET của 5 tình huống mô phỏng.
 * Chỉ kiểm phép tính (cộng các thành phần RSET, yêu cầu 1,5 × RSET, hệ số ASET/RSET, kiểm tra đỉnh đường cong t²);
 * không thay thế việc đối chiếu với tài liệu nguồn.
 * Chạy:  node scripts/kiem-so-lieu.ts   (Node 22+, không cần build)
 */
import { calcs } from "../src/data/calcs.ts"
import { docs } from "../src/data/library.ts"
import { topics } from "../src/data/topics.ts"
import { scenarios } from "../src/data/scenarios.ts"
import { method } from "../src/data/method.ts"
import { XLSX_FILES } from "../src/data/files.ts"

let fail = 0
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) fail++
  console.log(`${ok ? "✓" : "✗"} ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (cần ${JSON.stringify(expected)})`}`)
}
const run = (id: string, v: Record<string, number>) => calcs[id].run(v).map((r) => r.value)
const defaults = (id: string) => Object.fromEntries(calcs[id].inputs.map((i) => [i.id, Number(i.value)]))
/** Lấy số đầu tiên trong chuỗi, ví dụ "250 giây" → 250, "khoảng 2,4" → 2.4. */
const num = (s: string) => Number((s.match(/\d+(?:,\d+)?/)?.[0] ?? "NaN").replace(",", "."))

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

// Tình huống: cộng các thành phần RSET, yêu cầu 1,5 × RSET, hệ số ASET/RSET
eq(scenarios.length, 5, "số tình huống")
const sum = (s: string) => {
  const [parts, total] = s.split("=")
  return { sum: parts.split("+").reduce((a, b) => a + num(b), 0), total: num(total) }
}
const ga = scenarios[0].table!.rows
for (const r of ga) {
  const { sum: s, total } = sum(r[1])
  eq(s, total, `RSET cộng đúng: ${r[0]}`)
  eq(num(r[2]) , total * 1.5, `yêu cầu 1,5 × RSET: ${r[0]}`)
}
const kho = scenarios[1].table!.rows
for (const r of kho) {
  const { sum: s, total } = sum(r[1])
  eq(s, total, `RSET cộng đúng: ${r[0]}`)
  const ratio = num(r[2]) / total
  eq(Number(ratio.toFixed(1)), num(r[3]), `hệ số ASET/RSET: ${r[0]}`)
}
eq(Math.round(0.0469 * 173 ** 2), 1404, "đường cong t²: đỉnh khoảng 1.400 kW tại 173 s")
eq(method.criteria.rows.length, 4, "số tiêu chí an toàn")

console.log(fail ? `\n${fail} lỗi` : "\nSố liệu nhất quán.")
process.exit(fail ? 1 : 0)
