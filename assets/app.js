(function () {
  var d = document, root = d.documentElement, body = d.body;
  root.classList.add("js");
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // theme
  var saved = store("eva-theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  var tbtn = d.getElementById("theme");
  if (tbtn) tbtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); store("eva-theme", next);
  });

  // drawer
  function menu(open) {
    body.classList.toggle("menu-open", open);
    var b = d.getElementById("burger"); if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
  }
  var burger = d.getElementById("burger"), closeBtn = d.getElementById("close"), scrim = d.getElementById("scrim");
  if (burger) burger.addEventListener("click", function () { menu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { menu(false); });
  if (scrim) scrim.addEventListener("click", function () { menu(false); });
  d.addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });

  // promo progress
  var track = d.querySelector(".track"), bar = d.querySelector(".progress i");
  if (track && bar) {
    var n = track.children.length;
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = (100 / n) + "%";
      bar.style.transform = "translateX(" + (p * (n - 1) * 100) + "%)";
    };
    track.addEventListener("scroll", upd, { passive: true }); upd();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var idx = 0, paused = false;
      track.addEventListener("pointerdown", function () { paused = true; });
      track.addEventListener("mouseenter", function () { paused = true; });
      setInterval(function () {
        if (paused || d.hidden) return;
        idx = (idx + 1) % n;
        var el = track.children[idx];
        track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: "smooth" });
      }, 5000);
    }
  }

  // copy promo code
  d.querySelectorAll(".cp").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-copy"), done = function () { var o = b.textContent; b.textContent = "Скопировано"; setTimeout(function () { b.textContent = o; }, 1600); };
      var fb = function () { var r = d.createRange(); r.selectNodeContents(b.parentNode.querySelector(".cv")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb();
    });
  });

  // tabs
  var tabs = d.querySelectorAll('.tabs [role="tab"]');
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute("aria-selected", on ? "true" : "false");
        var p = d.getElementById(o.getAttribute("aria-controls")); if (p) p.hidden = !on;
      });
    });
  });

  // slots catalog
  var cat = d.getElementById("catalog");
  if (cat) {
    var rows = [], view = [], shown = 0, PAGE = 40;
    var q = d.getElementById("q"), fp = d.getElementById("fp"), ft = d.getElementById("ft"), fv = d.getElementById("fv");
    var body_ = d.getElementById("rows"), cnt = d.getElementById("cnt"), more = d.getElementById("more");
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var fmt = function (n) { return n ? String(n).replace(".", ",") : "—"; };
    var bet = function (a, b) { return a || b ? fmt(a) + " – " + fmt(b) : "—"; };
    var line = function (r) {
      return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + (r[2] || "—") + "</td><td>" + esc(r[3]) + "</td><td>" +
        (r[4] ? fmt(r[4]) + "%" : "—") + "</td><td>" + esc(r[5] || "—") + "</td><td>" + (r[6] ? "x" + r[6].toLocaleString("ru-RU") : "—") + "</td><td>" + bet(r[7], r[8]) + "</td></tr>";
    };
    var draw = function (reset) {
      if (reset) { shown = 0; body_.innerHTML = ""; }
      var end = Math.min(view.length, shown + PAGE), html = "";
      for (var i = shown; i < end; i++) html += line(view[i]);
      body_.insertAdjacentHTML("beforeend", html); shown = end;
      cnt.textContent = "Найдено: " + view.length.toLocaleString("ru-RU") + " из " + rows.length.toLocaleString("ru-RU");
      more.hidden = shown >= view.length;
    };
    var sorters = { new: function (a, b) { return b[2] - a[2]; }, rtp: function (a, b) { return b[4] - a[4]; }, win: function (a, b) { return b[6] - a[6]; }, name: function (a, b) { return a[0].localeCompare(b[0], "ru"); } };
    var apply = function () {
      var s = q.value.trim().toLowerCase(), p = fp.value, t = ft.value, v = fv.value, so = d.getElementById("so").value;
      view = rows.filter(function (r) {
        return (!s || r[0].toLowerCase().indexOf(s) > -1) && (!p || r[1] === p) && (!t || r[3] === t) && (!v || r[5] === v);
      });
      view.sort(sorters[so]); draw(true);
    };
    fetch(cat.getAttribute("data-src")).then(function (r) { return r.json(); }).then(function (data) {
      rows = data;
      var count = function (i) { var m = {}; rows.forEach(function (r) { if (r[i]) m[r[i]] = (m[r[i]] || 0) + 1; }); return m; };
      var opt = function (sel, m, lim) {
        Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).slice(0, lim).sort(function (a, b) { return a.localeCompare(b, "ru"); })
          .forEach(function (k) { var o = d.createElement("option"); o.value = k; o.textContent = k + " (" + m[k] + ")"; sel.appendChild(o); });
      };
      opt(fp, count(1), 120); opt(ft, count(3), 20); opt(fv, count(5), 20);
      apply();
    }).catch(function () { cnt.textContent = "Не удалось загрузить каталог. Откройте сайт через веб-сервер, а не как локальный файл."; });
    var t0; q.addEventListener("input", function () { clearTimeout(t0); t0 = setTimeout(apply, 180); });
    [fp, ft, fv, d.getElementById("so")].forEach(function (el) { el.addEventListener("change", apply); });
    more.querySelector("button").addEventListener("click", function () { draw(false); });
  }
})();
