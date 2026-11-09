/*
 * Kiểm thử tự động bằng Playwright (Chromium).
 * Chạy:  python3 -m http.server 8080   (ở thư mục gốc, cửa sổ khác)
 *        node scripts/kiem-tra.js [URL] [thư-mục-lưu-ảnh]
 * Thoát với mã 1 nếu có lỗi. Kiểm tra: lỗi console/pageerror/request lỗi, cuộn ngang,
 * kéo thả thanh so sánh, click phòng, thời gian, phát/dừng, đặt lại, tải PNG/CSV/xlsx,
 * bộ lọc đề tài và thư viện, dialog bài viết, form đăng ký.
 */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:8080/index.html";
const SHOTS = process.argv[3] || "";
const failures = [];
let checks = 0;

function ok(cond, msg) { checks++; if (!cond) { failures.push(msg); console.log("  ✗ " + msg); } else { console.log("  ✓ " + msg); } }

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

async function layout(browser, w, h) {
  console.log(`\n== Bố cục ${w}x${h}`);
  const { page, ctx } = await newPage(browser, w, h, `layout-${w}`);
  // cuộn qua trang để kích hoạt reveal
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h1: document.querySelectorAll("h1").length }));
  ok(m.sw <= m.cw, `không cuộn ngang (scrollWidth ${m.sw} <= ${m.cw})`);
  ok(m.h1 === 1, "đúng một <h1>");
  const overflowing = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth, bad = [];
    document.querySelectorAll("body *").forEach((n) => { const r = n.getBoundingClientRect(); if (r.width > 0 && (r.right > vw + 1 || r.left < -1) && !n.closest(".sim-stage, .toast, .skip-link, dialog, .hero-glow, .hero-card-side")) { bad.push(n.tagName + "." + n.className); } });
    return bad.slice(0, 5);
  });
  ok(overflowing.length === 0, "không phần tử nào tràn ngang: " + overflowing.join(", "));
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, `trang-${w}.png`), fullPage: true }); }
  await ctx.close();
}

