/*
 * Kiểm tra số liệu của mô hình mặt bằng và máy tính nhanh trùng với bản tĩnh đã kiểm.
 * Chạy:  node scripts/kiem-so-lieu.ts   (Node 22+, không cần build)
 */
import { RSET, ASET, stats, agents, hrr, smokeLen, compose, renderCad } from "../src/lib/plan.ts"
import { calcs } from "../src/data/calcs.ts"
import { docs } from "../src/data/library.ts"
import { topics } from "../src/data/topics.ts"
import { XLSX_FILES } from "../src/data/files.ts"

let fail = 0
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) fail++
  console.log(`${ok ? "✓" : "✗"} ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (cần ${JSON.stringify(expected)})`}`)
}
const run = (id: string, v: Record<string, number>) => calcs[id].run(v).map((r) => r.value)
const defaults = (id: string) => Object.fromEntries(calcs[id].inputs.map((i) => [i.id, Number(i.value)]))

eq(agents.length, 48, "số người")
eq(RSET, 99, "RSET minh họa (s)")
eq(ASET, 201, "ASET minh họa (s)")
const s90 = stats(90)
eq([s90.out, s90.total], [42, 48], "đã thoát / tổng tại t = 90 s")
eq(stats(250).out, 48, "tại t = 250 s tất cả đã thoát")
eq(stats(0).out, 0, "tại t = 0 chưa ai thoát")
eq(Math.round(hrr(100)), 469, "HRR tại t = 100 s (kW)")
eq(smokeLen(45), 0, "khói chưa lan tại t = 45 s")
eq(run("dstar", { q: 1000 })[0], "0,959 m", "D* với Q = 1000 kW")
eq(run("hrr", { alpha: 0.0469, t: 100 })[0], "469 kW", "Q = 0,0469 × 100²")
eq(run("rset", defaults("rset"))[0], "195 s", "RSET mặc định")
eq(run("flow", { d: 1.5 })[0], "0,841 m/s", "vận tốc dòng người tại D = 1,5")
eq(run("vis", { c: 3, k: 0.3 })[0], "10 m", "tầm nhìn C = 3, K = 0,3")
eq([docs.length, topics.length], [13, 9], "số tài liệu / số đề tài")
eq(Object.keys(XLSX_FILES).length, 4, "số file Excel nhúng")
eq(docs.filter((d) => d.type === "excel").every((d) => d.type === "excel" && d.file in XLSX_FILES), true, "mọi tài liệu Excel đều có file nhúng")
const svg = compose({ t: 90, pos: 30, layers: { smoke: true, people: true } }, { brand: "FireTech", domain: "firetech.edu.vn" })
eq([svg.startsWith("<svg"), svg.endsWith("</svg>"), renderCad().length > 1000], [true, true, true], "SVG ghép hợp lệ")

console.log(fail ? `\n${fail} lỗi` : "\nSố liệu trùng bản tĩnh.")
process.exit(fail ? 1 : 0)
