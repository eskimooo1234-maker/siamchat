/* Siam Chat — ตัวอย่างกดลองได้ 6 หน้าในสไลด์มือถือ (index.html)
   ตัวอย่างล้วน: ข้อมูลปลอมทั้งหมด ไม่เรียก API/DB ใด ๆ ไม่มีการเข้าสู่ระบบจริง ไม่มีช่องกรอกข้อมูล
   หน้าตาจำลองจากหน้าจอจริงของแอป (LoginScreen · เลือกพื้นที่ 3 ขั้น · HomeScreen · FullMapModal · IncidentMapModal · ProfileScreen)
   ขอบเขตแผนที่: ภาค/จังหวัด = ไฟล์เดียวกับแอป (open data apisit/thailand.json) · อำเภอ = geoBoundaries THA ADM2 (CC BY 3.0 IGO)
   สร้างหน้าจอเมื่อสไลด์นั้นใกล้ปรากฏ · ข้อมูลอำเภอโหลดทีละจังหวัดเมื่อเลือก */
(function () {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/demo\.js(\?.*)?$/, '') || 'assets/demo/';
  var ASSETS = BASE.replace(/demo\/$/, '');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ไอคอนเส้น lucide (stroke 2) ---------- */
  var ICONS = {
    'chev-l': '<path d="m15 18-6-6 6-6"/>', 'chev-r': '<path d="m9 18 6-6-6-6"/>', 'chev-d': '<path d="m6 9 6 6 6-6"/>',
    'arrow-l': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    'pin-plus': '<path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738"/><circle cx="12" cy="10" r="3"/><path d="M16 18h6"/><path d="M19 15v6"/>',
    nav: '<path d="M3 11 22 2l-9 19-2-8z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>',
    msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pkg: '<path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    locate: '<path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>',
    landmark: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    pinned: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5"/><path d="M13 14h3"/>',
    bag: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    frame: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10v10H7z"/>',
    award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    sticker: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 3v4a2 2 0 0 0 2 2h4"/><path d="M8 13h.01"/><path d="M16 13h.01"/><path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
  };
  (function () {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">';
    Object.keys(ICONS).forEach(function (k) { s += '<symbol id="dm-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    var d = document.createElement('div'); d.innerHTML = s + '</svg>'; document.body.appendChild(d.firstChild);
  })();
  function ic(n, c) { return '<svg class="ic' + (c ? ' ' + c : '') + '" aria-hidden="true"><use href="#dm-' + n + '"/></svg>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function em(e) { return '<i class="d-emoji">' + e + '</i>'; }

  /* ---------- ข้อมูลตามแอป ---------- */
  var REG = {
    north:     { n: 'ภาคเหนือ', full: 'ภาคเหนือ', short: 'เหนือ', c1: '#15803d', c2: '#0b4f2c', icon: '⛰️', pc: 17, dc: 196 },
    northeast: { n: 'ภาคอีสาน', full: 'ภาคตะวันออกเฉียงเหนือ', short: 'อีสาน', c1: '#b45309', c2: '#7a3a06', icon: '🌾', pc: 20, dc: 322 },
    central:   { n: 'ภาคกลาง', full: 'ภาคกลาง', short: 'กลาง', c1: '#1e3a8a', c2: '#0b2a5b', icon: '🏛️', pc: 26, dc: 259 },
    south:     { n: 'ภาคใต้', full: 'ภาคใต้', short: 'ใต้', c1: '#0e7490', c2: '#0b4f61', icon: '🌊', pc: 14, dc: 151 }
  };
  var ORDER = ['north', 'northeast', 'central', 'south'];
  // หมวดหมุด (rooms.ts / ROOM_META) — ไอคอนตามแอป: ตลาดสดกับเครื่องดื่มเป็นภาพ svg ของแอป
  var CAT = {
    toilet: ['🚻', 'ห้องน้ำ'], food: ['🍜', 'ร้านอาหาร'], drinks: ['@drinks-thai-tea', 'เครื่องดื่ม'], gas: ['⛽', 'ปั๊มน้ำมัน'],
    atm: ['🏦', 'ATM'], parking: ['🅿️', 'ที่จอดรถ'], transit: ['🚌', 'รถประจำทาง'], market: ['@market-stall', 'ตลาดสด'],
    convenience: ['🏪', 'สะดวกซื้อ'], mechanic: ['🔧', 'ซ่อมรถ'], car_rental: ['🚙', 'รถเช่า'], hospital: ['🏥', 'โรงพยาบาล'],
    pharmacy: ['💊', 'ร้านยา'], dental: ['🦷', 'ทันตกรรม'], fitness: ['🏃', 'ออกกำลังกาย'], cafe: ['☕', 'คาเฟ่'],
    temple: ['🏯', 'วัด'], beach: ['🏖️', 'ทะเล'], viewpoint: ['🌄', 'จุดชมวิว'], nature: ['🌿', 'ธรรมชาติ'],
    walkingstreet: ['🛍️', 'ถนนคนเดิน'], souvenir: ['🧺', 'ร้านของฝาก / ของที่ระลึก'], museum: ['🏛️', 'พิพิธภัณฑ์'],
    themepark: ['🎢', 'สวนสนุก'], landmark: ['🎭', 'แลนด์มาร์ก'], spa: ['💆', 'สปา'], nightlife: ['🍸', 'ไนท์ไลฟ์'],
    farm: ['🌾', 'ฟาร์ม'], camping: ['🏕️', 'ที่พัก']
  };
  var DAILY = ['toilet', 'food', 'drinks', 'gas', 'atm', 'parking', 'transit', 'market', 'convenience', 'mechanic', 'car_rental', 'hospital', 'pharmacy', 'dental', 'fitness', 'cafe'];
  var TRAVEL = ['temple', 'beach', 'viewpoint', 'nature', 'walkingstreet', 'souvenir', 'museum', 'themepark', 'landmark', 'spa', 'nightlife', 'farm', 'camping'];
  function catIcon(k) {
    var i = CAT[k][0];
    return i.charAt(0) === '@' ? '<img src="' + ASSETS + 'icons/' + i.slice(1) + '.svg" alt="">' : em(i);
  }
  // ประเภทเหตุ (incidentTypes.ts)
  var INC = {
    flood: { e: '🌊', n: 'น้ำท่วม', c: '#3b82f6', w: 'หลีกเลี่ยงเส้นทางน้ำท่วมขัง' },
    fire: { e: '🔥', n: 'ไฟไหม้', c: '#ef4444', w: 'อยู่ห่างจากพื้นที่เกิดเหตุ' },
    accident: { e: '🚗', n: 'อุบัติเหตุ', c: '#f97316', w: 'ขับช้า ระวังการจราจรติดขัด' },
    road: { e: '🚧', n: 'ปรับปรุงถนน', c: '#d97706', w: 'ชะลอความเร็ว ระวังพื้นผิวถนน' }
  };
  var AV = { elephant: '#dbeafe', dog: '#ffe7c7', cat: '#fde2e4', owl: '#ede9fe' };
  function av(k) { return '<span class="d-av" style="background:' + AV[k] + '"><img src="' + BASE + 'avatars/' + k + '.png" alt=""></span>'; }

  // หมุดตัวอย่าง (ชื่อสมมติทั้งหมด) · a = มุม (องศา) · km = ระยะจากตำแหน่งฉัน
  var PLACES = [
    { k: 'toilet', n: 'ห้องน้ำสาธารณะสวนกลาง', km: 0.4, a: 200, open: 'เปิด 24 ชม.' },
    { k: 'food', n: 'ข้าวซอยบ้านสวนฟ้า', km: 0.6, a: 40, open: 'เปิดอยู่ · ปิด 15:00' },
    { k: 'market', n: 'ตลาดเช้าริมคลอง', km: 0.9, a: 300, open: 'เปิดอยู่ · ปิด 11:00' },
    { k: 'atm', n: 'ตู้ ATM หน้าตลาด', km: 1.0, a: 350, open: 'เปิด 24 ชม.' },
    { k: 'drinks', n: 'ชาเย็นหน้าซอย', km: 1.1, a: 120, open: 'เปิดอยู่ · ปิด 20:00' },
    { k: 'cafe', n: 'คาเฟ่ใบเตยหอม', km: 1.4, a: 75, open: 'เปิดอยู่ · ปิด 18:00' },
    { k: 'souvenir', n: 'ร้านของฝากบ้านไม้', km: 1.6, a: 165, open: 'เปิดอยู่ · ปิด 19:00' },
    { k: 'pharmacy', n: 'ร้านยาใจดี', km: 1.8, a: 235, open: 'เปิดอยู่ · ปิด 21:00' },
    { k: 'walkingstreet', n: 'ถนนคนเดินกลางเวียง', km: 2.2, a: 15, open: 'เปิดเฉพาะวันอาทิตย์' },
    { k: 'gas', n: 'ปั๊มน้ำมันหน้าหมู่บ้าน', km: 2.6, a: 300, open: 'เปิด 24 ชม.' },
    { k: 'museum', n: 'พิพิธภัณฑ์ผ้าทอเมือง', km: 3.1, a: 140, open: 'เปิดอยู่ · ปิด 16:30' },
    { k: 'convenience', n: 'ร้านสะดวกซื้อหัวมุม', km: 3.4, a: 225, open: 'เปิด 24 ชม.' },
    { k: 'hospital', n: 'โรงพยาบาลชุมชนเมืองใหม่', km: 4.2, a: 95, open: 'เปิด 24 ชม.' },
    { k: 'nature', n: 'สวนป่าน้ำใส', km: 4.8, a: 335, open: 'เปิดอยู่ · ปิด 18:00' },
    { k: 'temple', n: 'วัดป่าดอยหมอก', km: 6.5, a: 190, open: 'เปิดอยู่ · ปิด 18:00' },
    { k: 'viewpoint', n: 'จุดชมวิวผาตะวัน', km: 8.8, a: 55, open: 'เปิดตลอดวัน' },
    { k: 'camping', n: 'ลานกางเต็นท์ห้วยเย็น', km: 9.4, a: 255, open: 'เปิดอยู่' }
  ];
  function isTravel(k) { return TRAVEL.indexOf(k) >= 0; }
  // ระยะจริง → ตำแหน่งบนแผนที่วาด (หน่วย = % ของความกว้าง) · วงรัศมีใช้สูตรเดียวกัน
  function rr(km) { return 14 * Math.pow(km, 0.75); }
  function pos(km, a) { var r = rr(km), t = a * Math.PI / 180; return [Math.cos(t) * r, Math.sin(t) * r]; }

  /* ---------- state ที่ส่งต่อทุกหน้า ---------- */
  var S = { r: 'north', p: 'cm', d: 'cm_mueang', pn: 'เชียงใหม่', dn: 'เมืองเชียงใหม่', bkk: false };
  function dLabel() { return (S.bkk ? 'เขต' : 'อ.') + S.dn; }
  function pLabel() { return S.bkk ? S.pn : 'จ.' + S.pn; }

  /* ---------- ข้อมูลแผนที่ (โหลดเมื่อใช้) ---------- */
  var GEO = null, geoP = null, DC = {};
  function geo() {
    return geoP || (geoP = fetch(BASE + 'geo/th.json').then(function (r) { if (!r.ok) throw new Error('geo'); return r.json(); })
      .then(function (j) { GEO = j; return j; }));
  }
  function dmap(pid) {
    return DC[pid] || (DC[pid] = fetch(BASE + 'geo/d/' + pid + '.json').then(function (r) { if (!r.ok) throw new Error('d'); return r.json(); }));
  }

  /* ---------- ตัวช่วย ---------- */
  function go(i) { document.dispatchEvent(new CustomEvent('siamdemo:go', { detail: i })); }
  function toast(host, msg) {
    var t = host.querySelector(':scope > .dm > .d-toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 1900);
  }
  function sheet(host, html) {
    var w = host.querySelector('.d-shw'); if (!w) return;
    if (html == null) { w.classList.remove('on'); w.setAttribute('aria-hidden', 'true'); return; }
    w.querySelector('.d-sh').innerHTML = '<div class="d-handle"></div>' + html;
    w.querySelector('.d-sh').scrollTop = 0;
    w.classList.add('on'); w.removeAttribute('aria-hidden');
  }
  var SHEET = '<div class="d-shw" data-a="shclose" aria-hidden="true"><div class="d-sh" role="dialog"></div></div>';
  var TOAST = '<div class="d-toast" role="status" aria-live="polite"></div>';
  function pattern(id) {
    return '<svg class="pat" aria-hidden="true"><defs><pattern id="' + id + '" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<line x1="0" y1="0" x2="0" y2="10" stroke="#fff" stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }
  // แผนที่เมืองแบบวาดเรียบ ๆ (ไม่ใช่ Google) · viewBox 100x100 แบบ slice
  function cityMap() {
    return '<svg class="bg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="100" height="100" fill="#eef2e8"/>' +
      '<path d="M-5 70 C10 62 22 80 38 72 S60 50 72 58 S95 70 105 62 L105 105 L-5 105Z" fill="#e6ecdf"/>' +
      '<ellipse cx="18" cy="24" rx="14" ry="10" fill="#cfe8c4"/><ellipse cx="80" cy="82" rx="12" ry="9" fill="#cfe8c4"/>' +
      '<path d="M66 10 q8 -4 14 2 q6 8 -2 13 q-10 4 -14 -4z" fill="#d6ebcd"/>' +
      '<path d="M-5 40 C15 46 25 30 45 36 S70 58 105 46" fill="none" stroke="#b3d4f5" stroke-width="5" stroke-linecap="round"/>' +
      '<g fill="none" stroke-linecap="round">' +
      '<path d="M-5 58 L105 50 M52 -5 L46 105 M-5 15 L105 30 M20 -5 L28 105 M80 -5 L74 105" stroke="#dde3ea" stroke-width="3.6"/>' +
      '<path d="M-5 58 L105 50 M52 -5 L46 105 M-5 15 L105 30 M20 -5 L28 105 M80 -5 L74 105" stroke="#fff" stroke-width="2.4"/>' +
      '<path d="M-5 84 L105 90 M36 -5 L38 50 M62 54 L64 105 M88 30 L92 105 M5 30 L40 34" stroke="#fff" stroke-width="1.2"/>' +
      '<path d="M-5 50 C30 56 60 44 105 40" stroke="#fde68a" stroke-width="2.6" opacity=".9"/>' +
      '</g></svg>';
  }
  function placePin(p, extra, still) {
    var xy = pos(p.km, p.a), c = isTravel(p.k) ? '#185FA5' : '#15803d';
    var tag = still ? 'span' : 'button';
    return '<' + tag + ' class="d-pin' + (extra || '') + '"' + (still ? '' : ' data-a="pin" data-i="' + PLACES.indexOf(p) + '"') + ' style="--pc:' + c +
      ';left:calc(50% + ' + xy[0].toFixed(1) + 'cqw);top:calc(50% + ' + xy[1].toFixed(1) + 'cqw)" aria-label="' + esc(p.n) + '">' +
      '<span class="tl"></span><span class="hd">' + catIcon(p.k) + '</span></' + tag + '>';
  }

  /* =====================================================================
     หน้าจอทั้ง 6 — แต่ละหน้า: { html(), on(action, el) } · คลิกใช้ data-a
     ===================================================================== */
  var SC = {};

  /* ---------- 1) เข้าสู่ระบบ ---------- */
  SC.login = {
    html: function () {
      var bg = '<svg class="lg-bg" viewBox="0 0 240 506" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>' +
        '<linearGradient id="lgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2fb"/><stop offset=".45" stop-color="#eef4fd"/><stop offset="1" stop-color="#f6f9fe"/></linearGradient>' +
        '<radialGradient id="lgCl"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="lgW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#1e40af"/></linearGradient></defs>' +
        '<rect width="240" height="506" fill="url(#lgSky)"/>' +
        '<ellipse cx="40" cy="45" rx="60" ry="16" fill="url(#lgCl)"/><ellipse cx="190" cy="36" rx="58" ry="14" fill="url(#lgCl)"/><ellipse cx="30" cy="112" rx="40" ry="10" fill="url(#lgCl)"/>' +
        '<path d="M0 150 q12-12 26-4 q12-16 28-8 q14-8 26 8 q12 12 20 32 L0 178z" fill="#d6e3f6" opacity=".8"/>' +
        '<g fill="#d3e1f5" opacity=".85"><path d="M200 70 l2 74 q12 6 14 34 h-32 q2-28 14-34z"/><path d="M174 128 l1.5 40 q8 4 9 22 h-21 q1-18 9-22z"/>' +
        '<path d="M157 158 l1 28 q6 3 6 12 h-14 q0-9 6-12z"/><path d="M234 140 l1.5 40 q8 4 9 22 h-21 q1-18 9-22z"/></g>' +
        '<path d="M40 112 C46 150 70 160 90 156 S140 110 182 92" fill="none" stroke="#b6cdf0" stroke-width="1.6" stroke-dasharray="4 4"/>' +
        '<g fill="#9fc0f0"><path d="M40 82a8 8 0 0 1 8 8c0 6-8 14-8 14s-8-8-8-14a8 8 0 0 1 8-8z"/><path d="M183 60a9 9 0 0 1 9 9c0 7-9 15-9 15s-9-8-9-15a9 9 0 0 1 9-9z"/></g>' +
        '<g fill="#eef4fd"><circle cx="40" cy="90" r="3"/><circle cx="183" cy="69" r="3.4"/></g>' +
        '<path d="M0 448 C60 436 120 456 170 446 S225 436 240 440 L240 506 L0 506z" fill="#c8dcf6"/>' +
        '<path d="M0 458 C60 448 120 466 170 458 S225 448 240 452 L240 506 L0 506z" fill="#7aa7f0"/>' +
        '<path d="M0 468 C60 460 120 476 170 468 S225 460 240 464 L240 506 L0 506z" fill="url(#lgW)"/></svg>';
      function m(k, i, t, soon) {
        return '<button data-a="soon"' + (soon ? ' class="soon"' : '') + '>' + (soon ? '<em>เร็วๆ นี้</em>' : '') + ic(i) + '<span>' + t + '</span></button>';
      }
      return '<div class="dm d-login">' + bg +
        '<div class="lg-body">' +
        '<div class="lg-logo"><img src="' + ASSETS + 'logo-128.png" alt=""></div>' +
        '<div class="lg-name"><span class="s">Siam</span> <span class="c">Chat</span></div>' +
        '<div class="lg-tag">เชื่อมโยงผู้คน สร้างสังคมที่น่าอยู่</div>' +
        '<div class="lg-feat"><span>' + ic('pin') + 'แผนที่</span><span>' + ic('msg') + 'ชุมชน</span><span>' + ic('users') + 'เพื่อน</span><span>' + ic('shield') + 'ร่วมสร้างสังคม</span></div>' +
        '<div class="lg-card">' +
        '<button class="lg-g d-pulse" data-a="google"><span class="lg-gc">G</span><span class="t">เข้าสู่ระบบด้วย Google</span>' + ic('chev-r') + '</button>' +
        '<div class="lg-or"><i></i>หรือ<i></i></div>' +
        '<div class="lg-m">' + m('phone', 'phone', 'เบอร์โทรศัพท์', true) + m('mail', 'mail', 'อีเมล', false) + m('other', 'user', 'บัญชีอื่นๆ', true) + '</div>' +
        '</div></div>' +
        '<div class="lg-foot">' + ic('pin') + 'ทุกเส้นทาง... มีเรื่องราว</div>' + TOAST + '</div>';
    },
    on: function (a, el, host) {
      if (a === 'google') {
        toast(host, 'ตัวอย่าง — ในแอปจะให้เลือกบัญชี Google');
        el.classList.remove('d-pulse');
        clearTimeout(this._t); this._t = setTimeout(function () { go(1); }, 1300);
      } else if (a === 'soon') toast(host, 'เร็วๆ นี้');
    }
  };

  /* ---------- 2) เลือกพื้นที่ 3 ขั้น ---------- */
  // แผนที่ที่สูงกว่า ~1.4 เท่าของความกว้าง จะถูกย่อตามความสูง → ขยายป้ายชื่อตาม
  function lblScale(vb) { var v = vb.split(' ').map(Number); return Math.max(1, v[3] / (v[2] * 1.4)); }
  var L = { step: 1, r: null, p: null, d: null, dm: null, loading: false };
  SC.loc = {
    html: function () {
      var st = L.step, R = L.r ? REG[L.r] : null, hdBg, title, sub, map = '', card, cta, ctaOn = false;
      if (st === 1) { hdBg = 'linear-gradient(135deg,#2f6bff,#0b2a7a)'; title = 'เลือกภูมิภาคของคุณ'; sub = 'ขั้นตอนที่ 1 จาก 3'; }
      else { hdBg = 'linear-gradient(135deg,' + R.c1 + ',' + R.c2 + ')'; }
      if (!GEO) map = '<div class="loc-load">กำลังโหลดแผนที่…</div>';
      else if (st === 1) map = this.regionMap();
      if (st === 2) {
        var P = GEO.provinces[L.r];
        title = 'เลือกจังหวัด · ' + R.n; sub = 'ขั้นตอนที่ 2 จาก 3 · ' + R.pc + ' จังหวัด · ' + R.dc + ' อำเภอ';
        map = this.provMap(P);
      }
      if (st === 3) {
        var pv = GEO.provinces[L.r].list[L.p], bk = L.p === 'bkk';
        title = 'เลือก' + (bk ? 'เขต' : 'อำเภอ') + ' · ' + pv.n; sub = 'ขั้นตอนที่ 3 จาก 3 · ' + pv.c + (bk ? ' เขต' : ' อำเภอ');
        map = L.dm ? this.distMap(L.dm) : '<div class="loc-load">กำลังโหลดแผนที่อำเภอ…</div>';
      }
      // การ์ด "…ที่เลือก" + ปุ่มไปขั้นถัดไป (‹ › เลือกทีละอันได้ เผื่อพื้นที่เล็กแตะยาก)
      var sel = st === 1 ? L.r : st === 2 ? L.p : L.d, CR = R || { c1: '#2f6bff', c2: '#0b2a7a' };
      if (st === 1 && L.r) CR = REG[L.r];
      if (sel && (st !== 3 || L.dm)) {
        var kicker, name, stats;
        if (st === 1) { kicker = 'ภูมิภาคที่เลือก'; name = REG[sel].n; stats = REG[sel].pc + ' จังหวัด · ' + REG[sel].dc + ' อำเภอ'; cta = 'เลือกภูมิภาค'; }
        else if (st === 2) { var pp = GEO.provinces[L.r].list[sel]; kicker = 'จังหวัดที่เลือก'; name = pp.n; stats = pp.c + (sel === 'bkk' ? ' เขต' : ' อำเภอ') + ' · ' + R.n; cta = 'เลือกจังหวัด'; }
        else { var dd = L.dm.d[sel], bk2 = L.p === 'bkk'; kicker = (bk2 ? 'เขต' : 'อำเภอ') + 'ที่เลือก'; name = (bk2 ? 'เขต' : 'อ.') + dd.n; stats = GEO.provinces[L.r].list[L.p].n + ' · ห้องแชทอำเภอพร้อมใช้'; cta = 'เลือก ' + name + ' ›'; }
        card = '<div class="loc-card" style="--c1:' + CR.c1 + ';--c2:' + CR.c2 + '">' + pattern('lp' + st) +
          '<button class="nav" data-a="step" data-d="-1" aria-label="ก่อนหน้า">' + ic('chev-l') + '</button>' +
          '<div class="info"><small>' + kicker + '</small><i class="gl"></i><b>' + esc(name) + '</b><span>' + esc(stats) + '</span></div>' +
          '<button class="nav" data-a="step" data-d="1" aria-label="ถัดไป">' + ic('chev-r') + '</button></div>';
        ctaOn = true;
      } else {
        card = '<div class="loc-empty">' + (st === 1 ? 'แตะภาคบนแผนที่' : st === 2 ? 'แตะจังหวัดบนแผนที่' : 'แตะอำเภอบนแผนที่') + '</div>';
        cta = st === 1 ? 'เลือกภูมิภาค' : st === 2 ? 'เลือกจังหวัด' : 'เลือกอำเภอ';
      }
      return '<div class="dm d-loc">' +
        '<div class="d-hd loc-hd" style="background:' + hdBg + '"><div class="row">' +
        (st > 1 ? '<button class="loc-back" data-a="back" aria-label="ย้อนขั้น">' + ic('arrow-l') + '</button>' : '<span class="loc-ico">' + ic('map') + '</span>') +
        '<div class="tt"><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></div></div>' +
        '<div class="loc-steps"><i class="on"></i><i' + (st > 1 ? ' class="on"' : '') + '></i><i' + (st > 2 ? ' class="on"' : '') + '></i></div></div>' +
        '<div class="loc-top"><span>' + (st === 1 ? 'แตะภาคบนแผนที่' : st === 2 ? 'แตะจังหวัดบนแผนที่' : 'แตะอำเภอบนแผนที่') + '</span>' +
        '<button class="loc-me" data-a="me">' + ic('locate') + 'ตำแหน่งฉัน</button></div>' +
        '<div class="loc-map">' + map + (st === 3 && L.dm ? '<span class="loc-credit">แผนที่เขต: geoBoundaries (CC BY 3.0 IGO)</span>' : '') + '</div>' +
        '<div class="loc-sheet">' + card + '<button class="d-btn loc-cta ' + (ctaOn ? 'p d-pulse' : 'dis') + '" data-a="' + (ctaOn ? 'confirm' : 'noop') + '">' + esc(cta) + '</button></div>' +
        TOAST + '</div>';
    },
    regionMap: function () {
      var s = '<svg viewBox="' + GEO.vb + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="แผนที่ 4 ภาค">';
      ORDER.forEach(function (id) {
        var R = REG[id], dim = L.r && L.r !== id;
        s += '<path data-a="pick" data-id="' + id + '" d="' + GEO.regions[id].d + '" fill="' + R.c1 + '" fill-opacity="' + (dim ? .45 : 1) + '" stroke="' + (L.r === id ? '#f5d27a' : '#fff') + '" stroke-width="' + (L.r === id ? 4 : 2.5) + '"><title>' + R.n + '</title></path>';
      });
      ORDER.forEach(function (id) {
        var l = GEO.regions[id].l, R = REG[id], on = L.r === id;
        s += '<text x="' + l[0] + '" y="' + l[1] + '" text-anchor="middle" font-size="' + (on ? 27 : 22) + '" font-weight="800" fill="#fff" class="lbl-on" stroke-width="3">' + R.short + '</text>' +
          '<text x="' + l[0] + '" y="' + (l[1] + 19) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff" class="lbl-on" stroke-width="2.5">' + R.pc + ' จังหวัด</text>';
      });
      return s + '</svg>';
    },
    provMap: function (P) {
      var R = REG[L.r], k = lblScale(P.vb), s = '<svg viewBox="' + P.vb + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="แผนที่จังหวัด">', labels = '';
      Object.keys(P.list).forEach(function (id) {
        var e = P.list[id], on = L.p === id;
        s += '<path data-a="pick" data-id="' + id + '" d="' + e.d + '" fill="' + (on ? '#f5d27a' : R.c1) + '" fill-opacity="' + (on ? 1 : .78) + '" stroke="' + (on ? '#b8902a' : '#fff') + '" stroke-width="' + (on ? 2.5 : 1.3) + '"><title>' + e.n + '</title></path>';
        if (on || e.l[2] >= 34 * k) labels += '<text x="' + e.l[0] + '" y="' + (e.l[1] + 4 * k) + '" text-anchor="middle" font-size="' + ((on ? 14 : 10.5) * k).toFixed(1) + '" font-weight="700" fill="' + (on ? '#422006' : '#fff') + '" stroke="' + (on ? '#fff' : 'rgba(15,23,42,.55)') + '" stroke-width="' + (2.2 * k).toFixed(1) + '">' + e.n + '</text>';
      });
      return s + labels + '</svg>';
    },
    distMap: function (M) {
      var R = REG[L.r], k = lblScale(M.vb), s = '<svg viewBox="' + M.vb + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="แผนที่อำเภอ">', labels = '';
      Object.keys(M.d).forEach(function (id, i) {
        var e = M.d[id], on = L.d === id;
        s += '<path data-a="pick" data-id="' + id + '" d="' + e.d + '" fill="' + (on ? '#f5d27a' : R.c1) + '" fill-opacity="' + (on ? 1 : (i % 2 ? .7 : .85)) + '" stroke="' + (on ? '#b8902a' : '#fff') + '" stroke-width="' + (on ? 2.5 : 1.2) + '"><title>' + e.n + '</title></path>';
        if (on || e.l[2] >= 40 * k) labels += '<text x="' + e.l[0] + '" y="' + (e.l[1] + 4 * k) + '" text-anchor="middle" font-size="' + ((on ? 15 : 11) * k).toFixed(1) + '" font-weight="700" fill="' + (on ? '#422006' : '#fff') + '" stroke="' + (on ? '#fff' : 'rgba(15,23,42,.55)') + '" stroke-width="' + (2.2 * k).toFixed(1) + '">' + e.n + '</text>';
      });
      return s + labels + '</svg>';
    },
    ids: function () {
      if (L.step === 1) return ORDER;
      if (L.step === 2) return Object.keys(GEO.provinces[L.r].list);
      return L.dm ? Object.keys(L.dm.d) : [];
    },
    loadDistricts: function (host) {
      var self = this, pid = L.p; L.dm = null;
      dmap(pid).then(function (m) { if (L.p === pid) { L.dm = m; render('loc'); } })
        .catch(function () { toast(host, 'โหลดแผนที่อำเภอไม่สำเร็จ'); });
    },
    on: function (a, el, host) {
      if (a === 'me') return toast(host, 'ในแอปจะใช้ตำแหน่งปัจจุบันของคุณ');
      if (!GEO) return;
      if (a === 'pick') {
        var id = el.getAttribute('data-id');
        if (L.step === 1) L.r = id; else if (L.step === 2) L.p = id; else L.d = id;
        return render('loc');
      }
      if (a === 'step') {
        var ids = this.ids(), cur = L.step === 1 ? L.r : L.step === 2 ? L.p : L.d, i = ids.indexOf(cur), d = +el.getAttribute('data-d');
        var n = ids[(i + d + ids.length) % ids.length];
        if (L.step === 1) L.r = n; else if (L.step === 2) L.p = n; else L.d = n;
        return render('loc');
      }
      if (a === 'back') { L.step--; return render('loc'); }
      if (a === 'confirm') {
        if (L.step === 1) { L.step = 2; if (!GEO.provinces[L.r].list[L.p]) L.p = null; return render('loc'); }
        if (L.step === 2) { L.step = 3; L.d = null; this.loadDistricts(host); return render('loc'); }
        // ขั้น 3 → ส่งค่าไปหน้าหลัก แผนที่ และโปรไฟล์
        var pv = GEO.provinces[L.r].list[L.p];
        S.r = L.r; S.p = L.p; S.d = L.d; S.pn = pv.n; S.dn = L.dm.d[L.d].n; S.bkk = L.p === 'bkk';
        H.voted = {}; renderAll();
        toast(host, 'บันทึกพื้นที่แล้ว · ' + dLabel());
        setTimeout(function () { go(2); }, 600);
      }
    },
    init: function () { geo().then(function () { render('loc'); }); }
  };

  /* ---------- 3) หน้าหลัก ---------- */
  var H = { tab: 'd', voted: {}, like: {}, save: {}, nudgeMap: false };
  var POLL = {
    d: { q: function () { return 'ควรมีตลาดนัดวันอาทิตย์ที่สวนสาธารณะใน' + dLabel() + 'ไหม'; }, y: 64, n: 36, votes: 312, left: 'เหลือ 2 วัน', by: ['dog', 'สุนัข 1313'] },
    p: { q: function () { return 'ควรเพิ่มรถสองแถวเส้นรอบเมือง' + (S.bkk ? 'ใน' + S.pn : 'จังหวัด' + S.pn) + 'ไหม'; }, y: 71, n: 29, votes: 1840, left: 'เหลือ 5 ชม.', by: ['owl', 'นกฮูก 5521'] }
  };
  function homeIncidents() {
    return [
      { t: 'fire', ti: 'ไฟไหม้หญ้าข้างทางเลี่ยงเมือง', at: '15 นาที' },
      { t: 'flood', ti: 'น้ำท่วมขังทางลอดหน้าตลาด', at: '40 นาที' }
    ];
  }
  function inRadius(km, cat) { return PLACES.filter(function (p) { return p.km <= km && (!cat || p.k === cat); }); }
  SC.home = {
    html: function () {
      var tab = H.tab, feed = '';
      if (tab !== 'c') feed += this.poll(tab);
      if (tab === 'd') feed += this.placePost() + this.post('g1');
      else if (tab === 'p') feed += this.post('p1') + this.post('p2');
      else feed += this.post('c1') + this.post('c2');
      var inc = homeIncidents().slice(0, tab === 'c' ? 1 : 2).map(function (x) {
        var T = INC[x.t];
        return '<div class="hm-inc" style="--c:' + T.c + '"><span class="tag">' + em(T.e) + T.n + '</span><b>' + x.ti + '</b>' +
          '<div class="meta"><span>' + (tab === 'c' ? pLabel() : dLabel()) + ' · ' + x.at + '</span><button data-a="go" data-i="4">' + ic('map') + 'ดูบนแผนที่</button></div></div>';
      }).join('');
      var near = inRadius(3).length, mini = PLACES.slice(0, 8).map(function (p) { return placePin(p, ' mini', true); }).join('');
      var tabs = [['d', 'อำเภอฉัน'], ['p', 'จังหวัด'], ['c', 'ประเทศ']].map(function (t) {
        return '<button data-a="tab" data-t="' + t[0] + '"' + (tab === t[0] ? ' class="on"' : '') + '>' + t[1] + '</button>';
      }).join('');
      return '<div class="dm d-home">' +
        '<div class="d-hd hm-hd"><div class="hm-top"><img src="' + ASSETS + 'logo-64.png" alt=""><b>Siam Chat</b>' +
        '<button class="hm-lang" data-a="lang">TH</button><button class="hm-bell" data-a="bell" aria-label="แจ้งเตือน">' + ic('bell') + '<i>3</i></button></div>' +
        '<div class="hm-loc">' + ic('pin') + '<span>' + esc(S.pn + ' · ' + S.dn) + '</span><button data-a="change">เปลี่ยน</button></div>' +
        '<div class="hm-tabs">' + tabs + '</div></div>' +
        '<div class="d-scroll hm-body">' +
        '<button class="hm-fund" data-a="fund">' + ic('landmark') + '<span>กองทุน' + REG[S.r].n + ' <b>669.3</b> คะแนน</span>' + ic('chev-r') + '</button>' +
        '<div class="hm-sec red">' + ic('alert') + '<span>เหตุการณ์เร่งด่วนในพื้นที่</span><button data-a="go" data-i="4">ดูทั้งหมด</button></div>' + inc +
        '<div class="hm-sec blue">' + ic('map') + '<span>แผนที่ใกล้คุณ · พบ ' + near + ' จุด</span><button data-a="go" data-i="3">ดูแผนที่เต็ม</button></div>' +
        '<div class="hm-mini d-mapc' + (H.voted[tab] && !H.nudgeMap ? ' d-pulse' : '') + '" role="button" tabindex="0" data-a="go" data-i="3" aria-label="เปิดแผนที่ใกล้คุณ">' + cityMap() +
        '<span class="d-you" style="left:50%;top:50%"></span>' + mini + '<span class="tapme">' + ic('map') + 'แตะเพื่อเปิด</span></div>' +
        feed + '</div>' +
        '<nav class="hm-nav"><button class="on" data-a="noop">' + ic('home') + 'หน้าหลัก</button><button data-a="go" data-i="3">' + ic('map') + 'แผนที่</button>' +
        '<button class="plus" data-a="plus" aria-label="สร้างโพสต์">' + ic('plus') + '</button>' +
        '<button data-a="go" data-i="4">' + ic('alert') + 'แจ้งเหตุ</button><button data-a="go" data-i="5">' + ic('user') + 'โปรไฟล์</button></nav>' +
        TOAST + '</div>';
    },
    poll: function (tab) {
      var P = POLL[tab], v = H.voted[tab], body;
      if (!v) {
        body = '<div class="poll-btns"><button class="y d-pulse" data-a="vote" data-v="y">ใช่</button><button class="n" data-a="vote" data-v="n">ไม่ใช่</button></div>' +
          '<div class="poll-meta">โหวตก่อนเพื่อดูผล · ' + P.votes.toLocaleString('th-TH') + ' โหวต</div>';
      } else {
        var tot = P.votes + 1, y = P.y * P.votes / 100 + (v === 'y' ? 1 : 0), py = Math.round(100 * y / tot), pn = 100 - py;
        body = '<div class="poll-res"><div class="opt y"><i data-w="' + py + '"></i><span>' + (v === 'y' ? ic('check') : '') + 'ใช่</span><span>' + py + '%</span></div>' +
          '<div class="opt n"><i data-w="' + pn + '"></i><span>' + (v === 'n' ? ic('check') : '') + 'ไม่ใช่</span><span>' + pn + '%</span></div></div>' +
          '<div class="poll-meta">' + tot.toLocaleString('th-TH') + ' โหวต · โหวตได้เฉพาะคนใน ' + esc(pLabel()) + '</div>';
      }
      return '<div class="card"><div class="ribbon">' + ic('pinned') + 'ปักบนสุด · ' + P.left + '</div>' +
        '<div class="poll-lbl">' + ic('chart') + 'โพลชุมชน</div><div class="poll-q">' + esc(P.q()) + '</div>' + body +
        '<div class="who" style="margin-top:.6em">' + av(P.by[0]) + '<div><b>' + P.by[1] + '</b><small>' + (tab === 'd' ? dLabel() : pLabel()) + ' · 3 ชม.</small></div></div></div>';
    },
    acts: function (id, likes, comments) {
      var l = H.like[id], s = H.save[id];
      return '<div class="acts"><button data-a="like" data-id="' + id + '"' + (l ? ' class="on-like"' : '') + '>' + ic('heart') + (likes + (l ? 1 : 0)) + '</button>' +
        '<button data-a="comment">' + ic('msg') + comments + '</button><span class="sp"></span>' +
        '<button data-a="save" data-id="' + id + '"' + (s ? ' class="on-save"' : '') + ' aria-label="บันทึก">' + ic('bookmark') + '</button>' +
        '<button data-a="share" aria-label="แชร์">' + ic('share') + '</button></div>';
    },
    placePost: function () {
      return '<div class="card"><div class="who">' + av('dog') + '<div><b>สุนัข 1313</b><small>' + esc(dLabel()) + ' · 2 ชม. · ปักหมุดร้าน</small></div></div>' +
        '<div class="post-txt">ข้าวซอยไก่น้ำข้น ร้านเปิดใหม่ใกล้ตลาด รสชาติดี ราคาไม่แพง ที่จอดรถพอมี</div>' +
        '<div class="post-pic" style="background:linear-gradient(135deg,#fde68a,#fca5a5)">' + em('🍜') + '</div>' +
        '<div class="place-row"><span>0.6 กม.</span><span class="open">เปิดอยู่</span><span>' + em('🍜') + 'อาหาร</span><button data-a="go" data-i="3">แผนที่ ›</button></div>' +
        this.acts('pp', 24, 6) + '</div>';
    },
    post: function (id) {
      var T = {
        g1: ['cat', 'แมว 2047', dLabel(), 'พรุ่งนี้เช้ามีกิจกรรมเก็บขยะริมคลอง 7 โมง ใครว่างมาช่วยกันนะ', 31, 9, 'linear-gradient(135deg,#bbf7d0,#a5f3fc)', '🌿'],
        p1: ['elephant', 'ช้าง 3568', pLabel(), 'งานกาชาดปีนี้จัดที่สนามกลางเมือง เปิดถึงสามทุ่มทุกวัน', 58, 14, 'linear-gradient(135deg,#fde68a,#fbcfe8)', '🎡'],
        p2: ['owl', 'นกฮูก 5521', pLabel(), 'ถนนสายหลักขาเข้าเมืองเปิดเลนเพิ่มแล้ว รถไม่ค่อยติดเหมือนก่อน', 19, 4, null, null],
        c1: ['dog', 'สุนัข 8801', 'ทั่วประเทศไทย', 'ช่วงนี้ฝนตกหลายภาค เช็กแจ้งเหตุในอำเภอตัวเองก่อนออกเดินทางกันนะ', 205, 41, null, null],
        c2: ['cat', 'แมว 4410', 'ทั่วประเทศไทย', 'ใครมีจุดชมวิวที่ชอบในจังหวัดตัวเอง ปักหมุดแนะนำกันได้เลย', 132, 77, 'linear-gradient(135deg,#bfdbfe,#c7d2fe)', '🌄']
      }[id];
      return '<div class="card"><div class="who">' + av(T[0]) + '<div><b>' + T[1] + '</b><small>' + esc(T[2]) + ' · ' + (id === 'g1' ? '5 ชม.' : '1 วัน') + '</small></div></div>' +
        '<div class="post-txt">' + T[3] + '</div>' + (T[6] ? '<div class="post-pic" style="background:' + T[6] + '">' + em(T[7]) + '</div>' : '') +
        this.acts(id, T[4], T[5]) + '</div>';
    },
    after: function (host) {
      // แถบผลโพลขยับจาก 0 ไปค่าจริง
      var bars = host.querySelectorAll('.poll-res i[data-w]');
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        Array.prototype.forEach.call(bars, function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      }); });
    },
    on: function (a, el, host) {
      if (a === 'tab') { H.tab = el.getAttribute('data-t'); return render('home'); }
      if (a === 'vote') { H.voted[H.tab] = el.getAttribute('data-v'); return render('home', true); }
      if (a === 'like' || a === 'save') { var o = a === 'like' ? H.like : H.save, id = el.getAttribute('data-id'); o[id] = !o[id]; return render('home', true); }
      if (a === 'go') { if (el.getAttribute('data-i') === '3') H.nudgeMap = true; return go(+el.getAttribute('data-i')); }
      if (a === 'change') { L.step = 1; L.r = S.r; L.p = S.p; L.d = S.d; render('loc'); return go(1); }
      var msg = { lang: 'ในแอปสลับภาษา ไทย / อังกฤษ ได้', bell: 'ในแอปจะเปิดรายการแจ้งเตือน', fund: 'ในแอปดูที่มาของคะแนนกองทุนได้ทุกรายการ',
        comment: 'ในแอปจะเปิดคอมเมนต์', share: 'ในแอปจะเปิดเมนูแชร์', plus: 'ในแอปจะเปิดหน้าสร้างโพสต์ / แจ้งเหตุ / โพล' }[a];
      if (msg) toast(host, msg);
    }
  };

  /* ---------- 4) แผนที่ชีวิตประจำวัน ---------- */
  var M = { km: 3, cat: null, group: 'daily', touched: false };
  SC.map = {
    html: function () {
      var list = inRadius(M.km, M.cat), lbl = M.cat ? CAT[M.cat][1] : 'ทั้งหมด', first = list[0];
      var pins = PLACES.map(function (p) {
        var vis = list.indexOf(p) >= 0;
        return placePin(p, (vis ? '' : ' hid') + (!M.touched && p === first ? ' d-pulse-pin' : ''));
      }).join('');
      var rads = [1, 2, 3, 5, 10].map(function (k) { return '<button data-a="km" data-k="' + k + '"' + (M.km === k ? ' class="on"' : '') + '>' + k + ' กม.</button>'; }).join('');
      return '<div class="dm d-map">' +
        '<div class="d-hd mp-hd"><div class="row"><div class="tt"><b>แผนที่ชีวิตประจำวัน</b><small>' + ic('pin') + 'รอบตำแหน่งของคุณ · ' + list.length + ' จุด</small></div>' +
        '<button class="d-x" data-a="close" aria-label="ปิดแผนที่">' + ic('x') + '</button></div></div>' +
        '<div class="mp-ctl"><button class="mp-cat" data-a="cats"><span>หมวดหมู่: <b>' + esc(lbl) + '</b></span>' + ic('chev-d') + '</button>' +
        '<div class="mp-leg"><span style="--c:#15803d"><i></i>ชีวิตประจำวัน</span><span style="--c:#185FA5"><i></i>ท่องเที่ยว</span></div></div>' +
        '<div class="mp-map d-mapc">' + cityMap() +
        '<span class="d-ring" style="--rc:#15803d;left:50%;top:50%;width:' + (2 * rr(M.km)).toFixed(1) + 'cqw"></span>' +
        '<span class="d-you" style="left:50%;top:50%"></span>' + pins +
        '<span class="mp-count">' + esc(dLabel()) + '</span>' +
        '<button class="mp-fab" data-a="add">' + ic('pin-plus') + 'หมุด</button></div>' +
        '<div class="mp-rads">' + rads + '</div>' + SHEET + TOAST + '</div>';
    },
    catSheet: function () {
      var g = M.group, keys = g === 'daily' ? DAILY : TRAVEL, ac = g === 'daily' ? '#15803d' : '#185FA5';
      var chips = '<button class="chip' + (!M.cat ? ' on' : '') + '" style="--ac:' + ac + '" data-a="cat" data-k="">' + em('🌐') + 'ทั้งหมด</button>' +
        keys.map(function (k) { return '<button class="chip' + (M.cat === k ? ' on' : '') + '" style="--ac:' + ac + '" data-a="cat" data-k="' + k + '">' + catIcon(k) + CAT[k][1] + '</button>'; }).join('');
      return '<h4>เลือกหมวดหมู่</h4><div class="cat-tabs"><button data-a="grp" data-g="daily"' + (g === 'daily' ? ' class="on"' : '') + '>ชีวิตประจำวัน</button>' +
        '<button data-a="grp" data-g="travel"' + (g === 'travel' ? ' class="on tr"' : '') + '>ท่องเที่ยว</button></div><div class="chips">' + chips + '</div>';
    },
    placeSheet: function (p) {
      var tr = isTravel(p.k), bg = tr ? 'linear-gradient(135deg,#e8f0fe,#dbeafe)' : 'linear-gradient(135deg,#e8f0fe,#dcfce7)';
      return '<div class="pl-hero" style="background:' + bg + '">' + catIcon(p.k) + '<button class="d-x" data-a="shclose" aria-label="ปิด">' + ic('x') + '</button></div>' +
        '<div class="pl-name">' + esc(p.n) + '</div>' +
        '<div class="pl-meta"><span>' + catIcon(p.k) + ' ' + CAT[p.k][1] + '</span><span>' + p.km.toFixed(1) + ' กม.</span><span class="open">● ' + p.open + '</span></div>' +
        '<div class="pl-btns"><button class="d-btn p" data-a="navi">' + ic('nav') + 'นำทาง</button><button class="d-btn o" data-a="detail">' + ic('info') + 'รายละเอียด</button></div>';
    },
    on: function (a, el, host) {
      if (a === 'km') { M.km = +el.getAttribute('data-k'); return render('map'); }
      if (a === 'cats') return sheet(host, this.catSheet());
      if (a === 'grp') { M.group = el.getAttribute('data-g'); return sheet(host, this.catSheet()); }
      if (a === 'cat') {
        M.cat = el.getAttribute('data-k') || null; sheet(host, null);
        // หมวดที่เลือกไกลกว่าระยะ → ขยายวงให้เห็นหมุด
        if (M.cat && !inRadius(M.km, M.cat).length) { var p = PLACES.filter(function (x) { return x.k === M.cat; })[0]; if (p) M.km = [1, 2, 3, 5, 10].filter(function (k) { return k >= p.km; })[0] || 10; }
        setTimeout(function () { render('map'); if (M.cat && !inRadius(M.km, M.cat).length) toast(host, 'ยังไม่มีหมุดหมวดนี้ในตัวอย่าง'); }, 180);
        return;
      }
      if (a === 'pin') { M.touched = true; var pl = PLACES[+el.getAttribute('data-i')]; render('map'); return sheet(host, this.placeSheet(pl)); }
      if (a === 'shclose') return sheet(host, null);
      if (a === 'close') return go(2);
      var msg = { add: 'ในแอปปักหมุดได้ +40 คะแนน', navi: 'ในแอปจะเปิดการนำทาง', detail: 'ในแอปดูรีวิว เวลาเปิด และรูปจากคนในพื้นที่' }[a];
      if (msg) toast(host, msg);
    }
  };

  /* ---------- 5) แผนที่เหตุการณ์ ---------- */
  var A = { f: null, otherD: null };
  function incidents() {
    var o = A.otherD || [S.dn, S.dn, S.dn];
    return [
      { t: 'accident', ti: 'รถชนกัน 2 คัน แยกไฟแดงกลางเมือง', d: S.dn, at: '12 นาที', x: 20, y: -4 },
      { t: 'fire', ti: 'ไฟไหม้หญ้าข้างทางเลี่ยงเมือง', d: o[0], at: '15 นาที', x: -28, y: -8 },
      { t: 'flood', ti: 'น้ำท่วมขังทางลอดหน้าตลาด', d: S.dn, at: '40 นาที', x: -6, y: 12 },
      { t: 'road', ti: 'ปิดซ่อมถนนเลนซ้าย ถึง 18:00', d: o[1], at: '3 ชม.', x: 32, y: 18 },
      { t: 'accident', ti: 'รถจักรยานยนต์ล้ม ทางโค้งขึ้นดอย', d: o[2], at: '2 ชม.', x: -34, y: 27 },
      { t: 'flood', ti: 'น้ำเอ่อล้นตลิ่ง ซอย 5', d: o[0], at: '4 ชม.', x: 12, y: 28 }
    ];
  }
  SC.alert = {
    html: function () {
      var all = incidents(), list = all.filter(function (x) { return !A.f || x.t === A.f; });
      var chips = [[null, 'ทั้งหมด', '']].concat(Object.keys(INC).map(function (k) { return [k, INC[k].n, INC[k].e]; })).map(function (c) {
        return '<button class="chip' + (A.f === c[0] ? ' on' : '') + '" data-a="f" data-k="' + (c[0] || '') + '">' + (c[2] ? em(c[2]) : '') + c[1] + '</button>';
      }).join('');
      var counts = Object.keys(INC).map(function (k) { return '<span>' + em(INC[k].e) + '<b>' + all.filter(function (x) { return x.t === k; }).length + '</b></span>'; }).join('');
      var pins = all.map(function (x, i) {
        var T = INC[x.t], fill = (x.t === 'fire' || x.t === 'accident') ? '#dc2626' : '#f97316', vis = list.indexOf(x) >= 0;
        return '<button class="d-ipin' + (vis ? '' : ' hid') + '" data-a="inc" data-i="' + i + '" style="left:calc(50% + ' + x.x + 'cqw);top:calc(50% + ' + x.y + 'cqw)" aria-label="' + esc(x.ti) + '">' +
          '<svg viewBox="0 0 30 38"><path d="M15 37C15 37 2 23 2 14a13 13 0 0 1 26 0c0 9-13 23-13 23z" fill="' + fill + '" stroke="#fff" stroke-width="2"/></svg>' +
          '<span class="em">' + em(T.e) + '</span></button>';
      }).join('');
      var items = list.slice(0, 4).map(function (x) {
        var T = INC[x.t];
        return '<button class="al-item" data-a="inc" data-i="' + all.indexOf(x) + '" style="--c:' + T.c + '"><span class="ti">' + em(T.e) + '</span>' +
          '<span class="tx"><b>' + esc(x.ti) + '</b><small>' + T.n + ' · ' + (S.bkk ? 'เขต' : 'อ.') + esc(x.d) + ' · ' + x.at + '</small></span>' + ic('chev-r') + '</button>';
      }).join('') || '<div class="loc-empty" style="height:5em">ยังไม่มีเหตุการณ์ประเภทนี้ในตัวอย่าง</div>';
      return '<div class="dm d-alert">' +
        '<div class="d-hd al-hd"><div class="row"><div class="tt"><b>แผนที่เหตุการณ์</b><small>' + ic('pin') + esc(S.bkk ? S.pn : 'จังหวัด' + S.pn) + '</small></div>' +
        '<button class="d-x" data-a="close" aria-label="ปิดแผนที่">' + ic('x') + '</button></div></div>' +
        '<div class="al-top"><div class="chips">' + chips + '</div><div class="al-counts">' + counts + '</div></div>' +
        '<div class="d-scroll"><div class="al-map d-mapc">' + cityMap() + pins + '</div>' +
        '<div class="al-list"><h4>เหตุการณ์ล่าสุด</h4>' + items + '</div></div>' + SHEET + TOAST + '</div>';
    },
    detail: function (i) {
      var x = incidents()[i], T = INC[x.t];
      return '<div class="al-pic" style="background:linear-gradient(135deg,' + T.c + '33,' + T.c + '66)">' +
        '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q25 22 50 28 T100 26 V40 H0z" fill="#fff" opacity=".35"/><path d="M0 34 Q30 30 60 35 T100 33 V40 H0z" fill="#fff" opacity=".5"/></svg>' +
        em(T.e) + '<button class="d-x" style="position:absolute;right:1em;top:1em;font-size:.28em;background:rgba(0,0,0,.45)" data-a="shclose" aria-label="ปิด">' + ic('x') + '</button></div>' +
        '<div class="pl-name">' + esc(x.ti) + '</div>' +
        '<div class="pl-meta"><span>' + em(T.e) + ' ' + T.n + '</span><span>' + (S.bkk ? 'เขต' : 'อ.') + esc(x.d) + '</span><span>' + x.at + 'ที่แล้ว</span></div>' +
        '<div class="al-warn">' + ic('alert') + '<span>' + T.w + '</span></div>' +
        '<div class="pl-btns"><button class="d-btn p" data-a="navi">' + ic('nav') + 'นำทาง</button><button class="d-btn o" data-a="onmap" data-i="' + i + '">' + ic('map') + 'ดูบนแผนที่</button></div>';
    },
    on: function (a, el, host) {
      if (a === 'f') { A.f = el.getAttribute('data-k') || null; return render('alert'); }
      if (a === 'inc') return sheet(host, this.detail(+el.getAttribute('data-i')));
      if (a === 'shclose') return sheet(host, null);
      if (a === 'onmap') {
        sheet(host, null);
        var i = el.getAttribute('data-i'), sc = host.querySelector('.d-alert .d-scroll'), pin = host.querySelector('.d-ipin[data-i="' + i + '"]');
        if (sc) sc.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        if (pin && !reduce) { pin.classList.remove('blink'); void pin.offsetWidth; pin.classList.add('blink'); }
        return;
      }
      if (a === 'close') return go(2);
      if (a === 'navi') toast(host, 'ในแอปจะเปิดการนำทาง');
    },
    init: function () { loadOtherDistricts(); }
  };
  function loadOtherDistricts() {
    var pid = S.p;
    dmap(pid).then(function (m) {
      if (S.p !== pid) return;
      var names = Object.keys(m.d).filter(function (k) { return k !== S.d; }).map(function (k) { return m.d[k].n; });
      A.otherD = [names[0] || S.dn, names[1] || S.dn, names[2] || S.dn];
      if (built.alert) render('alert');
    }).catch(function () {});
  }

  /* ---------- 6) โปรไฟล์ ---------- */
  var P = { view: 'card', tab: 'map', chip: null, bagTab: 'items', checked: false };
  var MYPINS = [
    { k: 'food', n: 'ข้าวซอยบ้านสวนฟ้า', g: 'linear-gradient(135deg,#fde68a,#fca5a5)' },
    { k: 'cafe', n: 'คาเฟ่ใบเตยหอม', g: 'linear-gradient(135deg,#d9f99d,#a7f3d0)' },
    { k: 'temple', n: 'วัดป่าดอยหมอก', g: 'linear-gradient(135deg,#fef3c7,#fcd34d)' },
    { k: 'souvenir', n: 'ร้านของฝากบ้านไม้', g: 'linear-gradient(135deg,#fed7aa,#fdba74)' }
  ];
  SC.prof = {
    html: function () {
      var body = P.view === 'card' ? this.card() : this.bag();
      var tabs = [['general', 'โพสต์ทั่วไป'], ['poll', 'โพล'], ['alert', 'แจ้งเหตุ'], ['map', 'แผนที่']].map(function (t) {
        return '<button data-a="ptab" data-t="' + t[0] + '"' + (P.tab === t[0] ? ' class="on"' : '') + '>' + t[1] + '</button>';
      }).join('');
      return '<div class="dm d-prof"><div class="pf-hd"><b>โปรไฟล์</b><button data-a="edit">' + ic('pencil') + 'แก้ไข</button></div>' +
        '<div class="d-scroll pf-body"><div class="pf-sw"><button data-a="view" data-v="card"' + (P.view === 'card' ? ' class="on"' : '') + '>' + ic('card') + 'นามบัตร</button>' +
        '<button data-a="view" data-v="bag"' + (P.view === 'bag' ? ' class="on"' : P.seenBag ? '' : ' class="d-pulse"') + '>' + ic('bag') + 'กระเป๋า</button></div>' +
        body + '<div class="pf-tabs">' + tabs + '</div>' + this.tabBody() + '</div>' + TOAST + '</div>';
    },
    card: function () {
      var R = REG[S.r], th = '';
      if (GEO) {
        th = '<svg class="th" viewBox="' + GEO.vb + '" aria-hidden="true">' + ORDER.map(function (id) {
          return '<path d="' + GEO.regions[id].d + '" fill="' + (id === S.r ? '#f5d27a' : 'rgba(255,255,255,.28)') + '" stroke="rgba(255,255,255,.6)" stroke-width="2"/>';
        }).join('') + '</svg>';
      } else th = '<span class="th"></span>';
      var stats = [['1,240', 'คะแนน'], ['18', 'โพสต์'], ['4', 'โพล'], ['6', 'แจ้งเหตุ'], ['23', 'หมุด']].map(function (s) { return '<div><b>' + s[0] + '</b><small>' + s[1] + '</small></div>'; }).join('');
      return '<div class="idc" style="--c1:' + R.c1 + ';--c2:' + R.c2 + '">' + pattern('idp') +
        '<div class="reg">' + em(R.icon) + ' ' + R.full + '</div><i class="gl"></i>' +
        '<div class="me">' + av('elephant') + '<div><b>ช้าง 3568</b><small>ระดับ 6 · คนในพื้นที่</small></div>' + th + '</div>' +
        '<div class="tbl"><div><small>ชุมชน</small><b>' + esc(S.dn) + '</b></div><div><small>จังหวัด</small><b>' + esc(S.pn) + '</b></div><div><small>เข้าร่วม</small><b>มี.ค. 2569</b></div></div>' +
        '<div class="exp"><div class="bar"><i></i></div><small><span>Lv.6</span><span>อีก 120 EXP จะถึง Lv.7</span></small></div>' +
        '<div class="st">' + stats + '</div></div>';
    },
    bag: function () {
      var items = P.bagTab === 'items'
        ? [{ i: 'frame', n: 'กรอบทอง', bg: '#fef3c7', bd: '#d9b45a', fg: '#92400e', use: true }, { i: 'award', n: 'นักปักหมุด', bg: '#dcfce7', bd: '#86efac', fg: '#15803d' }]
        : [{ i: 'sticker', n: 'ช้างน้อย', bg: '#dbeafe', bd: '#93c5fd', fg: '#1d4ed8' }];
      var cells = items.map(function (x) {
        return '<button class="slot it" data-a="item" style="--bg:' + x.bg + ';--bd:' + x.bd + ';--fg:' + x.fg + '">' + ic(x.i) + '<em>' + x.n + '</em>' + (x.use ? '<u>ใช้อยู่</u>' : '') + '</button>';
      }).join('');
      for (var k = items.length; k < 8; k++) cells += '<span class="slot em">' + ic('pkg') + '</span>';
      var pts = 1240 + (P.checked ? 1 : 0);
      return '<div class="bag"><div class="bag-hd"><b>กระเป๋าของฉัน</b><small>3 ไอเท็ม · ใช้ 3 / 12 ช่อง</small></div>' +
        '<div class="bag-coin"><span class="cn">' + ic('coins') + '</span><div><small>คะแนนคงเหลือ</small><b>' + pts.toLocaleString('th-TH') + '</b> <span>คะแนน</span></div>' +
        (P.checked ? '<button class="done" data-a="noop">' + ic('check') + 'เช็กอินแล้ว</button>' : '<button class="d-pulse" data-a="checkin">' + ic('gift') + 'เช็กอิน +1</button>') + '</div>' +
        '<div class="bag-tabs"><button data-a="btab" data-t="items"' + (P.bagTab === 'items' ? ' class="on"' : '') + '>ไอเท็ม</button>' +
        '<button data-a="btab" data-t="col"' + (P.bagTab === 'col' ? ' class="on"' : '') + '>ของสะสม</button></div>' +
        '<div class="bag-grid">' + cells + '</div><p class="bag-note">ช่องว่างสำหรับไอเท็มใหม่ · เร็ว ๆ นี้</p></div>';
    },
    tabBody: function () {
      if (P.tab === 'map') {
        var keys = ['food', 'cafe', 'temple', 'souvenir'];
        var chips = '<div class="chips"><button class="chip' + (!P.chip ? ' on' : '') + '" style="--ac:#1a56db" data-a="pchip" data-k="">ทั้งหมด</button>' +
          keys.map(function (k) { return '<button class="chip' + (P.chip === k ? ' on' : '') + '" style="--ac:#1a56db" data-a="pchip" data-k="' + k + '">' + catIcon(k) + CAT[k][1] + '</button>'; }).join('') + '</div>';
        var cards = MYPINS.filter(function (x) { return !P.chip || x.k === P.chip; }).map(function (x) {
          return '<button class="pc" data-a="pc"><div class="pic" style="background:' + x.g + '">' + catIcon(x.k) + '</div><div class="tx"><b>' + esc(x.n) + '</b><small>' + CAT[x.k][1] + ' · ' + esc(dLabel()) + '</small></div></button>';
        }).join('');
        return chips + '<div class="pf-grid">' + cards + '</div>';
      }
      var rows = {
        general: [['msg', '#dbeafe', '#1d4ed8', 'แนะนำร้านซ่อมรถใกล้ตลาด บริการดี', dLabel() + ' · 2 วัน'], ['msg', '#dbeafe', '#1d4ed8', 'ขอบคุณทุกคนที่มาช่วยเก็บขยะริมคลอง', dLabel() + ' · 1 สัปดาห์']],
        poll: [['chart', '#ede9fe', '#6d28d9', 'ควรมีไฟส่องทางในซอยเพิ่มไหม', 'ใช่ 82% · 214 โหวต']],
        alert: [['@🌊', '#dbeafe', '', 'น้ำท่วมขังทางลอดหน้าตลาด', 'น้ำท่วม · ' + dLabel() + ' · 3 วัน'], ['@🚧', '#fef3c7', '', 'ปิดซ่อมถนนเลนซ้าย', 'ปรับปรุงถนน · ' + dLabel() + ' · 1 สัปดาห์']]
      }[P.tab];
      return rows.map(function (r) {
        var icon = r[0].charAt(0) === '@' ? em(r[0].slice(1)) : ic(r[0]);
        return '<button class="pf-row" data-a="row"><span class="ti" style="background:' + r[1] + ';color:' + r[2] + '">' + icon + '</span><div><b>' + esc(r[3]) + '</b><small>' + esc(r[4]) + '</small></div></button>';
      }).join('');
    },
    on: function (a, el, host) {
      if (a === 'view') { P.view = el.getAttribute('data-v'); if (P.view === 'bag') P.seenBag = true; return render('prof', true); }
      if (a === 'ptab') { P.tab = el.getAttribute('data-t'); return render('prof', true); }
      if (a === 'pchip') { P.chip = el.getAttribute('data-k') || null; return render('prof', true); }
      if (a === 'btab') { P.bagTab = el.getAttribute('data-t'); return render('prof', true); }
      if (a === 'checkin') { P.checked = true; toast(host, 'เช็กอินแล้ววันนี้ · +1 คะแนน'); return render('prof', true); }
      var msg = { edit: 'ในแอปเปลี่ยนรูปสัตว์และพื้นที่ได้', item: 'ในแอปกดใช้ / เลิกใช้ไอเท็มได้', pc: 'ในแอปจะเปิดหมุดนี้บนแผนที่', row: 'ในแอปจะเปิดโพสต์นี้' }[a];
      if (msg) toast(host, msg);
    },
    init: function () { geo().then(function () { if (P.view === 'card') render('prof', true); }); }
  };

  /* =====================================================================
     สร้าง / วาดใหม่ / ส่งต่อ state
     ===================================================================== */
  var HOSTS = {}, built = {};
  var NAME = { login: 'login', location: 'loc', home: 'home', map: 'map', alert: 'alert', profile: 'prof' };
  function render(name, keepScroll) {
    var host = HOSTS[name]; if (!host || !built[name]) return;
    var sc = host.querySelector('.d-scroll'), top = sc ? sc.scrollTop : 0, toastMsg = host.querySelector('.d-toast.on');
    host.innerHTML = SC[name].html();
    if (keepScroll) { var s2 = host.querySelector('.d-scroll'); if (s2) s2.scrollTop = top; }
    if (toastMsg) toast(host, toastMsg.textContent);
    if (SC[name].after) SC[name].after(host);
  }
  function renderAll() {
    loadOtherDistricts();
    ['home', 'map', 'alert', 'prof'].forEach(function (n) { if (built[n]) render(n); });
  }
  function build(host) {
    var name = NAME[host.getAttribute('data-screen')];
    if (!name || built[name]) return;
    built[name] = true; HOSTS[name] = host;
    host.innerHTML = SC[name].html();
    if (SC[name].after) SC[name].after(host);
    host.addEventListener('click', function (e) {
      var el = e.target.closest('[data-a]');
      if (!el || !host.contains(el)) return;
      var a = el.getAttribute('data-a');
      // แตะพื้นหลังแผ่นล่าง = ปิด · แตะในแผ่นไม่ปิด
      if (a === 'shclose' && el.classList.contains('d-shw') && e.target !== el) return;
      if (a === 'noop') return;
      SC[name].on(a, el, host);
    });
    if (SC[name].init) SC[name].init();
  }

  // สร้างหน้าจอเมื่อสไลด์ใกล้ปรากฏ
  var hosts = document.querySelectorAll('.demo-host[data-screen]');
  var track = document.getElementById('track');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { build(e.target); io.unobserve(e.target); } });
    }, { root: track, rootMargin: '0px 60% 0px 60%' });
    Array.prototype.forEach.call(hosts, function (h) { io.observe(h); });
  } else Array.prototype.forEach.call(hosts, build);
  // ข้ามไปสไลด์ที่ยังไม่สร้าง (เช่น ปุ่มในหน้าหลัก) → สร้างทันที
  document.addEventListener('siamdemo:go', function (e) {
    var h = hosts[e.detail]; if (h) build(h);
  });
})();
