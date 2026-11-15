/*
 * Kiểm thử tự động bản React (Chromium, Playwright).
 * Chạy từ gốc repo:  python3 -m http.server 8080   (cửa sổ khác)
 *                    node web/scripts/kiem-tra.cjs [URL] [thư-mục-lưu-ảnh]
 * URL mặc định: http://localhost:8080/web/bundle.html (tạo bằng `pnpm bundle`).
 * Thoát mã 1 nếu có lỗi. Kiểm tra: lỗi console/pageerror/request lỗi, cuộn ngang 320–1440 px, thứ bậc heading,
 * 7 mục nội dung, 5 tình huống và bảng số liệu, thư viện (lọc, tìm, máy tính nhanh, tải xlsx, hộp thoại),
 * đề tài, form liên hệ, không có giá, khung ảnh/video để trống, SEO/JSON-LD, 5 thiết bị cảm ứng giả lập.
 */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:8080/web/bundle.html";
const SHOTS = process.argv[3] || "";
const failures = [];
let checks = 0;

function ok(cond, msg) {
  checks++;
  if (!cond) { failures.push(msg); console.log("  ✗ " + msg); } else { console.log("  ✓ " + msg); }
}

async function newPage(browser, width, height, label) {
  const ctx = await browser.newContext({ viewport: { width, height }, acceptDownloads: true, deviceScaleFactor: 1, hasTouch: width < 600 });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) { failures.push(`[${label}] console.${m.type()}: ${m.text()}`); console.log(`  ✗ console.${m.type()}: ${m.text()}`); } });
  page.on("pageerror", (e) => { failures.push(`[${label}] pageerror: ${e.message}`); console.log("  ✗ pageerror: " + e.message); });
  page.on("requestfailed", (r) => { failures.push(`[${label}] requestfailed: ${r.url()}`); console.log("  ✗ requestfailed " + r.url()); });
  page.on("response", (r) => { if (r.status() >= 400) { failures.push(`[${label}] HTTP ${r.status()} ${r.url()}`); console.log(`  ✗ HTTP ${r.status()} ${r.url()}`); } });
  await page.goto(URL, { waitUntil: "load" });
  return { page, ctx };
}

const SCENARIOS = ["ga-tau-dien-ngam", "kho-ke-cao", "kho-ba-tang", "nha-xuong-cong-nghiep", "vien-duong-lao"];
const widthOk = (page) => page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
const openScenario = async (page, id) => {
  const item = page.locator(`#th-${id}`);
  if ((await item.getAttribute("data-state")) !== "open") await item.locator("button").first().click();
  await page.waitForFunction((i) => document.getElementById(`th-${i}`)?.getAttribute("data-state") === "open", id);
  await page.waitForTimeout(350);
};

async function layout(browser, w, h) {
  console.log(`\n== Bố cục ${w}x${h}`);
  const { page, ctx } = await newPage(browser, w, h, `layout-${w}`);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  let [sw, cw] = await widthOk(page);
  ok(sw <= cw, `không cuộn ngang (scrollWidth ${sw} <= ${cw})`);
  ok((await page.locator("h1").count()) === 1, "đúng một <h1>");
  const jumps = await page.evaluate(() => {
    const lv = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]);
    return lv.filter((v, i) => i > 0 && v - lv[i - 1] > 1).length;
  });
  ok(jumps === 0, "heading không nhảy cấp");
  const bad = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth, out = [];
    document.querySelectorAll("body *").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1) && !n.closest('[role="region"], [role="dialog"], .sr-only, [data-sonner-toaster]')) out.push(n.tagName + "." + String(n.className).slice(0, 40));
    });
    return out.slice(0, 5);
  });
  ok(bad.length === 0, "không phần tử nào tràn ngang: " + bad.join(", "));
  for (const id of SCENARIOS) {
    await openScenario(page, id);
    [sw, cw] = await widthOk(page);
    if (sw > cw) { ok(false, `tình huống ${id} mở ra làm trang cuộn ngang (${sw} > ${cw})`); }
  }
  ok(true, "mở từng tình huống không làm trang cuộn ngang");
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, `trang-${w}.png`), fullPage: true }); }
  await ctx.close();
}

