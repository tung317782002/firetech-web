/*
 * FireTech – tương tác của trang. Không phụ thuộc thư viện ngoài.
 * Thông tin liên hệ, giá, nhóm Zalo: sửa trong assets/js/config.js.
 * Đề tài, tài liệu, bài viết: sửa trong assets/js/data.js.
 */
(function () {
  "use strict";

  var CFG = window.FIRETECH_CONFIG;
  var DATA = window.FIRETECH_DATA;
  if (!CFG || !DATA) { return; }

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) { root.classList.add("reduce"); }

  /* ================================================================ Tiện ích */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) { return; }
        if (k === "text") { n.textContent = v; }
        else if (k === "class") { n.className = v; }
        else if (k.indexOf("on") === 0 && typeof v === "function") { n.addEventListener(k.slice(2), v); }
        else { n.setAttribute(k, v === true ? "" : v); }
      });
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) { return; }
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  function norm(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }

  function fmtNum(n, d) {
    try { return n.toLocaleString("vi-VN", { maximumFractionDigits: d === undefined ? 2 : d }); }
    catch (e) { return String(Math.round(n * 100) / 100); }
  }

  function fmtVND(n) { return fmtNum(n, 0) + " ₫"; }

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, obj);
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) { return; }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = el("textarea", { readonly: true, "aria-hidden": "true", style: "position:fixed;left:-9999px;top:0" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) { resolve(); } else { reject(new Error("copy")); }
    });
  }

  function copyWithToast(text) {
    copyText(text).then(function () { toast("Đã sao chép vào bộ nhớ tạm"); },
      function () { toast("Không sao chép được, hãy bôi đen và sao chép thủ công"); });
  }

  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: name, style: "display:none" });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  function chipGroup(container, items, onChange) {
    var current = items[0].value;
    function paint() {
      $$("button", container).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.value === current ? "true" : "false"); });
    }
    items.forEach(function (it) {
      container.appendChild(el("button", {
        type: "button", class: "chip", "data-value": it.value, "aria-pressed": "false", text: it.label,
        onclick: function () { current = it.value; paint(); onChange(current); }
      }));
    });
    paint();
    return {
      get: function () { return current; },
      set: function (v) { current = v; paint(); }
    };
  }

  function uniq(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }

  /* ================================================================ Cấu hình → giao diện */
  function bindConfig() {
    $$("[data-cfg]").forEach(function (n) {
      var v = get(CFG, n.getAttribute("data-cfg"));
      if (v !== undefined) { n.textContent = v; }
    });
    $$("[data-cfg-tel]").forEach(function (n) { n.setAttribute("href", "tel:" + CFG.contact.phoneTel); });
    $$("[data-cfg-mail]").forEach(function (n) { n.setAttribute("href", "mailto:" + CFG.contact.email); });
    $$("[data-cfg-href]").forEach(function (n) {
      var v = get(CFG, n.getAttribute("data-cfg-href"));
      if (v) { n.setAttribute("href", v); }
    });
    var y = $("#year");
    if (y) { y.textContent = String(new Date().getFullYear()); }
  }

  /* ================================================================ Menu, scrollspy, reveal */
  function initNav() {
    var btn = $("#menu-btn");
    var nav = $("#main-nav");
    if (!btn || !nav) { return; }
    function close() { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Mở menu"); }
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1060) { close(); } });

    if (!("IntersectionObserver" in window)) { return; }
    var links = {};
    $$("a[href^='#']", nav).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        Object.keys(links).forEach(function (id) {
          var on = id === en.target.id;
          links[id].classList.toggle("active", on);
          if (on) { links[id].setAttribute("aria-current", "true"); } else { links[id].removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) { io.observe(s); } });
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ================================================================ Đề tài */
  function topicText(t) {
    return [
      "Đề tài: " + t.title,
      "Lĩnh vực: " + t.field + " · Cấp: " + t.level,
      "Phần mềm: " + t.tools.join(", "),
      "Nội dung: " + t.summary,
      "Kết quả cần đạt: " + t.outcomes.join("; "),
      "Tiêu chuẩn tham chiếu: " + t.standards,
      "Nguồn: " + CFG.brand.domain
    ].join("\n");
  }

  function initTopics() {
    var list = $("#topic-list");
    if (!list) { return; }
    var topics = DATA.topics;
    var state = { field: "all", level: "all", tool: "all" };

    function opts(values) {
      return [{ value: "all", label: "Tất cả" }].concat(values.map(function (v) { return { value: v, label: v }; }));
    }
    var tools = uniq([].concat.apply([], topics.map(function (t) { return t.tools; })));
    chipGroup($("#topic-field"), opts(uniq(topics.map(function (t) { return t.field; }))), function (v) { state.field = v; render(); });
    chipGroup($("#topic-level"), opts(uniq(topics.map(function (t) { return t.level; }))), function (v) { state.level = v; render(); });
    chipGroup($("#topic-tool"), opts(tools), function (v) { state.tool = v; render(); });

    function render() {
      var shown = topics.filter(function (t) {
        return (state.field === "all" || t.field === state.field) &&
          (state.level === "all" || t.level === state.level) &&
          (state.tool === "all" || t.tools.indexOf(state.tool) > -1);
      });
      clear(list);
      shown.forEach(function (t) {
        list.appendChild(el("article", { class: "topic" }, [
          el("div", { class: "topic-meta" }, [
            el("span", { class: "badge " + (t.field === "PCCC" ? "badge-pccc" : "badge-kt"), text: t.field }),
            el("span", { class: "badge", text: t.level })
          ].concat(t.tools.map(function (x) { return el("span", { class: "badge", text: x }); }))),
          el("h3", { text: t.title }),
          el("p", { text: t.summary }),
          el("ul", null, t.outcomes.map(function (o) { return el("li", { text: o }); })),
          el("p", { class: "std", text: "Tiêu chuẩn: " + t.standards }),
          el("div", { class: "topic-actions" }, [
            el("button", { type: "button", class: "btn btn-ghost btn-sm", text: "Sao chép gợi ý", onclick: function () { copyWithToast(topicText(t)); } }),
            el("button", { type: "button", class: "btn btn-ink btn-sm", text: "Học để làm đề tài này", onclick: function () { goRegister(CFG.plans[0].id, "Quan tâm đề tài: " + t.title); } })
          ])
        ]));
      });
      $("#topic-count").textContent = shown.length ? "Hiển thị " + shown.length + " / " + topics.length + " đề tài" : "Không có đề tài phù hợp, hãy đổi bộ lọc.";
    }
    render();
  }

  /* ================================================================ Thư viện */
  var TYPE_LABEL = { formula: "Công thức", excel: "Bảng tính Excel", article: "Bài viết" };
  var TYPE_ICON = { formula: "fx", excel: "XLS", article: "Aa" };

  function renderCalc(doc) {
    var spec = DATA.calcs[doc.calc];
    var out = el("div", { class: "calc-out", "aria-live": "polite" });
    var fields = {};
    var box = el("div", { class: "calc" });

    function readValues() {
      var vals = {}, ok = true;
      spec.inputs.forEach(function (inp) {
        var raw = fields[inp.id].value;
        var v = inp.type === "select" ? parseFloat(raw) : parseFloat(String(raw).replace(",", "."));
        if (!isFinite(v) || (inp.min !== undefined && v < inp.min) || (inp.max !== undefined && v > inp.max)) { ok = false; }
        vals[inp.id] = v;
      });
      return ok ? vals : null;
    }
    function update() {
      clear(out);
      var vals = readValues();
      if (!vals) { out.appendChild(el("div", null, [el("span", { text: "Hãy nhập số trong khoảng cho phép." })])); return; }
      spec.run(vals).forEach(function (r) {
        out.appendChild(el("div", null, [el("span", { text: r.label }), el("strong", { class: r.status || "", text: r.value })]));
      });
    }

    spec.inputs.forEach(function (inp) {
      var id = "calc-" + doc.id + "-" + inp.id;
      var control;
      if (inp.type === "select") {
        control = el("select", { id: id }, inp.options.map(function (o) {
          return el("option", { value: o.v, text: o.t, selected: o.v === String(inp.value) });
        }));
      } else {
        control = el("input", { id: id, type: "number", inputmode: "decimal", value: inp.value, min: inp.min, max: inp.max, step: inp.step });
      }
      control.addEventListener("input", update);
      fields[inp.id] = control;
      box.appendChild(el("label", { for: id }, [inp.label + (inp.unit ? " (" + inp.unit + ")" : ""), control]));
    });
    box.appendChild(out);
    update();
    return el("details", null, [el("summary", { text: "Tính nhanh" }), box]);
  }

  function openArticle(doc) {
    var dlg = $("#article-dialog");
    $("#article-title").textContent = doc.title;
    $("#article-meta").textContent = "Bài viết · " + doc.read + " · " + doc.tags.join(", ");
    var body = $("#article-body");
    clear(body);
    doc.body.forEach(function (p) { body.appendChild(el("p", { text: p })); });
    if (typeof dlg.showModal === "function") { if (!dlg.open) { dlg.showModal(); } } else { dlg.setAttribute("open", ""); }
    dlg.scrollTop = 0;
  }

  function initLibrary() {
    var list = $("#lib-list");
    if (!list) { return; }
    var docs = DATA.docs;
    var state = { q: "", type: "all", tag: "all" };

    var typeGroup = chipGroup($("#lib-type"), [{ value: "all", label: "Tất cả" }].concat(Object.keys(TYPE_LABEL).map(function (k) { return { value: k, label: TYPE_LABEL[k] }; })), function (v) { state.type = v; render(); });
    var tagGroup = chipGroup($("#lib-tag"), [{ value: "all", label: "Tất cả" }].concat(DATA.docTags.map(function (t) { return { value: t, label: t }; })), function (v) { state.tag = v; render(); });
    var search = $("#lib-search");
    search.addEventListener("input", function () { state.q = search.value; render(); });
    $("#lib-clear").addEventListener("click", function () {
      state = { q: "", type: "all", tag: "all" };
      search.value = ""; typeGroup.set("all"); tagGroup.set("all"); render();
    });

    function card(d) {
      var children = [
        el("div", { class: "doc-head" }, [
          el("span", { class: "doc-ic " + d.type, "aria-hidden": "true", text: TYPE_ICON[d.type] }),
          el("div", null, [el("h3", { text: d.title })])
        ]),
        el("p", { text: d.desc }),
        el("div", { class: "doc-tags" }, [el("span", { class: "badge", text: TYPE_LABEL[d.type] })].concat(d.tags.map(function (t) { return el("span", { class: "badge", text: t }); })))
      ];
      if (d.type === "formula") {
        children.push(el("pre", { class: "formula-box", text: d.formula }));
        if (d.note) { children.push(el("p", { class: "small", text: d.note })); }
        children.push(renderCalc(d));
        children.push(el("div", { class: "doc-actions" }, [
          el("button", { type: "button", class: "btn btn-ghost btn-sm", text: "Sao chép công thức", onclick: function () { copyWithToast(d.formula + "\n(" + d.title + " – " + CFG.brand.domain + ")"); } })
        ]));
      } else if (d.type === "excel") {
        children.push(el("div", { class: "doc-actions" }, [
          el("a", { class: "btn btn-ink btn-sm", href: d.file, download: d.file.split("/").pop(), text: "Tải xuống .xlsx" })
        ]));
      } else {
        children.push(el("div", { class: "doc-actions" }, [
          el("button", { type: "button", class: "btn btn-ink btn-sm", text: "Đọc bài viết (" + d.read + ")", onclick: function () { openArticle(d); } })
        ]));
      }
      return el("article", { class: "doc" }, children);
    }

    function render() {
      var q = norm(state.q.trim());
      var shown = docs.filter(function (d) {
        if (state.type !== "all" && d.type !== state.type) { return false; }
        if (state.tag !== "all" && d.tags.indexOf(state.tag) < 0) { return false; }
        if (!q) { return true; }
        return norm([d.title, d.desc, d.tags.join(" "), TYPE_LABEL[d.type], d.formula || ""].join(" ")).indexOf(q) > -1;
      });
      clear(list);
      shown.forEach(function (d) { list.appendChild(card(d)); });
      $("#lib-empty").hidden = shown.length > 0;
      $("#lib-count").textContent = "Hiển thị " + shown.length + " / " + docs.length + " tài liệu";
      $("#lib-clear").hidden = !(state.q || state.type !== "all" || state.tag !== "all");
    }
    render();

    var dlg = $("#article-dialog");
    $("#article-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target !== dlg) { return; }
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { dlg.close(); }
    });
  }

  /* ================================================================ Số liệu */
  function initStats() {
    var box = $("#stats");
    if (!box) { return; }
    var items = [
      { n: DATA.docs.length, l: "tài liệu mở" },
      { n: DATA.docs.filter(function (d) { return d.type === "excel"; }).length, l: "bảng tính Excel" },
      { n: DATA.topics.length, l: "đề tài gợi ý" },
      { n: 3, l: "phần mềm: PyroSim, FDS, Pathfinder" }
    ];
    var nums = [];
    items.forEach(function (it) {
      var dd = el("dd", { text: reduceMotion ? String(it.n) : "0" });
      nums.push({ node: dd, n: it.n });
      box.appendChild(el("div", { class: "stat" }, [el("dt", { text: it.l }), dd]));
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nums.forEach(function (x) { x.node.textContent = String(x.n); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) { return; }
      io.disconnect();
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / 900);
        nums.forEach(function (x) { x.node.textContent = String(Math.round(x.n * (1 - Math.pow(1 - p, 3)))); });
        if (p < 1) { requestAnimationFrame(tick); }
      })(t0);
    }, { threshold: 0.3 });
    io.observe(box);
  }

  /* ================================================================ Học phí, Zalo, đăng ký */
  function goRegister(planId, note) {
    var sel = $("#f-course");
    if (planId && sel) { sel.value = planId; }
    if (note) { $("#f-note").value = note; }
    resetForm();
    var sec = $("#dang-ky");
    sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setTimeout(function () { var f = $("#f-name"); if (f && !f.closest("[hidden]")) { f.focus({ preventScroll: true }); } }, reduceMotion ? 0 : 450);
  }

  function initPlans() {
    var box = $("#plans");
    if (!box) { return; }
    var plans = CFG.plans;
    box.setAttribute("data-count", String(plans.length));
    plans.forEach(function (p) {
      var hot = !!p.featured;
      box.appendChild(el("article", { class: "plan" + (hot ? " hot" : "") }, [
        hot && p.badge ? el("span", { class: "plan-badge", text: p.badge }) : null,
        el("h3", { text: p.name }),
        el("p", { class: "tagline", text: p.tagline }),
        el("p", { class: "price" }, [fmtVND(p.price), " ", el("small", { text: "/ khóa" })]),
        el("p", { class: "sched", text: p.schedule }),
        el("ul", { class: "ticks" }, p.features.map(function (f) { return el("li", { text: f }); })),
        el("button", { type: "button", class: "btn " + (hot ? "btn-ember" : "btn-ink"), text: "Đăng ký gói này", onclick: function () { goRegister(p.id); } })
      ]));
    });
    var sel = $("#f-course");
    plans.forEach(function (p) { sel.appendChild(el("option", { value: p.id, text: p.name + " – " + fmtVND(p.price) })); });
    sel.appendChild(el("option", { value: "tu-van", text: "Chưa chắc, cần tư vấn" }));
  }

  function initZalo() {
    var box = $("#zalo-list");
    if (!box) { return; }
    box.setAttribute("data-count", String(CFG.zaloGroups.length));
    CFG.zaloGroups.forEach(function (g) {
      box.appendChild(el("article", { class: "zalo-card reveal" }, [
        el("span", { class: "zi", "aria-hidden": "true", text: "Z" }),
        el("h3", { text: g.name }),
        el("p", { text: g.desc }),
        el("a", { class: "btn btn-ink btn-sm", href: g.url, target: "_blank", rel: "noopener noreferrer", text: "Tham gia nhóm Zalo" })
      ]));
    });
  }

  var PHONE_RE = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;

  function resetForm() {
    $("#reg-form").hidden = false;
    $("#reg-done").hidden = true;
  }

  function initForm() {
    var form = $("#reg-form");
    if (!form) { return; }
    var name = $("#f-name"), phone = $("#f-phone");

    function setErr(input, id, msg) {
      $("#" + id).textContent = msg;
      if (msg) { input.setAttribute("aria-invalid", "true"); } else { input.removeAttribute("aria-invalid"); }
    }
    name.addEventListener("input", function () { if (name.value.trim()) { setErr(name, "e-name", ""); } });
    phone.addEventListener("input", function () { setErr(phone, "e-phone", ""); });

    function showPrepared(msg, sent) {
      form.hidden = true;
      var done = $("#reg-done");
      done.hidden = false;
      $("#reg-done-title").textContent = sent ? "Đã gửi đăng ký" : "Thông tin đã sẵn sàng";
      $("#reg-done-text").textContent = sent
        ? "Cảm ơn bạn. Chúng tôi sẽ liên hệ qua số điện thoại đã nhập."
        : "Trang này chưa kết nối máy chủ nhận đăng ký, nên thông tin của bạn chưa được gửi đi. Hãy gửi nội dung dưới đây qua Zalo, email hoặc gọi điện.";
      $("#reg-msg").value = msg;
      var acts = $("#reg-done-actions");
      clear(acts);
      acts.appendChild(el("button", { type: "button", class: "btn btn-ghost btn-sm", text: "Sao chép nội dung", onclick: function () { copyWithToast(msg); } }));
      if (!sent) {
        acts.appendChild(el("a", { class: "btn btn-ink btn-sm", href: CFG.contact.zalo, target: "_blank", rel: "noopener noreferrer", text: "Mở Zalo" }));
        acts.appendChild(el("a", { class: "btn btn-ghost btn-sm", href: "mailto:" + CFG.contact.email + "?subject=" + encodeURIComponent("Đăng ký khóa học") + "&body=" + encodeURIComponent(msg), text: "Gửi email" }));
        acts.appendChild(el("a", { class: "btn btn-ghost btn-sm", href: "tel:" + CFG.contact.phoneTel, text: "Gọi " + CFG.contact.phoneDisplay }));
      }
      done.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      if (!name.value.trim()) { setErr(name, "e-name", "Vui lòng nhập họ và tên."); ok = false; }
      var digits = phone.value.replace(/[\s.\-()]/g, "");
      if (!PHONE_RE.test(digits)) { setErr(phone, "e-phone", "Số điện thoại chưa đúng. Ví dụ: 0912345678."); ok = false; }
      if (!ok) { (name.getAttribute("aria-invalid") ? name : phone).focus(); return; }

      var sel = $("#f-course");
      var courseName = sel.options[sel.selectedIndex].text;
      var payload = { name: name.value.trim(), phone: digits, course: courseName, note: $("#f-note").value.trim(), createdAt: new Date().toISOString() };
      var msg = ["Đăng ký khóa học – " + CFG.brand.name, "Họ tên: " + payload.name, "Số điện thoại: " + payload.phone, "Khóa học: " + payload.course]
        .concat(payload.note ? ["Ghi chú: " + payload.note] : []).join("\n");

      if (!CFG.registerEndpoint) { showPrepared(msg, false); return; }
      var btn = $("#reg-submit");
      btn.disabled = true; btn.textContent = "Đang gửi…";
      fetch(CFG.registerEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) { throw new Error("http " + r.status); } showPrepared(msg, true); })
        .catch(function () { toast("Chưa gửi được, hãy dùng nội dung bên dưới để liên hệ."); showPrepared(msg, false); })
        .then(function () { btn.disabled = false; btn.textContent = "Đăng ký khóa học"; });
    });
    $("#reg-again").addEventListener("click", function () { resetForm(); name.focus(); });
  }

  /* ================================================================ Trình mô phỏng */
  var Plan = (function () {
    var W = 800, H = 480, CY = 270, PXM = 10; // 10 px = 1 m
    var FIRE = { x: 320, y: 150 };
    var SMOKE_START = 45, SMOKE_SPEED = 1.8, ALPHA = 0.0469, T_MAX = 300, K_SAFE = 1.5;

    var ROOMS = [
      { id: 1, name: "Phòng học A", x: 40, y: 40, w: 200, h: 190, n: 10, door: [140, 230], fill: "#e6efff" },
      { id: 2, name: "Kho lưu trữ", x: 240, y: 40, w: 160, h: 190, n: 2, door: [320, 230], fire: true, fill: "#fff0e6" },
      { id: 3, name: "Văn phòng", x: 400, y: 40, w: 180, h: 190, n: 8, door: [490, 230], fill: "#e6efff" },
      { id: 4, name: "Phòng họp", x: 580, y: 40, w: 180, h: 190, n: 8, door: [670, 230], fill: "#e6efff" },
      { id: 5, name: "Sảnh chính", x: 40, y: 310, w: 260, h: 130, n: 6, exit: [170, 440], fill: "#e5f7ee" },
      { id: 6, name: "Phòng máy", x: 300, y: 310, w: 200, h: 130, n: 2, door: [400, 310], fill: "#efeafc" },
      { id: 7, name: "Căn tin", x: 500, y: 310, w: 260, h: 130, n: 12, exit: [630, 440], fill: "#e5f7ee" },
      { id: 8, name: "Hành lang", x: 40, y: 230, w: 720, h: 80, n: 0, corridor: true, fill: "#f6f8fc" }
    ];
    var EXITS = [
      { p: [40, CY], rect: [34, 250, 12, 40] },
      { p: [760, CY], rect: [754, 250, 12, 40] },
      { ax: 170, end: [170, 440], rect: [150, 434, 40, 12] },
      { ax: 630, end: [630, 440], rect: [610, 434, 40, 12] }
    ];

    function rng(seed) {
      return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
    function pathLen(pts) { var s = 0; for (var i = 1; i < pts.length; i++) { s += dist(pts[i - 1], pts[i]); } return s; }

    function buildAgents() {
      var rand = rng(7), out = [], idx = 0;
      ROOMS.forEach(function (r) {
        for (var i = 0; i < r.n; i++) {
          var start = [Math.round(r.x + 22 + rand() * (r.w - 44)), Math.round(r.y + 40 + rand() * (r.h - 56))];
          var pts;
          if (r.exit) {
            pts = [start, r.exit];
          } else {
            var d = r.door, c = [d[0], CY], best = null;
            EXITS.forEach(function (e) {
              var p = e.p ? [start, d, c, e.p] : [start, d, c, [e.ax, CY], [e.ax, 310], e.end];
              if (!best || pathLen(p) < pathLen(best)) { best = p; }
            });
            pts = best;
          }
          var cum = [0];
          for (var k = 1; k < pts.length; k++) { cum.push(cum[k - 1] + dist(pts[k - 1], pts[k])); }
          var speedMs = 1.0 + rand() * 0.4;
          out.push({
            id: ++idx, room: r.id, pts: pts, cum: cum, len: cum[cum.length - 1],
            sp: speedMs * PXM, pre: r.fire ? 3 + rand() * 12 : 15 + rand() * 65
          });
        }
      });
      return out;
    }
    var agents = buildAgents();
    agents.forEach(function (a) { a.exitAt = a.pre + a.len / a.sp; });
    var RSET = Math.ceil(Math.max.apply(null, agents.map(function (a) { return a.exitAt; })));
    var ASET = Math.round(SMOKE_START + (FIRE.x - 40) / SMOKE_SPEED);

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function smokeLen(t) { return clamp((t - SMOKE_START) * SMOKE_SPEED, 0, 760); }
    function fireSmoke(t) { return clamp((t - 8) / 60, 0, 1) * 0.78; }
    function hrr(t) { return ALPHA * t * t; }

    function agentAt(a, t) {
      var d = (t - a.pre) * a.sp;
      if (d <= 0) { return { x: a.pts[0][0], y: a.pts[0][1], out: false }; }
      if (d >= a.len) { return { out: true }; }
      for (var i = 1; i < a.cum.length; i++) {
        if (d <= a.cum[i]) {
          var f = (d - a.cum[i - 1]) / (a.cum[i] - a.cum[i - 1]);
          return { x: a.pts[i - 1][0] + (a.pts[i][0] - a.pts[i - 1][0]) * f, y: a.pts[i - 1][1] + (a.pts[i][1] - a.pts[i - 1][1]) * f, out: false };
        }
      }
      return { out: true };
    }
    function inSmoke(a, p, t) {
      if (a.room === 2 && t > 25) { return true; }
      var L = smokeLen(t);
      return L > 0 && p.y >= 230 && p.y <= 310 && Math.abs(p.x - FIRE.x) <= L;
    }
    function stats(t) {
      var out = 0, smoke = 0, byRoom = {};
      agents.forEach(function (a) {
        var p = agentAt(a, t);
        byRoom[a.room] = byRoom[a.room] || { out: 0, total: 0 };
        byRoom[a.room].total++;
        if (p.out) { out++; byRoom[a.room].out++; } else if (inSmoke(a, p, t)) { smoke++; }
      });
      return { out: out, total: agents.length, smoke: smoke, byRoom: byRoom };
    }

    var FONT = "Segoe UI, Roboto, Helvetica, Arial, sans-serif";

    function renderCad() {
      var s = '<rect width="800" height="480" fill="#0a1a2f"/>';
      s += '<defs><pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#12304f" stroke-width="0.7"/></pattern></defs>';
      s += '<rect width="800" height="480" fill="url(#cad-grid)"/>';
      s += '<rect x="40" y="40" width="720" height="400" fill="none" stroke="#5ad1ff" stroke-width="2"/>';
      s += '<rect x="46" y="46" width="708" height="388" fill="none" stroke="#2f7aa6" stroke-width="1"/>';
      ROOMS.forEach(function (r) {
        if (!r.corridor) { s += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="none" stroke="#5ad1ff" stroke-width="1.2"/>'; }
      });
      ROOMS.forEach(function (r) {
        if (r.door) {
          s += '<rect x="' + (r.door[0] - 14) + '" y="' + (r.door[1] - 3) + '" width="28" height="6" fill="#0a1a2f"/>';
          var up = r.door[1] === 230;
          s += '<path d="M' + (r.door[0] - 14) + ' ' + r.door[1] + ' a28 28 0 0 ' + (up ? 1 : 0) + ' 28 ' + (up ? 0 : 0) + '" fill="none" stroke="#c9ecff" stroke-width="0.9" transform="translate(0 ' + (up ? -1 : 1) + ')"/>';
          s += '<line x1="' + (r.door[0] - 14) + '" y1="' + r.door[1] + '" x2="' + (r.door[0] - 14) + '" y2="' + (r.door[1] + (up ? -22 : 22)) + '" stroke="#c9ecff" stroke-width="0.9"/>';
        }
      });
      s += '<rect x="165" y="436" width="10" height="8" fill="#0a1a2f"/><rect x="625" y="436" width="10" height="8" fill="#0a1a2f"/>';
      s += '<line x1="40" y1="22" x2="760" y2="22" stroke="#8ab4d3" stroke-width="1"/><line x1="40" y1="16" x2="40" y2="28" stroke="#8ab4d3"/><line x1="760" y1="16" x2="760" y2="28" stroke="#8ab4d3"/>';
      s += '<text x="400" y="17" text-anchor="middle" font-size="12" fill="#8ab4d3" font-family="ui-monospace, Consolas, monospace">72 000</text>';
      ROOMS.forEach(function (r) {
        s += '<text class="plan-label" x="' + (r.x + 42) + '" y="' + (r.y + 27) + '" font-size="13" fill="#7fb2d6" font-family="ui-monospace, Consolas, monospace">' + r.name.toUpperCase() + '</text>';
      });
      s += '<text x="40" y="466" font-size="12" fill="#5f8aa9" font-family="ui-monospace, Consolas, monospace">A-WALL · A-DOOR · A-ANNO-DIMS   (chưa có kịch bản cháy, người, lối ra)</text>';
      return s;
    }

    function flame() {
      return "M0,-28 C10,-14 18,-6 14,6 C12,14 4,18 0,18 C-4,18 -12,14 -14,6 C-18,-6 -8,-14 0,-28Z";
    }

    function renderSim(t, layers) {
      var L = smokeLen(t), s = "";
      s += '<defs>' +
        '<filter id="sim-blur" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>' +
        '<radialGradient id="sim-heat"><stop offset="0" stop-color="#ff5a1f" stop-opacity="0.75"/><stop offset="0.55" stop-color="#ffb020" stop-opacity="0.35"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="sim-glow"><stop offset="0" stop-color="#ffd166" stop-opacity="0.95"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="sim-clip-corr"><rect x="40" y="230" width="720" height="80"/></clipPath>' +
        '<clipPath id="sim-clip-fire"><rect x="240" y="40" width="160" height="190"/></clipPath>' +
        '</defs>';
      s += '<rect width="800" height="480" fill="#eef1f8"/>';
      ROOMS.forEach(function (r) {
        s += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="' + r.fill + '" stroke="#1f2a44" stroke-width="3"/>';
      });
      ROOMS.forEach(function (r) {
        if (r.door) { s += '<rect x="' + (r.door[0] - 14) + '" y="' + (r.door[1] - 3) + '" width="28" height="6" fill="#f6f8fc"/>'; }
      });
      EXITS.forEach(function (e, i) {
        s += '<rect x="' + e.rect[0] + '" y="' + e.rect[1] + '" width="' + e.rect[2] + '" height="' + e.rect[3] + '" rx="3" fill="#12b886"/>';
        var tx = i === 0 ? 20 : i === 1 ? 780 : e.rect[0] + 20, ty = i < 2 ? 274 : 458;
        s += '<text class="plan-label" x="' + tx + '" y="' + ty + '" text-anchor="middle" font-size="11" font-weight="700" fill="#0b7a5b" font-family="' + FONT + '">' + (i < 2 ? "RA" : "LỐI RA") + '</text>';
      });
      ROOMS.forEach(function (r) {
        s += '<text class="plan-label" x="' + (r.x + 42) + '" y="' + (r.y + 27) + '" font-size="13" font-weight="600" fill="#44506b" font-family="' + FONT + '">' + r.name + '</text>';
      });

      if (layers.smoke) {
        var heatR = 40 + Math.min(120, t * 0.6);
        s += '<g clip-path="url(#sim-clip-fire)"><circle cx="' + FIRE.x + '" cy="' + FIRE.y + '" r="' + heatR + '" fill="url(#sim-heat)"/></g>';
        var fa = fireSmoke(t);
        if (fa > 0) { s += '<g clip-path="url(#sim-clip-fire)"><rect x="210" y="10" width="220" height="250" fill="#262a36" opacity="' + fa.toFixed(3) + '" filter="url(#sim-blur)"/></g>'; }
        if (L > 0) {
          var x0 = Math.max(10, FIRE.x - L), x1 = Math.min(790, FIRE.x + L);
          s += '<g clip-path="url(#sim-clip-corr)"><rect x="' + x0.toFixed(1) + '" y="215" width="' + (x1 - x0).toFixed(1) + '" height="110" fill="#333847" opacity="0.66" filter="url(#sim-blur)"/></g>';
        }
      }

      var sc = Math.min(1.5, 0.35 + t / 110);
      s += '<circle cx="' + FIRE.x + '" cy="' + FIRE.y + '" r="' + (24 + sc * 22).toFixed(1) + '" fill="url(#sim-glow)"/>';
      s += '<g transform="translate(' + FIRE.x + ' ' + (FIRE.y + 6) + ') scale(' + sc.toFixed(2) + ')"><path d="' + flame() + '" fill="#ff5a1f"/><path d="' + flame() + '" fill="#ffd166" transform="translate(0 7) scale(0.55)"/></g>';

      if (layers.people) {
        agents.forEach(function (a) {
          var p = agentAt(a, t);
          if (p.out) { return; }
          var smoky = layers.smoke && inSmoke(a, p, t);
          s += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4.6" fill="' + (smoky ? "#ffb020" : "#12b886") + '" stroke="#fff" stroke-width="1.3"/>';
        });
      }
      return s;
    }

    function hitSvg() {
      var s = '<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" focusable="false">';
      ROOMS.forEach(function (r) {
        s += '<rect class="hit-room" data-room="' + r.id + '" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" tabindex="0" role="button" aria-pressed="false" aria-label="Phòng ' + r.id + ': ' + r.name + '"/>';
      });
      ROOMS.forEach(function (r) {
        s += '<g class="hit-badge"><circle cx="' + (r.x + 22) + '" cy="' + (r.y + 22) + '" r="16" fill="#0b1020" stroke="#fff" stroke-width="2"/><text x="' + (r.x + 22) + '" y="' + (r.y + 28) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="' + FONT + '">' + r.id + '</text></g>';
      });
      return s + "</svg>";
    }

    function compose(st, caption) {
      var h = caption ? 536 : 480, x = st.pos * 8;
      var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ' + h + '" width="800" height="' + h + '" font-family="' + FONT + '">';
      s += "<g>" + renderCad() + "</g>";
      s += '<defs><clipPath id="cmp-clip"><rect x="' + x + '" y="0" width="' + (800 - x) + '" height="480"/></clipPath></defs>';
      s += '<g clip-path="url(#cmp-clip)">' + renderSim(st.t, st.layers) + "</g>";
      s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="480" stroke="#fff" stroke-width="3"/>';
      s += '<circle cx="' + x + '" cy="240" r="20" fill="#fff" stroke="#0b1020" stroke-opacity="0.35"/>';
      s += '<path d="M' + (x - 9) + ' 240l6-6v12zM' + (x + 9) + ' 240l-6-6v12z" fill="#0b1020"/>';
      if (caption) {
        s += '<rect y="480" width="800" height="56" fill="#0b1020"/>';
        s += '<text x="20" y="505" font-size="17" font-weight="700" fill="#fff">' + CFG.brand.name + " · t = " + Math.round(st.t) + " s · HRR ≈ " + fmtNum(hrr(st.t) / 1000, 2) + " MW</text>";
        s += '<text x="20" y="526" font-size="13" fill="#9aa4cc">Trái: CAD/Revit thô · Phải: PyroSim + Pathfinder (số liệu minh họa) · ' + CFG.brand.domain + "</text>";
      }
      return s + "</svg>";
    }

    return {
      ROOMS: ROOMS, agents: agents, RSET: RSET, ASET: ASET, K_SAFE: K_SAFE, T_MAX: T_MAX, FIRE: FIRE,
      renderCad: renderCad, renderSim: renderSim, hitSvg: hitSvg, compose: compose,
      smokeLen: smokeLen, fireSmoke: fireSmoke, hrr: hrr, stats: stats, agentAt: agentAt
    };
  })();

  function initHero() {
    var plan = $("#hero-plan");
    if (!plan) { return; }
    var t = 120;
    plan.innerHTML = Plan.compose({ t: t, pos: 30, layers: { smoke: true, people: true } }, false);
    var st = Plan.stats(t);
    var okSafe = Plan.ASET >= Plan.K_SAFE * Plan.RSET;
    $("#hero-left").innerHTML =
      '<p class="mini-k">ASET (minh họa)</p><p class="mini-v">' + Plan.ASET + ' s</p><p class="mini-n">Thời điểm khói lan hết hành lang</p>';
    $("#hero-right").innerHTML =
      '<p class="mini-k">RSET (minh họa)</p><p class="mini-v ' + (okSafe ? "ok" : "") + '">' + Plan.RSET + ' s</p><p class="mini-n">' + st.out + "/" + st.total + " người đã thoát lúc t = " + t + " s</p>";
  }

  function initSim() {
    var stage = $("#sim-stage");
    if (!stage) { return; }
    var DEFAULTS = { t: 90, pos: 30 };
    var state = { t: DEFAULTS.t, pos: DEFAULTS.pos, layers: { smoke: true, people: true }, sel: null, playing: false };

    var cad = $("#sim-cad"), top = $("#sim-top"), hit = $("#sim-hit"), handle = $("#sim-handle");
    var timeIn = $("#sim-time"), timeOut = $("#sim-time-out"), hud = $("#sim-hud");
    var playBtn = $("#sim-play"), playLabel = $("#sim-play-label"), playIcon = $("#sim-play-icon");

    cad.innerHTML = '<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" focusable="false">' + Plan.renderCad() + "</svg>";
    hit.innerHTML = Plan.hitSvg();

    // Danh sách phòng (cho bàn phím và màn hình nhỏ)
    var roomBox = $("#sim-rooms");
    Plan.ROOMS.forEach(function (r) {
      roomBox.appendChild(el("button", {
        type: "button", class: "room-btn", "data-room": r.id, "aria-pressed": "false",
        onclick: function () { select(state.sel === r.id ? null : r.id); }
      }, [el("span", { class: "n", text: String(r.id) }), r.name]));
    });

    function roomById(id) { return Plan.ROOMS.filter(function (r) { return r.id === id; })[0]; }

    function select(id) {
      state.sel = id;
      $$(".hit-room", hit).forEach(function (n) {
        var on = Number(n.getAttribute("data-room")) === id;
        n.classList.toggle("sel", on);
        n.setAttribute("aria-pressed", on ? "true" : "false");
      });
      $$(".room-btn", roomBox).forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-room")) === id ? "true" : "false"); });
      renderInfo();
    }

    hit.addEventListener("click", function (e) {
      var n = e.target.closest ? e.target.closest(".hit-room") : null;
      if (n) { var id = Number(n.getAttribute("data-room")); select(state.sel === id ? null : id); }
    });
    hit.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("hit-room")) {
        e.preventDefault();
        var id = Number(e.target.getAttribute("data-room"));
        select(state.sel === id ? null : id);
      }
    });

    function renderInfo() {
      var box = $("#sim-info");
      clear(box);
      if (!state.sel) {
        box.appendChild(el("p", { class: "muted", text: "Bấm vào một phòng trên mô hình, hoặc chọn trong danh sách dưới mô hình, để xem diện tích, số người và tình trạng khói tại thời điểm đang xem." }));
        return;
      }
      var r = roomById(state.sel), st = Plan.stats(state.t), rs = st.byRoom[r.id] || { out: 0, total: 0 };
      var status;
      if (r.fire) {
        status = "Nguồn cháy, HRR ≈ " + fmtNum(Plan.hrr(state.t) / 1000, 2) + " MW, khói lấp đầy " + Math.round(Plan.fireSmoke(state.t) / 0.78 * 100) + "%";
      } else if (r.corridor) {
        var L = Plan.smokeLen(state.t);
        status = L > 0 ? "Khói lan khoảng " + fmtNum(Math.min(720, 2 * L) / 10, 1) + " m dọc hành lang" : "Chưa có khói";
      } else {
        status = "Chưa bị ảnh hưởng (cửa đóng, minh họa)";
      }
      var dl = el("dl", null, [
        el("dt", { text: "Diện tích" }), el("dd", { text: fmtNum(r.w * r.h / 100, 0) + " m²" }),
        el("dt", { text: "Số người" }), el("dd", { text: r.corridor ? "Chỉ là lối đi" : rs.total + " người" }),
        el("dt", { text: "Đã thoát" }), el("dd", { text: r.corridor ? "–" : rs.out + " / " + rs.total }),
        el("dt", { text: "Khói" }), el("dd", { text: status }),
        el("dt", { text: "Lối ra" }), el("dd", { text: r.exit ? "Ra trực tiếp ngoài công trình" : r.corridor ? "Bốn lối ra quanh hành lang" : "Qua hành lang tới lối ra gần nhất" })
      ]);
      box.appendChild(el("h3", { text: r.id + ". " + r.name }));
      box.appendChild(dl);
    }

    function renderMetrics() {
      var st = Plan.stats(state.t), ok = Plan.ASET >= Plan.K_SAFE * Plan.RSET;
      var m = $("#sim-metrics");
      clear(m);
      [
        { k: "RSET", v: Plan.RSET + " s", c: "" },
        { k: "ASET", v: Plan.ASET + " s", c: ok ? "ok" : "bad" },
        { k: "Đã thoát", v: st.out + "/" + st.total, c: "" }
      ].forEach(function (x) { m.appendChild(el("div", { class: "metric " + x.c }, [el("span", { text: x.k }), el("strong", { text: x.v })])); });
      m.setAttribute("title", ok ? "ASET ≥ " + Plan.K_SAFE + " × RSET: đạt (minh họa)" : "ASET < " + Plan.K_SAFE + " × RSET: chưa đạt (minh họa)");
    }

    function update() {
      timeIn.value = String(Math.round(state.t));
      timeOut.textContent = Math.round(state.t) + " s";
      timeIn.setAttribute("aria-valuetext", Math.round(state.t) + " giây");
      hud.textContent = "t = " + Math.round(state.t) + " s · HRR ≈ " + fmtNum(Plan.hrr(state.t) / 1000, 2) + " MW · " + Plan.stats(state.t).smoke + " người trong khói";
      top.innerHTML = '<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" focusable="false">' + Plan.renderSim(state.t, state.layers) + "</svg>";
      renderMetrics();
      renderInfo();
    }

    function setPos(p) {
      state.pos = Math.max(0, Math.min(100, Math.round(p)));
      stage.style.setProperty("--pos", state.pos + "%");
      handle.setAttribute("aria-valuenow", String(state.pos));
      handle.setAttribute("aria-valuetext", "Hiển thị " + (100 - state.pos) + "% mô hình mô phỏng");
    }

    // Kéo thả tay cầm
    var dragging = false;
    function posFrom(e) { var r = stage.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; }
    handle.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      dragging = true;
      handle.classList.add("drag");
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
      handle.focus({ preventScroll: true });
    });
    handle.addEventListener("pointermove", function (e) { if (dragging) { setPos(posFrom(e)); } });
    function endDrag(e) {
      if (!dragging) { return; }
      dragging = false;
      handle.classList.remove("drag");
      try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
    }
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2, handled = true;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setPos(state.pos - step); }
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") { setPos(state.pos + step); }
      else if (e.key === "Home") { setPos(0); }
      else if (e.key === "End") { setPos(100); }
      else { handled = false; }
      if (handled) { e.preventDefault(); }
    });

    // Thời gian, phát
    timeIn.addEventListener("input", function () { state.t = Number(timeIn.value); update(); });
    var raf = 0, last = 0;
    function setPlaying(on) {
      state.playing = on;
      playBtn.setAttribute("aria-pressed", on ? "true" : "false");
      playLabel.textContent = on ? "Dừng" : "Phát";
      playIcon.setAttribute("d", on ? "M6 4h4v16H6zM14 4h4v16h-4z" : "M7 4v16l13-8z");
      cancelAnimationFrame(raf);
      if (on) {
        if (state.t >= Plan.T_MAX) { state.t = 0; }
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }
    function tick(now) {
      state.t = Math.min(Plan.T_MAX, state.t + ((now - last) / 1000) * 15);
      last = now;
      update();
      if (state.t >= Plan.T_MAX) { setPlaying(false); } else { raf = requestAnimationFrame(tick); }
    }
    playBtn.addEventListener("click", function () { setPlaying(!state.playing); });

    $("#layer-smoke").addEventListener("change", function (e) { state.layers.smoke = e.target.checked; update(); });
    $("#layer-people").addEventListener("change", function (e) { state.layers.people = e.target.checked; update(); });

    $("#sim-reset").addEventListener("click", function () {
      setPlaying(false);
      state.t = DEFAULTS.t; state.layers = { smoke: true, people: true };
      $("#layer-smoke").checked = true; $("#layer-people").checked = true;
      setPos(DEFAULTS.pos);
      select(null);
      update();
      toast("Đã đặt lại trình mô phỏng");
    });

    $("#sim-png").addEventListener("click", function () {
      var svg = Plan.compose({ t: state.t, pos: state.pos, layers: state.layers }, true);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        c.width = 1600; c.height = 1072;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          if (b) { saveBlob(b, "mo-phong-thoat-nan-t" + Math.round(state.t) + "s.png"); toast("Đã tải ảnh PNG"); }
          else { toast("Không tạo được ảnh PNG"); }
        }, "image/png");
      };
      img.onerror = function () { toast("Không tạo được ảnh PNG"); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });

    $("#sim-csv").addEventListener("click", function () {
      var rows = [["Ma nguoi", "Phong", "Tre truoc khi di chuyen (s)", "Quang duong (m)", "Van toc (m/s)", "Thoi diem thoat (s)"]];
      Plan.agents.forEach(function (a) {
        rows.push([a.id, roomById(a.room).name, (Math.round(a.pre * 10) / 10), (Math.round(a.len / 10 * 10) / 10), (Math.round(a.sp) / 10), (Math.round(a.exitAt * 10) / 10)]);
      });
      rows.push([]);
      rows.push(["RSET (s)", Plan.RSET]);
      rows.push(["ASET minh hoa (s)", Plan.ASET]);
      var csv = rows.map(function (r) { return r.join(","); }).join("\r\n");
      saveBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), "ket-qua-thoat-nan-minh-hoa.csv");
      toast("Đã tải file CSV");
    });

    setPos(state.pos);
    update();
  }

  /* ================================================================ Khởi chạy */
  function init() {
    bindConfig();
    initNav();
    initTopics();
    initLibrary();
    initStats();
    initPlans();
    initZalo();
    initForm();
    initHero();
    initSim();
    initReveal();
  }

  root.classList.add("js");
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