async function interactions(browser) {
  console.log("\n== Tương tác (desktop)");
  const { page, ctx } = await newPage(browser, 1280, 900, "tuong-tac");
  const dl = path.join(SHOTS || "/tmp", "dl");
  fs.mkdirSync(dl, { recursive: true });

  // Nội dung được dựng
  ok((await page.locator(".topic").count()) === 9, "9 đề tài hiển thị");
  ok((await page.locator(".doc").count()) === 13, "13 tài liệu hiển thị");
  ok((await page.locator(".plan").count()) === 2, "2 gói học phí");
  ok((await page.locator(".plan").first().innerText()).includes("10.000.000"), "gói PyroSim + Pathfinder giá 10.000.000 ₫");
  ok((await page.locator(".plan").nth(1).innerText()).includes("5.000.000"), "gói FDS giá 5.000.000 ₫");
  ok((await page.locator(".zalo-card").count()) === 1, "1 nhóm Zalo");
  ok((await page.locator("#zalo-list a").first().getAttribute("href")) === "https://zalo.me/g/lvhvkq842", "link nhóm Zalo thật");
  ok((await page.locator("#hero-plan svg").count()) === 1, "hero có hình mô phỏng");
  ok((await page.locator('a[href^="tel:"]').first().getAttribute("href")) === "tel:+84387582114", "liên kết gọi điện đúng");

  // Menu: ở desktop không có hamburger
  ok(!(await page.locator("#menu-btn").isVisible()), "desktop ẩn nút menu");

  // Lọc đề tài
  await page.locator("#topic-field button", { hasText: "Kiến trúc" }).click();
  ok((await page.locator(".topic").count()) === 4, "lọc Kiến trúc còn 4 đề tài");
  await page.locator("#topic-tool button", { hasText: "Pathfinder" }).click();
  ok((await page.locator(".topic").count()) === 3, "Kiến trúc + Pathfinder còn 3 đề tài");
  await page.locator("#topic-level button", { hasText: "Luận văn thạc sĩ" }).click();
  ok((await page.locator(".topic").count()) === 1, "thêm cấp Luận văn thạc sĩ còn 1 đề tài");
  await page.locator("#topic-level button", { hasText: "Đồ án tốt nghiệp" }).click();
  ok((await page.locator(".topic").count()) === 0, "bộ lọc không khớp hiện 0 đề tài");
  ok((await page.locator("#topic-count").innerText()).includes("Không có đề tài"), "hiện thông báo khi không có đề tài");
  await page.locator("#topic-field button", { hasText: "Tất cả" }).click();
  await page.locator("#topic-tool button", { hasText: "Tất cả" }).click();
  await page.locator("#topic-level button", { hasText: "Tất cả" }).click();
  ok((await page.locator(".topic").count()) === 9, "bỏ lọc trở lại 9 đề tài");

  // Sao chép đề tài
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  await page.locator(".topic").first().getByRole("button", { name: "Sao chép gợi ý" }).click();
  await page.waitForSelector("#toast.show", { timeout: 3000 });
  ok(true, "hiện thông báo sau khi sao chép đề tài");

  // Thư viện: lọc/tìm
  await page.locator("#lib-type button", { hasText: "Bảng tính Excel" }).click();
  ok((await page.locator(".doc").count()) === 4, "lọc Excel còn 4 tài liệu");
  await page.locator("#lib-type button", { hasText: "Tất cả" }).click();
  await page.fill("#lib-search", "luoi");
  ok((await page.locator(".doc").count()) >= 2, "tìm không dấu 'luoi' có kết quả");
  await page.fill("#lib-search", "zzzz");
  ok(await page.locator("#lib-empty").isVisible(), "tìm không có kết quả hiện thông báo rỗng");
  await page.locator("#lib-clear").click();
  ok((await page.locator(".doc").count()) === 13, "xóa bộ lọc trở lại 13 tài liệu");
  await page.locator("#lib-tag button", { hasText: "Revit/BIM" }).click();
  ok((await page.locator(".doc").count()) === 1, "chủ đề Revit/BIM còn 1 tài liệu");
  await page.locator("#lib-clear").click();

  // Máy tính nhanh
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

  // Tải Excel
  for (const name of ["Bảng tính HRR theo đường cong t²", "Bảng tính RSET/ASET", "Bảng tính D*", "Bảng tính số người"]) {
    const [d] = await Promise.all([page.waitForEvent("download"), page.locator(".doc", { hasText: name }).getByRole("link", { name: /Tải xuống/ }).click()]);
    const p = path.join(dl, d.suggestedFilename());
    await d.saveAs(p);
    ok(fs.statSync(p).size > 3000 && d.suggestedFilename().endsWith(".xlsx"), "tải " + d.suggestedFilename());
  }

  // Bài viết
  await page.locator(".doc", { hasText: "Chọn kích thước ô lưới FDS" }).getByRole("button", { name: /Đọc bài viết/ }).click();
  ok(await page.locator("#article-dialog").evaluate((d) => d.open), "mở bài viết trong dialog");
  ok((await page.locator("#article-body p").count()) >= 3, "bài viết có nội dung");
  await page.keyboard.press("Escape");
  ok(!(await page.locator("#article-dialog").evaluate((d) => d.open)), "Escape đóng dialog");
  await page.locator(".doc", { hasText: "RSET gồm những gì" }).getByRole("button", { name: /Đọc bài viết/ }).click();
  await page.locator("#article-close").click();
  ok(!(await page.locator("#article-dialog").evaluate((d) => d.open)), "nút đóng dialog hoạt động");

  // ---- Trình mô phỏng
  await page.locator("#mo-phong").scrollIntoViewIfNeeded();
  const stage = page.locator("#sim-stage");
  const box = await stage.boundingBox();
  const handle = page.locator("#sim-handle");
  ok((await handle.getAttribute("aria-valuenow")) === "30", "tay cầm bắt đầu ở 30%");
  // kéo chuột
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, { steps: 8 });
  await page.mouse.up();
  const afterDrag = Number(await handle.getAttribute("aria-valuenow"));
  ok(afterDrag >= 18 && afterDrag <= 22, `kéo chuột đưa tay cầm tới ~20% (được ${afterDrag})`);
  ok((await stage.evaluate((n) => getComputedStyle(n).getPropertyValue("--pos").trim())) === afterDrag + "%", "biến --pos cập nhật theo");
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 2, box.y + box.height * 0.5, { steps: 5 });
  await page.mouse.up();
  ok((await handle.getAttribute("aria-valuenow")) === "100", "kéo quá biên bị chặn ở 100%");
  // bàn phím
  await handle.focus();
  await page.keyboard.press("Home");
  ok((await handle.getAttribute("aria-valuenow")) === "0", "phím Home về 0");
  await page.keyboard.press("ArrowRight");
  ok((await handle.getAttribute("aria-valuenow")) === "2", "phím mũi tên +2");
  await page.keyboard.press("End");
  await page.keyboard.press("Shift+ArrowLeft");
  ok((await handle.getAttribute("aria-valuenow")) === "90", "Shift+mũi tên -10");

  // click phòng
  await page.locator('.hit-room[data-room="2"]').click({ position: { x: 80, y: 120 }, force: true });
  ok((await page.locator("#sim-info h3").innerText()).includes("Kho lưu trữ"), "click phòng 2 hiện thông tin Kho lưu trữ");
  ok((await page.locator('.room-btn[data-room="2"]').getAttribute("aria-pressed")) === "true", "nút danh sách phòng đồng bộ");
  await page.locator('.room-btn[data-room="8"]').click();
  ok((await page.locator("#sim-info").innerText()).includes("hành lang"), "chọn Hành lang qua danh sách");
  await page.locator('.hit-room[data-room="5"]').focus();
  await page.keyboard.press("Enter");
  ok((await page.locator("#sim-info h3").innerText()).includes("Sảnh chính"), "Enter chọn phòng bằng bàn phím");

  // thời gian
  await page.locator("#sim-time").fill("250");
  ok((await page.locator("#sim-time-out").innerText()) === "250 s", "thanh thời gian hiển thị 250 s");
  const m250 = await page.locator("#sim-metrics").innerText();
  ok(/48\/48/.test(m250), "t = 250 s: cả 48 người đã thoát");
  await page.locator("#sim-time").fill("0");
  ok(/0\/48/.test(await page.locator("#sim-metrics").innerText()), "t = 0: chưa ai thoát");
  await page.locator("#sim-time").fill("150");
  const smokeN = await page.locator("#sim-top svg rect[filter]").count();
  ok(smokeN >= 2, "t = 150: có lớp khói trong phòng cháy và hành lang");
  await page.locator("#layer-smoke").uncheck();
  ok((await page.locator("#sim-top svg rect[filter]").count()) === 0, "tắt lớp khói");
  await page.locator("#layer-people").uncheck();
  ok((await page.locator("#sim-top svg circle[stroke='#fff']").count()) === 0, "tắt lớp người");
  await page.locator("#layer-smoke").check();
  await page.locator("#layer-people").check();

  // phát / dừng
  await page.locator("#sim-time").fill("280");
  await page.locator("#sim-play").click();
  ok((await page.locator("#sim-play").getAttribute("aria-pressed")) === "true", "nút Phát chuyển sang Dừng");
  await page.waitForFunction(() => document.querySelector("#sim-time").value === "300", null, { timeout: 5000 });
  await page.waitForFunction(() => document.querySelector("#sim-play-label").textContent === "Phát", null, { timeout: 3000 });
  ok(true, "tự dừng khi hết thời gian");
  await page.locator("#sim-play").click();
  await page.waitForTimeout(250);
  await page.locator("#sim-play").click();
  ok((await page.locator("#sim-play").getAttribute("aria-pressed")) === "false", "bấm Dừng giữa chừng");

  // tải PNG / CSV
  const [png] = await Promise.all([page.waitForEvent("download"), page.locator("#sim-png").click()]);
  const pngPath = path.join(dl, png.suggestedFilename());
  await png.saveAs(pngPath);
  const head = fs.readFileSync(pngPath).subarray(0, 8).toString("hex");
  ok(head === "89504e470d0a1a0a" && fs.statSync(pngPath).size > 20000, "tải ảnh PNG hợp lệ (" + png.suggestedFilename() + ")");
  const [csv] = await Promise.all([page.waitForEvent("download"), page.locator("#sim-csv").click()]);
  const csvPath = path.join(dl, csv.suggestedFilename());
  await csv.saveAs(csvPath);
  const csvText = fs.readFileSync(csvPath, "utf8");
  ok(csvText.charCodeAt(0) === 0xfeff && csvText.split("\r\n").length > 50 && csvText.includes("RSET"), "tải CSV có BOM, 48 dòng người và RSET");

  // đặt lại
  await page.locator("#layer-smoke").uncheck();
  await page.locator("#sim-reset").click();
  ok((await handle.getAttribute("aria-valuenow")) === "30", "Đặt lại: tay cầm về 30%");
  ok((await page.locator("#sim-time").inputValue()) === "90", "Đặt lại: thời gian về 90 s");
  ok(await page.locator("#layer-smoke").isChecked(), "Đặt lại: bật lại lớp khói");
  ok((await page.locator("#sim-info").innerText()).includes("Bấm vào một phòng"), "Đặt lại: bỏ chọn phòng");

  // ---- Form đăng ký
  await page.locator(".plan.hot").getByRole("button", { name: /Đăng ký gói này/ }).click();
  await page.waitForTimeout(700);
  ok((await page.locator("#f-course").inputValue()) === "pyrosim-pathfinder", "chọn gói nổi bật điền sẵn khóa học");
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
  ok(msg.includes("Nguyễn Văn A") && msg.includes("0912345678") && msg.includes("PyroSim + Pathfinder"), "nội dung đăng ký đầy đủ");
  ok((await page.locator("#reg-done-text").innerText()).includes("chưa được gửi"), "nói rõ thông tin chưa được gửi đi");
  await page.locator("#reg-again").click();
  ok(await page.locator("#reg-form").isVisible(), "nhập lại hiện lại form");

  // Zalo
  const zalo = await page.locator("#zalo-list a").first().evaluate((a) => ({ t: a.target, r: a.rel }));
  ok(zalo.t === "_blank" && zalo.r.includes("noopener"), "liên kết Zalo mở tab mới có noopener");

  // SEO / meta
  const seo = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title.length > 10,
    desc: !!document.querySelector('meta[name="description"]'),
    canon: document.querySelector('link[rel="canonical"]')?.href,
    og: document.querySelectorAll('meta[property^="og:"]').length,
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch (e) { return false; } })
  }));
  ok(seo.lang === "vi" && seo.title && seo.desc, "lang=vi, title, description");
  ok(seo.canon === "https://firetech.edu.vn/", "canonical đúng");
  ok(seo.og >= 8 && seo.ld.length === 1 && seo.ld[0], "Open Graph và JSON-LD hợp lệ");
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
  await page.locator("#mo-phong").scrollIntoViewIfNeeded();
  const stage = page.locator("#sim-stage");
  const box = await stage.boundingBox();
  ok(box.width <= 375, "khung mô phỏng không rộng quá màn hình");
  // kéo bằng cảm ứng (pointer events)
  const h = await page.locator("#sim-handle").boundingBox();
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, h.y + h.height / 2, { steps: 6 });
  await page.mouse.up();
  const v = Number(await page.locator("#sim-handle").getAttribute("aria-valuenow"));
  ok(v >= 76 && v <= 84, `kéo tay cầm trên mobile tới ~80% (được ${v})`);
  await page.locator('.room-btn[data-room="3"]').click();
  ok((await page.locator("#sim-info h3").innerText()).includes("Văn phòng"), "chọn phòng bằng danh sách trên mobile");
  await ctx.close();
}