async function noiDung(browser) {
  console.log("\n== Nội dung (desktop 1280x900)");
  const { page, ctx } = await newPage(browser, 1280, 900, "noi-dung");
  const text = await page.evaluate(() => document.body.innerText);

  ok((await page.locator("h1").innerText()).includes("chuyện gì thực sự diễn ra"), "h1 theo nội dung 2.0");
  for (const id of ["gioi-thieu", "mo-phong-chay", "cong-cu", "tinh-huong", "thu-vien", "chung-toi", "zalo", "dang-ky"]) {
    ok((await page.locator(`#${id}`).count()) === 1, `có mục #${id}`);
  }
  ok((await page.locator("#main-nav a").count()) >= 6, "thanh điều hướng có 6 liên kết mục");
  const hrefs = await page.locator("#hero-questions a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  ok(hrefs.length === 3 && (await Promise.all(hrefs.map((h) => page.locator(h).count()))).every((n) => n === 1), "ba câu hỏi ở hero dẫn tới đúng đoạn trong mục 2");

  ok(text.includes("Hai đồng hồ quyết định mọi thứ") && text.includes("176/188 người ở giây thứ 138"), "mục Mô phỏng cháy: hai đồng hồ ASET/RSET và bộ đếm 176/188");
  ok((await page.locator("#cong-cu article").count()) === 3, "mục Công cụ có 3 thẻ (FDS+Smokeview, PyroSim, Pathfinder)");
  ok(text.includes("Ba công cụ phối hợp thế nào"), "có khối Ba công cụ phối hợp thế nào");
  const lower = text.toLowerCase()
  ok(lower.includes("cùng nhau gỡ từng bài toán khó") && lower.includes("giá trị cốt lõi") && lower.includes("sứ mệnh"), "mục Chúng tôi và Trao đổi có nội dung");

  // Không còn giá
  ok(!/triệu|học phí|\d{1,2}\.000\.000/i.test(text), "trang không ghi học phí hay giá");
  ok((await page.locator("#f-course").count()) === 0, "form không còn chọn gói");

  // Khung ảnh/video để trống
  const empties = await page.locator("[data-slot-empty]").count();
  ok(empties >= 20, `${empties} khung ảnh/video để trống hiện đúng chỗ`);
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length);
  ok(broken === 0, "không có ảnh hỏng");
  const ratio = await page.locator('[data-media="concepts-video"] > div').evaluate((n) => { const r = n.getBoundingClientRect(); return r.width / r.height; });
  ok(Math.abs(ratio - 16 / 9) < 0.05, `khung video giữ tỉ lệ 16:9 (${ratio.toFixed(2)})`);

  // Tình huống
  ok((await page.locator(".scenario").count()) === 5, "5 tình huống");
  await openScenario(page, "ga-tau-dien-ngam");
  let t1 = await page.locator("#th-ga-tau-dien-ngam table").innerText();
  ok(t1.includes("50 + 0 + 130 + 70 = 250 giây") && t1.includes("375 giây") && t1.includes("240 giây") && t1.includes("360 giây"), "ga tàu điện ngầm: bảng RSET và 1,5 × RSET");
  ok((await page.locator("#th-ga-tau-dien-ngam table caption").count()) === 1 && (await page.locator("#th-ga-tau-dien-ngam th[scope=col]").count()) === 4, "bảng có caption và tiêu đề cột");
  await openScenario(page, "kho-ke-cao");
  ok((await page.locator("#th-kho-ke-cao table").innerText()).includes("khoảng 2,4"), "kho kệ cao: hệ số ASET/RSET khoảng 2,4");
  ok((await page.locator("#th-ga-tau-dien-ngam").getAttribute("data-state")) === "closed", "mở tình huống khác thì đóng tình huống trước");
  ok((await page.locator("#th-kho-ke-cao").innerText()).includes("0,0469·t²"), "kho kệ cao: đường cong Q = 0,0469·t²");
  await openScenario(page, "vien-duong-lao");
  ok((await page.locator("#th-vien-duong-lao").innerText()).includes("0,57 m/s"), "viện dưỡng lão: tốc độ xe lăn 0,57 m/s");
  ok((await page.locator("#phuong-phap").innerText()).includes("RSET = Δt phát hiện + Δt báo động + Δt chuẩn bị + Δt di chuyển"), "phương pháp: công thức RSET");
  ok((await page.locator("#phuong-phap tbody tr").count()) === 4, "bảng tiêu chí an toàn có 4 dòng");
  ok((await page.locator("#phuong-phap").innerText()).includes("ASET > 1,5 × RSET"), "phương pháp: hệ số an toàn 1,5");

  // Thư viện
  ok((await page.locator(".doc").count()) === 21, "21 tài liệu hiển thị");
  await page.locator("#lib-type button", { hasText: "Mẫu và checklist" }).click();
  ok((await page.locator(".doc").count()) === 2, "lọc Mẫu và checklist còn 2");
  await page.locator("#lib-type button", { hasText: "Tiêu chuẩn" }).click();
  ok((await page.locator(".doc").count()) === 4, "lọc Tiêu chuẩn còn 4 (QCVN 06, NFPA 101, NFPA 92, NIST)");
  await page.locator("#lib-type button", { hasText: "Bảng tính Excel" }).click();
  ok((await page.locator(".doc").count()) === 4, "lọc Excel còn 4");
  await page.locator("#lib-type button", { hasText: "Tất cả" }).click();
  await page.fill("#lib-search", "luoi");
  ok((await page.locator(".doc").count()) >= 2, "tìm không dấu 'luoi' có kết quả");
  await page.fill("#lib-search", "zzzz");
  ok(await page.locator("#lib-empty").isVisible(), "tìm không có kết quả hiện thông báo rỗng");
  await page.locator("#lib-clear").click();
  ok((await page.locator(".doc").count()) === 21, "xóa bộ lọc trở lại 21 tài liệu");

  const hrrDoc = page.locator(".doc", { hasText: "Đường cong phát triển cháy t²" });
  await hrrDoc.locator("summary").click();
  await hrrDoc.locator('input[type="number"]').fill("100");
  ok((await hrrDoc.locator(".calc-out").innerText()).includes("469"), "Q = 0,0469 × 100² = 469 kW");
  const dsDoc = page.locator(".doc", { hasText: "Đường kính đám cháy đặc trưng" });
  await dsDoc.locator("summary").click();
  ok((await dsDoc.locator(".calc-out").innerText()).includes("0,959"), "D* cho Q = 1000 kW là 0,959 m");
  const rsDoc = page.locator(".doc", { hasText: "Thời gian thoát nạn cần thiết RSET" });
  await rsDoc.locator("summary").click();
  ok((await rsDoc.locator(".calc-out").innerText()).includes("195"), "RSET mặc định = 195 s");
  await hrrDoc.locator('input[type="number"]').fill("-5");
  ok((await hrrDoc.locator(".calc-out").innerText()).includes("khoảng cho phép"), "giá trị âm báo ngoài khoảng");

  const dl = path.join(SHOTS || "/tmp", "dl");
  fs.mkdirSync(dl, { recursive: true });
  for (const name of ["Bảng tính HRR theo đường cong t²", "Bảng tính RSET/ASET", "Bảng tính D*", "Bảng tính số người"]) {
    const [d] = await Promise.all([page.waitForEvent("download"), page.locator(".doc", { hasText: name }).getByRole("link", { name: /Tải xuống/ }).click()]);
    const p = path.join(dl, d.suggestedFilename());
    await d.saveAs(p);
    ok(fs.statSync(p).size > 3000 && d.suggestedFilename().endsWith(".xlsx"), "tải " + d.suggestedFilename());
  }

  const dialog = page.locator('[role="dialog"], dialog[open]').first();
  await page.locator(".doc", { hasText: "Chọn kích thước ô lưới FDS" }).getByRole("button", { name: /Đọc bài viết/ }).click();
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  ok((await page.locator("#article-body p").count()) >= 3, "bài viết mở trong hộp thoại có nội dung");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached", timeout: 3000 });
  ok(true, "Escape đóng hộp thoại");
  await page.locator(".doc", { hasText: "Mẫu kịch bản cháy" }).getByRole("button", { name: /Xem mẫu/ }).click();
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  ok((await page.locator("#article-body li").count()) === 8, "mẫu kịch bản cháy có 8 mục");
  await page.locator('[role="dialog"] button:has-text("Đóng")').first().click();
  await dialog.waitFor({ state: "detached", timeout: 3000 });
  await page.locator(".doc", { hasText: "Checklist kiểm tra mô hình" }).getByRole("button", { name: /Xem mẫu/ }).click();
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  ok((await page.locator("#article-body li").count()) === 9, "checklist kiểm tra mô hình có 9 mục");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached", timeout: 3000 });
  await page.locator(".doc", { hasText: "Tiêu chí an toàn đối với con người" }).getByRole("button", { name: /Đọc bài viết/ }).click();
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  ok((await page.locator("#article-body").innerText()).includes("FED"), "bài viết tiêu chí an toàn nhắc FED");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached", timeout: 3000 });

  // Đề tài (nhóm nhỏ trong Thư viện)
  ok((await page.locator(".topic").count()) === 9, "9 đề tài hiển thị");
  await page.locator("#topic-field button", { hasText: "Kiến trúc" }).click();
  ok((await page.locator(".topic").count()) === 4, "lọc Kiến trúc còn 4 đề tài");
  await page.locator("#topic-tool button", { hasText: "Pathfinder" }).click();
  ok((await page.locator(".topic").count()) === 3, "Kiến trúc + Pathfinder còn 3 đề tài");
  await page.locator("#topic-level button", { hasText: "Đồ án tốt nghiệp" }).click();
  await page.locator("#topic-level button", { hasText: "Luận văn thạc sĩ" }).click();
  await page.locator("#topic-field button", { hasText: "Tất cả" }).click();
  await page.locator("#topic-tool button", { hasText: "Tất cả" }).click();
  await page.locator("#topic-level button", { hasText: "Tất cả" }).click();
  ok((await page.locator(".topic").count()) === 9, "bỏ lọc trở lại 9 đề tài");
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  await page.locator(".topic").first().getByRole("button", { name: "Sao chép gợi ý" }).click();
  await page.waitForSelector("[data-sonner-toast]", { timeout: 3000 });
  ok(true, "hiện thông báo sau khi sao chép đề tài");
  await page.locator(".topic").first().getByRole("button", { name: /Trao đổi về đề tài này/ }).click();
  await page.waitForTimeout(700);
  ok((await page.locator("#f-note").inputValue()).startsWith("Quan tâm đề tài: "), "nút đề tài điền sẵn ghi chú ở form");

  // Form
  await page.locator("#reg-submit").click();
  ok((await page.locator("#e-name").innerText()).length > 0, "thiếu tên báo lỗi");
  await page.fill("#f-name", "Nguyễn Văn A");
  await page.fill("#f-phone", "12345");
  await page.locator("#reg-submit").click();
  ok((await page.locator("#e-phone").innerText()).includes("chưa đúng"), "số điện thoại sai báo lỗi");
  await page.fill("#f-phone", "0912 345 678");
  await page.locator("#reg-submit").click();
  ok(await page.locator("#reg-done").isVisible(), "form hợp lệ hiện nội dung đã chuẩn bị");
  const msg = await page.locator("#reg-msg").inputValue();
  ok(msg.includes("Nguyễn Văn A") && msg.includes("0912345678") && msg.includes("Đề nghị trao đổi"), "nội dung đầy đủ");
  ok((await page.locator("#reg-done-text").innerText()).includes("chưa được gửi"), "nói rõ thông tin chưa được gửi đi");
  await page.locator("#reg-again").click();
  ok(await page.locator("#reg-form").isVisible(), "nhập lại hiện lại form");

  // Liên hệ và Zalo
  ok((await page.locator('a[href^="tel:"]').first().getAttribute("href")) === "tel:+84387582114", "liên kết gọi điện đúng");
  ok((await page.locator("#zalo-list a").first().getAttribute("href")) === "https://zalo.me/g/lvhvkq842", "link nhóm Zalo thật");
  const z = await page.locator("#zalo-list a").first().evaluate((a) => ({ t: a.target, r: a.rel }));
  ok(z.t === "_blank" && z.r.includes("noopener"), "liên kết Zalo mở tab mới có noopener");

  // SEO
  const seo = await page.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } });
    return {
      lang: document.documentElement.lang,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      canon: document.querySelector('link[rel="canonical"]')?.href,
      og: document.querySelectorAll('meta[property^="og:"]').length,
      tw: document.querySelectorAll('meta[name^="twitter:"]').length,
      ld,
      body: document.body.innerText.replace(/\s+/g, " "),
    };
  });
  ok(seo.lang === "vi" && seo.title.includes("FireTech") && !!seo.desc, "lang=vi, title, description");
  ok(seo.canon === "https://firetech.edu.vn/", "canonical đúng");
  ok(seo.og >= 8 && seo.tw >= 3, "Open Graph và Twitter Card đủ thẻ");
  ok(seo.ld.length === 1 && seo.ld[0], "JSON-LD parse được");
  const types = (seo.ld[0]?.["@graph"] || []).map((n) => n["@type"]);
  ok(["Organization", "BreadcrumbList", "FAQPage"].every((t) => types.includes(t)) && !types.includes("Course"), "JSON-LD: Organization, BreadcrumbList, FAQPage; không còn Course có giá");
  ok(!/Offer|price/i.test(JSON.stringify(seo.ld)), "JSON-LD không còn giá");
  const faq = (seo.ld[0]?.["@graph"] || []).find((n) => n["@type"] === "FAQPage");
  ok(faq && faq.mainEntity.every((q) => seo.body.includes(q.acceptedAnswer.text.slice(0, 55)) && seo.body.includes(q.name)), "FAQPage khớp nội dung hiển thị");
  await ctx.close();
}

