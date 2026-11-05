/* "ลองใช้แอป" — แอปจำลองเต็มจอ (ข้อมูลตัวอย่างจาก demo-data.js ทั้งหมด · ไม่เรียก DB/API ของแอป · ไม่เก็บอะไร)
   แผนที่: ย้ายการ์ดแผนที่ตัวเดิมของหน้าเว็บเข้ามา (map instance เดิม → ยัง 1 map load ต่อการเปิดหน้า)
   ปุ่ม back ของเครื่อง / ✕ = ปิด (history.pushState) */
(function(){
  'use strict';
  var D = window.SIAM_DEMO, M = window.SiamMap;
  var root, pages = {}, tabs = {}, current = 'home', isOpen = false, pushed = false, afterClose = null;
  var cardHome = null;   // ที่เดิมของการ์ดแผนที่บนหน้าเว็บ
  var savedY = 0;        // ตำแหน่งเลื่อนหน้าเว็บก่อนเปิด (คืนให้ตอนปิด)

  // ---- ไอคอน (วาดตาม Ionicons ที่แอปใช้) ----
  var I = {
    home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    map: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20"/>',
    warn: '<path d="M12 3 2 20h20L12 3zM12 10v4.5M12 17.2v.3"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bell: '<path d="M18 16V11a6 6 0 0 0-12 0v5l-2 2h16zM10 21h4"/>',
    chat: '<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19 9h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    bubble: '<path d="M4 5h16v11H9l-5 4z"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    create: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'
  };
  function ic(n, extra){ return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + I[n] + '</svg>'; }
  function av(n){ return 'assets/avatars/' + n + '.png'; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }
  function el(html){ var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function area(){ var st = M && M.state ? M.state() : null; return st ? st.place : 'อ.เมืองเชียงใหม่ จ.เชียงใหม่'; }
  function areaParts(){
    var a = area(), i = a.lastIndexOf(' จ.'), bkk = a.indexOf('กรุงเทพมหานคร') >= 0;
    if (bkk) { var j = a.lastIndexOf(' '); return { d: a.slice(0, j), p: 'กรุงเทพมหานคร' }; }
    return i > 0 ? { d: a.slice(0, i), p: a.slice(i + 1) } : { d: a, p: '' };
  }

  // ---- โครง ----
  function build(){
    root = el('<div class="da" hidden role="dialog" aria-modal="true" aria-label="แอปจำลอง Siam Chat">' +
      '<div class="da-phone">' +
        '<div class="da-top"><button class="da-x" type="button" data-close>' + ic('x') + 'ปิด</button>' +
          '<span>แอปจำลอง · ข้อมูลตัวอย่าง</span><span class="da-tag">ตัวอย่าง</span></div>' +
        '<div class="da-body">' +
          '<div class="da-page home" data-page="home"></div>' +
          '<div class="da-page map" data-page="map"></div>' +
          '<div class="da-page alert" data-page="alert"></div>' +
          '<div class="da-page profile" data-page="profile"></div>' +
          '<div class="ds" data-sheet><div class="ds-sheet"></div></div>' +
        '</div>' +
        '<nav class="da-tabs" aria-label="เมนูแอป">' +
          tabBtn('home', 'home', 'หน้าหลัก', 3) + tabBtn('map', 'map', 'แผนที่') +
          '<button class="da-plus" type="button" data-plus aria-label="สร้าง"><span>' + ic('plus', ' stroke="#fff" stroke-width="2.6"') + '</span></button>' +
          tabBtn('alert', 'warn', 'แจ้งเหตุ') + tabBtn('profile', 'person', 'โปรไฟล์') +
        '</nav>' +
      '</div></div>');
    document.body.appendChild(root);
    root.querySelectorAll('[data-page]').forEach(function(p){ pages[p.getAttribute('data-page')] = p; });
    root.querySelectorAll('[data-tab]').forEach(function(b){
      tabs[b.getAttribute('data-tab')] = b;
      b.addEventListener('click', function(){ go(b.getAttribute('data-tab')); });
    });
    root.querySelector('[data-close]').addEventListener('click', function(){ requestClose(); });
    root.querySelector('[data-plus]').addEventListener('click', createSheet);
    var sh = root.querySelector('[data-sheet]');
    sh.addEventListener('click', function(e){ if (e.target === sh) hideSheet(); });
    // ทุกลิงก์ #install ในแอปจำลอง (FAB ปักหมุด · ปุ่มดูในแอป · เลือกหมวดหมู่) → แผ่น "ติดตั้งแอป"
    root.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href="#install"]');
      if (a && root.contains(a)) { e.preventDefault(); installSheet(); }
    });
    renderHome(); renderAlert(); renderProfile();
  }
  function tabBtn(id, icon, label, badge){
    return '<button class="da-tab" type="button" data-tab="' + id + '"><span class="pill">' + ic(icon) + '</span>' + label +
      (badge ? '<span class="bdg">' + badge + '</span>' : '') + '</button>';
  }

  // ---- หน้าหลัก ----
  function renderHome(){
    var a = areaParts(), p = pages.home;
    var html = '<div class="h-head">' +
      '<div class="h-top"><div class="h-left"><div class="h-logo">' + ic('chat', ' stroke="#fff"') + '<i></i></div>' +
        '<div><div class="h-title">Siam Chat</div><div class="h-tag">เชื่อมโยงคนไทย ทั้ง 77 จังหวัด</div></div></div>' +
        '<div class="h-right"><span class="h-lang">TH ▾</span><button class="h-bell" type="button" data-bell aria-label="แจ้งเตือน">' + ic('bell', ' stroke="#fff"') + '<b>3</b></button></div></div>' +
      '<div class="h-loc"><span>📍 <b>' + esc(a.p) + '</b> · <em>' + esc(a.d) + '</em></span>' +
        '<button class="h-chg" type="button" data-change>' + ic('compass', ' style="width:14px;height:14px"') + 'เปลี่ยนพื้นที่</button></div>' +
      '<div class="h-scope"><button class="on" type="button">อำเภอฉัน</button><button type="button">จังหวัด</button><button type="button">ประเทศ</button></div>' +
      '</div>' +
      '<div class="h-modes"><button class="on" type="button" data-hmode="daily" style="--c:#10b981"><span>🏪</span><span><b>ชีวิตประจำวัน</b><small>สิ่งอำนวยความสะดวก</small></span></button>' +
        '<button type="button" data-hmode="travel" style="--c:#1a56db"><span>✈️</span><span><b>ท่องเที่ยว</b><small>แนะนำสถานที่เที่ยว</small></span></button></div>' +
      '<div class="h-mini" data-openmap><div class="art"><div class="ring"></div>' +
        '<span class="mp" style="left:30%;top:28%">🍜</span><span class="mp" style="left:62%;top:20%">⛽</span><span class="mp" style="left:68%;top:62%">🏦</span>' +
        '<span class="mp" style="left:22%;top:62%">☕</span><span class="mp" style="left:46%;top:70%">🚻</span><div class="dot"></div></div>' +
        '<div class="bar"><b>แผนที่ ' + esc(a.d) + '</b><span>ดูแผนที่ ›</span></div></div>' +
      '<div class="h-sec">ฟีดในพื้นที่ <small>ตัวอย่าง</small></div>';
    D.feed.forEach(function(f, i){ html += f.kind === 'place' ? placeCard(f, i) : postCard(f, i, a); });
    p.innerHTML = html;
    p.querySelector('[data-bell]').addEventListener('click', notiSheet);
    p.querySelector('[data-change]').addEventListener('click', function(){
      requestClose(function(){ var s = document.getElementById('selR'); if (s) { s.scrollIntoView({ block: 'center' }); s.focus(); } });
    });
    p.querySelectorAll('[data-hmode]').forEach(function(b){
      b.addEventListener('click', function(){
        p.querySelectorAll('[data-hmode]').forEach(function(x){ x.classList.toggle('on', x === b); });
        if (M && M.setMode) M.setMode(b.getAttribute('data-hmode'));
      });
    });
    p.querySelector('[data-openmap]').addEventListener('click', function(){ go('map'); });
    p.querySelectorAll('[data-like]').forEach(function(b){
      b.addEventListener('click', function(){
        var f = D.feed[+b.getAttribute('data-like')]; f._liked = !f._liked; f.likes += f._liked ? 1 : -1;
        b.classList.toggle('liked', f._liked); b.querySelector('span').textContent = f.likes;
        b.querySelector('svg').setAttribute('fill', f._liked ? '#ef4444' : 'none');
      });
    });
    p.querySelectorAll('[data-cmt]').forEach(function(b){
      b.addEventListener('click', function(){
        var f = D.feed[+b.getAttribute('data-cmt')]; if (f._c) return installSheet(); f._c = true; f.comments += 1;
        b.querySelector('span').textContent = f.comments;
      });
    });
    p.querySelectorAll('[data-share],[data-viewpin]').forEach(function(b){
      b.addEventListener('click', function(){ b.hasAttribute('data-viewpin') ? go('map') : installSheet(); });
    });
  }
  function postCard(f, i, a){
    var al = f.cat === 'alert' ? D.alertTypes[f.alertType] : null;
    var chip = al ? '<span class="pc-chip" style="background:' + al.color + '1f;color:' + al.color + '">' + al.emoji + ' ' + al.label + '</span>'
      : f.cat === 'news' ? '<span class="pc-chip" style="background:#10b9811f;color:#059669">📰 ข่าวชุมชน</span>'
      : '<span class="pc-chip" style="background:#1a56db14;color:#1a56db">💬 โพสต์ทั่วไป</span>';
    return '<article class="pc' + (al ? ' alert' : '') + '"><div class="pc-row"><img class="pc-av" src="' + av(f.avatar) + '" alt="">' +
      '<div class="pc-meta"><div class="pc-name">' + esc(f.author) + '</div><div class="pc-loc">📍 ' + esc(a.d) + ' <i>·</i> ' + esc(f.time) + '</div>' + chip + '</div></div>' +
      '<p class="pc-txt">' + esc(f.text) + '</p>' +
      '<div class="pc-act"><button type="button" data-like="' + i + '">' + ic('heart') + '<span>' + f.likes + '</span></button>' +
      '<button type="button" data-cmt="' + i + '">' + ic('bubble') + '<span>' + f.comments + '</span></button>' +
      '<button type="button" data-share>' + ic('share') + 'แชร์</button></div></article>';
  }
  function placeCard(f){
    return '<div class="plc"><span class="pi">' + f.icon + '</span><div class="pt"><small>📍 หมุดแนะนำ · ' + esc(f.cat) + '</small><b>' + esc(f.name) + '</b>' +
      '<span>⭐ ' + f.rating + ' (' + f.reviews + ') · ' + esc(f.dist) + ' · ' + esc(f.note) + '</span></div>' +
      '<button type="button" data-viewpin>ดูหมุด</button></div>';
  }

  // ---- แจ้งเหตุ ----
  var alertFilter = 'all';
  function renderAlert(){
    var a = areaParts(), p = pages.alert;
    var types = {}; D.alerts.forEach(function(x){ types[x.type] = 1; });
    var html = '<div class="a-head"><div class="a-top"><div><div class="a-title">แจ้งเหตุ</div><div class="a-sub">📍 ' + esc(a.d) + '</div></div>' +
      '<div class="a-btns"><button class="a-map" type="button" data-amap aria-label="แผนที่">' + ic('map') + '</button>' +
      '<button class="a-rep" type="button" data-report>' + ic('plus', ' style="width:18px;height:18px"') + 'แจ้งเหตุ</button></div></div>' +
      '<div class="a-scope"><button class="on" type="button">อำเภอฉัน</button><button type="button">จังหวัด</button><button type="button">ประเทศ</button></div></div>' +
      '<div class="a-filters"><button type="button" data-af="all" class="' + (alertFilter === 'all' ? 'on' : '') + '">ทั้งหมด</button>';
    Object.keys(types).forEach(function(t){
      var m = D.alertTypes[t]; html += '<button type="button" data-af="' + t + '" class="' + (alertFilter === t ? 'on' : '') + '">' + m.emoji + ' ' + m.label + '</button>';
    });
    html += '</div>';
    D.alerts.forEach(function(x, i){
      if (alertFilter !== 'all' && x.type !== alertFilter) return;
      var m = D.alertTypes[x.type];
      html += '<div class="ac" data-ai="' + i + '" style="--c:' + m.color + '" role="button"><span class="ae">' + m.emoji + '</span><div class="at">' +
        '<span class="chip">' + m.label + '</span><b>' + esc(x.title) + '</b>' +
        '<span>📍 ' + esc(x.where) + ' · ' + esc(x.dist) + '</span>' +
        '<span><span class="live">● </span>' + ago(x.mins) + ' · ยืนยัน ' + x.confirms + ' คน</span></div></div>';
    });
    p.innerHTML = html;
    p.querySelector('[data-report]').addEventListener('click', installSheet);
    p.querySelector('[data-amap]').addEventListener('click', function(){ go('map'); });
    p.querySelectorAll('[data-af]').forEach(function(b){ b.addEventListener('click', function(){ alertFilter = b.getAttribute('data-af'); renderAlert(); }); });
    p.querySelectorAll('[data-ai]').forEach(function(c){ c.addEventListener('click', function(){ alertSheet(D.alerts[+c.getAttribute('data-ai')]); }); });
  }
  function ago(m){ return m < 60 ? m + ' นาทีที่แล้ว' : Math.round(m / 60) + ' ชม.ที่แล้ว'; }

  // ---- โปรไฟล์ ----
  function renderProfile(){
    var a = areaParts(), me = D.me, p = pages.profile, pct = Math.round(me.exp / me.nextExp * 100);
    var html = '<div class="p-head"><b>โปรไฟล์</b><button class="p-edit" type="button" data-pm>แก้ไข</button></div>' +
      '<div class="p-card"><div class="p-cover"></div><div class="p-info"><img class="p-av" src="' + av(me.avatar) + '" alt="">' +
        '<div class="p-name">' + esc(me.name) + '</div><div class="p-loc">📍 ' + esc(a.p) + ' · ' + esc(a.d) + '</div>' +
        '<div class="p-lv"><div><span>Lv.' + me.level + '</span><span>' + me.exp + ' / ' + me.nextExp + ' EXP</span></div>' +
        '<div class="p-bar"><i style="width:' + pct + '%"></i></div><small>อีก ' + (me.nextExp - me.exp) + ' EXP จะถึง Lv.' + (me.level + 1) + '</small></div></div>' +
        '<div class="p-stats"><div><b>' + me.points + '</b><span>คะแนน</span></div><div><b>' + me.posts + '</b><span>โพสต์</span></div>' +
        '<div><b>' + me.alerts + '</b><span>แจ้งเหตุ</span></div><div><b>' + me.pins + '</b><span>แผนที่</span></div></div></div>' +
      '<div class="p-menu">';
    D.profileMenu.forEach(function(m){ html += '<button type="button" data-pm><i>' + m.icon + '</i><span>' + esc(m.label) + '</span></button>'; });
    html += '</div><p class="p-note">โปรไฟล์ตัวอย่าง · ในแอปจริงใช้รูปสัตว์แทนรูปจริง และไม่แสดงอีเมลของคุณ</p>';
    p.innerHTML = html;
    p.querySelectorAll('[data-pm]').forEach(function(b){ b.addEventListener('click', installSheet); });
  }

  // ---- แผ่นล่าง ----
  function sheet(html, bind){
    var s = root.querySelector('[data-sheet]'), box = s.querySelector('.ds-sheet');
    box.innerHTML = '<div class="ds-handle"></div>' + html;
    box.querySelectorAll('[data-dsclose]').forEach(function(b){ b.addEventListener('click', hideSheet); });
    if (bind) bind(box);
    s.classList.add('on');
  }
  function hideSheet(){ root.querySelector('[data-sheet]').classList.remove('on'); }
  function createSheet(){
    // เมนูเดียวกับ CreatePostFab ของแอป
    sheet('<div class="ds-title">สร้างอะไร?</div>' +
      item('create', '#e8f0fe', '#1a56db', 'สร้างโพสต์', 'แบ่งปันข่าวสาร ความคิดเห็น ถามตอบ', '#111827') +
      item('map', '#dcfce7', '#16a34a', 'โพสต์แผนที่', 'เพิ่มสถานที่ใหม่ หรือแบ่งปันสถานที่บนแผนที่', '#16a34a') +
      item('warn', '#fee2e2', '#dc2626', 'แจ้งเหตุ', 'ไฟไหม้ น้ำท่วม อุบัติเหตุ คนหาย ปรับปรุงถนน', '#dc2626') +
      '<button class="ds-cancel" type="button" data-dsclose>ยกเลิก</button>',
      function(box){ box.querySelectorAll('.ds-item').forEach(function(b){ b.addEventListener('click', installSheet); }); });
  }
  function item(icn, bg, fg, label, sub, color){
    return '<button class="ds-item" type="button"><span class="mi" style="background:' + bg + ';color:' + fg + '">' + ic(icn) + '</span>' +
      '<span><b style="color:' + color + '">' + label + '</b><small>' + sub + '</small></span></button>';
  }
  function installSheet(){
    sheet('<div class="ds-inst"><div class="big">📲</div><h3>ติดตั้งแอปเพื่อใช้งานจริง</h3>' +
      '<p>นี่คือแอปจำลองที่ใช้ข้อมูลตัวอย่าง ติดตั้ง Siam Chat เพื่อโพสต์ ปักหมุด และแจ้งเหตุในพื้นที่ของคุณจริง ฟรี</p>' +
      '<button class="ds-go" type="button" data-go>ไปหน้าติดตั้ง (3 ขั้น)</button>' +
      '<button class="ds-cancel" type="button" data-dsclose>ลองต่อ</button></div>',
      function(box){
        box.querySelector('[data-go]').addEventListener('click', function(){
          requestClose(function(){ var t = document.getElementById('install'); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
        });
      });
  }
  function alertSheet(x){
    var m = D.alertTypes[x.type];
    sheet('<div class="ds-detail"><span class="chip" style="background:' + m.color + '">' + m.emoji + ' ' + m.label + '</span>' +
      '<h3>' + esc(x.title) + '</h3><div class="meta">📍 ' + esc(x.where) + ' · ' + esc(x.dist) + ' · ' + ago(x.mins) + ' · ยืนยัน ' + x.confirms + ' คน</div>' +
      '<p>' + esc(x.detail) + '</p><div class="tip">💡 ' + esc(x.tip) + '</div>' +
      '<button class="ds-go" type="button" data-inst>ยืนยันเหตุ / แสดงความคิดเห็น</button>' +
      '<button class="ds-cancel" type="button" data-dsclose>ปิด</button><p class="meta" style="text-align:center">เหตุการณ์ตัวอย่าง ไม่ใช่เหตุจริง</p></div>',
      function(box){ box.querySelector('[data-inst]').addEventListener('click', installSheet); });
  }
  function notiSheet(){
    var h = '<div class="ds-title">การแจ้งเตือน <small style="font-weight:500;color:#9ca3af">· ตัวอย่าง</small></div>';
    D.notifications.forEach(function(n){ h += '<div class="ds-noti"><i>' + n.icon + '</i><div>' + esc(n.text) + '<small>' + esc(n.time) + '</small></div></div>'; });
    sheet(h + '<button class="ds-cancel" type="button" data-dsclose style="margin-top:12px">ปิด</button>');
  }

  // ---- สลับแท็บ ----
  function go(t){
    current = t; hideSheet();
    Object.keys(pages).forEach(function(k){ pages[k].classList.toggle('on', k === t); });
    Object.keys(tabs).forEach(function(k){ tabs[k].classList.toggle('on', k === t); });
    if (t === 'map') attachMap(); else detachMap();
  }
  // ย้ายการ์ดแผนที่ตัวเดิมเข้า/ออก (ไม่สร้างแผนที่ใหม่)
  function attachMap(){
    if (!M) return;
    var card = M.card();
    if (card.parentNode !== pages.map) { cardHome = { parent: card.parentNode, next: card.nextSibling }; pages.map.appendChild(card); }
    M.ensure(); M.setGreedy(true); M.refresh();
  }
  function detachMap(){
    if (!M || !cardHome) return;
    var card = M.card();
    cardHome.parent.insertBefore(card, cardHome.next); cardHome = null;
    M.setGreedy(false); M.refresh();
  }

  // ---- เปิด / ปิด ----
  function open(tab){
    if (!root) build();
    renderHome(); renderAlert(); renderProfile();   // พื้นที่อาจเปลี่ยนตั้งแต่เปิดครั้งก่อน
    savedY = window.scrollY || 0;
    root.hidden = false; isOpen = true;
    document.documentElement.classList.add('da-lock');
    if (!pushed) { history.pushState({ siamDemo: 1 }, ''); pushed = true; }
    go(tab || 'home');
  }
  function close(){
    if (!isOpen) return;
    hideSheet(); detachMap();
    root.hidden = true; isOpen = false;
    document.documentElement.classList.remove('da-lock');
    window.scrollTo({ top: savedY, behavior: 'instant' });   // หน้าเว็บตั้ง scroll-behavior:smooth ไว้
    var fn = afterClose; afterClose = null; if (fn) setTimeout(fn, 30);
  }
  function requestClose(fn){
    afterClose = fn || null;
    if (pushed) history.back(); else close();   // back → popstate → close
  }
  window.addEventListener('popstate', function(){ if (pushed) { pushed = false; close(); } });
  document.addEventListener('keydown', function(e){ if (isOpen && e.key === 'Escape') requestClose(); });

  window.SiamDemo = { open: open, close: requestClose };
})();