async function thietBiCamUng(browser) {
  console.log("\n== Thiết bị cảm ứng giả lập (sự kiện cảm ứng thật qua CDP)");
  for (const name of ["iPhone SE", "iPhone 13", "Pixel 5", "Galaxy S9+", "iPad Mini"]) {
    const ctx = await browser.newContext({ ...devices[name] });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (["error", "warning"].includes(m.type())) { errs.push(m.text()); } });
    page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(URL, { waitUntil: "load" });
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    ok(w[0] <= w[1], `${name}: không cuộn ngang (${w[0]}/${w[1]})`);
    await page.locator("#sim-stage").scrollIntoViewIfNeeded();
    const box = await page.locator("#sim-stage").boundingBox();
    const hb = await page.locator("#sim-handle").boundingBox();
    const cdp = await ctx.newCDPSession(page);
    const touch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
    const x0 = hb.x + hb.width / 2, y = hb.y + hb.height / 2, x1 = box.x + box.width * 0.75;
    await touch("touchStart", x0, y);
    for (let i = 1; i <= 6; i++) { await touch("touchMove", x0 + ((x1 - x0) * i) / 6, y); }
    await touch("touchEnd");
    const v = Number(await page.locator("#sim-handle").getAttribute("aria-valuenow"));
    ok(v >= 65 && v <= 85, `${name}: kéo cảm ứng tay cầm tới ~75% (được ${v})`);
    await page.waitForTimeout(1500); // Chromium bỏ qua cú chạm sát ngay sau cú kéo
    await page.locator('.room-btn[data-room="2"]').tap();
    ok((await page.locator("#sim-info h3").innerText()).includes("Kho"), `${name}: chạm chọn phòng`);
    ok(errs.length === 0, `${name}: không lỗi console ${errs[0] || ""}`);
    if (errs.length) { failures.push(`[${name}] ${errs[0]}`); }
    await ctx.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [480, 900], [414, 800], [375, 740], [360, 740], [320, 640]]) { await layout(browser, w, h); }
    await interactions(browser);
    await mobile(browser);
    await thietBiCamUng(browser);
  } finally { await browser.close(); }
  console.log(`\n${checks} kiểm tra, ${failures.length} lỗi`);
  if (failures.length) { console.log(failures.map((f) => " - " + f).join("\n")); process.exit(1); }
})();
