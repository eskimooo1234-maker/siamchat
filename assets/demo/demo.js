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
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    compass: '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    minus: '<path d="M5 12h14"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    acircle: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    up: '<circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/>',
    down: '<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/>',
    tel: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    cloudsun: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    imgplus: '<path d="M16 5h6"/><path d="M19 2v6"/><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/>',
    pen: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    pinmap: '<path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/>',
    images: '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',
    navc: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-5.6 1.8-1.1 4.9 4.9-1.1z"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
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
    medical: { e: '🚑', n: 'ฉุกเฉินแพทย์', c: '#10b981', w: 'เปิดทางให้รถพยาบาล' },
    crime: { e: '🚔', n: 'อาชญากรรม', c: '#1e3a8a', w: 'ระวังตัวและอยู่ห่างจากพื้นที่' },
    road: { e: '🚧', n: 'ปรับปรุงถนน', c: '#d97706', w: 'ชะลอความเร็ว ระวังพื้นผิวถนน' },
    blackout: { e: '💡', n: 'ไฟดับ', c: '#6b7280', w: 'ระวังไฟฟ้าและสายไฟชำรุด' },
    no_water: { e: '🚰', n: 'น้ำไม่ไหล', c: '#0891b2', w: 'สำรองน้ำใช้ไว้ล่วงหน้า' },
    lost_person: { e: '🧑', n: 'คนหาย', c: '#8b5cf6', w: 'หากพบเห็น โปรดแจ้งเจ้าของโพสต์' },
    lost_pet: { e: '🐕', n: 'สัตว์เลี้ยงหาย', c: '#c2410c', w: 'หากพบเห็น โปรดแจ้งเจ้าของโพสต์' },
    lost_item: { e: '🔍', n: 'ของหาย', c: '#14b8a6', w: 'หากพบเห็น โปรดแจ้งเจ้าของโพสต์' },
    other: { e: '❓', n: 'อื่นๆ', c: '#475569', w: 'ตรวจสอบรายละเอียดก่อนตัดสินใจ' }
  };
  var AV = { elephant: '#dbeafe', dog: '#ffe7c7', cat: '#ffe0e6', owl: '#ece3d6', parrot: '#d9f5e3' };
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
    { k: 'temple', n: 'วัดตัวอย่าง', km: 1.7, a: 228, open: 'เปิดอยู่ · ปิด 18:00' },
    { k: 'viewpoint', n: 'จุดชมวิวสันเขื่อน', km: 2.6, a: 112, open: 'เปิดตลอดวัน' },
    { k: 'landmark', n: 'ลานวัฒนธรรมกลางเมือง', km: 2.8, a: 300, open: 'เปิดอยู่ · ปิด 21:00' },
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
    if (html == null) { w.classList.remove('on'); w.setAttribute('aria-hidden', 'true'); updateLock(); return; }
    w.querySelector('.d-sh').innerHTML = '<div class="d-handle"></div>' + html;
    w.querySelector('.d-sh').scrollTop = 0;
    w.classList.add('on'); w.removeAttribute('aria-hidden');
    updateLock();
  }
  // มีแผ่น/ฟอร์มเปิดอยู่ → ล็อกการปัดสไลด์ (index.html ฟัง siamdemo:lock)
  function updateLock() {
    var open = !!document.querySelector('.demo-host .d-shw.on, .demo-host .d-form.on, .demo-host .pv-ov, .demo-host .mp-full.on');
    document.dispatchEvent(new CustomEvent('siamdemo:lock', { detail: open }));
  }
  var SHEET = '<div class="d-shw" data-a="shclose" aria-hidden="true"><div class="d-sh" role="dialog"></div></div>';
  var TOAST = '<div class="d-toast" role="status" aria-live="polite"></div>';
  function pattern(id) {
    return '<svg class="pat" aria-hidden="true"><defs><pattern id="' + id + '" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<line x1="0" y1="0" x2="0" y2="10" stroke="#fff" stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }
  // แผนที่เมืองแบบวาดเรียบ ๆ (ไม่ใช่ Google) · viewBox 100x100 แบบ slice
  function cityMap(labels) {
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
      '</g>' + (labels ? '<g font-weight="700" font-family="inherit" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width=".8">' +
      '<text x="16" y="40" font-size="3.3" fill="#64748b">ย่านเมืองเก่า</text><text x="64" y="78" font-size="3.3" fill="#64748b">ตลาดกลาง</text>' +
      '<text x="80" y="24" font-size="2.6" fill="#94a3b8">ถ.หมายเลข 11</text><text x="30" y="94" font-size="2.6" fill="#94a3b8">ซอย 5</text></g>' : '') + '</svg>';
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

  /* ---------- ส่วนประกอบร่วมแบบแอป ---------- */
  // แถบหัวข้อไล่สี + ลายคลื่นล่าง (SectionBanner.tsx)
  function banner(g1, g2, icon, title, btnIcon, btnLabel, btnColor, act) {
    return '<div class="sbn" style="background:linear-gradient(90deg,' + g1 + ',' + g2 + ')">' +
      '<svg class="wv" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path d="M0,17 C28,28 72,3 100,17 L100,28 L0,28 Z" fill="rgba(255,255,255,.15)"/></svg>' +
      ic(icon) + '<span class="t">' + title + '</span>' +
      '<button class="bd" ' + act + ' style="color:' + btnColor + '">' + ic(btnIcon) + btnLabel + '</button></div>';
  }
  // หัวฟอร์มไล่สี + คลื่นโค้งล่าง (WaveHeader.tsx)
  function waveHead(c1, c2, bg, lead, title, sub, btns) {
    return '<div class="fhd" style="background:linear-gradient(135deg,' + c1 + ',' + c2 + ')">' + lead +
      '<div class="tt"><b>' + title + '</b><small>' + sub + '</small></div>' + btns +
      '<svg class="wv" viewBox="0 0 100 13" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13 L0 0 Q 50 24 100 0 L100 13 Z" fill="' + bg + '"/></svg></div>';
  }
  // การ์ดขั้นตอน (StepCard.tsx) · dim = ยังเลือกข้อแรกไม่ได้ → จาง + ป้ายกลางการ์ด
  function stepCard(n, title, right, color, body, dim, hint, dimLabel, dimAct) {
    return '<div class="sc' + (dim ? ' dim' : '') + '"><div class="sc-h"><span class="sc-n" style="background:' + color + '">' + n + '</span><b>' + title + '</b>' +
      (right ? '<small>' + right + '</small>' : '') + '</div>' + (hint ? '<div class="sc-hint" style="color:' + color + '">' + hint + '</div>' : '') +
      '<div class="sc-b">' + body + '</div>' +
      (dim ? '<button class="sc-dim" data-a="' + dimAct + '"><span>' + dimLabel + '</span></button>' : '') + '</div>';
  }
  // ภาพวาดแทนรูปถ่าย (ไล่สี + เส้นภูเขา + ไอคอน)
  var PICS = [['#bae6fd', '#fde68a'], ['#bbf7d0', '#a5f3fc'], ['#fecaca', '#fde68a'], ['#ddd6fe', '#bfdbfe'], ['#fed7aa', '#fecdd3']];
  function drawnPic(i, iconHtml) {
    var g = PICS[i % PICS.length];
    return '<span class="ph" style="background:linear-gradient(160deg,' + g[0] + ',' + g[1] + ')">' +
      '<svg viewBox="0 0 40 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 31 L9 23 L17 29 L27 18 L40 29 V40 H0Z" fill="rgba(255,255,255,.55)"/><circle cx="31" cy="10" r="4" fill="rgba(255,255,255,.85)"/></svg>' +
      '<i>' + iconHtml + '</i></span>';
  }
  function photoSlots(list, labels, iconHtml, act) {
    var s = '';
    for (var i = 0; i < Math.max(list.length, labels.length); i++) {
      s += list[i] !== undefined
        ? '<span class="slot on">' + drawnPic(list[i], iconHtml) + '</span>'
        : '<button class="slot" data-a="' + act + '">' + ic('imgplus') + '<span>' + labels[i] + '</span></button>';
    }
    return s + '<button class="slot" data-a="' + act + '">' + ic('plus') + '<span>' + (labels.length === 4 ? 'เพิ่มรูป' : 'เพิ่ม') + '</span></button>';
  }

  /* ---------- 3) หน้าหลัก (HomeScreen) ---------- */
  var H = { tab: 'd', voted: {}, save: {}, vote: {}, pending: null, hot: 0, votes: {}, zoom: 1, filter: 'all', nudgeMap: false };
  var POLL = {
    d: { title: 'ตลาดนัดวันอาทิตย์', q: function () { return 'ควรมีตลาดนัดวันอาทิตย์ที่สวนสาธารณะใน ' + dLabel() + ' ไหม'; },
      desc: 'ถ้าส่วนใหญ่เห็นด้วย จะรวบรวมเสนอเทศบาลต้นเดือนหน้า', y: 64, votes: 312, left: '5 ชม. 58 นาที', ago: '6 ชั่วโมงที่แล้ว', icon: '🛍️', by: ['dog', 'สุนัข 1313'] },
    p: { title: 'รถสองแถวรอบเมือง', q: function () { return 'ควรเพิ่มรถสองแถวเส้นรอบเมือง' + (S.bkk ? 'ใน' + S.pn : 'จังหวัด' + S.pn) + 'ไหม'; },
      desc: 'เส้นทางใหม่จะวิ่งผ่านโรงพยาบาลและตลาดกลาง', y: 71, votes: 1840, left: '28 ชม. 10 นาที', ago: '1 วันที่แล้ว', icon: '🚌', by: ['owl', 'นกฮูก 5521'] }
  };
  var PCARD = {
    temple: { by: ['parrot', 'นกแก้ว 9482'], ago: '13 นาทีที่แล้ว', n: 'วัดตัวอย่าง', scene: 'temple', rate: '5.0 (1)', photos: 13, km: '1.7 กม.', cat: 'temple',
      desc: 'บรรยากาศสงบ, ที่จอดรถกว้าง, ห้องน้ำสะอาด, เปิดทุกวัน' },
    food: { by: ['owl', 'นกฮูก 5521'], ago: '2 ชั่วโมงที่แล้ว', n: 'ร้านข้าวซอยตัวอย่าง', scene: 'food', rate: '4.5 (8)', photos: 6, km: '0.6 กม.', cat: 'food',
      desc: 'ราคาประหยัด, รสชาติอร่อย, เปิดเช้าตรู่, มีที่จอดรถ' }
  };
  // ภาพวาดแทนรูปถ่าย: วัด / อาหาร (ไม่มีคน) · i = มุมภาพ 0–3
  var SCN = 0;
  function scene(kind, i) {
    var id = 'scn' + (++SCN);
    if (kind === 'temple') {
      var sky = [['#fde68a', '#fca5a5'], ['#bae6fd', '#e0f2fe'], ['#fbcfe8', '#fde68a'], ['#c7d2fe', '#fef3c7']][i % 4], dx = [0, -22, 20, 6][i % 4], sc = [1, .8, .9, 1.2][i % 4];
      return '<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' +
        '<rect width="120" height="80" fill="url(#' + id + ')"/><circle cx="96" cy="18" r="8" fill="#fff" opacity=".75"/>' +
        '<path d="M0 58 Q30 46 60 54 T120 50 V80 H0Z" fill="#86efac"/>' +
        '<g transform="translate(' + (60 + dx) + ' 62) scale(' + sc + ')"><path d="M0 -50 L3 -33 Q12 -27 12 -12 H-12 Q-12 -27 -3 -33Z" fill="#f59e0b"/><rect x="-16" y="-12" width="32" height="6" fill="#d97706"/>' +
        '<path d="M-44 -6 L-30 -18 L-16 -6Z" fill="#b45309"/><rect x="-40" y="-6" width="20" height="10" fill="#fde68a"/>' +
        '<path d="M16 -6 L30 -18 L44 -6Z" fill="#b45309"/><rect x="20" y="-6" width="20" height="10" fill="#fde68a"/></g>' +
        '<circle cx="10" cy="56" r="8" fill="#16a34a"/><circle cx="112" cy="54" r="9" fill="#15803d"/><rect y="68" width="120" height="12" fill="#bef264" opacity=".55"/></svg>';
    }
    var wood = [['#fcd34d', '#d97706'], ['#fde68a', '#f59e0b'], ['#fed7aa', '#ea580c'], ['#fef3c7', '#d97706']][i % 4], soup = ['#f97316', '#fb923c', '#ea580c', '#f59e0b'][i % 4], sc2 = [1, 1.25, .9, 1.1][i % 4];
    return '<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + wood[0] + '"/><stop offset="1" stop-color="' + wood[1] + '"/></linearGradient></defs>' +
      '<rect width="120" height="80" fill="url(#' + id + ')"/><path d="M0 20 H120 M0 44 H120 M0 68 H120" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>' +
      '<g transform="translate(60 46) scale(' + sc2 + ')"><ellipse rx="34" ry="20" fill="#fff"/><ellipse cy="-3" rx="24" ry="12" fill="' + soup + '"/>' +
      '<path d="M-16 -3 q8 -6 16 0 t16 0" stroke="#fde68a" stroke-width="3" fill="none"/><path d="M-12 2 q8 -5 16 0 t12 0" stroke="#fef3c7" stroke-width="2.5" fill="none"/>' +
      '<circle cx="-6" cy="-7" r="3" fill="#16a34a"/><circle cx="8" cy="-6" r="2.5" fill="#22c55e"/>' +
      '<path d="M-8 -24 q-4 -6 0 -12 M0 -26 q-4 -6 0 -12 M8 -24 q-4 -6 0 -12" stroke="#fff" stroke-width="2" fill="none" opacity=".85"/></g>' +
      '<path d="M90 14 L102 64 M96 12 L106 62" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  var HOT = [
    { t: 'fire', ti: 'ไฟไหม้หญ้าข้างทางเลี่ยงเมือง ควันหนาเห็นได้จากถนนใหญ่', at: '2 วันที่แล้ว', more: 9 },
    { t: 'flood', ti: 'น้ำท่วมขังทางลอดหน้าตลาด รถเล็กผ่านไม่ได้', at: '5 ชม.ที่แล้ว', more: 4 },
    { t: 'accident', ti: 'รถชนกัน 2 คัน แยกไฟแดงกลางเมือง', at: '40 นาทีที่แล้ว', more: 2 }
  ];
  var FILTERS = [['all', 'grid', 'ทั้งหมด'], ['poll', 'chart', 'โพล'], ['alert', 'acircle', 'แจ้งเหตุ'], ['map', 'map', 'แผนที่']];
  function inRadius(km, cat) { return PLACES.filter(function (p) { return p.km <= km && (!cat || p.k === cat); }); }
  var RING3 = (function () {
    var R = (54 - 5.5) / 2, C = 27, pt = function (d) { var r = d * Math.PI / 180; return (C + R * Math.sin(r)).toFixed(2) + ' ' + (C - R * Math.cos(r)).toFixed(2); };
    return [['#1a56db', -60], ['#e53935', 60], ['#10b981', 180]].map(function (s) {
      return '<path d="M ' + pt(s[1]) + ' A ' + R + ' ' + R + ' 0 0 1 ' + pt(s[1] + 120) + '" stroke="' + s[0] + '" stroke-width="5.5" fill="none"/>';
    }).join('');
  })();
  SC.home = {
    html: function () {
      var tab = H.tab;
      var tabs = [['d', 'pin', 'อำเภอฉัน'], ['p', 'map', 'จังหวัด'], ['c', 'globe', 'ประเทศ']].map(function (t) {
        return '<button data-a="tab" data-t="' + t[0] + '"' + (tab === t[0] ? ' class="on"' : '') + '>' + ic(t[1]) + t[2] + '</button>';
      }).join('');
      var feed = this.feed(), near = inRadius(2).length, fl = FILTERS.filter(function (f) { return f[0] === H.filter; })[0];
      return '<div class="dm d-home">' +
        '<div class="hm-hd"><div class="hm-top"><span class="lb"><span class="lc"><img src="' + ASSETS + 'logo-128.png" alt=""></span><i></i></span>' +
        '<div class="ttl"><b>Siam Chat</b><small>เชื่อมโยงคนไทย ทั้ง 77 จังหวัด</small></div>' +
        '<button class="lang" data-a="lang">' + ic('languages') + 'TH' + ic('chev-d') + '</button>' +
        '<button class="bell" data-a="bell" aria-label="แจ้งเตือน">' + ic('bell') + '<i>3</i></button></div>' +
        '<div class="hm-loc">' + ic('pin', 'f') + '<b>' + esc(S.pn) + '</b><span class="sep">·</span><span class="ds">' + esc(S.dn) + '</span>' +
        '<button data-a="change">' + ic('compass') + 'เปลี่ยน</button></div>' +
        '<div class="hm-scope">' + tabs + '</div>' +
        '<button class="hm-fund" data-a="fund">' + ic('leaf') + '<span>กองทุน' + REG[S.r].n + ' <b>669.3</b> คะแนน</span>' + ic('chev-r') + '</button></div>' +
        // หัวน้ำเงินอยู่กับที่ (นอก FlatList ในแอป) · เลื่อนเฉพาะฟีด
        '<div class="d-scroll hm-body">' +
        // เหตุการณ์เร่งด่วน
        '<div class="hm-hot">' + banner('#dc2626', '#ef4444', 'megaphone', 'เหตุการณ์เร่งด่วนในพื้นที่', 'pinmap', 'ดูทั้งหมด', '#dc2626', 'data-a="go" data-i="4"') +
        '<div class="hc-wrap"><div class="hc-row">' + this.hotCard(H.hot, false) + this.hotCard((H.hot + 1) % HOT.length, true) + '</div></div></div>' +
        // แผนที่ใกล้คุณ
        '<div class="hm-near">' + banner('#1d4ed8', '#3b82f6', 'pin', 'แผนที่ใกล้คุณ <small>· พบ ' + near + ' จุด</small>', 'maximize', 'ดูแผนที่เต็ม', '#1d4ed8', 'data-a="go" data-i="3"') +
        this.miniMap() + '</div>' +
        '<div class="hm-meta"><span>' + feed.n + ' โพสต์ · อัปเดตล่าสุด</span><button data-a="filter">' + ic(fl[1]) + fl[2] + ic('chev-d') + '</button></div>' +
        '<div class="hm-feed">' + feed.html + '</div></div>' +
        '<nav class="hm-nav"><button class="tb on" style="--c:#1a56db" data-a="noop"><span class="ti">' + ic('home') + '<i>3</i></span>หน้าหลัก</button>' +
        '<button class="tb" style="--c:#10b981" data-a="go" data-i="3"><span class="ti">' + ic('map') + '</span>แผนที่</button>' +
        '<button class="fab3" data-a="plus" aria-label="สร้าง"><svg viewBox="0 0 54 54" aria-hidden="true">' + RING3 + '<circle cx="27" cy="27" r="21" fill="#1a56db"/><path d="M27 18.5 V35.5 M18.5 27 H35.5" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></button>' +
        '<button class="tb" style="--c:#e53935" data-a="go" data-i="4"><span class="ti">' + ic('alert') + '</span>แจ้งเหตุ</button>' +
        '<button class="tb" style="--c:#0b3a9e" data-a="go" data-i="5"><span class="ti">' + ic('user') + '</span>โปรไฟล์</button></nav>' +
        SHEET + (H.pending ? this.confirm() : '') + TOAST + '</div>';
    },
    hotCard: function (i, peek) {
      var x = HOT[i], T = INC[x.t], v = H.votes[i] || { u: 0, d: 0 };
      var btn = function (a, extra, inner) { return peek ? '<span class="' + extra + '">' + inner + '</span>' : '<button class="' + extra + '" data-a="' + a + '" data-i="' + i + '">' + inner + '</button>'; };
      return '<div class="hc' + (peek ? ' peek" role="button" tabindex="0" data-a="hotnext" aria-label="เหตุการณ์ถัดไป' : '') + '">' +
        '<div class="hc-img"><span class="im" style="background:' + T.c + '22">' + em(T.e) + '</span>' +
        '<span class="im">' + drawnPic(i + 1, em(T.e)) + '<b>+' + x.more + '</b></span></div>' +
        '<div class="hc-c"><div class="hc-meta"><span class="bdg" style="background:' + T.c + '">' + em(T.e) + ' ' + T.n + '</span><span class="tm">' + ic('clock') + x.at + '</span></div>' +
        '<b class="hc-t">' + esc(x.ti) + '</b><span class="hc-l">' + ic('pin') + esc(S.dn + ' · ' + S.pn) + '</span>' +
        '<span class="hc-w">' + ic('alert') + T.w + '</span>' +
        '<div class="hc-f">' + btn('go" data-i="4', 'hc-map', ic('map') + 'ดูบนแผนที่') +
        '<span class="hc-v">' + btn('vup', 'up' + (v.my === 'u' ? ' on' : ''), ic('up') + v.u) + btn('vdn', 'dn' + (v.my === 'd' ? ' on' : ''), ic('down') + v.d) + '</span></div></div></div>';
    },
    miniMap: function () {
      var z = H.zoom, pins = inRadius(2.6).map(function (p) {
        var xy = pos(p.km, p.a);
        return '<button class="d-pin" data-a="hpin" data-i="' + PLACES.indexOf(p) + '" style="--pc:#185FA5;left:calc(50% + ' + (xy[0] * z).toFixed(1) + 'cqw);top:calc(50% + ' + (xy[1] * z).toFixed(1) + 'cqw)" aria-label="' + esc(p.n) + '"><span class="tl"></span><span class="hd">' + catIcon(p.k) + '</span></button>';
      }).join('');
      return '<div class="hm-map d-mapc"><div class="zl" style="transform:scale(' + z + ')">' + cityMap() + '</div>' +
        '<span class="d-ring" style="--rc:#3b82f6;left:50%;top:50%;width:' + (2 * rr(2) * z).toFixed(1) + 'cqw"></span>' +
        '<span class="d-you" style="left:50%;top:50%"></span>' + pins +
        '<div class="mz"><button data-a="zin" aria-label="ขยาย">' + ic('plus') + '</button><button data-a="zout" aria-label="ย่อ">' + ic('minus') + '</button><button data-a="zloc" aria-label="ตำแหน่งฉัน">' + ic('locate') + '</button></div></div>';
    },
    // ลำดับฟีดตามแอป (HomeScreen รวมโพสต์ + หมุด · โพลยังไม่หมดเวลาปักบนสุด)
    feed: function () {
      var tab = H.tab, f = H.filter, items = [];
      if ((f === 'all' || f === 'poll') && tab !== 'c') items.push(this.poll(tab));
      if (f === 'alert') HOT.slice(0, 2).forEach(function (x, i) { items.push(SC.home.alertPost(x, i)); });
      if (f === 'all' || f === 'map') {
        var seq = f === 'map' ? ['temple', 'food'] : tab === 'd' ? ['temple', 'g1', 'food'] : tab === 'p' ? ['temple', 'p1', 'food'] : ['c1', 'temple', 'c2'];
        seq.forEach(function (k) { items.push(PCARD[k] ? SC.home.placeCard(k) : SC.home.post(k)); });
      }
      return { n: items.length, html: items.join('') || '<div class="hm-empty">ยังไม่มีโพสต์ในพื้นที่นี้</div>' };
    },
    // โพลชุมชน (PollCard + PollBlock)
    poll: function (tab) {
      var P = POLL[tab], v = H.voted[tab], saved = H.save['poll' + tab];
      var tot = P.votes + (v ? 1 : 0), ny = Math.round(P.votes * P.y / 100) + (v === 'y' ? 1 : 0), nn = tot - ny;
      var pct = function (n) { return Math.round(100 * n / (tot || 1)); };
      var bar = function (k, n, icon, label) {
        var chosen = v === k;
        return '<' + (v ? 'div' : 'button data-a="vote" data-v="' + k + '"') + ' class="pb-row ' + k + (chosen ? ' chosen' : '') + '">' +
          '<i style="width:' + (v ? pct(n) : 0) + '%"></i><span class="lb">' + icon + ' ' + label + (chosen ? ' (คุณเลือก)' : '') + '</span>' +
          (v ? '<span class="nm">' + pct(n) + '% · ' + n + '</span>' : '') + '</' + (v ? 'div' : 'button') + '>';
      };
      return '<div class="pc-card pinned"><div class="pc-rib"><span>📌 ปักบนสุด · เหลือ ' + P.left + '</span><span>👥 ' + esc(pLabel()) + '</span></div>' +
        '<div class="pc-row">' + av(P.by[0]) + '<div class="mt"><b>' + P.by[1] + '</b><small>📍 ' + esc(tab === 'd' ? S.dn : S.pn) + ' · ' + P.ago + '</small></div>' +
        '<span class="pc-chip">' + ic('chart') + 'โพลชุมชน</span>' +
        '<button class="ib' + (saved ? ' on' : '') + '" data-a="save" data-id="poll' + tab + '" aria-label="บันทึก">' + ic('bookmark', saved ? 'f' : '') + '</button>' +
        '<button class="ib" data-a="more" aria-label="เมนู">' + ic('dots') + '</button></div>' +
        '<div class="pc-title">' + P.title + '</div><div class="pc-q">' + esc(P.q()) + '</div><div class="pc-desc">' + P.desc + '</div>' +
        '<div class="pc-img">' + drawnPic(tab === 'd' ? 0 : 3, em(P.icon)) + '<span class="cnt">📷 3</span></div>' +
        '<div class="pb">' + bar('y', ny, '✓', 'ใช่') + bar('n', nn, '✕', 'ไม่ใช่') +
        '<div class="pb-foot"><span class="pot">🏆 ' + (v ? 97 : 98) + '/100' + (v ? '' : ' · โหวตรับ +1') + '</span><span class="vt">🗳️ ' + tot.toLocaleString('th-TH') + ' โหวต</span>' +
        '<button data-a="share">' + ic('share') + 'แชร์</button></div></div>' +
        (H.pending ? '' : '') + '</div>';
    },
    confirm: function () {
      var c = H.pending;
      return '<div class="pv-ov" data-a="vcancel"><div class="pv-dlg" role="dialog"><b>ยืนยันเลือก ' + (c === 'y' ? '✓ ใช่' : '✕ ไม่ใช่') + '?</b>' +
        '<small>โหวตแล้วเปลี่ยนไม่ได้</small><em>รับ +1 คะแนน</em><div class="bt"><button class="g" data-a="vcancel">ยกเลิก</button><button class="m" data-a="vok">ยืนยัน</button></div></div></div>';
    },
    // การ์ดหมุดสถานที่ (PlaceFeedCard · refined)
    placeCard: function (k) {
      var P = PCARD[k], saved = H.save['pl' + k], g = '';
      for (var i = 1; i <= 3; i++) g += '<span class="th">' + scene(P.scene, i) + (i === 3 && P.photos > 4 ? '<b>+' + (P.photos - 4) + '</b>' : '') + '</span>';
      return '<div class="pf-card"><div class="pf-h">' + av(P.by[0]) + '<div class="mt"><b>' + P.by[1] + '</b>' +
        '<small>📍 ' + esc(dLabel() + ' ' + pLabel()) + '<em> · ' + P.ago + '</em></small></div>' +
        '<button class="ib' + (saved ? ' on' : '') + '" data-a="save" data-id="pl' + k + '" aria-label="' + (saved ? 'ยกเลิกบันทึกสถานที่นี้' : 'บันทึกสถานที่นี้') + '">' + ic('bookmark', saved ? 'f' : '') + '</button></div>' +
        '<div class="pf-name">' + P.n + '</div>' +
        '<div class="pf-gal"><span class="main">' + scene(P.scene, 0) + '<span class="rt"><i>★</i> ' + P.rate + '</span><span class="ct">' + ic('images') + '1/' + P.photos + '</span></span>' +
        '<span class="thr">' + g + '</span></div>' +
        '<div class="pf-info"><span class="c"><i style="background:#eef3ff;color:#2563EB">' + ic('navc') + '</i><b>' + P.km + '</b></span>' +
        '<span class="c"><i style="background:#e8f8ee;color:#16a34a">' + ic('clock') + '</i><b style="color:#16a34a">เปิดอยู่</b></span>' +
        '<span class="c"><i style="background:#f1ecff">' + catIcon(P.cat) + '</i><b>' + CAT[P.cat][1] + '</b></span>' +
        '<button class="c map" data-a="go" data-i="3"><i>' + ic('map') + '</i><span class="pill">แผนที่ ›</span></button></div>' +
        '<div class="pf-desc">' + P.desc + '</div></div>';
    },
    // โพสต์ทั่วไป (PostCard)
    post: function (id) {
      var T = {
        g1: ['cat', 'แมว 2047', '5 ชั่วโมงที่แล้ว', 'พรุ่งนี้เช้ามีกิจกรรมเก็บขยะริมคลอง 7 โมง ใครว่างมาช่วยกันนะ นัดเจอที่ศาลาหน้าวัด', 31, 9, 1, '🌿'],
        p1: ['elephant', 'ช้าง 3568', '1 วันที่แล้ว', 'งานกาชาดปีนี้จัดที่สนามกลางเมือง เปิดถึงสามทุ่มทุกวัน', 58, 14, 4, '🎡'],
        c1: ['dog', 'สุนัข 8801', '1 วันที่แล้ว', 'ช่วงนี้ฝนตกหลายภาค เช็กแจ้งเหตุในอำเภอตัวเองก่อนออกเดินทางกันนะ', 205, 41, -1, ''],
        c2: ['owl', 'นกฮูก 4410', '2 วันที่แล้ว', 'ใครมีจุดชมวิวที่ชอบในจังหวัดตัวเอง ปักหมุดแนะนำกันได้เลย', 132, 77, 3, '🌄']
      }[id];
      return this.generalCard(id, T[0], T[1], T[2], T[3], T[4], T[5], T[6] >= 0 ? drawnPic(T[6], em(T[7])) : '', '<span class="gp-chip" style="--c:#1a56db">💬 โพสต์ทั่วไป</span>', '');
    },
    alertPost: function (x, i) {
      var T = INC[x.t];
      return this.generalCard('al' + i, i ? 'cat' : 'elephant', i ? 'แมว 2047' : 'ช้าง 3568', x.at, x.ti, 12, 3, drawnPic(i + 2, em(T.e)), '',
        '<span class="gp-al" style="background:' + T.c + '">' + T.e + ' ' + T.n + '</span>');
    },
    generalCard: function (id, a, name, ago, text, up, cm, pic, chip, badge) {
      var u = H.vote[id], saved = H.save[id];
      return '<div class="gp-card"><div class="gp-h">' + av(a) + '<div class="mt"><b>' + name + '</b>' + chip +
        '<small>' + ic('pin', 'f') + esc(S.pn + ' / ' + S.dn) + '<em>·</em>' + ago + '</small></div>' +
        '<div class="rt"><div class="bt"><button class="ib' + (saved ? ' on' : '') + '" data-a="save" data-id="' + id + '" aria-label="บันทึก">' + ic('bookmark', saved ? 'f' : '') + '</button>' +
        '<button class="ib" data-a="more" aria-label="เมนู">' + ic('dots') + '</button></div>' + badge + '</div></div>' +
        '<div class="gp-txt">' + esc(text) + '</div>' + (pic ? '<div class="gp-pic">' + pic + '</div>' : '') +
        '<div class="gp-act"><button data-a="pvote" data-id="' + id + '" data-v="u"' + (u === 'u' ? ' class="up"' : '') + '>' + ic('up', u === 'u' ? 'f' : '') + (up + (u === 'u' ? 1 : 0)) + '</button>' +
        '<button data-a="pvote" data-id="' + id + '" data-v="d"' + (u === 'd' ? ' class="dn"' : '') + '>' + ic('down', u === 'd' ? 'f' : '') + (u === 'd' ? 1 : 0) + '</button>' +
        '<button data-a="comment">' + ic('msg') + cm + '</button><button data-a="share">' + ic('share') + 'แชร์</button></div></div>';
    },
    filterSheet: function () {
      return '<h4>เลือกหมวดหมู่</h4>' + FILTERS.map(function (f) {
        var on = H.filter === f[0];
        return '<button class="fl-row' + (on ? ' on' : '') + '" data-a="setf" data-k="' + f[0] + '">' + ic(f[1]) + '<span>' + f[2] + '</span>' + (on ? ic('check') : '') + '</button>';
      }).join('');
    },
    after: function (host) {
      var bars = host.querySelectorAll('.poll-res i[data-w]');
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        Array.prototype.forEach.call(bars, function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      }); });
    },
    on: function (a, el, host) {
      var i = +el.getAttribute('data-i');
      if (a === 'tab') { H.tab = el.getAttribute('data-t'); return render('home', true); }
      if (a === 'vote') { H.pending = el.getAttribute('data-v'); render('home', true); return updateLock(); }
      if (a === 'vcancel') { H.pending = null; render('home', true); return updateLock(); }
      if (a === 'vok') { H.voted[H.tab] = H.pending; H.pending = null; render('home', true); updateLock(); return toast(host, '+1 คะแนน 🎉'); }
      if (a === 'pvote') { var pid = el.getAttribute('data-id'), pv = el.getAttribute('data-v'); H.vote[pid] = H.vote[pid] === pv ? null : pv; return render('home', true); }
      if (a === 'save') { var id = el.getAttribute('data-id'); H.save[id] = !H.save[id]; return render('home', true); }
      if (a === 'hotnext') { H.hot = (H.hot + 1) % HOT.length; render('home', true); var c = host.querySelector('.hc'); if (c && !reduce) c.classList.add('in'); return; }
      if (a === 'vup' || a === 'vdn') {
        var v = H.votes[i] || (H.votes[i] = { u: 0, d: 0, my: null }), k = a === 'vup' ? 'u' : 'd';
        if (v.my) v[v.my]--;
        v.my = v.my === k ? null : k; if (v.my) v[v.my]++;
        return render('home', true);
      }
      if (a === 'zin' || a === 'zout' || a === 'zloc') {
        H.zoom = a === 'zloc' ? 1 : Math.max(0.6, Math.min(2.2, H.zoom * (a === 'zin' ? 1.35 : 1 / 1.35)));
        return render('home', true);
      }
      if (a === 'hpin') { go(3); setTimeout(function () { SC.map.openPlace(i); }, 380); return; }
      if (a === 'filter') return sheet(host, this.filterSheet());
      if (a === 'setf') { H.filter = el.getAttribute('data-k'); sheet(host, null); return render('home', true); }
      if (a === 'shclose') return sheet(host, null);
      if (a === 'go') return go(i);
      if (a === 'change') { L.step = 1; L.r = S.r; L.p = S.p; L.d = S.d; render('loc'); return go(1); }
      var msg = { lang: 'ในแอปสลับภาษา ไทย / อังกฤษ ได้', bell: 'ในแอปจะเปิดรายการแจ้งเตือน', fund: 'ในแอปดูที่มาของคะแนนกองทุนได้ทุกรายการ',
        comment: 'ในแอปจะเปิดคอมเมนต์', share: 'ในแอปจะเปิดเมนูแชร์', more: 'ในแอปมีเมนู บันทึก / รายงาน',
        plus: 'ในแอปจะเปิดเมนู "สร้างอะไรดีวันนี้?"' }[a];
      if (msg) toast(host, msg);
    }
  };

  /* ---------- 4) แผนที่ชีวิตประจำวัน + ฟอร์มเพิ่มสถานที่ (AddPlaceSheet) ---------- */
  var M = { km: 3, cat: null, group: 'daily', touched: false, fabSeen: false, mode: 'daily', src: 'siam', full: false, zoom: 1 };
  // หมุดตามโหมด: ชีวิตประจำวัน "ทั้งหมด" แสดงทั้ง 2 กลุ่ม (เหมือนแอป) · ท่องเที่ยว แสดงเฉพาะหมวดท่องเที่ยว
  function mList(all) {
    var mp = PLACES.filter(function (p) { return M.mode === 'daily' || isTravel(p.k); });
    return all ? mp : mp.filter(function (p) { return p.km <= M.km && (!M.cat || p.k === M.cat); });
  }
  var RATES = [4.6, 5.0, 4.7, 4.2, 4.8, 4.9, 4.5, 4.3, 4.6, 5.0, 4.9, 4.7, 4.1, 4.8, 4.4, 4.0, 4.7, 5.0, 4.9, 4.6];
  function rateOf(p) { var i = PLACES.indexOf(p); return p.rt || RATES[i] || 5.0; }
  function fmtKm(km) { return km < 1 ? Math.round(km * 1000) + ' ม.' : km.toFixed(1) + ' กม.'; }
  // ภาพวาดตามหมวด (วัด/อาหาร = ฉากวาด · หมวดอื่น = ไล่สี + ไอคอนหมวด)
  function placePic(p, i) {
    if (p.k === 'temple') return scene('temple', i);
    if (p.k === 'food') return scene('food', i);
    return drawnPic(PLACES.indexOf(p) + i, catIcon(p.k));
  }
  // แถบล่างแบบแอป (TabNavigator) · cur = เลขสไลด์ของแท็บที่เลือก
  function navBar(cur) {
    var T = [[2, '#1a56db', 'home', 'หน้าหลัก'], [3, '#10b981', 'map', 'แผนที่'], null, [4, '#e53935', 'alert', 'แจ้งเหตุ'], [5, '#0b3a9e', 'user', 'โปรไฟล์']];
    return '<nav class="hm-nav">' + T.map(function (t) {
      if (!t) return '<button class="fab3" data-a="plus" aria-label="สร้าง"><svg viewBox="0 0 54 54" aria-hidden="true">' + RING3 + '<circle cx="27" cy="27" r="21" fill="#1a56db"/><path d="M27 18.5 V35.5 M18.5 27 H35.5" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></button>';
      var on = t[0] === cur;
      return '<button class="tb' + (on ? ' on' : '') + '" style="--c:' + t[1] + '" data-a="' + (on ? 'noop' : 'go') + '" data-i="' + t[0] + '"><span class="ti">' + ic(t[2]) + (t[0] === 2 ? '<i>3</i>' : '') + '</span>' + t[3] + '</button>';
    }).join('') + '</nav>';
  }
  var NAMETH = {
    toilet: 'ห้องน้ำใกล้ฉัน', food: 'ร้านอาหาร', drinks: 'เครื่องดื่ม', gas: 'ปั๊มน้ำมัน', atm: 'ATM/ธนาคาร', parking: 'ที่จอดรถ', transit: 'รถประจำทาง',
    market: 'ตลาดสด', convenience: 'สะดวกซื้อ', mechanic: 'ร้านซ่อมรถ', car_rental: 'รถเช่า', hospital: 'โรงพยาบาล/คลินิก', pharmacy: 'ร้านยา',
    dental: 'ทันตกรรม', fitness: 'สถานที่ออกกำลังกาย', cafe: 'ร้านกาแฟ', temple: 'วัด / ศาสนสถาน', beach: 'ทะเล / ชายหาด', viewpoint: 'จุดชมวิว',
    nature: 'ธรรมชาติ / น้ำตก', walkingstreet: 'ถนนคนเดิน / ตลาดท่องเที่ยว', souvenir: 'ร้านของฝาก / ของที่ระลึก', museum: 'พิพิธภัณฑ์ / ศิลปะ',
    themepark: 'สวนสนุก / สวนน้ำ / สวนสัตว์', landmark: 'กิจกรรม / แลนด์มาร์ก', spa: 'สปา / นวดไทย', nightlife: 'ไนท์ไลฟ์ / บาร์',
    farm: 'ฟาร์ม / สวนเกษตร', camping: 'ที่พัก / ลานกางเต็นท์'
  };
  // ชื่อแนะนำตาม PLACE_NAME_PRESETS ของแอป — ตัดชื่อแบรนด์/ธนาคารจริงออก · หมวดที่แอปไม่มีชื่อแนะนำ เติมชื่อทั่วไปให้กดได้
  var NAMES = {
    toilet: ['ห้องน้ำสาธารณะ', 'ห้องน้ำฟรี', 'ห้องน้ำริมทาง', 'ห้องน้ำตลาด'], food: ['ร้านข้าวแกง', 'ร้านก๋วยเตี๋ยว', 'แผงลอย', 'ร้านอาหารตามสั่ง'],
    drinks: ['ร้านชานม', 'ร้านน้ำผลไม้', 'ร้านน้ำปั่น', 'ร้านเครื่องดื่ม'], gas: ['ปั๊มน้ำมัน', 'ปั๊มน้ำมันริมทาง', 'ปั๊มน้ำมันชุมชน'],
    atm: ['ตู้ ATM', 'ตู้ ATM หน้าตลาด', 'ตู้ ATM ในปั๊ม'], parking: ['ที่จอดรถฟรี', 'ที่จอดรถเสียเงิน', 'ลานจอดรถ', 'อาคารจอดรถ'],
    transit: ['ป้ายรถเมล์', 'สถานีรถสองแถว', 'ป้ายรถประจำทาง', 'จุดจอดมอเตอร์ไซค์รับจ้าง'], market: ['ตลาดสด', 'ตลาดนัด', 'ตลาดเช้า', 'ตลาดชุมชน'],
    convenience: ['ร้านสะดวกซื้อ', 'มินิมาร์ท', 'ร้านโชห่วย'], mechanic: ['อู่ซ่อมรถ', 'ร้านยาง', 'ศูนย์บริการรถยนต์', 'ร้านซ่อมมอเตอร์ไซค์'],
    car_rental: ['รถเช่า', 'มอเตอร์ไซค์เช่า', 'รถเช่าพร้อมคนขับ', 'รถเช่ารายวัน'], hospital: ['โรงพยาบาลรัฐ', 'โรงพยาบาลเอกชน', 'คลินิกทั่วไป'],
    pharmacy: ['ร้านขายยา', 'ร้านยาเครือข่าย', 'เภสัชกรชุมชน'], dental: ['คลินิกทันตกรรม', 'หมอฟัน', 'ทันตแพทย์'],
    fitness: ['ฟิตเนส', 'สวนสาธารณะ', 'สนามกีฬา', 'ลานออกกำลังกาย'], temple: ['วัด', 'โบสถ์', 'มัสยิด', 'ศาลเจ้า'],
    viewpoint: ['จุดชมวิว', 'ดอยชมวิว', 'จุดพระอาทิตย์ตก', 'จุดถ่ายรูป'], nature: ['น้ำตก', 'ป่าเดินเล่น', 'สวนสาธารณะ', 'อ่างเก็บน้ำ'],
    cafe: ['คาเฟ่', 'ร้านกาแฟ', 'บ้านกาแฟ', 'ร้านนั่งเล่น'], walkingstreet: ['ถนนคนเดิน', 'ตลาดท่องเที่ยว', 'ตลาดกลางคืน', 'ตลาดของฝาก'],
    souvenir: ['ร้านของฝาก', 'ร้านของที่ระลึก', 'ร้านงานฝีมือ', 'ร้านของตกแต่ง'], landmark: ['แลนด์มาร์ก', 'สถานที่ถ่ายรูป', 'กิจกรรมกลางแจ้ง', 'พิพิธภัณฑ์'],
    camping: ['ลานกางเต็นท์', 'รีสอร์ท', 'บ้านพัก', 'โฮมสเตย์'], beach: ['ชายหาด', 'จุดเล่นน้ำ', 'หาดส่วนตัว'], museum: ['พิพิธภัณฑ์', 'หอศิลป์', 'แกลเลอรี'],
    themepark: ['สวนสนุก', 'สวนน้ำ', 'สวนสัตว์'], spa: ['ร้านนวดไทย', 'สปา', 'นวดเท้า'], nightlife: ['บาร์', 'ร้านนั่งชิล', 'ร้านดนตรีสด'], farm: ['ฟาร์ม', 'สวนเกษตร', 'สวนผลไม้']
  };
  var RATE = [
    ['c', 'sparkles', 'ความสะอาด', 'สะอาดแค่ไหน', { 5: 'สะอาดมาก', 4: 'สะอาด', 3: 'ปานกลาง', 2: 'ค่อนข้างสกปรก', 1: 'สกปรกมาก' }],
    ['s', 'shield', 'ความปลอดภัย', 'ปลอดภัยแค่ไหน', { 5: 'ปลอดภัยมาก', 4: 'ปลอดภัย', 3: 'ปานกลาง', 2: 'ค่อนข้างเสี่ยง', 1: 'อันตราย' }],
    ['a', 'cloudsun', 'บรรยากาศ', 'บรรยากาศดีแค่ไหน', { 5: 'ดีมาก', 4: 'ดี', 3: 'ปานกลาง', 2: 'พอใช้', 1: 'ควรปรับปรุง' }]
  ];
  var F = { open: false, cat: null, pg: 'daily', photos: [], name: '', r: { c: null, s: null, a: null } };
  function fReset() { F.cat = null; F.photos = []; F.name = ''; F.r = { c: null, s: null, a: null }; }
  function fTheme() {
    var daily = F.cat ? !isTravel(F.cat) : true;
    return daily ? { main: '#10b981', dark: '#0f6a3d', bg: '#f1f6f3', line: '#a7f3d0' } : { main: '#1a56db', dark: '#185FA5', bg: '#f1f4fb', line: '#bfdbfe' };
  }
  function fState() {
    var rv = [F.r.c, F.r.s, F.r.a], rated = rv.filter(function (x) { return x !== null; }).length;
    // ข้อบังคับ (canSubmit ของแอป): หมวด · ชื่อ · ดาวไม่ครึ่ง ๆ กลาง ๆ · ตำแหน่ง (เดโมถือว่ามีตำแหน่งแล้ว)
    var req = [['category', !!F.cat, 'หมวดหมู่'], ['name', F.name.length > 0, 'ชื่อสถานที่'], ['rating', rated === 0 || rated === 3, 'ดาวให้ครบ 3 มิติ']];
    // คุณภาพหมุด x/7 (computePlaceQuality) — เดโมไม่มีขั้นเวลา/รายละเอียด/ย้ายหมุด จึงนับได้สูงสุด 4/7
    var q = [['category', !!F.cat], ['photos', F.photos.length >= 1], ['name', F.name.length > 0], ['rating', rated === 3], ['hours', false], ['details', false], ['location', false]];
    var done = q.filter(function (x) { return x[1]; }).length, miss = req.filter(function (x) { return !x[1]; })[0], undone = q.filter(function (x) { return !x[1]; })[0];
    var SG = { category: 'เลือกหมวดหมู่', photos: 'เพิ่มรูปทางเข้า', name: 'ตั้งชื่อสถานที่', rating: 'ให้ดาวครบ 3 มิติ', hours: 'ใส่เวลาเปิด-ปิด', details: 'เล่ารายละเอียดสั้น ๆ', location: 'ปักหมุดให้ตรงทางเข้า' };
    var praise = done <= 2 ? '👋 เริ่มต้นดี' : done <= 4 ? '✨ ดีมาก!' : done <= 6 ? '🌟 เยี่ยมมาก!' : '🏆 สุดยอด!';
    return { done: done, ok: !miss, praise: praise, right: miss ? 'ต้องกรอก: ' + miss[2] : undone ? 'แนะนำ: ' + SG[undone[0]] : '🏆 พร้อมบันทึก' };
  }
  SC.map = {
    // ── หน้าแท็บแผนที่ (ChatScreen: MapModeToggle · SourceTabs · การ์ดแผนที่ · RadiusChips · CategoryChips · แนะนำใกล้คุณ · ยอดนิยม)
    html: function () {
      var tr = M.mode === 'travel', C = tr ? '#1a56db' : '#10b981', list = mList(), all = mList(true);
      var srcs = '<div class="mt-src">' +
        '<button data-a="src" data-v="all"' + (M.src === 'all' ? ' class="on"' : '') + ' style="--c:' + C + '">' + ic('layers') + 'ทั้งหมด <i>(' + list.length + ')</i></button>' +
        '<button data-a="src" data-v="google" style="--c:' + C + '"><span class="dt g"></span>Google <i>(0)</i></button>' +
        '<button data-a="src" data-v="siam"' + (M.src === 'siam' ? ' class="on"' : '') + ' style="--c:' + C + '"><span class="dt"></span>Siam <i>(' + list.length + ')</i></button></div>';
      var hint = '<div class="mt-hint"><span>แสดง ' + (tr ? TRAVEL.length : 22) + ' หมวดที่คุณเลือก · <button data-a="cats" style="color:' + C + '">ปรับ ›</button></span>' +
        (tr ? '' : '<span class="mt-leg"><span style="--c:#15803d"><i></i>ชีวิตประจำวัน</span><span style="--c:#185FA5"><i></i>ท่องเที่ยว</span></span>') + '</div>';
      var rads = [1, 2, 3, 5, 10].map(function (k) { return '<button data-a="km" data-k="' + k + '"' + (M.km === k ? ' class="on"' : '') + ' style="--c:' + C + '">' + k + ' กม.</button>'; }).join('');
      // ชิปวงกลม 1 แถว (ไม่เลื่อนแนวนอน) + "เพิ่มเติม"
      var base = tr ? ['temple', 'viewpoint', 'nature', 'souvenir'] : ['gas', 'toilet', 'food', 'drinks'];
      if (M.cat && base.indexOf(M.cat) < 0) base = base.slice(0, 3).concat([M.cat]);
      var chips = [''].concat(base).map(function (k) {
        var on = (M.cat || '') === k;
        return '<button class="cc' + (on ? ' on' : '') + '" style="--c:' + C + '" data-a="chip" data-k="' + k + '"><span class="ci">' + (k ? catIcon(k) : ic('globe')) + '</span>' +
          '<span class="cl">' + (k ? CAT[k][1].split(' / ')[0] : 'ทั้งหมด') + '</span></button>';
      }).join('') + '<button class="cc" data-a="cats"><span class="ci more">' + ic('plus') + '</span><span class="cl">เพิ่มเติม</span></button>';
      var rec = list.slice(0, 2).map(function (p) {
        return '<button class="rc" data-a="pin" data-i="' + PLACES.indexOf(p) + '"><span class="im">' + placePic(p, 0) + '</span><b>' + esc(p.n) + '</b>' +
          '<small><em>★ ' + rateOf(p).toFixed(1) + '</em> · ' + fmtKm(p.km) + '</small></button>';
      }).join('') || '<div class="mt-empty">ยังไม่มีสถานที่ในหมวดนี้ใกล้คุณ</div>';
      var pop = list.slice().sort(function (a, b) { return rateOf(b) - rateOf(a) || a.km - b.km; }).slice(0, 3).map(function (p, i) {
        return '<button class="pp" data-a="pin" data-i="' + PLACES.indexOf(p) + '"><span class="rk r' + (i + 1) + '">' + (i + 1) + '</span><span class="im">' + placePic(p, i + 1) + '</span>' +
          '<span class="tx"><b>' + esc(p.n) + '</b><small>' + CAT[p.k][1].split(' / ')[0] + ' · ' + fmtKm(p.km) + '</small></span><em>★ ' + rateOf(p).toFixed(1) + '</em></button>';
      }).join('') || '<div class="mt-empty">ยังไม่มีสถานที่ยอดนิยมในระยะนี้</div>';
      return '<div class="dm d-map2' + (tr ? ' tr' : '') + '">' +
        '<div class="d-scroll mt-body">' +
        '<div class="mt-mode"><button data-a="mode" data-v="daily"' + (tr ? '' : ' class="on"') + ' style="--c:#10b981">' + ic('store') + '<span><b>ชีวิตประจำวัน</b><small>สิ่งอำนวยความสะดวก</small></span></button>' +
        '<button data-a="mode" data-v="travel"' + (tr ? ' class="on"' : '') + ' style="--c:#1a56db">' + ic('plane') + '<span><b>ท่องเที่ยว</b><small>แนะนำสถานที่เที่ยว</small></span></button></div>' +
        '<div class="mt-pad">' + srcs + hint +
        '<div class="mt-card d-mapc">' + this.mapLayer(list, all, M.zoom, true) +
        '<button class="mt-exp" data-a="full" style="color:' + C + ';border-color:' + C + '">' + ic('maximize') + 'เต็มจอ</button>' +
        '<div class="mz"><button data-a="mloc" aria-label="ตำแหน่งฉัน" style="color:#1a73e8">' + ic('locate') + '</button>' +
        '<button data-a="mzin" aria-label="ขยาย">' + ic('plus') + '</button><button data-a="mzout" aria-label="ย่อ">' + ic('minus') + '</button></div></div>' +
        '<div class="mt-rads">' + rads + '</div>' +
        '<div class="mt-sec"><b>' + (tr ? 'หมวดท่องเที่ยว' : 'หมวดหมู่') + '</b><button data-a="cats" style="color:' + C + '">เลือกหมวดหมู่ ›</button></div>' +
        '<div class="mt-chips">' + chips + '</div>' +
        '<div class="mt-sec"><b class="big">' + (tr ? 'สถานที่ท่องเที่ยวใกล้คุณ' : 'แนะนำใกล้คุณ') + '</b></div><div class="mt-rec">' + rec + '</div>' +
        '<div class="mt-sec"><b class="big">🏆 สถานที่ยอดนิยมใกล้คุณ</b></div><div class="mt-pop">' + pop + '</div></div></div>' +
        '<button class="apf mt-fab" data-a="add" aria-label="ปักหมุดสถานที่ใหม่"><span class="orb"' + (tr ? ' style="border-color:rgba(46,139,255,.45)"' : '') + '></span>' +
        '<span class="core' + (M.fabSeen ? '' : ' d-pulse') + '"' + (tr ? ' style="background:linear-gradient(135deg,#37C0FF,#1F6BFF)"' : '') + '>' + ic('pin-plus') + '</span></button>' +
        navBar(3) +
        '<div class="mp-full' + (M.full ? ' on' : '') + '" role="dialog" aria-label="แผนที่เต็มจอ">' + (M.full ? this.fullHtml() : '') + '</div>' +
        SHEET + '<div class="d-form' + (F.open ? ' on' : '') + '" role="dialog" aria-label="เพิ่มสถานที่ใหม่">' + (F.open ? this.form() : '') + '</div>' + TOAST + '</div>';
    },
    // ชั้นแผนที่วาด + วง + หมุด (ใช้ทั้งการ์ดและเต็มจอ)
    mapLayer: function (list, all, z, labels) {
      var C = M.mode === 'travel' ? '#1a56db' : '#15803d';
      var pins = all.map(function (p) {
        var xy = pos(p.km, p.a), vis = list.indexOf(p) >= 0;
        return '<button class="d-pin' + (vis ? '' : ' hid') + (p.isNew ? ' new' : '') + '" data-a="pin" data-i="' + PLACES.indexOf(p) + '" style="--pc:' + (isTravel(p.k) ? '#185FA5' : '#15803d') +
          ';left:calc(50% + ' + (xy[0] * z).toFixed(1) + 'cqw);top:calc(50% + ' + (xy[1] * z).toFixed(1) + 'cqw)" aria-label="' + esc(p.n) + '"><span class="tl"></span><span class="hd">' + catIcon(p.k) + '</span></button>';
      }).join('');
      return '<div class="zl" style="transform:scale(' + z + ')">' + cityMap(labels) + '</div>' +
        '<span class="d-ring" style="--rc:' + C + ';left:50%;top:50%;width:' + (2 * rr(M.km) * z).toFixed(1) + 'cqw"></span>' +
        '<span class="d-you" style="left:50%;top:50%"></span>' + pins;
    },
    // ── แผนที่เต็มจอ (FullMapModal / TravelMapModal) เป็นแผ่นทับ
    fullHtml: function () {
      var tr = M.mode === 'travel', list = mList(), all = mList(true), lbl = M.cat ? CAT[M.cat][1] : 'ทั้งหมด';
      PLACES.forEach(function (p) { p.isNew = false; });
      var rads = [1, 2, 3, 5, 10].map(function (k) { return '<button data-a="km" data-k="' + k + '"' + (M.km === k ? ' class="on"' : '') + '>' + k + ' กม.</button>'; }).join('');
      return '<div class="d-hd mp-hd"' + (tr ? ' style="background:#1a56db"' : '') + '><div class="row"><div class="tt"><b>' + (tr ? 'แผนที่ท่องเที่ยว' : 'แผนที่ชีวิตประจำวัน') + '</b><small>' + ic('pin') + 'รอบตำแหน่งของคุณ · ' + list.length + ' จุด</small></div>' +
        '<button class="d-x" data-a="fclose" aria-label="ปิดแผนที่">' + ic('x') + '</button></div></div>' +
        '<div class="mp-ctl"><button class="mp-cat" data-a="cats"' + (tr ? ' style="color:#1a56db;border-color:#bfdbfe;background:#eff6ff"' : '') + '><span>หมวดหมู่: <b>' + esc(lbl) + '</b></span>' + ic('chev-d') + '</button>' +
        '<div class="mp-leg"><span style="--c:#15803d"><i></i>ชีวิตประจำวัน</span><span style="--c:#185FA5"><i></i>ท่องเที่ยว</span></div></div>' +
        '<div class="mp-map d-mapc">' + this.mapLayer(list, all, 1, true) +
        '<span class="mp-count">' + esc(dLabel()) + '</span>' +
        '<button class="apf" data-a="add" aria-label="ปักหมุดสถานที่ใหม่"><span class="orb"></span><span class="core">' + ic('pin-plus') + '</span></button></div>' +
        '<div class="mp-rads' + (tr ? ' tr' : '') + '">' + rads + '</div>';
    },
    form: function () {
      var T = fTheme(), dim = !F.cat, st = fState(), room = F.cat ? NAMETH[F.cat] : null;
      var s1 = '<button class="sel' + (F.cat ? '' : ' d-pulse') + '" data-a="f-cat" style="--c:' + T.main + '">' + (F.cat ? catIcon(F.cat) : em('📍')) +
        '<span>' + esc(room || 'เลือกหมวดหมู่...') + '</span>' + ic('chev-d') + '</button>';
      var s2 = '<div class="slots">' + photoSlots(F.photos, ['ปก', 'ทางเข้า', 'บรรยากาศ', 'ทางออก'], F.cat ? catIcon(F.cat) : em('📍'), 'f-photo') + '</div>';
      var s3 = '<div class="fld" style="--c:' + T.main + '">' + ic('pen') + '<span class="' + (F.name ? 'v' : 'pl') + '">' + esc(F.name || 'เช่น ' + (room || 'สถานที่') + 'แถวตลาดสด') + '</span><small>' + F.name.length + '/100</small></div>' +
        (F.cat ? '<div class="chips pre">' + NAMES[F.cat].map(function (n) {
          return '<button class="chip' + (F.name === n ? ' on' : '') + '" style="--ac:' + T.main + '" data-a="f-name" data-v="' + esc(n) + '">' + esc(n) + '</button>';
        }).join('') + '</div>' : '');
      var s4 = '<div class="sc-note">ให้ครบ 3 มิติ (ความจุไม่บังคับ)</div>' + RATE.map(function (r) {
        var v = F.r[r[0]], stars = '';
        for (var k = 1; k <= 5; k++) stars += '<button class="star' + (v && k <= v ? ' on' : '') + '" data-a="f-star" data-k="' + r[0] + '" data-v="' + k + '" aria-label="' + k + ' ดาว">' + ic('star') + '</button>';
        return '<div class="rt"><span class="ri" style="color:' + T.main + '">' + ic(r[1]) + '</span><div class="rx"><b>' + r[2] + '</b><small>' + (v ? r[4][v] : r[3]) + '</small></div><div class="stars">' + stars + '</div></div>';
      }).join('');
      return waveHead(T.main, T.dark, T.bg, '<span class="fic">' + ic('pin', 'f') + '</span>', 'เพิ่มสถานที่ใหม่', 'ร่วมสร้างแผนที่ประเทศไทย ให้สมบูรณ์ยิ่งขึ้น',
        '<button class="fbtn" data-a="f-close" aria-label="ปิด">' + ic('x') + '</button>') +
        '<div class="fbody" style="background:' + T.bg + '">' +
        stepCard(1, 'หมวดหมู่ *', '', T.main, s1, false, F.cat ? '' : '👆 เริ่มจากเลือกหมวดหมู่ — ระบบจะแนะนำชื่อและสีให้เอง') +
        stepCard(2, 'รูปภาพ (ถ้ามี)', F.photos.length + '/30 รูป · ไม่บังคับ', T.main, s2, dim, '', 'เลือกหมวดหมู่ก่อน', 'f-cat') +
        stepCard(3, 'ชื่อสถานที่ *', '', T.main, s3, dim, '', 'เลือกหมวดหมู่ก่อน', 'f-cat') +
        stepCard(4, 'ประเมินคุณภาพ', 'ไม่บังคับ', T.main, s4, dim, '', 'เลือกหมวดหมู่ก่อน', 'f-cat') + '</div>' +
        '<div class="ffoot"><div class="fprog"><span>คุณภาพหมุด <b>' + st.done + '</b>/7 · ' + st.praise + '</span><em style="color:' + T.main + '">' + st.right + '</em></div>' +
        '<div class="fbar"><i style="width:' + (st.done / 7 * 100).toFixed(1) + '%;background:linear-gradient(90deg,' + T.main + ',' + T.dark + ')"></i></div>' +
        '<button class="fsave' + (st.ok ? '' : ' off') + '" data-a="f-save" style="background:linear-gradient(135deg,' + T.main + ',' + T.dark + ')">' +
        '<b>📍 บันทึกสถานที่</b><small>รับ +35 คะแนนสุทธิ (+40 หัก 5 เข้ากองทุนภาค)</small></button></div>' +
        '<div class="d-shw' + (F.picker ? ' on' : '') + '" data-a="f-pclose"><div class="d-sh" role="dialog">' + (F.picker ? this.picker() : '') + '</div></div>';
    },
    picker: function () {
      var g = F.pg, keys = g === 'daily' ? DAILY : TRAVEL, ac = g === 'daily' ? '#10b981' : '#1a56db';
      return '<div class="d-handle"></div><h4>เลือกหมวดหมู่</h4><div class="cat-tabs"><button data-a="f-pg" data-g="daily"' + (g === 'daily' ? ' class="on"' : '') + '>ชีวิตประจำวัน</button>' +
        '<button data-a="f-pg" data-g="travel"' + (g === 'travel' ? ' class="on tr"' : '') + '>ท่องเที่ยว</button></div><div class="pk">' +
        keys.map(function (k) { return '<button class="pk-r' + (F.cat === k ? ' on' : '') + '" style="--ac:' + ac + '" data-a="f-pick" data-k="' + k + '">' + catIcon(k) + '<span>' + NAMETH[k] + '</span></button>'; }).join('') + '</div>';
    },
    renderForm: function (host) {
      var box = host.querySelector('.d-form'); if (!box) return;
      var b = box.querySelector('.fbody'), top = b ? b.scrollTop : 0, pk = box.querySelector('.d-sh'), ptop = pk ? pk.scrollTop : 0;
      box.innerHTML = this.form();
      var b2 = box.querySelector('.fbody'); if (b2) b2.scrollTop = top;
      var pk2 = box.querySelector('.d-sh'); if (pk2) pk2.scrollTop = ptop;
      updateLock();
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
    openPlace: function (i) {
      var host = HOSTS.map, p = PLACES[i]; if (!host || !p) return;
      M.touched = true; if (p.km > M.km) M.km = [1, 2, 3, 5, 10].filter(function (k) { return k >= p.km; })[0] || 10;
      if (M.cat && M.cat !== p.k) M.cat = null;
      render('map', true); sheet(host, this.placeSheet(p));
    },
    on: function (a, el, host) {
      var self = this;
      if (a === 'km') { M.km = +el.getAttribute('data-k'); return render('map'); }
      if (a === 'cats') return sheet(host, this.catSheet());
      if (a === 'grp') { M.group = el.getAttribute('data-g'); return sheet(host, this.catSheet()); }
      if (a === 'cat') {
        M.cat = el.getAttribute('data-k') || null; sheet(host, null);
        if (M.cat && !isTravel(M.cat) && M.mode === 'travel') M.mode = 'daily';
        if (M.cat && !mList().length) { var p = PLACES.filter(function (x) { return x.k === M.cat; })[0]; if (p) M.km = [1, 2, 3, 5, 10].filter(function (k) { return k >= p.km; })[0] || 10; }
        setTimeout(function () { render('map', true); if (M.cat && !mList().length) toast(host, 'ยังไม่มีหมุดหมวดนี้ในตัวอย่าง'); }, 180);
        return;
      }
      if (a === 'pin') { M.touched = true; var pl = PLACES[+el.getAttribute('data-i')]; render('map'); return sheet(host, this.placeSheet(pl)); }
      if (a === 'shclose') return sheet(host, null);
      if (a === 'close' || a === 'go') return go(a === 'go' ? +el.getAttribute('data-i') : 2);
      if (a === 'plus') return toast(host, 'ในแอปจะเปิดเมนู "สร้างอะไรดีวันนี้?"');
      if (a === 'mode') { M.mode = el.getAttribute('data-v'); M.group = M.mode === 'travel' ? 'travel' : 'daily'; M.cat = null; M.zoom = 1; return render('map', true); }
      if (a === 'src') { var sv = el.getAttribute('data-v'); if (sv === 'google') return toast(host, 'ในแอปค้นหมุด Google ได้ (ใช้คะแนน)'); M.src = sv; return render('map', true); }
      if (a === 'chip') { M.cat = el.getAttribute('data-k') || null; return render('map', true); }
      if (a === 'mzin' || a === 'mzout' || a === 'mloc') { M.zoom = a === 'mloc' ? 1 : Math.max(0.6, Math.min(2.2, M.zoom * (a === 'mzin' ? 1.35 : 1 / 1.35))); return render('map', true); }
      if (a === 'full') {
        M.full = true; var fb = host.querySelector('.mp-full'); fb.innerHTML = this.fullHtml();
        requestAnimationFrame(function () { fb.classList.add('on'); updateLock(); });
        return;
      }
      if (a === 'fclose') { M.full = false; host.querySelector('.mp-full').classList.remove('on'); return updateLock(); }
      // ── ฟอร์มเพิ่มสถานที่ ──
      if (a === 'add') {
        M.fabSeen = true; F.open = true; F.picker = false; fReset();
        var box = host.querySelector('.d-form'); host.querySelector('.apf .core').classList.remove('d-pulse');
        box.innerHTML = this.form(); requestAnimationFrame(function () { box.classList.add('on'); updateLock(); });
        return;
      }
      if (a === 'f-close') { F.open = false; F.picker = false; host.querySelector('.d-form').classList.remove('on'); return updateLock(); }
      if (a === 'f-cat') { F.picker = true; F.pg = F.cat && isTravel(F.cat) ? 'travel' : 'daily'; return this.renderForm(host); }
      if (a === 'f-pclose') { F.picker = false; return this.renderForm(host); }
      if (a === 'f-pg') { F.pg = el.getAttribute('data-g'); return this.renderForm(host); }
      if (a === 'f-pick') { var nk = el.getAttribute('data-k'); if (nk !== F.cat) F.name = ''; F.cat = nk; F.picker = false; return this.renderForm(host); }
      if (a === 'f-photo') { if (F.photos.length < 30) F.photos.push(F.photos.length); return this.renderForm(host); }
      if (a === 'f-name') { F.name = el.getAttribute('data-v'); return this.renderForm(host); }
      if (a === 'f-star') { var k = el.getAttribute('data-k'), v = +el.getAttribute('data-v'); F.r[k] = F.r[k] === v ? null : v; return this.renderForm(host); }
      if (a === 'f-save') {
        var st = fState();
        if (!st.ok) return toast(host, st.right);
        var np = { k: F.cat, n: F.name, km: 0.25, a: Math.round(Math.random() * 360), open: 'เพิ่งปักหมุด', isNew: true, rt: 5.0 };
        if (isTravel(np.k) !== (M.mode === 'travel') && M.mode === 'travel') M.mode = 'daily';
        PLACES.push(np); M.touched = true; if (M.cat && M.cat !== np.k) M.cat = null;
        F.open = false; F.picker = false; fReset();
        host.querySelector('.d-form').classList.remove('on'); updateLock();
        setTimeout(function () { render('map', true); PLACES.forEach(function (p) { p.isNew = false; }); toast(host, 'ตัวอย่าง — ในแอปจะได้รับ +35 คะแนน'); if (built.home) render('home', true); }, 260);
        return;
      }
      var msg = { navi: 'ในแอปจะเปิดการนำทาง', detail: 'ในแอปดูรีวิว เวลาเปิด และรูปจากคนในพื้นที่' }[a];
      if (msg) toast(host, msg);
    }
  };

  /* ---------- 5) แผนที่เหตุการณ์ + ฟอร์มแจ้งเหตุ (IncidentReportScreen) ---------- */
  var A = { f: null, otherD: null, added: [] };
  var ALL_TYPES = ['flood', 'fire', 'accident', 'medical', 'crime', 'road', 'blackout', 'no_water', 'lost_person', 'lost_pet', 'lost_item', 'other'];
  var EXAMPLES = {
    flood: ['น้ำท่วมถนน', 'น้ำสูงประมาณเข่า', 'รถเล็กผ่านไม่ได้', 'น้ำกำลังขึ้น'], fire: ['ไฟไหม้บ้าน', 'ควันหนา', 'ไฟไหม้หญ้า', 'รถดับเพลิงมาแล้ว'],
    accident: ['รถชน', 'มีผู้บาดเจ็บ', 'รถติดสะสม', 'ขวางช่องทาง'], medical: ['มีคนหมดสติ', 'ต้องการรถพยาบาล', 'แจ้ง 1669 แล้ว'],
    crime: ['ลักทรัพย์', 'ทะเลาะวิวาท', 'พบคนน่าสงสัย', 'แจ้ง 191 แล้ว'], road: ['ปิดบางช่องทาง', 'รถติดสะสม', 'ชะลอความเร็ว', 'ใช้ทางเลี่ยง'],
    blackout: ['ไฟดับทั้งซอย', 'ไฟดับเป็นช่วง ๆ', 'เสาไฟล้ม', 'แจ้งการไฟฟ้าแล้ว'], no_water: ['น้ำไม่ไหลทั้งหมู่บ้าน', 'น้ำไหลอ่อน', 'ท่อแตก'],
    lost_person: ['เด็กหาย', 'ผู้สูงอายุหาย', 'สวมเสื้อสี…', 'พบเห็นครั้งสุดท้าย…'], lost_pet: ['สุนัขหาย', 'แมวหาย', 'ใส่ปลอกคอ', 'ติดต่อเจ้าของได้ที่…'],
    lost_item: ['กระเป๋าหาย', 'บัตรประชาชนหาย', 'ทำหายแถว…'], other: ['รถชน', 'ไฟไหม้บ้าน', 'น้ำท่วมถนน', 'ไฟดับทั้งหมู่บ้าน']
  };
  var RF = { open: false, type: null, photos: [], detail: '', pin: true, loc: false };
  function rReset() { RF.type = null; RF.photos = []; RF.detail = ''; RF.pin = true; RF.loc = false; }
  function rState() {
    var q = [['type', !!RF.type, true], ['photos', RF.photos.length >= 1, false], ['detail', RF.detail.length > 0, true], ['location', RF.pin && RF.loc, false]];
    var done = q.filter(function (x) { return x[1]; }).length, miss = q.filter(function (x) { return x[2] && !x[1]; })[0], und = q.filter(function (x) { return !x[1]; })[0];
    var REQ = { type: 'ประเภทเหตุการณ์', detail: 'รายละเอียด' }, TIP = { photos: 'เพิ่มรูปหลักฐาน', location: 'ปักตำแหน่งเหตุการณ์' };
    return { done: done, ok: !miss, right: miss ? 'ต้องกรอก: ' + REQ[miss[0]] : und ? 'แนะนำ: ' + TIP[und[0]] : '✅ พร้อมโพสต์' };
  }
  function incidents() {
    var o = A.otherD || [S.dn, S.dn, S.dn];
    return A.added.concat([
      { t: 'accident', ti: 'รถชนกัน 2 คัน แยกไฟแดงกลางเมือง', d: S.dn, at: '12 นาที', x: 20, y: -4 },
      { t: 'fire', ti: 'ไฟไหม้หญ้าข้างทางเลี่ยงเมือง', d: o[0], at: '15 นาที', x: -28, y: -8 },
      { t: 'flood', ti: 'น้ำท่วมขังทางลอดหน้าตลาด', d: S.dn, at: '40 นาที', x: -6, y: 12 },
      { t: 'road', ti: 'ปิดซ่อมถนนเลนซ้าย ถึง 18:00', d: o[1], at: '3 ชม.', x: 32, y: 18 },
      { t: 'accident', ti: 'รถจักรยานยนต์ล้ม ทางโค้งขึ้นดอย', d: o[2], at: '2 ชม.', x: -34, y: 27 },
      { t: 'flood', ti: 'น้ำเอ่อล้นตลิ่ง ซอย 5', d: o[0], at: '4 ชม.', x: 12, y: 28 }
    ]);
  }
  SC.alert = {
    html: function () {
      var all = incidents(), list = all.filter(function (x) { return !A.f || x.t === A.f; });
      var chips = [[null, 'ทั้งหมด', '']].concat(['flood', 'fire', 'accident', 'road'].map(function (k) { return [k, INC[k].n, INC[k].e]; })).map(function (c) {
        return '<button class="chip' + (A.f === c[0] ? ' on' : '') + '" data-a="f" data-k="' + (c[0] || '') + '">' + (c[2] ? em(c[2]) : '') + c[1] + '</button>';
      }).join('');
      var types = ALL_TYPES.filter(function (k) { return all.some(function (x) { return x.t === k; }); });
      var counts = types.map(function (k) { return '<span>' + em(INC[k].e) + '<b>' + all.filter(function (x) { return x.t === k; }).length + '</b></span>'; }).join('');
      var pins = all.map(function (x, i) {
        var T = INC[x.t], fill = (x.t === 'fire' || x.t === 'accident') ? '#dc2626' : '#f97316', vis = list.indexOf(x) >= 0;
        var cls = (vis ? '' : ' hid') + (x.isNew ? ' new' : '');
        return '<button class="d-ipin' + cls + '" data-a="inc" data-i="' + i + '" style="left:calc(50% + ' + x.x + 'cqw);top:calc(50% + ' + x.y + 'cqw)" aria-label="' + esc(x.ti) + '">' +
          '<svg viewBox="0 0 30 38"><path d="M15 37C15 37 2 23 2 14a13 13 0 0 1 26 0c0 9-13 23-13 23z" fill="' + fill + '" stroke="#fff" stroke-width="2"/></svg>' +
          '<span class="em">' + em(T.e) + '</span></button>';
      }).join('');
      var items = list.slice(0, 5).map(function (x) {
        var T = INC[x.t];
        return '<button class="al-item' + (x.isNew ? ' new' : '') + '" data-a="inc" data-i="' + all.indexOf(x) + '" style="--c:' + T.c + '"><span class="ti">' + em(T.e) + '</span>' +
          '<span class="tx"><b>' + esc(x.ti) + '</b><small>' + T.n + ' · ' + (S.bkk ? 'เขต' : 'อ.') + esc(x.d) + ' · ' + x.at + '</small></span>' + ic('chev-r') + '</button>';
      }).join('') || '<div class="loc-empty" style="height:5em">ยังไม่มีเหตุการณ์ประเภทนี้ในตัวอย่าง</div>';
      all.forEach(function (x) { x.isNew = false; });
      return '<div class="dm d-alert">' +
        '<div class="al-hd"><div class="tt"><b>แผนที่เหตุการณ์</b><small>' + ic('pin') + esc(S.bkk ? S.pn : 'จังหวัด' + S.pn) + '</small></div>' +
        '<button class="hb" data-a="tel" aria-label="เบอร์ฉุกเฉิน">' + ic('tel') + '</button>' +
        '<button class="hb" data-a="top" aria-label="แผนที่แจ้งเหตุ">' + ic('pinmap') + '</button>' +
        '<button class="rep' + (RF.seen ? '' : ' d-pulse') + '" data-a="report">＋ แจ้งเหตุ</button>' +
        '<svg class="wv" viewBox="0 0 100 13" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13 L0 0 Q 50 24 100 0 L100 13 Z" fill="#fff"/></svg></div>' +
        '<div class="al-top"><div class="chips">' + chips + '</div><div class="al-counts">' + counts + '</div></div>' +
        '<div class="d-scroll"><div class="al-map d-mapc">' + cityMap() + pins + '</div>' +
        '<div class="al-list"><h4>เหตุการณ์ล่าสุด</h4>' + items + '</div></div>' + SHEET +
        '<div class="d-form' + (RF.open ? ' on' : '') + '" role="dialog" aria-label="แจ้งเหตุในพื้นที่">' + (RF.open ? this.form() : '') + '</div>' + TOAST + '</div>';
    },
    form: function () {
      var C = { main: '#d32f2f', dark: '#8e0e14', bg: '#fbf3f3' }, dim = !RF.type, st = rState(), T = RF.type ? INC[RF.type] : null;
      var grid = '<div class="tg">' + ALL_TYPES.map(function (k) {
        var t = INC[k], on = RF.type === k;
        return '<button class="tc' + (on ? ' on' : '') + '" style="--c:' + t.c + '" data-a="r-type" data-k="' + k + '">' + em(t.e) + '<span>' + t.n + '</span></button>';
      }).join('') + '</div>';
      var s2 = '<div class="slots">' + photoSlots(RF.photos, ['จุดเกิดเหตุ', 'มุมกว้าง', 'ใกล้ ๆ'], T ? em(T.e) : em('🚨'), 'r-photo') + '</div>';
      var s3 = '<div class="fld tall" style="--c:' + C.main + '">' + ic('file') + '<span class="' + (RF.detail ? 'v' : 'pl') + '">' + esc(RF.detail || 'อธิบายสถานการณ์ เช่น จุดเกิดเหตุ ความรุนแรง สิ่งที่ต้องการความช่วยเหลือ...') + '</span></div>' +
        (RF.type ? '<div class="ex-l">ตัวอย่าง:</div><div class="chips pre">' + EXAMPLES[RF.type].map(function (x) {
          return '<button class="chip" style="--ac:' + C.main + '" data-a="r-ex" data-v="' + esc(x) + '">' + esc(x) + '</button>';
        }).join('') + '</div>' : '');
      var s4 = '<div class="pinrow"><small>' + (RF.pin ? 'GPS ปักให้อัตโนมัติ · เลื่อนแผนที่เพื่อย้ายหมุด' : 'ไม่ระบุจุดเกิดเหตุ') + '</small>' +
        '<button class="tgl' + (RF.pin ? ' on' : '') + '" data-a="r-pin">' + ic('pin', RF.pin ? 'f' : '') + (RF.pin ? 'ปักหมุด' : 'ไม่ปัก') + '</button></div>' +
        (RF.pin ? '<div class="rmap d-mapc">' + cityMap() + '<span class="cpin">' + (T ? em(T.e) : em('📍')) + '</span></div>' +
          '<button class="lbtn' + (RF.loc ? '' : ' d-pulse') + '" data-a="r-loc">' + ic('locate') + 'ใช้ตำแหน่งปัจจุบัน</button>' +
          '<div class="addr">' + ic('pin', 'f') + '<div><b>' + (RF.loc ? esc(dLabel() + ' ' + pLabel()) : 'ยังไม่ระบุตำแหน่ง') + '</b><small>เลื่อนแผนที่ให้หมุดอยู่ตรงจุดเกิดเหตุ · ที่อยู่อัปเดตอัตโนมัติ</small></div></div>' : '');
      return waveHead(C.main, C.dark, C.bg, '<span class="fic">' + em('🚨') + '</span>', 'แจ้งเหตุในพื้นที่', 'ช่วยกันดูแลชุมชนของเรา',
        '<button class="fbtn" data-a="r-info" aria-label="วิธีแจ้งเหตุ">' + ic('info') + '</button><button class="fbtn" data-a="r-close" aria-label="ปิด">' + ic('x') + '</button>') +
        '<div class="fbody" style="background:' + C.bg + '">' +
        stepCard(1, 'ประเภทเหตุการณ์ *', '', C.main, grid, false, RF.type ? '' : '👆 เริ่มจากเลือกประเภทเหตุ — ระบบจะแนะนำข้อความให้เอง') +
        stepCard(2, 'รูปภาพ (ถ้ามี)', RF.photos.length + '/30 รูป · ไม่บังคับ', C.main, s2, dim, '', 'เลือกประเภทเหตุก่อน', 'r-dim') +
        stepCard(3, 'รายละเอียดเหตุการณ์ *', RF.detail.length + '/500', C.main, s3, dim, '', 'เลือกประเภทเหตุก่อน', 'r-dim') +
        stepCard(4, 'ตำแหน่งเหตุการณ์', '', C.main, s4, dim, '', 'เลือกประเภทเหตุก่อน', 'r-dim') + '</div>' +
        '<div class="ffoot"><div class="fprog"><span>ขั้นตอน <b>' + st.done + '</b>/4</span><em style="color:' + C.main + '">' + st.right + '</em></div>' +
        '<div class="fbar"><i style="width:' + (st.done / 4 * 100) + '%;background:linear-gradient(90deg,' + C.main + ',' + C.dark + ')"></i></div>' +
        '<button class="fsave' + (st.ok ? '' : ' off') + '" data-a="r-post" style="background:linear-gradient(135deg,' + C.main + ',' + C.dark + ')"><b>🚨 โพสต์แจ้งเหตุ</b></button></div>';
    },
    renderForm: function (host) {
      var box = host.querySelector('.d-form'); if (!box) return;
      var b = box.querySelector('.fbody'), top = b ? b.scrollTop : 0;
      box.innerHTML = this.form();
      var b2 = box.querySelector('.fbody'); if (b2) b2.scrollTop = top;
    },
    detail: function (i) {
      var x = incidents()[i], T = INC[x.t];
      return '<div class="al-pic" style="background:linear-gradient(135deg,' + T.c + '33,' + T.c + '66)">' +
        '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q25 22 50 28 T100 26 V40 H0z" fill="#fff" opacity=".35"/><path d="M0 34 Q30 30 60 35 T100 33 V40 H0z" fill="#fff" opacity=".5"/></svg>' +
        em(T.e) + '<button class="d-x" style="position:absolute;right:1em;top:1em;font-size:.28em;background:rgba(0,0,0,.45)" data-a="shclose" aria-label="ปิด">' + ic('x') + '</button></div>' +
        '<div class="pl-name">' + esc(x.ti) + '</div>' +
        '<div class="pl-meta"><span>' + em(T.e) + ' ' + T.n + '</span><span>' + (S.bkk ? 'เขต' : 'อ.') + esc(x.d) + '</span><span>' + x.at + (x.at === 'เมื่อสักครู่' ? '' : 'ที่แล้ว') + '</span></div>' +
        '<div class="al-warn">' + ic('alert') + '<span>' + T.w + '</span></div>' +
        '<div class="pl-btns"><button class="d-btn p" data-a="navi">' + ic('nav') + 'นำทาง</button><button class="d-btn o" data-a="onmap" data-i="' + i + '">' + ic('map') + 'ดูบนแผนที่</button></div>';
    },
    telSheet: function () {
      var row = function (e, n, name, big) { return '<div class="tel' + (big ? ' big' : '') + '">' + em(e) + '<div><b>' + n + '</b><small>' + name + '</small></div></div>'; };
      return '<h4>📞 เบอร์ฉุกเฉิน & วิธีแจ้งเหตุ</h4>' + row('🚓', '191', 'ตำรวจ · เหตุด่วนเหตุร้าย', true) +
        '<div class="tel2">' + row('🚒', '199', 'ดับเพลิง / กู้ภัย') + row('🚑', '1669', 'การแพทย์ฉุกเฉิน') + '</div>' +
        '<div class="al-warn">' + ic('info') + '<span>แอปนี้ช่วยกระจายข่าวในชุมชน ไม่ใช่สายด่วนฉุกเฉิน</span></div>' +
        '<button class="d-btn p" style="width:100%" data-a="shclose">เข้าใจแล้ว</button>';
    },
    on: function (a, el, host) {
      if (a === 'f') { A.f = el.getAttribute('data-k') || null; return render('alert'); }
      if (a === 'inc') return sheet(host, this.detail(+el.getAttribute('data-i')));
      if (a === 'shclose') return sheet(host, null);
      if (a === 'tel') return sheet(host, this.telSheet());
      if (a === 'top') { var sc = host.querySelector('.d-alert .d-scroll'); if (sc) sc.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
      if (a === 'onmap') {
        sheet(host, null);
        var i = el.getAttribute('data-i'), sc2 = host.querySelector('.d-alert .d-scroll'), pin = host.querySelector('.d-ipin[data-i="' + i + '"]');
        if (sc2) sc2.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        if (pin && !reduce) { pin.classList.remove('blink'); void pin.offsetWidth; pin.classList.add('blink'); }
        return;
      }
      if (a === 'navi') return toast(host, 'ในแอปจะเปิดการนำทาง');
      // ── ฟอร์มแจ้งเหตุ ──
      if (a === 'report') {
        RF.seen = true; RF.open = true; rReset(); el.classList.remove('d-pulse');
        var box = host.querySelector('.d-form'); box.innerHTML = this.form();
        requestAnimationFrame(function () { box.classList.add('on'); updateLock(); });
        return;
      }
      if (a === 'r-close') { RF.open = false; host.querySelector('.d-form').classList.remove('on'); return updateLock(); }
      if (a === 'r-info') return toast(host, 'ในแอปมีคู่มือ: เลือกประเภท · เขียนรายละเอียด · แนบรูป · ตรวจตำแหน่ง');
      if (a === 'r-dim') return toast(host, 'เลือกประเภทเหตุก่อน');
      if (a === 'r-type') { RF.type = el.getAttribute('data-k'); return this.renderForm(host); }
      if (a === 'r-photo') { if (RF.photos.length < 30) RF.photos.push(RF.photos.length + 1); return this.renderForm(host); }
      if (a === 'r-ex') { var x = el.getAttribute('data-v'); RF.detail = (RF.detail ? RF.detail + ' ' : '') + x; RF.detail = RF.detail.slice(0, 500); return this.renderForm(host); }
      if (a === 'r-pin') { RF.pin = !RF.pin; return this.renderForm(host); }
      if (a === 'r-loc') { RF.loc = true; return this.renderForm(host); }
      if (a === 'r-post') {
        var st = rState(); if (!st.ok) return toast(host, st.right);
        A.added.unshift({ t: RF.type, ti: RF.detail, d: S.dn, at: 'เมื่อสักครู่', x: -16, y: 2, isNew: true });
        A.f = null; RF.open = false; rReset();
        host.querySelector('.d-form').classList.remove('on'); updateLock();
        setTimeout(function () { render('alert'); toast(host, 'ตัวอย่าง — ในแอปจะแจ้งเตือนคนในพื้นที่'); }, 260);
      }
    },
    init: function () { loadOtherDistricts(); }
  };
  function loadOtherDistricts() {
    var pid = S.p;
    dmap(pid).then(function (m) {
      if (S.p !== pid) return;
      var names = Object.keys(m.d).filter(function (k) { return k !== S.d; }).map(function (k) { return m.d[k].n; });
      A.otherD = [names[0] || S.dn, names[1] || S.dn, names[2] || S.dn];
      if (built.alert && !RF.open) render('alert');
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
      if ((el.classList.contains('d-shw') || el.classList.contains('pv-ov')) && e.target !== el) return;
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
  document.addEventListener('siamdemo:slide', function (e) {
    Array.prototype.forEach.call(hosts, function (h, i) {
      if (i === e.detail) return;
      Array.prototype.forEach.call(h.querySelectorAll('.d-shw.on'), function (w) { w.classList.remove('on'); });
      var name = NAME[h.getAttribute('data-screen')], f = h.querySelector('.d-form.on');
      if (name === 'home' && H.pending) { H.pending = null; render('home', true); }
      if (name === 'map' && M.full) { M.full = false; var mf = h.querySelector('.mp-full.on'); if (mf) mf.classList.remove('on'); }
      if (f) { f.classList.remove('on'); if (name === 'map') { F.open = false; F.picker = false; } if (name === 'alert') RF.open = false; }
    });
    updateLock();
  });
  document.addEventListener('siamdemo:go', function (e) {
    var h = hosts[e.detail]; if (h) build(h);
  });
})();