async function mobile(browser) {
  console.log("\n== Tương tác (mobile 375x740)");
  const { page, ctx } = await newPage(browser, 375, 740, "mobile");
  ok(await page.locator("#menu-btn").isVisible(), "mobile hiện nút menu");
  await page.locator("#menu-btn").click();
  ok(await page.locator("#main-nav").isVisible(), "mở menu");
  await page.locator('#main-nav a[href="#thu-vien"]').click();
  ok(!(await page.locator("#main-nav").isVisible()), "chọn mục thì menu tự đóng");
  await openScenario(page, "ga-tau-dien-ngam");
  const r = await page.locator('#th-ga-tau-dien-ngam [role="region"][tabindex="0"]').first().evaluate((n) => [n.scrollWidth, n.clientWidth]);
  ok(r[0] > r[1], `bảng số liệu cuộn ngang trong khung riêng (${r[0]} > ${r[1]})`);
  const [sw, cw] = await widthOk(page);
  ok(sw <= cw, "trang không cuộn ngang khi mở bảng");
  await ctx.close();
}

async function thietBiCamUng(browser) {
  console.log("\n== Thiết bị cảm ứng giả lập");
  for (const name of ["iPhone SE", "iPhone 13", "Pixel 5", "Galaxy S9+", "iPad Mini"]) {
    const ctx = await browser.newContext({ ...devices[name] });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text()); });
    page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(URL, { waitUntil: "load" });
    const [sw, cw] = await widthOk(page);
    ok(sw <= cw, `${name}: không cuộn ngang (${sw}/${cw})`);
    await page.locator("#hero-questions a").nth(1).tap();
    await page.waitForTimeout(900);
    const y = await page.locator("#cau-hoi-2").evaluate((n) => n.getBoundingClientRect().top);
    ok(y > -50 && y < 400, `${name}: chạm câu hỏi 2 cuộn tới đúng đoạn`);
    await page.locator("#th-kho-ba-tang").scrollIntoViewIfNeeded();
    await page.locator("#th-kho-ba-tang button").first().tap();
    await page.waitForFunction(() => document.getElementById("th-kho-ba-tang")?.getAttribute("data-state") === "open");
    ok(true, `${name}: chạm mở tình huống`);
    ok(errs.length === 0, `${name}: không lỗi console ${errs[0] || ""}`);
    if (errs.length) failures.push(`[${name}] ${errs[0]}`);
    await ctx.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [480, 900], [414, 800], [375, 740], [360, 740], [320, 640]]) { await layout(browser, w, h); }
    await noiDung(browser);
    await mobile(browser);
    await thietBiCamUng(browser);
  } finally { await browser.close(); }
  console.log(`\n${checks} kiểm tra, ${failures.length} lỗi`);
  if (failures.length) { console.log(failures.map((f) => " - " + f).join("\n")); process.exit(1); }
})();
