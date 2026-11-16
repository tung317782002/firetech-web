/*
 * Kiểm thử mục tin tức ở dạng đã ghép như khi đăng: trang chủ + trang danh sách + từng trang bài.
 * Chạy từ gốc repo sau `pnpm bundle` (đã gồm tao-tin-tuc), cần server:  python3 -m http.server 8080
 *   node web/scripts/kiem-tin-tuc.cjs
 * Tạm chép web/bundle.html thành web/dist-tin/index.html (thư mục build, không commit) để bấm từ trang chủ sang bài.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "http://localhost:8080/web/dist-tin/";
const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) { failures.push(m); console.log("  ✗ " + m); } else console.log("  ✓ " + m); };

const ts = fs.readFileSync(path.join(ROOT, "src/data/news.generated.ts"), "utf8");
const news = JSON.parse(ts.match(/export const news: NewsItem\[\] = (\[[\s\S]*\])\s*$/)[1]);
fs.copyFileSync(path.join(ROOT, "bundle.html"), path.join(ROOT, "dist-tin/index.html"));

async function open(browser, url, w = 1280, h = 800, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const page = await ctx.newPage();
  const bad = [];
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && bad.push("console: " + m.text()));
  page.on("pageerror", (e) => bad.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => bad.push("requestfailed: " + r.url()));
  page.on("response", (r) => r.status() >= 400 && bad.push(`HTTP ${r.status()} ${r.url()}`));
  await page.goto(url, { waitUntil: "load" });
  return { page, ctx, bad };
}

(async () => {
  const browser = await chromium.launch();
  try {
    ok(news.length >= 1, `có ${news.length} tin hiển thị`);
    const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
    ok(JSON.stringify(sorted.map((n) => n.slug)) === JSON.stringify(news.map((n) => n.slug)), "dữ liệu sắp xếp mới nhất trước");

    console.log("\n== Trang chủ → trang bài");
    {
      const { page, ctx, bad } = await open(browser, BASE);
      const first = news[0];
      ok((await page.locator("#news-featured").getAttribute("href")) === `tin-tuc/${first.slug}/`, "tin nổi bật là tin mới nhất");
      ok((await page.locator("#news-ticker li a").first().innerText()).includes(first.title), "băng tin bắt đầu bằng tin mới nhất");
      await page.locator("#news-featured").click();
      await page.waitForURL(`**/tin-tuc/${first.slug}/`);
      ok((await page.locator("h1").count()) === 1 && (await page.locator("h1").innerText()) === first.title, "trang bài có một <h1> đúng tiêu đề");
      ok(true, "bấm tin nổi bật mở đúng trang bài");
      await page.locator(".crumbs a").first().click();
      await page.waitForURL(BASE);
      ok(await page.locator("#tin-tuc").isVisible(), "liên kết Trang chủ ở đường dẫn quay về trang chủ");
      await page.locator("#news-ticker-pause").click();
      await page.locator("#news-ticker li a").first().click();
      await page.waitForURL(`**/tin-tuc/${first.slug}/`);
      ok(true, "bấm tiêu đề ở băng tin mở trang bài");
      ok(bad.length === 0, "không lỗi console/request " + (bad[0] || ""));
      await ctx.close();
    }

    console.log("\n== Trang danh sách");
    {
      const { page, ctx, bad } = await open(browser, BASE + "tin-tuc/");
      ok((await page.locator("h1").count()) === 1, "một <h1>");
      ok((await page.locator(".card").count()) === news.length, "danh sách đủ " + news.length + " tin");
      ok(/\d{2}\/\d{2}\/\d{4}/.test(await page.locator(".cards").first().innerText()), "thẻ có ngày dạng dd/mm/yyyy");
      ok((await page.locator(".month").count()) >= 1, "nhóm theo tháng");
      ok(await page.evaluate(() => document.fonts.check('800 16px "Be Vietnam Pro"')), "font dùng chung nạp được");
      ok(bad.length === 0, "không lỗi console/request " + (bad[0] || ""));
      await ctx.close();
    }

    console.log("\n== Từng trang bài");
    for (const n of news) {
      const { page, ctx, bad } = await open(browser, `${BASE}tin-tuc/${n.slug}/`);
      const m = await page.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        canon: document.querySelector('link[rel="canonical"]')?.href,
        desc: document.querySelector('meta[name="description"]')?.content,
        ogt: document.querySelector('meta[property="og:type"]')?.content,
        ogi: document.querySelector('meta[property="og:image"]')?.content,
        lang: document.documentElement.lang,
        ld: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),
        noAlt: [...document.images].filter((i) => !i.alt).length,
        title: document.title,
      }));
      const na = m.ld["@graph"].find((x) => x["@type"] === "NewsArticle");
      ok(m.h1 === 1 && m.lang === "vi", `${n.slug}: một <h1>, lang=vi`);
      ok(m.canon === `https://firetech.edu.vn/tin-tuc/${n.slug}/`, `${n.slug}: canonical tuyệt đối`);
      ok(m.desc === n.summary && m.ogt === "article" && m.ogi.startsWith("https://"), `${n.slug}: description, og:type=article, og:image tuyệt đối`);
      ok(na && na.headline === n.title && na.datePublished === n.date, `${n.slug}: JSON-LD NewsArticle đúng tiêu đề và ngày`);
      ok(m.ld["@graph"].some((x) => x["@type"] === "BreadcrumbList"), `${n.slug}: có BreadcrumbList`);
      ok(m.noAlt === 0, `${n.slug}: mọi ảnh có alt`);
      ok(m.title.includes(n.title), `${n.slug}: <title> chứa tiêu đề`);
      await ctx.close();
      ok(bad.length === 0, `${n.slug}: không lỗi console/request ${bad[0] || ""}`);
      for (const w of [320, 375, 768, 1440]) {
        const c = await open(browser, `${BASE}tin-tuc/${n.slug}/`, w, 800);
        const [sw, cw] = await c.page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
        ok(sw <= cw, `${n.slug}: không cuộn ngang ở ${w}px (${sw}/${cw})`);
        await c.ctx.close();
      }
    }

    console.log("\n== Sitemap và RSS");
    {
      const sm = fs.readFileSync(path.join(ROOT, "dist-tin/sitemap.xml"), "utf8");
      const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
      ok(locs.length === news.length + 2, `sitemap có ${locs.length} URL (trang chủ + danh sách + ${news.length} bài)`);
      ok(news.every((n) => locs.includes(`https://firetech.edu.vn/tin-tuc/${n.slug}/`)), "sitemap có đủ URL từng bài");
      const feed = fs.readFileSync(path.join(ROOT, "dist-tin/tin-tuc/feed.xml"), "utf8");
      ok((feed.match(/<item>/g) || []).length === Math.min(news.length, 30), "feed RSS đủ tin");
    }
  } finally {
    await browser.close();
    fs.rmSync(path.join(ROOT, "dist-tin/index.html"), { force: true });
  }
  console.log(`\n${checks} kiểm tra, ${failures.length} lỗi`);
  if (failures.length) { console.log(failures.map((f) => " - " + f).join("\n")); process.exit(1); }
})();
