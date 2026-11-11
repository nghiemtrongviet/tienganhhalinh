(() => {
  "use strict";
  const C = window.COURSE;
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
    r.onend = () => { activeRec = null; onState(false); onDone(alts, err); };
    activeRec = r;
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
    listen: ["Nghe", { video: "Video bài học", dict: "Chép chính tả", dlg: "Nghe hội thoại" }],
    speak: ["Nói", { shadow: "Nhại theo mẫu câu", role: "Đóng vai hội thoại" }],
    game: ["🎮 Trò chơi", { memory: "Lật thẻ ghép cặp", scramble: "Xếp chữ", balloon: "Bóng bay từ vựng" }]
  };
  // hẹn giờ của trò chơi: tự hủy khi chuyển trang
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); timers.add(t); return t; };
  const clearTimers = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.clear(); };
  const VIEWS = {};
  function route() {
    stopSay(); stopRec(); clearTimers();
    const [, a, id, tab, mode] = location.hash.split("/");
    const u = a === "u" && C.find((x) => x.id === +id);
    if (!u) return home();
    const t = TABS[tab] ? tab : "vocab";
    const m = TABS[t][1][mode] ? mode : Object.keys(TABS[t][1])[0];
    unit(u, t, m);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  function home() {
    crumbs.innerHTML = "";
    app.innerHTML = `<h1>Chọn bài học</h1>
      <p class="sub">8 unit theo giáo trình. Mỗi unit gồm <b>Từ vựng</b>, <b>Nghe</b>, <b>Nói</b> và <b>Trò chơi</b> ôn từ.</p>
      <div class="grid">${C.map((u) => {
        const p = progress(u);
        return `<a class="card unit" href="#/u/${u.id}/vocab">
          <div class="no">UNIT ${u.id}</div><h3>${esc(u.title)}</h3><div class="vi">${esc(u.vi)}</div>
          <div class="topics">${esc(u.topics)}</div>
          <div class="bar"><i style="width:${pc(p.all)}%"></i></div>
          <div class="pct"><span>Từ vựng ${pc(p.v)}% · Nghe ${pc(p.l)}% · Nói ${pc(p.s)}%</span><b>${pc(p.all)}%</b></div></a>`;
      }).join("")}</div>`;
  }

  let curUnit = null;
  function refreshBar() {
    const el = $("#ubar"); if (!el || !curUnit) return;
    const p = progress(curUnit);
    el.innerHTML = `<div class="bar"><i style="width:${pc(p.all)}%"></i></div>
      <div class="pct"><span>Từ vựng ${pc(p.v)}% · Nghe ${pc(p.l)}% · Nói ${pc(p.s)}%</span><b>${pc(p.all)}%</b></div>`;
  }
  function unit(u, tab, mode) {
    curUnit = u;
    crumbs.innerHTML = `<a href="#/">Tất cả bài học</a> › Unit ${u.id}`;
    const prev = C.find((x) => x.id === u.id - 1), next = C.find((x) => x.id === u.id + 1);
    app.innerHTML = `<div class="row"><div><h1>Unit ${u.id}: ${esc(u.title)}</h1><p class="sub" style="margin:0">${esc(u.vi)} — ${esc(u.topics)}</p></div>
      <span class="spacer"></span>
      ${prev ? `<a class="btn" href="#/u/${prev.id}/${tab}">‹ Unit ${prev.id}</a>` : ""}${next ? `<a class="btn" href="#/u/${next.id}/${tab}">Unit ${next.id} ›</a>` : ""}</div>
      <div id="ubar" style="margin-top:12px"></div>
      <div class="tabs">${Object.entries(TABS).map(([k, [name]]) => `<a class="tab ${k === tab ? "on" : ""}" data-t="${k}" href="#/u/${u.id}/${k}">${name}</a>`).join("")}</div>
      <div class="modes">${Object.entries(TABS[tab][1]).map(([k, name]) => `<a class="mode ${k === mode ? "on" : ""}" href="#/u/${u.id}/${tab}/${k}">${name}</a>`).join("")}</div>
      <div id="pane"></div>`;
    refreshBar();
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
          <div class="w">${esc(w[0])}</div><div class="ipa">${esc(w[1])}</div>
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
      <td><div class="en">${esc(w[0])} ${p.known.includes(w[0]) ? '<span class="tag">đã thuộc</span>' : ""}</div><div class="muted small">${esc(w[1])}</div></td>
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
        if (sc > p.quiz) { p.quiz = sc; save(); }
        pane.innerHTML = `<div class="card center"><div class="muted">Kết quả</div><div class="score">${right}/${qs.length}</div>
          <p class="muted">Điểm cao nhất: ${p.quiz}%</p><button class="btn pri" id="again">Làm lại</button></div>`;
        $("#again").onclick = () => VIEWS.quiz(u, pane);
        return;
      }
      const q = qs[i];
      pane.innerHTML = `<div class="card"><div class="count">Câu ${i + 1}/${qs.length}</div>
        <div class="q">${q.audio ? `<button class="icon" id="sp">🔊</button> <span class="muted small">Nghe và chọn từ đúng</span>` : `${esc(q.w[0])} <button class="icon" id="sp">🔊</button>`}</div>
        <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(q.audio ? o[0] : o[2])}</button>`).join("")}</div>
        <div id="fb"></div></div>`;
      $("#sp").onclick = () => say(q.w[0], { rate: 0.8 });
      if (q.audio) say(q.w[0], { rate: 0.8 });
      on(".opt", "click", (e) => {
        const pick = q.opts[+e.currentTarget.dataset.k], ok = pick === q.w;
        if (ok) right++;
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
        if (ok) { right++; if (!p.known.includes(w[0])) { p.known.push(w[0]); save(); refreshBar(); } }
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
      app.querySelectorAll(`.opt[data-q="${k}"]`).forEach((b) => b.classList.remove("right", "wrong"));
      e.currentTarget.classList.add(ok ? "right" : "wrong");
      if (d.questions.every((_, x) => answers[x])) {
        p.dlg = 1; save();
        $("#fb").innerHTML = `<div class="fb good">Bạn trả lời đúng cả ${d.questions.length} câu. Hãy mở lời thoại để đối chiếu, rồi sang phần <a href="#/u/${u.id}/speak/role">đóng vai hội thoại</a>.</div>`;
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
          $("#fb").innerHTML = `<div class="fb ${cls} center"><div class="score">${rs.r.score}%</div><div>${msg}</div>${paint(en, rs.r.hit)}
            <div class="small">Máy nghe được: “${esc(rs.t)}”</div></div>`;
        }, (live) => { btn.classList.toggle("live", live); btn.textContent = live ? "● Đang nghe… (bấm để dừng)" : "🎙 Bấm để nói"; });
      };
    };
    draw();
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
            scores.push(rs.r.score);
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

  // Lật thẻ: ghép từ tiếng Anh với nghĩa tiếng Việt
  VIEWS.memory = (u, pane) => {
    const g = G(u), N = 8;
    const pick = shuffle(u.vocab).slice(0, N);
    const cards = shuffle(pick.flatMap((w, i) => [{ id: i, t: w[0], en: true }, { id: i, t: w[2], en: false }]));
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
        $("#fd").textContent = ++found;
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
  VIEWS.scramble = (u, pane) => {
    const g = G(u), deck = shuffle(u.vocab).slice(0, 10), isL = (c) => /[a-z]/i.test(c);
    let i = 0, score = 0;
    const round = () => {
      if (i >= deck.length) {
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
        <div class="big" style="color:var(--vocab)">${esc(w[2])}</div>
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
        score += pts;
        app.querySelectorAll(".slot").forEach((s) => s.classList.add("ok"));
        $("#hint").disabled = $("#skip").disabled = true;
        say(w[0] + ". " + w[3], { rate: 0.85 });
        $("#fb").innerHTML = `<div class="fb good">+${pts} điểm! <b>${esc(w[0])}</b> ${esc(w[1])}<br><i>${esc(w[3])}</i></div>
          <div style="margin-top:12px"><button class="btn pri" id="nx">Từ tiếp ›</button></div>`;
        $("#nx").onclick = () => { i++; round(); };
        $("#nx").focus();
      };
      $("#sp").onclick = () => say(w[0], { rate: 0.75 });
      $("#skip").onclick = () => { i++; round(); };
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
      $("#ask").textContent = mine[2];
      opts.forEach((o, k) => {
        const b = document.createElement("button");
        b.className = "balloon"; b.textContent = o[0];
        b.style.left = 1.5 + k * 24.5 + "%"; b.style.background = cols[k];
        b.style.animationDuration = dur + (o === mine ? 0.6 : Math.random() * 0.6) + "s";
        b.onclick = () => {
          if (ended) return;
          if (o === mine) { score += 10; hud(); say(o[0], { rate: 0.85 }); b.classList.add("pop"); later(spawn, 350); }
          else { b.disabled = true; b.classList.add("wrong"); lose(); }
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

  route();
})();
