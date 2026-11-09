/*
 * Nhúng các bảng tính .xlsx vào mã nguồn (base64) để bản đóng gói chỉ còn một file HTML.
 * Chạy lại mỗi khi sửa file trong ../assets/downloads:  node scripts/dong-goi-xlsx.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../assets/downloads");
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/files.ts");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".xlsx")).sort();
let s = "// File tự sinh bởi scripts/dong-goi-xlsx.mjs. Không sửa tay.\n";
s += "export const XLSX_FILES: Record<string, string> = {\n";
for (const f of files) { s += `  ${JSON.stringify(f)}: ${JSON.stringify(fs.readFileSync(path.join(dir, f)).toString("base64"))},\n`; }
s += "};\n";
fs.writeFileSync(out, s);
console.log(`Đã nhúng ${files.length} file: ${files.join(", ")}`);
