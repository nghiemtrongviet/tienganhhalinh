(() => {
  "use strict";
  const C = (window.KIDS || []).concat(window.COURSE);
  const uname = (u) => (u.kids ? `Unit ${u.id - 100}` : `Unit ${u.id}`);
  const pic = (w) => w[4] || "";
  // unit có đủ hình khác nhau cho mọi từ thì mới chơi được "nghe chọn hình"
  const hasPics = (u) => u.vocab.filter((w) => w[4]).length >= 8;
  const KEY = "bpa1-progress";
  const app = document.getElementById("app");
  const crumbs = document.getElementById("crumbs");

  /* ---------- lưu tiến độ ---------- */
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { S = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* bỏ qua */ } };
  const P = (id) => (S[id] ||= { known: [], dict: [], speak: {}, quiz: 0, dlg: 0 });
  function progress(u) {
    const p = P(u.id);
    const v = p.known.length / u.vocab.length;
    const l = p.dict.length / u.phrases.length;
    const s = Object.values(p.speak).filter((x) => x >= 70).length / u.phrases.length;
    return { v, l, s, all: (v + l + s) / 3 };
  }
  const pc = (x) => Math.round(x * 100);

  /* ---------- lời động viên ---------- */
  const NAMEKEY = "bpa1-name";
  let kid = "Hà Linh";
  try { kid = localStorage.getItem(NAMEKEY) || kid; } catch { /* bỏ qua */ }
  const CHEERS = ["{n} cố lên! 💪", "{n} giỏi quá! 🌟", "Tuyệt vời, {n}! 🎉", "Chính xác! {n} cố lên nhé! 💖", "{n} làm tốt lắm! 👏", "Xuất sắc, {n}! 🏆", "Đúng rồi! {n} tiếp tục nào! 🚀", "{n} thông minh quá! ✨", "Hoan hô {n}! 🥳", "{n} cố lên, sắp giỏi tiếng Anh rồi! 📚"];
  let lastCheer = -1, cheerT;
  /* ---------- sao thưởng, huy hiệu, chuỗi ngày học ---------- */
  const M = (S._meta ||= { stars: 0, days: [] });
  const BADGES = [[10, "🌱", "Mầm xanh"], [30, "🐣", "Gà con chăm chỉ"], [60, "🐰", "Thỏ nhanh nhẹn"], [100, "🦊", "Cáo thông minh"], [200, "🦁", "Sư tử dũng cảm"], [350, "🦄", "Kỳ lân tài năng"], [500, "🚀", "Phi hành gia"], [1000, "👑", "Nhà vô địch tiếng Anh"]];
  const dayKey = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function markDay() { const k = dayKey(); if (!M.days.includes(k)) { M.days.push(k); M.days = M.days.slice(-90); } }
  function streak() {
    const set = new Set(M.days), d = new Date(); let n = 0;
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const starEl = document.getElementById("stars");
  function showStars() { if (starEl) starEl.textContent = "⭐ " + M.stars; }
  // mỗi lần làm đúng được 1 sao; trả về huy hiệu nếu vừa đạt mốc
  function addStar() { M.stars++; markDay(); save(); showStars(); return BADGES.find((b) => b[0] === M.stars); }
  showStars();

  function cheer() {
    let i; do { i = Math.floor(Math.random() * CHEERS.length); } while (i === lastCheer);
    lastCheer = i;
    const badge = addStar();
    let el = document.getElementById("cheer");
    if (!el) { el = document.createElement("div"); el.id = "cheer"; el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
    el.textContent = badge ? `🎖 Huy hiệu mới: ${badge[1]} ${badge[2]}! Chúc mừng ${kid}!` : CHEERS[i].replace("{n}", kid);
    el.className = ""; void el.offsetWidth; el.className = "show";
    clearTimeout(cheerT); cheerT = setTimeout(() => { el.className = ""; }, badge ? 4500 : 1900);
  }
  const renameEl = document.getElementById("rename");
  if (renameEl) {
    const label = () => { renameEl.textContent = `Người học: ${kid} (đổi tên)`; };
    label();
    renameEl.onclick = (e) => {
      e.preventDefault();
      const n = (prompt("Tên người học (dùng trong lời động viên):", kid) || "").trim().slice(0, 30);
      if (!n) return;
      kid = n; try { localStorage.setItem(NAMEKEY, n); } catch { /* bỏ qua */ }
      label(); cheer();
    };
  }

  /* ---------- tiện ích ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const $ = (sel, root = app) => root.querySelector(sel);
  const on = (sel, ev, fn, root = app) => root.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));

  /* ---------- đọc văn bản (TTS) ---------- */
  const hasTTS = "speechSynthesis" in window;
  let voices = [], token = 0;
  function loadVoices() {
    const rank = (v) => (/en[-_]US/i.test(v.lang) ? 0 : /en[-_]GB/i.test(v.lang) ? 1 : 2) + (/natural|google|online/i.test(v.name) ? 0 : 0.5);
    voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)).sort((a, b) => rank(a) - rank(b));
  }
  if (hasTTS) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function stopSay() { token++; if (hasTTS) speechSynthesis.cancel(); }
  function say(text, { rate = 0.9, who = 0, onend } = {}) {
    stopSay();
    const my = token;
    const done = () => { if (my === token && onend) onend(); };
    if (!hasTTS) { done(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate;
    const v = voices[who] || voices[0];
    if (v) { u.voice = v; u.lang = v.lang; }
    if (who && voices.length < 2) u.pitch = 0.7;
    u.onend = done; u.onerror = done;
    speechSynthesis.speak(u);
  }

  /* ---------- nhận dạng giọng nói ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRec = null;
  function listen(onDone, onState) {
    stopSay();
    const r = new SR();
    let alts = [], err = "";
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 3;
    r.onresult = (e) => { alts = [...e.results[0]].map((a) => a.transcript); };
    r.onerror = (e) => { err = e.error; };
    r.onend = () => { activeRec = null; onState(false); if (alts.length) markVoice(); startMonitor(); onDone(alts, err); };
    activeRec = r;
    stopMonitor(); // nhả micro cho bộ nhận dạng giọng nói
    try { r.start(); onState(true); } catch { onState(false); onDone([], "start"); }
  }
  function stopRec() { if (activeRec) { try { activeRec.abort(); } catch { /* bỏ qua */ } activeRec = null; } }
  const srError = (err) => ({
    "not-allowed": "Trình duyệt chưa được cấp quyền micro. Hãy cho phép micro rồi thử lại.",
    "service-not-allowed": "Trình duyệt chặn dịch vụ nhận dạng giọng nói.",
    "no-speech": "Không nghe thấy gì. Hãy nói to, rõ hơn và thử lại.",
    "audio-capture": "Không tìm thấy micro.",
    "network": "Nhận dạng giọng nói cần kết nối mạng."
  }[err] || "Chưa nhận dạng được. Hãy thử lại.");

  /* ---------- so khớp câu ---------- */
  const NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const CONTR = { "i'm": "i am", "it's": "it is", "that's": "that is", "what's": "what is", "let's": "let us", "don't": "do not", "can't": "can not", "cannot": "can not", "we're": "we are", "you're": "you are", "they're": "they are", "she's": "she is", "he's": "he is", "i'll": "i will", "we'll": "we will", "didn't": "did not", "doesn't": "does not", "isn't": "is not", "ok": "okay" };
  function words(s) {
    return s.toLowerCase().replace(/[’‘]/g, "'").replace(/(\d+):00/g, "$1 o'clock")
      .replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean)
      .flatMap((w) => (CONTR[w] || (/^\d+$/.test(w) && NUM[+w]) || w).split(" "));
  }
  // Trả về mảng đúng/sai cho từng từ của câu mẫu (dãy con chung dài nhất).
  function match(target, said) {
    const a = words(target), b = words(said), n = a.length, m = b.length;
    const d = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const hit = new Array(n).fill(false);
    for (let i = 0, j = 0; i < n && j < m;) { if (a[i] === b[j]) { hit[i] = true; i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
    return { hit, score: n ? Math.round(100 * hit.filter(Boolean).length / n) : 0, exact: a.join(" ") === b.join(" ") };
  }
  // Tô màu câu mẫu theo kết quả so khớp (giữ nguyên chữ hoa, dấu câu).
  function paint(target, hit, mask = false) {
    const toks = target.split(/\s+/); let k = 0;
    return '<div class="words big">' + toks.map((t) => {
      const n = words(t).length || 0; const ok = n > 0 && hit.slice(k, k + n).every(Boolean); k += n;
      return `<span class="${ok ? "hit" : "miss"}">${esc(ok || !mask ? t : t.replace(/[A-Za-z0-9']/g, "•"))}</span>`;
    }).join(" ") + "</div>";
  }
  const verdict = (sc) => sc >= 90 ? ["good", "Tuyệt vời!"] : sc >= 70 ? ["good", "Tốt, đạt yêu cầu."] : sc >= 40 ? ["mid", "Gần được rồi, thử lại nhé."] : ["bad", "Chưa khớp, hãy nghe lại và nói chậm, rõ từng từ."];

  /* ---------- định tuyến ---------- */
  const TABS = {
    vocab: ["Từ vựng", { flash: "Thẻ ghi nhớ", list: "Danh sách", quiz: "Trắc nghiệm", spell: "Nghe – gõ từ" }],
    listen: ["Nghe", { video: "Video bài học", order: "Nghe – xếp câu", dict: "Chép chính tả", dlg: "Nghe hội thoại" }],
    speak: ["Nói", { shadow: "Nhại theo mẫu câu", role: "Đóng vai hội thoại", chat: "🤖 Trò chuyện với cô Mimi" }],
    game: ["🎮 Trò chơi", { pic: "Nghe chọn hình", memory: "Lật thẻ ghép cặp", scramble: "Xếp chữ", balloon: "Bóng bay từ vựng" }]
  };
  // các chế độ dùng được cho từng unit (không có video thì ẩn mục video, không có hình thì ẩn trò chọn hình)
  const modesFor = (u, tab) => Object.entries(TABS[tab][1]).filter(([k]) => !(k === "chat" && !AI_URL && !MIMI_URL) && !(k === "video" && !u.videos.length) && !(k === "pic" && !hasPics(u)) && !(k === "dict" && u.kids) && !(k === "order" && !u.kids));
  /* ----- học đúng thứ tự: Từ vựng → Nghe → Nói → Trò chơi, xong bước trước mới mở bước sau ----- */
  const QUIZ_PASS = 80;
  const STEPS = [
    ["vocab", "flash", "bấm “Đã thuộc” hết các thẻ từ", (u, p) => p.known.length >= u.vocab.length],
    ["vocab", "quiz", `làm Trắc nghiệm đạt từ ${QUIZ_PASS}%`, (u, p) => p.quiz >= QUIZ_PASS],
    ["listen", "", "làm xong tất cả các câu nghe", (u, p) => p.dict.length >= u.phrases.length],
    ["listen", "dlg", "trả lời đúng các câu hỏi của bài hội thoại", (u, p) => !!p.dlg],
    ["speak", "shadow", "nói đạt tất cả các mẫu câu", (u, p) => u.phrases.every((_, k) => p.speak[k] >= 70)]
  ];
  // mỗi chế độ cần xong bao nhiêu bước đầu thì mới mở
  const NEED = { flash: 0, list: 0, quiz: 1, spell: 1, video: 2, order: 2, dict: 2, dlg: 3, shadow: 4, role: 5, chat: 5, pic: 5, memory: 5, scramble: 5, balloon: 5 };
  const stage = (u) => { const p = P(u.id), i = STEPS.findIndex((st) => !st[3](u, p)); return i < 0 ? STEPS.length : i; };
  const stepAt = (u, i) => [STEPS[i][0], STEPS[i][1] || (u.kids ? "order" : "dict")];
  const isOpen = (u, mode) => stage(u) >= NEED[mode];
  // hẹn giờ của trò chơi: tự hủy khi chuyển trang
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); timers.add(t); return t; };
  const clearTimers = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.clear(); };
  const VIEWS = {};
  // Địa chỉ máy chủ phụ gọi AI (Google Apps Script, xem tro-ly-ao.gs). Để trống thì ẩn mục trò chuyện.
  const AI_URL = "", CHAT_TURNS = 15;
  // Trang cô Mimi chạy trên claude.ai, dùng Claude của tài khoản bố mẹ (chỉ tài khoản đó mở được).
  const MIMI_URL = "https://claude.ai/artifact/QCHN2iJEx9yw16erL5iWMw";
  function route() {
    stopSay(); stopRec(); clearTimers();
    if (locked()) return showLock();
    const [, a, id, tab, mode] = location.hash.split("/");
    const u = a === "u" && C.find((x) => x.id === +id);
    document.body.classList.toggle("kid", !u || !!u.kids);
    if (a === "today") return todayLesson();
    if (a === "review") { window.scrollTo(0, 0); return reviewPage(); }
    if (!u) return home();
    const st = stage(u), cur = st < STEPS.length ? stepAt(u, st) : ["vocab", "flash"];
    const t = TABS[tab] ? tab : cur[0];
    const ms = modesFor(u, t).map(([k]) => k);
    const m = ms.includes(mode) ? mode : (!TABS[tab] ? cur[1] : ms.find((k) => isOpen(u, k)) || ms[0]);
    // chưa xong bước trước thì đưa về bước đang học
    if (!isOpen(u, m)) { location.replace(`#/u/${u.id}/${cur[0]}/${cur[1]}`); return; }
    unit(u, t, m);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  function home() {
    crumbs.innerHTML = "";
    const cards = (list) => `<div class="grid">${list.map((u) => {
        const p = progress(u);
        return `<a class="card unit ${u.kids ? "kid" : ""}" href="#/u/${u.id}">
          ${u.kids ? `<div class="cover">${esc(pic(u.vocab[0]) || "📘")}</div>` : ""}
          <div class="no">${uname(u).toUpperCase()}</div><h3>${esc(u.title)}</h3><div class="vi">${esc(u.vi)}</div>
          <div class="topics">${esc(u.topics)}</div>
          <div class="bar"><i style="width:${pc(p.all)}%"></i></div>
          <div class="pct"><span>Từ vựng ${pc(p.v)}% · Nghe ${pc(p.l)}% · Nói ${pc(p.s)}%</span><b>${pc(p.all)}%</b></div></a>`;
      }).join("")}</div>`;
    const kids = C.filter((u) => u.kids), adult = C.filter((u) => !u.kids);
    const tu = todayUnit(), doneToday = M.today === dayKey(), nextB = BADGES.find((b) => b[0] > M.stars);
    const hello = `<div class="card hello"><div class="row"><div><div class="big">Xin chào, ${esc(kid)}! 👋</div>
        <div class="muted">⭐ <b>${M.stars}</b> sao · 🔥 <b>${streak()}</b> ngày học liên tiếp</div></div><span class="spacer"></span>
        ${reviewWords().length ? `<a class="btn" href="#/review">📌 Ôn ${reviewWords().length} từ hay sai</a>` : ""}
        <a class="todaybtn" href="#/today"><b>${doneToday ? "✓ Đã học hôm nay · Học thêm" : "▶ Bài hôm nay"}</b><small>${uname(tu)}: ${esc(tu.title)}</small></a></div>
      <div class="badges">${BADGES.map((b) => `<span class="badge ${M.stars >= b[0] ? "got" : ""}" title="${esc(b[2])} – ${b[0]} sao">${b[1]}<small>${b[0]}⭐</small></span>`).join("")}</div>
      ${nextB ? `<div class="muted small">Còn <b>${nextB[0] - M.stars}</b> sao nữa để nhận huy hiệu ${nextB[1]} ${esc(nextB[2])}. Mỗi câu đúng được 1 sao.</div>` : ""}</div>`;
    app.innerHTML = `${hello}<h1 style="margin-top:26px">🌟 Tiếng Anh lớp 4</h1>
      <p class="sub">Bấm vào unit con đang học ở lớp. Unit có viền hồng là unit của <b>Bài hôm nay</b>.</p>
      <div class="utiles">${kids.map((u) => `<a class="utile ${u === tu ? "cur" : ""}" href="#/u/${u.id}"><span class="e">${esc(pic(u.vocab[0]) || "📘")}</span><b>${uname(u)}</b><span class="t">${esc(u.title)}</span><div class="bar"><i style="width:${pc(progress(u).all)}%"></i></div></a>`).join("")}</div>
      <details class="adult"><summary>Dành cho người lớn: Business Partner A1 (${adult.length} unit)</summary>${cards(adult)}</details>`;
  }

  let curUnit = null, curTab = "", curMode = "";
  function navHtml(u, tab, mode) {
    const st = stage(u), all = st >= STEPS.length;
    const tabs = Object.entries(TABS).map(([k, [name]]) => {
      const first = modesFor(u, k)[0][0];
      return isOpen(u, first) ? `<a class="tab ${k === tab ? "on" : ""}" data-t="${k}" href="#/u/${u.id}/${k}">${name}</a>` : `<span class="tab locked" title="Học xong bước trước thì mới mở">🔒 ${name}</span>`;
    }).join("");
    const modes = modesFor(u, tab).map(([k, name]) => isOpen(u, k) ? `<a class="mode ${k === mode ? "on" : ""}" href="#/u/${u.id}/${tab}/${k}">${name}</a>` : `<span class="mode locked">🔒 ${name}</span>`).join("");
    let hint;
    if (all) hint = `<div class="gate done">🎉 ${esc(kid)} đã học xong Từ vựng, Nghe và Nói. Trò chơi đã mở!${tab === "game" ? "" : ` <a href="#/u/${u.id}/game">Chơi ngay ›</a>`}</div>`;
    else {
      const [t2, m2] = stepAt(u, st), here = t2 === tab && m2 === mode;
      hint = `<div class="gate">👉 <b>Bước ${st + 1}/${STEPS.length}:</b> ${STEPS[st][2]} thì mới mở bước sau.${here ? "" : ` <a class="btn pri" href="#/u/${u.id}/${t2}/${m2}">Đến bước này ›</a>`}</div>`;
    }
    return `<div class="tabs">${tabs}</div>${hint}<div class="modes">${modes}</div>`;
  }
  function refreshBar() {
    const nav = $("#unav"); if (nav && curUnit) nav.innerHTML = navHtml(curUnit, curTab, curMode);
    const el = $("#ubar"); if (!el || !curUnit) return;
    const p = progress(curUnit);
    el.innerHTML = `<div class="bar"><i style="width:${pc(p.all)}%"></i></div>
      <div class="pct"><span>Từ vựng ${pc(p.v)}% · Nghe ${pc(p.l)}% · Nói ${pc(p.s)}%</span><b>${pc(p.all)}%</b></div>`;
  }
  function unit(u, tab, mode) {
    curUnit = u; curTab = tab; curMode = mode;
    crumbs.innerHTML = `<a href="#/">Tất cả bài học</a> › ${uname(u)}`;
    const prev = C.find((x) => x.id === u.id - 1), next = C.find((x) => x.id === u.id + 1);
    app.innerHTML = `<div class="row"><div><h1>${uname(u)}: ${esc(u.title)}</h1><p class="sub" style="margin:0">${esc(u.vi)} — ${esc(u.topics)}</p></div>
      <span class="spacer"></span>
      ${prev ? `<a class="btn" href="#/u/${prev.id}">‹ ${uname(prev)}</a>` : ""}${next ? `<a class="btn" href="#/u/${next.id}">${uname(next)} ›</a>` : ""}</div>
      <div id="ubar" style="margin-top:12px"></div>
      ${u.kids ? `<div style="margin-top:10px">${todayUnit() === u ? '<span class="tag">📌 Đây là unit của Bài hôm nay</span>' : '<button class="btn" id="setcur">📌 Đặt làm unit đang học</button>'}</div>` : ""}
      <div id="unav"></div>
      <div id="pane"></div>`;
    refreshBar();
    const sc = $("#setcur");
    if (sc) sc.onclick = () => { M.cur = u.id; save(); unit(u, tab, mode); };
    VIEWS[mode](u, $("#pane"));
  }

  /* ================= TỪ VỰNG ================= */
  VIEWS.flash = (u, pane) => {
    const p = P(u.id);
    let deck = u.vocab.filter((w) => !p.known.includes(w[0]));
    if (!deck.length) deck = u.vocab.slice();
    let i = 0, flipped = false;
    const draw = () => {
      const w = deck[i];
      pane.innerHTML = `<div class="card flash" id="fc">
          ${pic(w) ? `<div class="pic">${esc(pic(w))}</div>` : ""}<div class="w">${esc(w[0])}</div><div class="ipa">${esc(w[1])}</div>
          ${flipped ? `<div class="vi">${esc(w[2])}</div><div class="ex">${esc(w[3])}</div>` : `<div class="hint">Bấm vào thẻ để xem nghĩa</div>`}
        </div>
        <div class="row" style="margin-top:14px">
          <button class="icon" id="sp" title="Nghe phát âm">🔊</button>
          <span class="count">Thẻ ${i + 1}/${deck.length} · Đã thuộc ${p.known.length}/${u.vocab.length}</span>
          <span class="spacer"></span>
          <button class="btn" id="no">Chưa thuộc</button>
          <button class="btn ok" id="yes">Đã thuộc ✓</button>
        </div>`;
      $("#fc").onclick = () => { flipped = !flipped; draw(); if (flipped) say(w[3]); };
      $("#sp").onclick = () => say(w[0], { rate: 0.8 });
      $("#no").onclick = () => step(false);
      $("#yes").onclick = () => step(true);
    };
    const step = (known) => {
      const w = deck[i][0];
      if (known) cheer();
      if (known && !p.known.includes(w)) p.known.push(w);
      if (!known) p.known = p.known.filter((x) => x !== w);
      save(); refreshBar();
      i++; flipped = false;
      if (i >= deck.length) {
        pane.innerHTML = `<div class="card center"><div class="big">Hết bộ thẻ!</div>
          <p>Bạn đã thuộc <b>${p.known.length}/${u.vocab.length}</b> từ của unit này.</p>
          <div class="row" style="justify-content:center"><button class="btn pri" id="again">Học lại</button>
          <a class="btn" href="#/u/${u.id}/vocab/quiz">Làm trắc nghiệm ›</a></div></div>`;
        $("#again").onclick = () => VIEWS.flash(u, pane);
        return;
      }
      draw(); say(deck[i][0], { rate: 0.8 });
    };
    draw();
  };

  VIEWS.list = (u, pane) => {
    const p = P(u.id);
    pane.innerHTML = `<div class="card"><table class="wordlist">${u.vocab.map((w, i) => `<tr>
      <td><button class="icon" data-i="${i}">🔊</button></td>
      <td><div class="en">${pic(w) ? esc(pic(w)) + " " : ""}${esc(w[0])} ${p.known.includes(w[0]) ? '<span class="tag">đã thuộc</span>' : ""}</div><div class="muted small">${esc(w[1])}</div></td>
      <td><div>${esc(w[2])}</div><div class="muted small"><i>${esc(w[3])}</i></div></td></tr>`).join("")}</table></div>`;
    on(".icon", "click", (e) => { const w = u.vocab[+e.currentTarget.dataset.i]; say(w[0] + ". " + w[3], { rate: 0.85 }); });
  };

  VIEWS.quiz = (u, pane) => {
    const p = P(u.id);
    const qs = shuffle(u.vocab).slice(0, 10).map((w, k) => {
      const audio = k % 2 === 1 && hasTTS;
      const others = shuffle(u.vocab.filter((x) => x !== w)).slice(0, 3);
      return { w, audio, opts: shuffle([w, ...others]) };
    });
    let i = 0, right = 0;
    const draw = () => {
      if (i >= qs.length) {
        const sc = pc(right / qs.length);
        if (sc > p.quiz) { p.quiz = sc; save(); refreshBar(); }
        pane.innerHTML = `<div class="card center"><div class="muted">Kết quả</div><div class="score">${right}/${qs.length}</div>
          <p class="muted">Điểm cao nhất: ${p.quiz}%</p><button class="btn pri" id="again">Làm lại</button></div>`;
        $("#again").onclick = () => VIEWS.quiz(u, pane);
        return;
      }
      const q = qs[i];
      pane.innerHTML = `<div class="card"><div class="count">Câu ${i + 1}/${qs.length}</div>
        <div class="q">${q.audio ? `<button class="icon" id="sp">🔊</button> <span class="muted small">Nghe và chọn từ đúng</span>` : `${esc(q.w[0])} <button class="icon" id="sp">🔊</button>`}</div>
        <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(q.audio ? o[0] : (pic(o) ? pic(o) + "  " : "") + o[2])}</button>`).join("")}</div>
        <div id="fb"></div></div>`;
      $("#sp").onclick = () => say(q.w[0], { rate: 0.8 });
      if (q.audio) say(q.w[0], { rate: 0.8 });
      on(".opt", "click", (e) => {
        const pick = q.opts[+e.currentTarget.dataset.k], ok = pick === q.w;
        if (ok) { right++; cheer(); }
        (ok ? gotIt : missed)(q.w[0]);
        app.querySelectorAll(".opt").forEach((b, k) => { b.disabled = true; if (q.opts[k] === q.w) b.classList.add("right"); else if (b === e.currentTarget) b.classList.add("wrong"); });
        $("#fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}"><b>${esc(q.w[0])}</b> ${esc(q.w[1])} — ${esc(q.w[2])}<br><i>${esc(q.w[3])}</i></div>
          <div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn pri" id="nx">Tiếp ›</button></div>`;
        $("#nx").onclick = () => { i++; draw(); };
        $("#nx").focus();
      });
    };
    draw();
  };

  VIEWS.spell = (u, pane) => {
    const p = P(u.id);
    const deck = shuffle(u.vocab);
    let i = 0, right = 0;
    const draw = () => {
      if (i >= deck.length) {
        pane.innerHTML = `<div class="card center"><div class="muted">Viết đúng</div><div class="score">${right}/${deck.length}</div><button class="btn pri" id="again">Làm lại</button></div>`;
        $("#again").onclick = () => VIEWS.spell(u, pane);
        return;
      }
      const w = deck[i];
      pane.innerHTML = `<div class="card"><div class="count">Từ ${i + 1}/${deck.length}</div>
        <div class="row" style="margin:12px 0"><button class="icon" id="sp">🔊</button><span>Nghe và gõ lại từ tiếng Anh. Gợi ý nghĩa: <b>${esc(w[2])}</b></span></div>
        <form id="f" class="row"><input class="inp" id="in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ từ bạn nghe được" style="flex:1">
        <button class="btn pri">Kiểm tra</button></form><div id="fb"></div></div>`;
      $("#sp").onclick = () => say(w[0], { rate: 0.75 });
      say(w[0], { rate: 0.75 });
      $("#in").focus();
      $("#f").onsubmit = (e) => {
        e.preventDefault();
        if ($("#in").disabled) { i++; draw(); return; }
        const ok = words($("#in").value).join(" ") === words(w[0]).join(" ");
        (ok ? gotIt : missed)(w[0]);
        if (ok) { right++; cheer(); if (!p.known.includes(w[0])) { p.known.push(w[0]); save(); refreshBar(); } }
        $("#in").disabled = true;
        $("#f button").textContent = "Tiếp ›";
        $("#fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${ok ? "Chính xác!" : "Chưa đúng."} <b>${esc(w[0])}</b> ${esc(w[1])} — ${esc(w[2])}</div>`;
        $("#f button").focus();
      };
    };
    draw();
  };

  /* ================= NGHE ================= */
  VIEWS.video = (u, pane) => {
    pane.innerHTML = `<p class="muted">Xem video của unit, sau đó luyện <a href="#/u/${u.id}/listen/dict">chép chính tả</a> và <a href="#/u/${u.id}/listen/dlg">nghe hội thoại</a>.</p>
      <div class="videos">${u.videos.map(([id, name]) => `<div>
        <button class="vid" data-id="${id}" title="Phát video"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span class="play">▶</span></button>
        <div class="vcap">${esc(name)} · <a class="small" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${id}">Mở trên YouTube</a></div></div>`).join("")}</div>`;
    on(".vid", "click", (e) => {
      const b = e.currentTarget;
      b.outerHTML = `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
    });
  };

  VIEWS.dict = (u, pane) => {
    const p = P(u.id);
    let i = Math.max(0, u.phrases.findIndex((_, k) => !p.dict.includes(k)));
    const draw = () => {
      const [en, vi] = u.phrases[i];
      pane.innerHTML = `<div class="card">
        <div class="row"><span class="count">Câu ${i + 1}/${u.phrases.length} · Đã hoàn thành ${p.dict.length}/${u.phrases.length}</span>
          ${p.dict.includes(i) ? '<span class="tag">đã đạt</span>' : ""}</div>
        <div class="row" style="margin:14px 0"><button class="btn pri" id="sp">🔊 Nghe</button><button class="btn" id="slow">🐢 Nghe chậm</button>
          <span class="muted small">Nghe bao nhiêu lần tùy ý, rồi gõ lại cả câu.</span></div>
        <form id="f"><input class="inp" id="in" autocomplete="off" spellcheck="false" placeholder="Gõ câu bạn nghe được">
          <div class="row" style="margin-top:12px"><button class="btn pri">Kiểm tra</button><button type="button" class="btn" id="show">Xem đáp án</button>
          <span class="spacer"></span><button type="button" class="btn" id="pv" ${i ? "" : "disabled"}>‹ Trước</button><button type="button" class="btn" id="nx" ${i < u.phrases.length - 1 ? "" : "disabled"}>Sau ›</button></div></form>
        <div id="fb"></div></div>`;
      $("#sp").onclick = () => say(en, { rate: 0.9 });
      $("#slow").onclick = () => say(en, { rate: 0.6 });
      $("#pv").onclick = () => { i--; draw(); };
      $("#nx").onclick = () => { i++; draw(); };
      $("#show").onclick = () => { $("#fb").innerHTML = `<div class="fb mid"><b>${esc(en)}</b><br>${esc(vi)}</div>`; };
      $("#f").onsubmit = (e) => {
        e.preventDefault();
        const r = match(en, $("#in").value);
        if (r.exact) cheer();
        if (r.exact && !p.dict.includes(i)) { p.dict.push(i); save(); refreshBar(); }
        $("#fb").innerHTML = `<div class="fb ${r.exact ? "good" : r.score >= 60 ? "mid" : "bad"}">
          ${r.exact ? "Chính xác!" : `Đúng ${r.score}% số từ. Từ gạch chân là từ còn thiếu hoặc sai — nghe lại và sửa nhé.`}
          ${r.exact ? paint(en, r.hit) + `<div>${esc(vi)}</div>` : paint(en, r.hit, true)}</div>`;
      };
      say(en, { rate: 0.9 });
      $("#in").focus();
    };
    draw();
  };

  // Nghe – xếp câu (dành cho học sinh nhỏ, thay cho chép chính tả): bấm các từ theo đúng thứ tự
  VIEWS.order = (u, pane) => {
    const p = P(u.id);
    let i = Math.max(0, u.phrases.findIndex((_, k) => !p.dict.includes(k)));
    const draw = () => {
      const [en, vi] = u.phrases[i], toks = en.split(/\s+/);
      let pos = 0;
      const tiles = shuffle(toks);
      if (toks.length > 1 && tiles.join(" ") === en) tiles.reverse();
      pane.innerHTML = `<div class="card center">
        <div class="row"><span class="count">Câu ${i + 1}/${u.phrases.length} · Đã xong ${p.dict.length}/${u.phrases.length}</span>${p.dict.includes(i) ? '<span class="tag">đã đạt</span>' : ""}</div>
        <div class="row" style="justify-content:center;margin:14px 0"><button class="btn pri" id="sp">🔊 Nghe</button><button class="btn" id="slow">🐢 Nghe chậm</button></div>
        <p class="muted">Nghe rồi bấm các từ theo đúng thứ tự để xếp thành câu.</p>
        <div class="answer" id="ans"></div>
        <div class="tiles">${tiles.map((t) => `<button class="tile word" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
        <div id="fb"></div>
        <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn" id="pv" ${i ? "" : "disabled"}>‹ Trước</button><button class="btn" id="nx" ${i < u.phrases.length - 1 ? "" : "disabled"}>Sau ›</button></div></div>`;
      $("#sp").onclick = () => say(en, { rate: 0.85 });
      $("#slow").onclick = () => say(en, { rate: 0.6 });
      $("#pv").onclick = () => { i--; draw(); };
      $("#nx").onclick = () => { i++; draw(); };
      on(".tile", "click", (e) => {
        const t = e.currentTarget;
        if (t.dataset.t !== toks[pos]) { t.classList.remove("shake"); void t.offsetWidth; t.classList.add("shake"); return; }
        t.disabled = true; t.classList.add("used");
        $("#ans").textContent += (pos ? " " : "") + toks[pos];
        if (++pos < toks.length) return;
        cheer();
        if (!p.dict.includes(i)) { p.dict.push(i); save(); refreshBar(); }
        say(en, { rate: 0.85 });
        $("#fb").innerHTML = `<div class="fb good"><b>${esc(en)}</b><br>${esc(vi)}</div>`;
      });
      say(en, { rate: 0.85 });
    };
    draw();
  };

  function dlgHTML(u, cls = () => "") {
    return `<div class="dlg">${u.dialogue.lines.map(([who, t], k) => `<div class="line ${who} ${cls(k, who)}" data-k="${k}"><span class="who">${who}</span><span class="txt">${esc(t)}</span></div>`).join("")}</div>`;
  }

  VIEWS.dlg = (u, pane) => {
    const p = P(u.id), d = u.dialogue;
    let hidden = true;
    const answers = {};
    pane.innerHTML = `<div class="card"><h2>${esc(d.title)}</h2>
        <div class="row"><button class="btn pri" id="play">▶ Nghe hội thoại</button><button class="btn" id="stop">■ Dừng</button>
        <button class="btn" id="tog">Hiện lời thoại</button><span class="muted small">Nghe trước, trả lời câu hỏi, rồi mới mở lời thoại.</span></div>
        <div id="lines">${dlgHTML(u, () => "hidden")}</div></div>
      <div class="card" style="margin-top:14px"><h2>Câu hỏi nghe hiểu</h2><div class="stack">${d.questions.map(([q, opts], k) => `<div data-q="${k}">
        <div style="font-weight:600;margin-bottom:8px">${k + 1}. ${esc(q)}</div>
        <div class="opts">${opts.map((o, j) => `<button class="opt" data-q="${k}" data-j="${j}">${esc(o)}</button>`).join("")}</div></div>`).join("")}</div>
        <div id="fb"></div></div>`;
    const mark = (k) => app.querySelectorAll("#lines .line").forEach((el) => el.classList.toggle("now", +el.dataset.k === k));
    const play = (k) => {
      if (k >= d.lines.length) { mark(-1); return; }
      mark(k);
      say(d.lines[k][1], { who: d.lines[k][0] === "A" ? 0 : 1, onend: () => setTimeout(() => play(k + 1), 350) });
    };
    $("#play").onclick = () => play(0);
    $("#stop").onclick = () => { stopSay(); mark(-1); };
    $("#tog").onclick = () => {
      hidden = !hidden;
      app.querySelectorAll("#lines .line").forEach((el) => el.classList.toggle("hidden", hidden));
      $("#tog").textContent = hidden ? "Hiện lời thoại" : "Ẩn lời thoại";
    };
    on("#lines .line", "click", (e) => { const k = +e.currentTarget.dataset.k; mark(k); say(d.lines[k][1], { who: d.lines[k][0] === "A" ? 0 : 1, onend: () => mark(-1) }); });
    on(".opt", "click", (e) => {
      const k = +e.currentTarget.dataset.q, j = +e.currentTarget.dataset.j, ok = j === d.questions[k][2];
      answers[k] = ok;
      if (ok) cheer();
      app.querySelectorAll(`.opt[data-q="${k}"]`).forEach((b) => b.classList.remove("right", "wrong"));
      e.currentTarget.classList.add(ok ? "right" : "wrong");
      if (d.questions.every((_, x) => answers[x])) {
        p.dlg = 1; save(); refreshBar();
        $("#fb").innerHTML = `<div class="fb good">Bạn trả lời đúng cả ${d.questions.length} câu. Hãy mở lời thoại để đối chiếu, rồi sang phần <a href="#/u/${u.id}/speak">Nói</a>.</div>`;
      }
    });
  };

  /* ================= NÓI ================= */
  const noSR = `<div class="note">Trình duyệt này không hỗ trợ chấm điểm giọng nói. Hãy mở trang bằng <b>Chrome</b> hoặc <b>Edge</b> để dùng micro. Bạn vẫn có thể nghe mẫu, nói theo và tự đánh giá.</div>`;

  VIEWS.shadow = (u, pane) => {
    const p = P(u.id);
    let i = Math.max(0, u.phrases.findIndex((_, k) => !(p.speak[k] >= 70)));
    const draw = () => {
      const [en, vi] = u.phrases[i];
      const best = p.speak[i];
      pane.innerHTML = `${SR ? "" : noSR}<div class="card">
        <div class="row"><span class="count">Câu ${i + 1}/${u.phrases.length} · Đạt ${Object.values(p.speak).filter((x) => x >= 70).length}/${u.phrases.length}</span>
          ${best != null ? `<span class="tag">điểm cao nhất ${best}%</span>` : ""}</div>
        <div class="center" style="margin:22px 0 6px"><div class="big">${esc(en)}</div><div class="muted">${esc(vi)}</div></div>
        <div class="row" style="justify-content:center;margin:18px 0">
          <button class="btn" id="sp">🔊 Nghe mẫu</button><button class="btn" id="slow">🐢 Chậm</button>
          ${SR ? `<button class="btn rec" id="rec">🎙 Bấm để nói</button>` : `<button class="btn ok" id="self">Tôi đã nói tốt ✓</button>`}</div>
        <div id="fb"></div>
        <div class="row" style="margin-top:14px"><span class="muted small">Cách luyện: nghe mẫu → nói to theo → xem từ nào chưa rõ → nói lại.</span><span class="spacer"></span>
          <button class="btn" id="pv" ${i ? "" : "disabled"}>‹ Trước</button><button class="btn" id="nx" ${i < u.phrases.length - 1 ? "" : "disabled"}>Sau ›</button></div></div>`;
      $("#sp").onclick = () => say(en, { rate: 0.9 });
      $("#slow").onclick = () => say(en, { rate: 0.6 });
      $("#pv").onclick = () => { stopRec(); i--; draw(); };
      $("#nx").onclick = () => { stopRec(); i++; draw(); };
      const record = (sc) => { if (!(p.speak[i] >= sc)) { p.speak[i] = sc; save(); refreshBar(); } };
      if (!SR) { $("#self").onclick = () => { record(100); if (i < u.phrases.length - 1) i++; draw(); }; return; }
      $("#rec").onclick = () => {
        if (activeRec) { activeRec.stop(); return; }
        const btn = $("#rec");
        listen((alts, err) => {
          if (!$("#fb")) return;
          if (!alts.length) { $("#fb").innerHTML = `<div class="fb bad">${srError(err)}</div>`; return; }
          const rs = alts.map((t) => ({ t, r: match(en, t) })).sort((a, b) => b.r.score - a.r.score)[0];
          const [cls, msg] = verdict(rs.r.score);
          record(rs.r.score);
          if (rs.r.score >= 70) cheer();
          $("#fb").innerHTML = `<div class="fb ${cls} center"><div class="score">${rs.r.score}%</div><div>${msg}</div>${paint(en, rs.r.hit)}
            <div class="small">Máy nghe được: “${esc(rs.t)}”</div></div>`;
        }, (live) => { btn.classList.toggle("live", live); btn.textContent = live ? "● Đang nghe… (bấm để dừng)" : "🎙 Bấm để nói"; });
      };
    };
    draw();
  };

  /* ----- trò chuyện với trợ lý AI ----- */
  VIEWS.chat = (u, pane) => {
    if (!AI_URL) {
      pane.innerHTML = `<div class="card center" style="padding:30px 18px"><div style="font-size:60px">🤖</div>
        <div class="big">Trò chuyện với cô Mimi</div>
        <p>Cô Mimi là trợ lý AI. Cô sẽ hỏi con bằng tiếng Anh về chủ đề <b>${esc(u.title)}</b>, con trả lời bằng giọng nói hoặc gõ chữ.</p>
        <p><a class="btn pri" href="${MIMI_URL}" target="_blank" rel="noopener">Mở trang cô Mimi ›</a></p>
        <p class="muted small">Trang mở ở thẻ mới và cần đăng nhập Claude bằng tài khoản của bố mẹ. Trong trang đó, con chọn <b>${uname(u)}</b> rồi bấm “Bắt đầu nói chuyện”.</p></div>`;
      return;
    }
    const msgs = [];           // {role: "assistant" | "user", text}
    let busy = false, turns = 0, ended = false;
    // tách câu tiếng Anh (để đọc to) và dòng gợi ý tiếng Việt bắt đầu bằng 💡
    const split = (t) => { const ls = t.split("\n").map((x) => x.trim()).filter(Boolean); return { en: ls.filter((x) => !x.startsWith("💡")).join(" "), tip: ls.filter((x) => x.startsWith("💡")).join(" ") }; };
    const ERR = { limit: "Hôm nay cô Mimi đã nói chuyện đủ rồi. Mai mình gặp lại nhé!", busy: "Cô Mimi đang bận một chút. Con thử lại sau vài giây nhé.", nokey: "Bố mẹ chưa cài khóa cho cô Mimi.", auth: "Khóa của cô Mimi chưa đúng. Con nhờ bố mẹ kiểm tra nhé." };
    pane.innerHTML = `${SR ? "" : `<div class="note">Trình duyệt này không nghe được giọng nói. Con hãy gõ câu trả lời, hoặc mở trang bằng <b>Chrome</b> để nói bằng micro.</div>`}
      <div class="card chat"><div class="row"><div class="big">🤖 Cô Mimi</div><span class="count" id="cturn"></span><span class="spacer"></span><button class="btn" id="cnew">↻ Bắt đầu lại</button></div>
        <div class="muted small">Cô Mimi là trợ lý AI. Con nói tiếng Anh với cô về chủ đề: <b>${esc(u.title)}</b>. Không nói tên trường, địa chỉ hay số điện thoại nhé.</div>
        <div id="clog" class="clog" aria-live="polite"></div>
        <div class="row cin">${SR ? `<button class="btn rec" id="crec">🎙 Bấm để nói</button>` : ""}
          <input id="ctext" maxlength="200" autocomplete="off" placeholder="…hoặc gõ câu tiếng Anh ở đây"><button class="btn pri" id="csend">Gửi</button></div></div>`;
    const log = $("#clog"), inp = $("#ctext"), sendB = $("#csend"), recB = $("#crec");
    const draw = (wait) => {
      log.innerHTML = msgs.map((m, k) => {
        if (m.role === "user") return `<div class="bub me">${esc(m.text)}</div>`;
        const { en, tip } = split(m.text);
        return `<div class="bub bot"><button class="icon" data-k="${k}" title="Nghe lại">🔊</button><div><div>${esc(en)}</div>${tip ? `<div class="tip">${esc(tip)}</div>` : ""}</div></div>`;
      }).join("") + (wait ? `<div class="bub bot wait">Cô Mimi đang nghĩ…</div>` : "");
      on(".bub .icon", "click", (e) => say(split(msgs[+e.currentTarget.dataset.k].text).en, { rate: 0.85 }), log);
      log.scrollTop = log.scrollHeight;
      $("#cturn").textContent = turns ? `Lượt ${turns}/${CHAT_TURNS}` : "";
      const off = busy || ended;
      inp.disabled = sendB.disabled = off; if (recB) recB.disabled = off;
    };
    const note = (t) => { log.insertAdjacentHTML("beforeend", `<div class="fb mid">${esc(t)}</div>`); log.scrollTop = log.scrollHeight; };
    const ask = async () => {
      busy = true; draw(true);
      let reply = "", err = "";
      try {
        // text/plain để trình duyệt không hỏi trước (Apps Script không trả lời OPTIONS)
        const r = await fetch(AI_URL, { method: "POST", body: JSON.stringify({ unit: { title: u.title, words: u.vocab.map((w) => w[0]), phrases: u.phrases.map((x) => x[0]) }, messages: msgs.slice(-12) }) });
        const j = await r.json();
        if (j.ok) reply = String(j.reply || ""); else err = j.error || "x";
      } catch { err = "net"; }
      busy = false;
      if (!pane.isConnected) return;
      if (!reply) {
        if (msgs.length && msgs[msgs.length - 1].role === "user") { inp.value = msgs.pop().text; turns--; } // trả lại câu vừa nói để gửi lại
        draw(false); note(ERR[err] || "Chưa kết nối được với cô Mimi. Con kiểm tra mạng rồi thử lại nhé.");
        if (!msgs.length) { inp.disabled = sendB.disabled = true; if (recB) recB.disabled = true; }
        return;
      }
      msgs.push({ role: "assistant", text: reply });
      if (turns >= CHAT_TURNS) ended = true;
      draw(false);
      say(split(reply).en, { rate: 0.85 });
      if (ended) note(`${kid} đã trò chuyện ${CHAT_TURNS} lượt rồi, giỏi lắm! Bấm “Bắt đầu lại” nếu muốn nói chuyện tiếp.`);
    };
    const send = (text) => {
      text = text.trim().slice(0, 200);
      if (!text || busy || ended) return;
      stopSay();
      msgs.push({ role: "user", text }); turns++;
      inp.value = "";
      cheer(); markVoice();
      ask();
    };
    sendB.onclick = () => send(inp.value);
    inp.onkeydown = (e) => { if (e.key === "Enter") send(inp.value); };
    if (recB) recB.onclick = () => {
      if (activeRec) { activeRec.stop(); return; }
      listen((alts, err) => {
        if (!pane.isConnected) return;
        if (!alts.length) return note(srError(err));
        send(alts[0]);
      }, (live) => { recB.classList.toggle("live", live); recB.textContent = live ? "● Đang nghe… (bấm để dừng)" : "🎙 Bấm để nói"; });
    };
    $("#cnew").onclick = () => { stopSay(); stopRec(); VIEWS.chat(u, pane); };
    ask();
  };

  VIEWS.role = (u, pane) => {
    const d = u.dialogue;
    let me = "B", k = -1;
    const scores = [];
    const draw = () => {
      const running = k >= 0 && k < d.lines.length, mine = running && d.lines[k][0] === me;
      pane.innerHTML = `${SR ? "" : noSR}<div class="card"><h2>${esc(d.title)}</h2>
        <div class="row"><label>Bạn đóng vai: <select class="inp" id="who" ${running ? "disabled" : ""}><option value="A" ${me === "A" ? "selected" : ""}>A</option><option value="B" ${me === "B" ? "selected" : ""}>B</option></select></label>
          <button class="btn pri" id="start">${k < 0 ? "▶ Bắt đầu" : "↻ Làm lại từ đầu"}</button>
          <span class="muted small">Máy đọc vai còn lại. Đến lượt bạn, câu sẽ được tô vàng.</span></div>
        ${dlgHTML(u, (x, who) => (x === k ? (who === me ? "me" : "now") : ""))}
        ${mine ? `<div class="row">${SR ? `<button class="btn rec" id="rec">🎙 Bấm để nói</button>` : ""}<button class="btn" id="hear">🔊 Nghe mẫu</button><button class="btn ok" id="skip">${SR ? "Bỏ qua ›" : "Tôi đã nói xong ›"}</button></div>` : ""}
        <div id="fb"></div>
        ${k >= d.lines.length ? `<div class="fb good center"><div class="big">Hoàn thành hội thoại!</div>${scores.length ? `<div>Điểm trung bình các câu của bạn: <b>${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%</b></div>` : ""}<div class="small">Đổi vai và luyện lại để nói được cả hai phía.</div></div>` : ""}</div>`;
      $("#who").onchange = (e) => { me = e.target.value; };
      $("#start").onclick = () => { stopSay(); stopRec(); scores.length = 0; k = 0; turn(); };
      if (!mine) return;
      const line = d.lines[k][1];
      $("#hear").onclick = () => say(line, { rate: 0.85 });
      $("#skip").onclick = () => { stopRec(); k++; turn(); };
      if (!SR) return;
      $("#rec").onclick = () => {
        if (activeRec) { activeRec.stop(); return; }
        const btn = $("#rec");
        listen((alts, err) => {
          if (!$("#fb")) return;
          if (!alts.length) { $("#fb").innerHTML = `<div class="fb bad">${srError(err)}</div>`; return; }
          const rs = alts.map((t) => ({ t, r: match(line, t) })).sort((a, b) => b.r.score - a.r.score)[0];
          const [cls, msg] = verdict(rs.r.score);
          if (rs.r.score >= 70) {
            scores.push(rs.r.score); cheer();
            $("#fb").innerHTML = `<div class="fb ${cls}">${rs.r.score}% — ${msg}</div>`;
            setTimeout(() => { if ($("#fb")) { k++; turn(); } }, 900);
          } else {
            $("#fb").innerHTML = `<div class="fb ${cls}">${rs.r.score}% — ${msg}${paint(line, rs.r.hit)}<div class="small">Máy nghe được: “${esc(rs.t)}”</div></div>`;
          }
        }, (live) => { btn.classList.toggle("live", live); btn.textContent = live ? "● Đang nghe… (bấm để dừng)" : "🎙 Bấm để nói"; });
      };
    };
    const turn = () => {
      draw();
      if (k >= d.lines.length) return;
      const [who, text] = d.lines[k];
      if (who !== me) say(text, { who: who === "A" ? 0 : 1, onend: () => setTimeout(() => { k++; turn(); }, 400) });
    };
    draw();
  };

  /* ================= TRÒ CHƠI ================= */
  const stars = (n) => `<div class="stars">${"★".repeat(n)}<span>${"★".repeat(3 - n)}</span></div>`;
  const G = (u) => (P(u.id).game ||= {});

  // Nghe chọn hình: máy đọc từ, bấm vào hình đúng
  VIEWS.pic = (u, pane, done) => {
    const g = G(u), pool = done ? u.vocab : u.vocab.filter((w) => w[4]);
    const deck = shuffle(u.deck || pool).slice(0, 10);
    let i = 0, score = 0;
    const round = () => {
      if (i >= deck.length) {
        if (done) return done(score);
        if (!(g.pic >= score)) { g.pic = score; save(); }
        pane.innerHTML = `<div class="card center">${stars(score >= deck.length - 1 ? 3 : score >= deck.length * 0.6 ? 2 : 1)}<div class="muted">Con chọn đúng</div><div class="score">${score}/${deck.length}</div>
          <p class="muted">Điểm cao nhất: ${g.pic}</p><button class="btn pri" id="again">Chơi lại</button></div>`;
        $("#again").onclick = () => VIEWS.pic(u, pane);
        return;
      }
      const w = deck[i];
      const others = shuffle(pool.filter((x) => x !== w && (x[4] || x[2]) !== (w[4] || w[2]))).slice(0, 3);
      const opts = shuffle([w, ...others]);
      pane.innerHTML = `<div class="card center"><div class="row gamebar"><span>Câu ${i + 1}/${deck.length}</span><span class="spacer"></span><span>Đúng: <b>${score}</b></span></div>
        <p>Nghe và bấm vào <b>hình đúng</b>.</p>
        <button class="btn pri" id="sp" style="font-size:20px">🔊 Nghe lại</button>
        <div class="pics">${opts.map((o, k) => `<button class="picbtn ${o[4] ? "" : "txt"}" data-k="${k}">${esc(o[4] || o[2])}</button>`).join("")}</div>
        <div id="fb"></div></div>`;
      $("#sp").onclick = () => say(w[0], { rate: 0.75 });
      say(w[0], { rate: 0.75 });
      on(".picbtn", "click", (e) => {
        const ok = opts[+e.currentTarget.dataset.k] === w;
        (ok ? gotIt : missed)(w[0]);
        if (ok) { score++; cheer(); if (done && !u.deck && !P(u.id).known.includes(w[0])) { P(u.id).known.push(w[0]); save(); } }
        app.querySelectorAll(".picbtn").forEach((b, k) => { b.disabled = true; if (opts[k] === w) b.classList.add("right"); else if (b === e.currentTarget) b.classList.add("wrong"); });
        $("#fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${esc(w[4])} <b>${esc(w[0])}</b> ${esc(w[1])} — ${esc(w[2])}<br><i>${esc(w[3])}</i></div>
          <div style="margin-top:12px"><button class="btn pri" id="nx">Tiếp ›</button></div>`;
        $("#nx").onclick = () => { i++; round(); };
        $("#nx").focus();
        say(w[0] + ". " + w[3], { rate: 0.85 });
      });
    };
    round();
  };

  // Lật thẻ: ghép từ tiếng Anh với nghĩa tiếng Việt
  VIEWS.memory = (u, pane) => {
    const g = G(u), N = 8;
    const pick = shuffle(u.vocab).slice(0, N);
    const cards = shuffle(pick.flatMap((w, i) => [{ id: i, t: w[0], en: true }, { id: i, t: (pic(w) ? pic(w) + " " : "") + w[2], en: false }]));
    let open = [], lock = false, moves = 0, found = 0;
    pane.innerHTML = `<div class="row gamebar"><span>Lượt lật: <b id="mv">0</b></span><span>Cặp đúng: <b id="fd">0</b>/${N}</span>
        <span class="spacer"></span>${g.memory ? `<span class="tag">kỷ lục ${g.memory} lượt</span>` : ""}<button class="btn" id="re">↻ Ván mới</button></div>
      <p class="muted small">Lật hai thẻ để tìm cặp <b>từ tiếng Anh</b> – <b>nghĩa tiếng Việt</b>. Càng ít lượt lật càng giỏi!</p>
      <div class="mem">${cards.map((c, k) => `<button class="mcard" data-k="${k}"><span class="back">?</span><span class="face ${c.en ? "en" : "vi"}">${esc(c.t)}</span></button>`).join("")}</div><div id="fb"></div>`;
    $("#re").onclick = () => { clearTimers(); VIEWS.memory(u, pane); };
    on(".mcard", "click", (e) => {
      const el = e.currentTarget, c = cards[+el.dataset.k];
      if (lock || el.classList.contains("up")) return;
      el.classList.add("up");
      if (c.en) say(c.t, { rate: 0.85 });
      open.push([el, c]);
      if (open.length < 2) return;
      $("#mv").textContent = ++moves;
      const [[e1, c1], [e2, c2]] = open; open = [];
      if (c1.id === c2.id) {
        e1.classList.add("done"); e2.classList.add("done");
        $("#fd").textContent = ++found; cheer();
        if (!c.en) say(pick[c.id][0], { rate: 0.85 });
        if (found === N) {
          if (!g.memory || moves < g.memory) { g.memory = moves; save(); }
          $("#fb").innerHTML = `<div class="fb good center">${stars(moves <= 12 ? 3 : moves <= 18 ? 2 : 1)}<div class="big">Giỏi lắm! Xong sau ${moves} lượt lật.</div><div>Kỷ lục: ${g.memory} lượt</div></div>`;
          $("#fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        lock = true;
        later(() => { e1.classList.remove("up"); e2.classList.remove("up"); lock = false; }, 900);
      }
    });
  };

  // Xếp chữ: bấm các chữ cái theo đúng thứ tự để ghép thành từ
  VIEWS.scramble = (u, pane, done) => {
    const g = G(u), deck = shuffle(u.vocab).slice(0, 10), isL = (c) => /[a-z]/i.test(c);
    let i = 0, score = 0;
    const round = () => {
      if (i >= deck.length) {
        if (done) return done(score);
        if (!(g.scramble >= score)) { g.scramble = score; save(); }
        pane.innerHTML = `<div class="card center">${stars(score >= 26 ? 3 : score >= 18 ? 2 : 1)}<div class="muted">Điểm của con</div><div class="score">${score}/30</div>
          <p class="muted">Điểm cao nhất: ${g.scramble}</p><button class="btn pri" id="again">Chơi lại</button></div>`;
        $("#again").onclick = () => VIEWS.scramble(u, pane);
        return;
      }
      const w = deck[i], chars = [...w[0]], need = chars.map((c, k) => (isL(c) ? k : -1)).filter((k) => k >= 0);
      let pos = 0, miss = 0, tiles = shuffle(need.map((k) => chars[k].toLowerCase()));
      if (need.length > 1 && tiles.join("") === need.map((k) => chars[k].toLowerCase()).join("")) tiles.reverse();
      pane.innerHTML = `<div class="card center"><div class="row gamebar"><span>Từ ${i + 1}/${deck.length}</span><span class="spacer"></span><span>Điểm: <b>${score}</b></span></div>
        <div style="margin:14px 0 4px"><button class="icon" id="sp">🔊</button></div>
        ${pic(w) ? `<div class="pic">${esc(pic(w))}</div>` : ""}<div class="big" id="mean" style="color:var(--vocab)">${esc(w[2])}</div>
        <div class="slots">${chars.map((c, k) => (isL(c) ? `<span class="slot" data-k="${k}"></span>` : c === " " ? '<span class="gap"></span>' : `<span class="slot fixed">${esc(c)}</span>`)).join("")}</div>
        <div class="tiles">${tiles.map((c) => `<button class="tile" data-c="${c}">${c}</button>`).join("")}</div>
        <div class="row" style="justify-content:center"><button class="btn" id="hint">💡 Gợi ý 1 chữ</button><button class="btn" id="skip">Bỏ qua ›</button></div>
        <div id="fb"></div></div>`;
      const place = (tile) => {
        const k = need[pos];
        pane.querySelector(`.slot[data-k="${k}"]`).textContent = chars[k];
        tile.disabled = true; tile.classList.add("used");
        if (++pos < need.length) return;
        const pts = miss === 0 ? 3 : miss <= 2 ? 2 : 1;
        (miss > 2 ? missed : gotIt)(w[0]);
        score += pts; cheer();
        app.querySelectorAll(".slot").forEach((s) => s.classList.add("ok"));
        $("#hint").disabled = $("#skip").disabled = true;
        say(w[0] + ". " + w[3], { rate: 0.85 });
        $("#fb").innerHTML = `<div class="fb good">+${pts} điểm! <b>${esc(w[0])}</b> ${esc(w[1])}<br><i>${esc(w[3])}</i></div>
          <div style="margin-top:12px"><button class="btn pri" id="nx">Từ tiếp ›</button></div>`;
        $("#nx").onclick = () => { i++; round(); };
        $("#nx").focus();
      };
      $("#sp").onclick = () => say(w[0], { rate: 0.75 });
      $("#skip").onclick = () => { missed(w[0]); i++; round(); };
      $("#hint").onclick = () => {
        const want = chars[need[pos]].toLowerCase();
        miss += 2;
        place([...app.querySelectorAll(".tile:not(.used)")].find((t) => t.dataset.c === want));
      };
      on(".tile", "click", (e) => {
        const t = e.currentTarget;
        if (t.dataset.c === chars[need[pos]].toLowerCase()) return place(t);
        miss++;
        t.classList.remove("shake"); void t.offsetWidth; t.classList.add("shake");
      });
      say(w[0], { rate: 0.75 });
    };
    round();
  };

  // Bóng bay: đọc nghĩa tiếng Việt, bấm vào quả bóng có từ tiếng Anh đúng
  VIEWS.balloon = (u, pane) => {
    const g = G(u), COLORS = ["#e8590c", "#1f7ae0", "#2f9e44", "#ae3ec9", "#d6336c", "#0c8599"];
    let score, lives, time, ended, target;
    const intro = () => {
      pane.innerHTML = `<div class="card center"><div style="font-size:54px">🎈</div><div class="big">Bóng bay từ vựng</div>
        <p>Đọc nghĩa tiếng Việt ở phía trên, rồi <b>bấm vào quả bóng có từ tiếng Anh đúng</b> trước khi nó bay mất.<br>
        Con có <b>60 giây</b> và <b>3 mạng</b> ❤️. Bấm sai hoặc để bóng đúng bay mất sẽ mất một mạng.</p>
        ${g.balloon ? `<p class="muted">Điểm cao nhất: ${g.balloon}</p>` : ""}<button class="btn pri" id="go">▶ Bắt đầu chơi</button></div>`;
      $("#go").onclick = start;
    };
    const hud = () => { $("#hud").innerHTML = `<span>⏱ <b>${time}</b> giây</span><span>${"❤️".repeat(lives)}${"🤍".repeat(3 - lives)}</span><span class="spacer"></span><span>Điểm: <b>${score}</b></span>`; };
    const start = () => {
      score = 0; lives = 3; time = 60; ended = false; target = null;
      pane.innerHTML = `<div class="row gamebar" id="hud"></div><div class="sky" id="sky"><div class="ask" id="ask"></div></div>`;
      hud();
      every(() => { time--; hud(); if (time <= 0) over(); }, 1000);
      spawn();
    };
    const lose = () => { lives--; hud(); if (lives <= 0) over(); };
    const spawn = () => {
      if (ended) return;
      const sky = $("#sky");
      sky.querySelectorAll(".balloon").forEach((b) => b.remove());
      const pool = u.vocab.filter((w) => w !== target);
      target = pool[Math.floor(Math.random() * pool.length)];
      const mine = target, opts = shuffle([mine, ...shuffle(pool.filter((w) => w !== mine)).slice(0, 3)]);
      const cols = shuffle(COLORS), dur = Math.max(4.5, 8.5 - score / 40);
      $("#ask").textContent = (pic(mine) ? pic(mine) + " " : "") + mine[2];
      opts.forEach((o, k) => {
        const b = document.createElement("button");
        b.className = "balloon"; b.textContent = o[0];
        b.style.left = 1.5 + k * 24.5 + "%"; b.style.background = cols[k];
        b.style.animationDuration = dur + (o === mine ? 0.6 : Math.random() * 0.6) + "s";
        b.onclick = () => {
          if (ended) return;
          if (o === mine) { score += 10; hud(); cheer(); say(o[0], { rate: 0.85 }); b.classList.add("pop"); later(spawn, 350); }
          else { b.disabled = true; b.classList.add("wrong"); missed(mine[0]); lose(); }
        };
        if (o === mine) b.addEventListener("animationend", (e) => { if (e.animationName === "rise" && !ended) { lose(); spawn(); } });
        sky.appendChild(b);
      });
    };
    const over = () => {
      if (ended) return;
      ended = true; clearTimers();
      const missed = target;
      if (!(g.balloon >= score)) { g.balloon = score; save(); }
      pane.innerHTML = `<div class="card center">${stars(score >= 120 ? 3 : score >= 60 ? 2 : 1)}<div class="muted">${lives <= 0 ? "Hết mạng rồi!" : "Hết giờ!"} Điểm của con</div><div class="score">${score}</div>
        <p class="muted">Điểm cao nhất: ${g.balloon}${missed ? ` · Từ vừa rồi: <b>${esc(missed[0])}</b> = ${esc(missed[2])}` : ""}</p>
        <button class="btn pri" id="again">Chơi lại</button></div>`;
      $("#again").onclick = start;
    };
    intro();
  };

  /* ================= TỪ HAY SAI ================= */
  // M.miss[từ] = số lần cần trả lời đúng nữa thì mới coi là đã nhớ
  function missed(word) { (M.miss ||= {})[word] = 2; save(); }
  function gotIt(word) { if (M.miss && M.miss[word]) { if (--M.miss[word] <= 0) delete M.miss[word]; save(); } }
  function reviewWords() { const all = C.flatMap((u) => u.vocab); return Object.keys(M.miss || {}).map((k) => all.find((w) => w[0] === k)).filter(Boolean); }
  // unit giả để chơi "nghe và chọn" với các từ cần ôn (thêm vài từ khác làm đáp án nhiễu)
  function reviewUnit(rev, base) {
    const fill = shuffle(base.vocab.filter((w) => !rev.some((r) => r[0] === w[0]))).slice(0, 3);
    return { ...base, vocab: rev.concat(fill), deck: rev };
  }
  function reviewPage() {
    crumbs.innerHTML = `<a href="#/">Tất cả bài học</a> › Ôn từ hay sai`;
    const rev = shuffle(reviewWords()).slice(0, 10);
    if (!rev.length) {
      app.innerHTML = `<div class="card center" style="padding:34px 18px"><div style="font-size:64px">🎉</div><h1>Không còn từ nào cần ôn!</h1>
        <p>${esc(kid)} đã nhớ hết các từ từng làm sai.</p><a class="btn pri" href="#/">Về trang chủ</a></div>`;
      return;
    }
    app.innerHTML = `<h1>📌 Ôn từ hay sai</h1><p class="sub">Đây là những từ ${esc(kid)} từng làm sai. Trả lời đúng mỗi từ 2 lần là từ đó được xóa khỏi danh sách.</p><div id="pane"></div>`;
    VIEWS.pic(reviewUnit(rev, todayUnit()), $("#pane"), (score) => {
      const left = reviewWords().length;
      app.innerHTML = `<div class="card center" style="padding:34px 18px"><div class="muted">Con trả lời đúng</div><div class="score">${score}/${rev.length}</div>
        <p>${left ? `Còn <b>${left}</b> từ cần ôn tiếp.` : "Con đã nhớ hết các từ rồi! 🎉"}</p>
        <div class="row" style="justify-content:center">${left ? '<button class="btn pri" id="again">Ôn tiếp</button>' : ""}<a class="btn" href="#/">Về trang chủ</a></div></div>`;
      const ag = $("#again"); if (ag) ag.onclick = reviewPage;
    });
  }

  /* ================= BÀI HÔM NAY ================= */
  // Unit đang học: unit lớp 4 đầu tiên chưa thuộc hết từ
  // Bắt đầu từ unit phụ huynh/bé đã chọn (M.cur), nếu unit đó thuộc hết rồi thì sang unit kế tiếp.
  function todayUnit() {
    const ks = C.filter((u) => u.kids);
    if (!ks.length) return C[0];
    const from = Math.max(0, ks.findIndex((u) => u.id === M.cur));
    const order = ks.slice(from).concat(ks.slice(0, from));
    return order.find((u) => P(u.id).known.length < u.vocab.length) || ks[from];
  }
  function todayLesson() {
    const u = todayUnit(), p = P(u.id), start = M.stars;
    let five = u.vocab.filter((w) => !p.known.includes(w[0])).slice(0, 5);
    if (five.length < 5) five = five.concat(shuffle(u.vocab.filter((w) => !five.includes(w))).slice(0, 5 - five.length));
    const lesson = { ...u, vocab: five };
    const rev = shuffle(reviewWords()).slice(0, 5);
    const NAMES = (rev.length ? ["Ôn từ hay sai"] : []).concat(["Học 5 từ mới", "Nghe và chọn", "Nói thành câu", "Xếp chữ"]);
    let si = 0;
    crumbs.innerHTML = `<a href="#/">Tất cả bài học</a> › Bài hôm nay`;
    const next = () => { si++; run(); };

    const learn = (pane) => {
      let i = 0;
      const draw = () => {
        const w = five[i], last = i === five.length - 1;
        pane.innerHTML = `<div class="card flash" style="cursor:default">${pic(w) ? `<div class="pic">${esc(pic(w))}</div>` : ""}
            <div class="w">${esc(w[0])}</div><div class="ipa">${esc(w[1])}</div><div class="vi">${esc(w[2])}</div><div class="ex">${esc(w[3])}</div></div>
          <div class="row" style="margin-top:14px"><button class="icon" id="sp">🔊</button><span class="count">Từ ${i + 1}/${five.length} · Nghe rồi đọc to theo nhé!</span>
            <span class="spacer"></span><button class="btn pri" id="nx">${last ? "Sang bước tiếp ›" : "Từ tiếp ›"}</button></div>`;
        $("#sp").onclick = () => say(w[0] + ". " + w[3], { rate: 0.8 });
        $("#nx").onclick = () => { if (last) return next(); i++; draw(); };
        say(w[0] + ". " + w[3], { rate: 0.8 });
      };
      draw();
    };

    const speak = (pane) => {
      let idx = u.phrases.map((_, k) => k).filter((k) => !(p.speak[k] >= 70)).slice(0, 3);
      if (idx.length < 3) idx = [0, 1, 2];
      let j = 0;
      const draw = () => {
        if (j >= idx.length) return next();
        const k = idx[j], [en, vi] = u.phrases[k];
        pane.innerHTML = `${SR ? "" : noSR}<div class="card center"><div class="count">Câu ${j + 1}/${idx.length}</div>
          <div class="big" style="margin-top:14px">${esc(en)}</div><div class="muted">${esc(vi)}</div>
          <div class="row" style="justify-content:center;margin:18px 0"><button class="btn" id="sp">🔊 Nghe mẫu</button>
            ${SR ? `<button class="btn rec" id="rec">🎙 Bấm để nói</button>` : ""}<button class="btn ok" id="nx">${SR ? "Bỏ qua ›" : "Con đã nói xong ✓"}</button></div><div id="fb"></div></div>`;
        $("#sp").onclick = () => say(en, { rate: 0.85 });
        $("#nx").onclick = () => { stopRec(); if (!SR) { p.speak[k] = 100; save(); cheer(); } j++; draw(); };
        say(en, { rate: 0.85 });
        if (!SR) return;
        $("#rec").onclick = () => {
          if (activeRec) { activeRec.stop(); return; }
          const btn = $("#rec");
          listen((alts, err) => {
            if (!$("#fb")) return;
            if (!alts.length) { $("#fb").innerHTML = `<div class="fb bad">${srError(err)}</div>`; return; }
            const rs = alts.map((t) => ({ t, r: match(en, t) })).sort((a, b) => b.r.score - a.r.score)[0];
            const [cls, msg] = verdict(rs.r.score);
            if (!(p.speak[k] >= rs.r.score)) { p.speak[k] = rs.r.score; save(); }
            $("#fb").innerHTML = `<div class="fb ${cls}"><b>${rs.r.score}%</b> — ${msg}${paint(en, rs.r.hit)}</div>`;
            if (rs.r.score >= 70) { cheer(); $("#nx").textContent = "Tiếp ›"; }
          }, (live) => { btn.classList.toggle("live", live); btn.textContent = live ? "● Đang nghe… (bấm để dừng)" : "🎙 Bấm để nói"; });
        };
      };
      draw();
    };

    const finish = () => {
      M.today = dayKey(); markDay(); save();
      const got = M.stars - start, n = streak();
      app.innerHTML = `<div class="card center" style="padding:34px 18px"><div style="font-size:64px">🎉</div>
        <h1>${esc(kid)} đã hoàn thành bài hôm nay!</h1>
        <div class="score">+${got} ⭐</div>
        <p>Tổng cộng <b>${M.stars} sao</b> · 🔥 <b>${n} ngày</b> học liên tiếp</p>
        <div class="row" style="justify-content:center"><a class="btn pri" href="#/u/${u.id}">📘 Học tiếp ${uname(u)}</a><a class="btn" href="#/">Về trang chủ</a></div></div>`;
    };

    const run = () => {
      stopSay(); stopRec(); clearTimers(); window.scrollTo(0, 0);
      if (si >= NAMES.length) return finish();
      app.innerHTML = `<h1>📅 Bài hôm nay</h1><p class="sub">${uname(u)}: ${esc(u.title)} — ${esc(u.vi)}</p>
        <div class="steps">${NAMES.map((n, k) => `<span class="step ${k < si ? "done" : k === si ? "on" : ""}">${k < si ? "✓" : k + 1}. ${n}</span>`).join("")}</div><div id="pane"></div>`;
      const pane = $("#pane");
      (rev.length ? [() => VIEWS.pic(reviewUnit(rev, u), pane, next)] : []).concat([learn, () => VIEWS.pic(lesson, pane, next), speak, () => VIEWS.scramble({ ...lesson, vocab: five.slice(0, 3) }, pane, next)])[si](pane);
    };
    run();
  }

  /* ================= NHẮC ĐỌC TO ================= */
  // Nghe âm lượng micro (chỉ xử lý ngay trên máy, không ghi âm, không gửi đi đâu).
  // Nếu QUIET mili giây không thấy tiếng đọc thì hiện lời nhắc.
  const QUIET = 2 * 60 * 1000, micEl = document.getElementById("mic");
  let lastVoice = Date.now(), mon = null, monWanted = false, monDenied = false, loud = 0, remindT;
  function markVoice() { lastVoice = Date.now(); }
  function micLabel() {
    if (!micEl) return;
    const on = mon && mon.stream;
    micEl.textContent = on ? "🎙 Đang nghe" : monDenied ? "🎙 Chưa bật" : "";
    micEl.title = on ? "Trang đang nghe xem bạn có đọc to không. Âm thanh không được ghi lại hay gửi đi." : "Hãy cho phép micro để trang biết bạn đang đọc to.";
  }
  async function startMonitor() {
    if (mon || monDenied || !monWanted || activeRec || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return;
    const me = (mon = {});
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      if (mon !== me) { stream.getTracks().forEach((t) => t.stop()); return; }
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      me.stream = stream; me.ctx = ctx;
      me.timer = setInterval(() => {
        an.getFloatTimeDomainData(buf);
        let s = 0; for (const v of buf) s += v * v;
        // đủ to trong ~0,6 giây liên tục và không phải lúc máy đang đọc mẫu
        if (Math.sqrt(s / buf.length) > 0.03 && !(hasTTS && speechSynthesis.speaking)) { if (++loud >= 3) markVoice(); } else loud = 0;
      }, 200);
    } catch { if (mon === me) mon = null; monDenied = true; }
    micLabel();
  }
  function stopMonitor() {
    const m = mon; mon = null;
    if (!m) return;
    clearInterval(m.timer);
    if (m.stream) m.stream.getTracks().forEach((t) => t.stop());
    if (m.ctx) m.ctx.close().catch(() => {});
    micLabel();
  }
  function remind() {
    let el = document.getElementById("remind");
    if (!el) { el = document.createElement("div"); el.id = "remind"; el.setAttribute("role", "alert"); document.body.appendChild(el); }
    el.textContent = "📣 Bạn cần đọc to các từ nhìn thấy";
    el.className = ""; void el.offsetWidth; el.className = "show";
    clearTimeout(remindT); remindT = setTimeout(() => { el.className = ""; }, 8000);
  }
  document.addEventListener("pointerdown", () => { monWanted = true; if (!locked()) startMonitor(); }, { once: true });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { if (!locked()) startMonitor(); } else stopMonitor(); });

  /* ================= GIỚI HẠN THỜI GIAN ================= */
  // Mỗi ngày dùng tối đa LIMIT giây; hết giờ thì khóa trang trong LOCK mili giây.
  const LIMIT = 15 * 60, LOCK = 8 * 60 * 60 * 1000, TKEY = "bpa1-time";
  // Địa chỉ dịch vụ gửi thư cho bố mẹ (để trống thì ẩn phần xin mã). Mã có hiệu lực CODE_TTL, gửi lại sau RESEND.
  const MAIL_URL = "", CODE_TTL = 15 * 60 * 1000, RESEND = 60 * 1000;
  const timerEl = document.getElementById("timer");
  const loadT = () => { try { return Object.assign({ used: 0, day: "", until: 0 }, JSON.parse(localStorage.getItem(TKEY))); } catch { return { used: 0, day: "", until: 0 }; } };
  const saveT = (t) => { try { localStorage.setItem(TKEY, JSON.stringify(t)); } catch { /* bỏ qua */ } };
  const today = () => new Date().toDateString();
  const two = (n) => String(n).padStart(2, "0");
  const clock = (sec) => { sec = Math.max(0, Math.ceil(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60; return (h ? h + ":" + two(m) : m) + ":" + two(s); };
  let lockShown = false;
  function locked() { return Date.now() < loadT().until; }
  function showLock() {
    stopSay(); stopRec(); clearTimers(); stopMonitor();
    lockShown = true;
    const until = new Date(loadT().until);
    crumbs.innerHTML = "";
    if (timerEl) timerEl.textContent = "🔒 Đang khóa";
    app.innerHTML = `<div class="card center lock"><div style="font-size:64px">🔒</div>
      <h1>Hôm nay ${esc(kid)} đã học đủ ${LIMIT / 60} phút rồi!</h1>
      <p>${esc(kid)} giỏi lắm. Bây giờ hãy nghỉ ngơi, cho mắt thư giãn nhé. 🌙</p>
      <p class="muted">Trang sẽ mở lại sau</p><div class="score" id="lockcd"></div>
      <p class="muted">Mở lại lúc ${two(until.getHours())}:${two(until.getMinutes())} ngày ${two(until.getDate())}/${two(until.getMonth() + 1)}</p>
      <div class="pbox"><h3>👨‍👩‍👧 Bố mẹ cho học tiếp?</h3>
        <p class="muted">Bố mẹ nhập mã bí mật thì ${esc(kid)} được học thêm ${LIMIT / 60} phút.</p>
        ${MAIL_URL ? `<button class="btn" id="psend">📧 Gửi mã vào thư của bố mẹ</button>` : ""}
        <div class="row"><input id="pcode" class="secret" inputmode="numeric" maxlength="12" autocomplete="off" placeholder="Mã bí mật"><button class="btn pri" id="pok">Mở khóa</button></div>
        <p id="pmsg" class="muted"></p></div></div>`;
    window.scrollTo(0, 0);
    parentBox();
  }
  /* ----- bố mẹ cho phép học tiếp: mã bí mật cố định, hoặc mã 6 số gửi qua thư (nếu có MAIL_URL) ----- */
  // Chỉ lưu dấu băm của mã bí mật, không lưu mã, để người xem mã nguồn không đọc được ngay.
  const SECRET = "1g99he5atuc", MAX_BAD = 5, BAD_WAIT = 5 * 60 * 1000;
  const h53 = (str) => {
    let a = 0xdeadbeef ^ 7, b = 0x41c6ce57 ^ 7;
    for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); a = Math.imul(a ^ c, 2654435761); b = Math.imul(b ^ c, 1597334677); }
    a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
    b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
    return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
  };
  function parentBox() {
    const send = document.getElementById("psend"), inp = document.getElementById("pcode"),
      ok = document.getElementById("pok"), msg = document.getElementById("pmsg");
    const pc = () => { const q = loadT().pc; return q && Date.now() < q.exp ? q : null; };
    const upd = (fn) => { const t = loadT(); fn(t); saveT(t); };
    const wait = () => { const q = loadT().pc; return q ? Math.ceil((q.sent + RESEND - Date.now()) / 1000) : 0; };
    const blocked = () => Math.ceil(((loadT().pwait || 0) - Date.now()) / 1000);
    const show = () => {
      const bl = blocked();
      ok.disabled = inp.disabled = bl > 0;
      if (bl > 0) msg.textContent = "Nhập sai quá " + MAX_BAD + " lần. Thử lại sau " + clock(bl) + ".";
      else if (inp.disabled !== ok.disabled || /^Nhập sai quá/.test(msg.textContent)) msg.textContent = "";
      if (!send) return;
      const w = wait();
      send.disabled = w > 0;
      send.textContent = w > 0 ? "Gửi lại sau " + w + " giây" : (pc() ? "📧 Gửi lại mã" : "📧 Gửi mã vào thư của bố mẹ");
    };
    show();
    every(show, 1000);
    if (send) send.onclick = async () => {
      if (wait() > 0) return;
      const code = String(Math.floor(100000 + Math.random() * 900000));
      send.disabled = true; msg.textContent = "Đang gửi mã…";
      try {
        // Gửi dạng text/plain để trình duyệt không hỏi trước (Apps Script không trả lời OPTIONS).
        const r = await fetch(MAIL_URL, { method: "POST", body: JSON.stringify({ code, kid, minutes: LIMIT / 60, ttl: CODE_TTL / 60000 }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) throw new Error(j.error || r.status);
        upd((t) => { t.pc = { h: h53("m|" + code), exp: Date.now() + CODE_TTL, sent: Date.now() }; });
        msg.textContent = "Đã gửi mã vào hộp thư của bố mẹ. Mã dùng được trong " + (CODE_TTL / 60000) + " phút.";
        inp.value = ""; show(); inp.focus();
      } catch (e) {
        msg.textContent = String(e.message) === "limit" ? "Hôm nay đã xin mã quá nhiều lần rồi." : "Chưa gửi được thư. Hãy kiểm tra mạng rồi thử lại.";
        show();
      }
    };
    const check = () => {
      if (blocked() > 0) return;
      const v = inp.value.replace(/\D/g, ""), q = pc();
      if (!v) return;
      if (h53("hl|" + v) === SECRET || (q && h53("m|" + v) === q.h)) {
        upd((t) => { t.until = 0; t.used = 0; t.pc = null; t.pbad = 0; t.pwait = 0; });
        tick();
        return;
      }
      inp.value = "";
      let left = 0;
      upd((t) => { t.pbad = (t.pbad || 0) + 1; if (t.pbad >= MAX_BAD) { t.pbad = 0; t.pwait = Date.now() + BAD_WAIT; } left = MAX_BAD - t.pbad; });
      if (blocked() > 0) show(); else msg.textContent = "Mã chưa đúng. Còn " + left + " lần thử.";
    };
    ok.onclick = check;
    inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  }
  function tick() {
    const t = loadT(), now = Date.now();
    if (now < t.until) {
      if (!lockShown) showLock();
      const cd = document.getElementById("lockcd");
      if (cd) cd.textContent = clock((t.until - now) / 1000);
      return;
    }
    if (t.until) { t.until = 0; t.used = 0; }            // vừa hết thời gian khóa
    if (t.day !== today()) { t.day = today(); t.used = 0; } // sang ngày mới
    if (lockShown) { lockShown = false; saveT(t); route(); }
    const visible = document.visibilityState === "visible";
    if (visible) t.used++;
    // nhắc đọc to: chỉ tính khi đang ở trong một unit và không phải lúc xem video
    const reading = visible && /^#\/(u\/\d|today)/.test(location.hash) && !location.hash.includes("/listen/video");
    if (!reading) lastVoice = now;
    else if (now - lastVoice >= QUIET) { remind(); lastVoice = now; }
    if (visible && monWanted && !mon) startMonitor();
    if (t.used >= LIMIT) {
      t.until = now + LOCK; t.used = 0; saveT(t);
      showLock(); tick();
      return;
    }
    saveT(t);
    if (timerEl) {
      const left = LIMIT - t.used;
      timerEl.textContent = "⏱ Còn " + clock(left);
      timerEl.classList.toggle("low", left <= 60);
    }
  }
  setInterval(tick, 1000);

  route();
  tick();
})();
