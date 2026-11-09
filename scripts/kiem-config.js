/*
 * Kiểm tra assets/js/config.js còn giá trị mẫu hay không, trước khi công bố trang.
 * Chạy:  node scripts/kiem-config.js [đường-dẫn-config.js]
 * Thoát mã 1 nếu còn giá trị mẫu, mã 0 nếu đã thay hết. Không cần trình duyệt hay server.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = process.argv[2] || path.join(__dirname, "..", "assets", "js", "config.js");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
const cfg = sandbox.window.FIRETECH_CONFIG;
if (!cfg) { console.error("Không đọc được FIRETECH_CONFIG từ " + file); process.exit(2); }

const todo = [];
const c = cfg.contact || {};
if (/0900\s?000\s?000/.test(c.phoneDisplay || "") || /0900000000/.test(c.phoneTel || "")) { todo.push("contact.phoneDisplay / contact.phoneTel: số điện thoại mẫu 0900 000 000"); }
if (/@firetech\.edu\.vn$/.test(c.email || "") && /^lienhe@/.test(c.email)) { todo.push("contact.email: email mẫu " + c.email); }
if (/zalo\.me\/0900000000/.test(c.zalo || "")) { todo.push("contact.zalo: liên kết Zalo mẫu " + c.zalo); }
(cfg.zaloGroups || []).forEach((g, i) => {
  if (/thay-ma-nhom/.test(g.url || "")) { todo.push(`zaloGroups[${i}].url: link nhóm "${g.name}" còn là mẫu (${g.url})`); }
});
if (!cfg.registerEndpoint) { todo.push("registerEndpoint: chưa có địa chỉ nhận đăng ký, form chỉ chuẩn bị nội dung để gửi qua Zalo/email"); }

if (todo.length === 0) { console.log("Cấu hình đã thay hết giá trị mẫu."); process.exit(0); }
console.log(`Còn ${todo.length} mục cần thay trong ${path.relative(process.cwd(), file)}:`);
todo.forEach((t) => console.log("  - " + t));
console.log("\nGiá học phí, lịch học trong plans[] cũng là mẫu, hãy rà lại thủ công.");
process.exit(1);
