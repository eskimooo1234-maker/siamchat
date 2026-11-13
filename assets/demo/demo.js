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
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    reorder: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'
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
    var open = !!document.querySelector('.demo-host .d-shw.on, .demo-host .d-form.on, .demo-host .pv-ov, .demo-host .mp-full.on, .demo-host .ovl.on, .demo-host .co-w.on');
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

  /* ---------- 2) เลือกพื้นที่ 3 ขั้น (RegionSelectionScreen · ProvinceSelectionScreen · DistrictMapView) ---------- */
  // แผนที่ 3 มิติแบบแอป (components/map3d/Map3D.tsx): A เงาพื้น (6,12 · .14) · B ความหนา 4 ชั้น (1,2)…(4,8) · .35 · C หน้าบน
  // ตัวที่เลือก "ลอย" ขึ้น 12 หน่วยใน ~240ms (useLiftReveal: 6 ขั้น × 40ms) + กรอบทอง + ลายเส้นเฉียง + เส้นแบ่งย่อยค่อย ๆ ขึ้น
  var LTHEME = { // ProvinceSelectionScreen / DistrictMapView: REGION_THEME + PAGE_BG
    north:     { from: '#22c55e', to: '#0f6a3d', light: '#bbf7d0', dark: '#15803d', bg: '#eef6f0' },
    northeast: { from: '#f59e0b', to: '#b45309', light: '#fde68a', dark: '#b45309', bg: '#fbf3e8' },
    central:   { from: '#2f6bff', to: '#0b2a7a', light: '#bfd0fb', dark: '#1e3a8a', bg: '#eef2fb' },
    south:     { from: '#22b8c4', to: '#0e7490', light: '#a5e6ec', dark: '#0e7490', bg: '#eaf6f8' }
  };
  var RLAB = { // RegionSelectionScreen LABELS (viewBox -95 0 490 552)
    north: { x: -88, y: 70, a: 'start', ax: -6 }, central: { x: -88, y: 250, a: 'start', ax: -6 },
    northeast: { x: 388, y: 130, a: 'end', ax: 306 }, south: { x: 388, y: 455, a: 'end', ax: 306 }
  };
  // ป้ายบนแผนที่ใหญ่กว่าแอป (จอในเว็บเล็กกว่ามือถือจริง · ตัวหนังสืออื่นในเดโมก็ขยายราว 1.4 เท่า)
  var LIFT = 12, GOLD_EDGE = '#d9b45a', LBL = 1.4, RLBL = 1.3;
  var L = { step: 1, r: null, p: null, d: null, dm: null, pm: null, zoom: 1, cx: null, cy: null, anim: false };
  function lclamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function dFull(n) { return n.indexOf('เขต') === 0 ? n : 'อ.' + n; }
  function dShown(n) { return n.replace(/^เขต/, ''); }
  function th(r) { return GEO.provinces[r]; }

  // svg ของแผนที่ 3 มิติ · o = { vb, areas:[{id,d}], faces:[{id,d,fill,op,stroke,sw}], dark(id), sel, selFill, lines:[d], lw, defs, under, selLabel, top }
  function map3d(o) {
    var s = '<svg class="m3" viewBox="' + o.vb + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs><pattern id="m3d-diag" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">' +
      '<line x1="0" y1="0" x2="0" y2="8" stroke="#fff" stroke-opacity=".12" stroke-width="2"/></pattern>' + (o.defs || '') + '</defs>';
    var g = '';
    o.areas.forEach(function (a) { if (a.id !== o.sel) g += '<path d="' + a.d + '" fill="' + o.dark(a.id) + '"/>'; });
    s += '<g transform="translate(6 12)" opacity=".14" pointer-events="none">' + g + '</g>';
    [[1, 2], [2, 4], [3, 6], [4, 8]].forEach(function (t) { s += '<g transform="translate(' + t[0] + ' ' + t[1] + ')" opacity=".35" pointer-events="none">' + g + '</g>'; });
    o.faces.forEach(function (f) {
      if (f.id === o.sel) return;
      s += '<path class="fc" data-a="pick" data-id="' + f.id + '" d="' + f.d + '" fill="' + f.fill + '" fill-opacity="' + (f.op == null ? 1 : f.op) + '" stroke="' + (f.stroke || '#fff') + '" stroke-width="' + (f.sw || 1.3) + '"><title>' + esc(f.t || '') + '</title></path>';
    });
    s += o.under || '';
    var a = o.sel ? o.areas.filter(function (x) { return x.id === o.sel; })[0] : null;
    if (a) {
      var dk = o.dark(a.id), key = L.step + ':' + a.id, up = (L.anim ? '' : ' up') + (L.rvKey === key ? ' rv' : ''), sides = '';
      for (var i = 1; i <= 8; i++) sides += '<path class="sd' + (i > 4 ? ' x' : '') + '" transform="translate(' + i + ' ' + i * 2 + ')" d="' + a.d + '" fill="' + dk + '" opacity=".35"/>';
      s += '<g class="m3-sel' + up + '" data-k="' + key + '">' +
        '<g class="sh" pointer-events="none"><path d="' + a.d + '" fill="' + dk + '"/></g>' +
        '<g class="lf">' + '<g pointer-events="none">' + sides + '</g>' +
        '<path data-a="pick" data-id="' + a.id + '" d="' + a.d + '" fill="' + o.selFill + '" stroke="' + GOLD_EDGE + '" stroke-width="3"/>' +
        '<path d="' + a.d + '" fill="url(#m3d-diag)" pointer-events="none"/>';
      if (o.lines && o.lines.length) {
        var n = o.lines.length, gap = Math.min(60, 900 / n);
        s += '<g pointer-events="none">' + o.lines.map(function (d, k) {
          return '<path class="ln" style="transition-delay:' + Math.round(240 + k * gap) + 'ms" d="' + d + '" fill="none" stroke="#fff7d6" stroke-width="' + o.lw + '"/>';
        }).join('') + '</g>';
      }
      s += (o.selLabel || '') + '</g></g>';
    }
    return s + (o.top || '') + '</svg>';
  }
  function grad(id, a, b) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  // viewBox หลังซูม (ProvinceSelectionScreen: กว้าง 300 · ซูม 1–5 เท่า · กล้องไม่ออกนอกแผนที่)
  function zvb(h) {
    var vw = 300 / L.zoom, vh = h / L.zoom, cx = L.cx == null ? 150 : L.cx, cy = L.cy == null ? h / 2 : L.cy;
    var vx = lclamp(cx - vw / 2, 0, 300 - vw), vy = lclamp(cy - vh / 2, 0, h - vh);
    return vx.toFixed(1) + ' ' + vy.toFixed(1) + ' ' + vw.toFixed(1) + ' ' + vh.toFixed(1);
  }
  function pill(x, y, name, color) {
    var z = L.zoom / LBL, fs = 9 / z, w = name.length * 9 / z * 0.58, cw = Math.max(w + 12 / z, 34 / z);
    return '<rect x="' + (x - cw / 2).toFixed(1) + '" y="' + (y - 8 / z).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + (16 / z).toFixed(1) + '" rx="' + (8 / z).toFixed(1) + '" fill="#fff" fill-opacity=".97" pointer-events="none"/>' +
      '<text x="' + x + '" y="' + (y + 3.2 / z).toFixed(1) + '" font-size="' + fs.toFixed(2) + '" font-weight="700" fill="' + color + '" text-anchor="middle">' + esc(name) + '</text>';
  }
  function miniCard(o) { // MiniIdCard
    return '<div class="lc' + (o.dim ? ' dim' : '') + '"' + (o.act ? ' data-a="' + o.act + '" data-id="' + o.id + '"' : '') + ' style="--c1:' + o.c1 + ';--c2:' + o.c2 + ';height:' + o.h + 'em">' +
      '<span class="fr"></span>' + (o.map ? '<span class="mp">' + o.map + '</span>' : '') +
      '<div class="tx" style="padding-right:' + (o.mw + 2) + 'em"><small>' + esc(o.k) + '</small><i class="gl"></i><b>' + esc(o.t) + '</b>' +
      (o.l3 ? '<span class="l3">' + esc(o.l3) + '</span>' : '') + (o.l4 ? '<span class="l4">' + esc(o.l4) + '</span>' : '') + '</div></div>';
  }
  function strip(cards, idx) { // แถวการ์ดแบบแอป (ไม่เลื่อนเอง · แตะใบที่โผล่ขวา = เลือกใบนั้น)
    return '<div class="lcs"><div class="lcr" style="transform:translateX(calc(' + Math.max(0, idx) + ' * (-100% + 1.48em)))">' + cards.join('') + '</div></div>';
  }
  function thMini(rk, h) { // RegionMapGraphic
    return '<svg viewBox="' + GEO.vb + '" style="height:' + h + 'em;width:' + (h * 300 / 552).toFixed(2) + 'em">' + ORDER.map(function (k) {
      return '<path d="' + GEO.regions[k].d + '" fill="' + (k === rk ? '#f5d27a' : 'rgba(255,255,255,.15)') + '" stroke="#fff" stroke-width="3"/>';
    }).join('') + '</svg>';
  }

  SC.loc = {
    html: function () {
      var st = L.step, hd, body = '', sheetH = '';
      if (!GEO) {
        return '<div class="dm d-loc">' + this.head(1) + '<div class="loc-map"><div class="loc-load">กำลังโหลดแผนที่…</div></div>' + TOAST + '</div>';
      }
      hd = this.head(st);
      if (st === 1) { body = this.s1map(); sheetH = this.s1sheet(); }
      else if (st === 2) { body = this.s2map(); sheetH = this.s2sheet(); }
      else { body = L.dm ? this.s3map() : '<div class="loc-load">กำลังโหลดแผนที่อำเภอ…</div>'; sheetH = this.s3sheet(); }
      var T = st > 1 ? LTHEME[L.r] : null;
      var hint = st === 1 ? 'แตะภาคบนแผนที่' : st === 2 ? 'แตะจังหวัดบนแผนที่' : 'แตะอำเภอบนแผนที่';
      return '<div class="dm d-loc' + (st > 1 ? ' s23' : '') + '"' + (T ? ' style="background:' + T.bg + '"' : '') + '>' + hd +
        '<div class="loc-top"><span>' + hint + '</span>' +
        '<button class="loc-me' + (st > 1 ? ' sq' : '') + '" data-a="me"' + (T ? ' style="color:' + T.dark + '"' : '') + '>' + em('📍') + 'ตำแหน่งฉัน</button></div>' +
        '<div class="loc-map' + (L.zoom > 1 ? ' zoomed' : '') + '">' + body +
        (st > 1 ? '<div class="loc-zoom"><button data-a="zin" aria-label="ขยายแผนที่">+</button><i></i><button data-a="zout" aria-label="ย่อแผนที่">−</button></div>' : '') +
        (st === 3 && L.dm ? '<span class="loc-credit">แผนที่เขต: geoBoundaries (CC BY 3.0 IGO)</span>' : '') + '</div>' +
        '<div class="loc-sheet"><div class="d-handle"></div>' + sheetH + '</div>' + TOAST + '</div>';
    },
    head: function (st) {
      var bg, lead, title, sub, R = L.r ? REG[L.r] : null;
      if (st === 1) {
        bg = 'linear-gradient(135deg,#2f6bff,#0b2a7a)';
        lead = '<span class="loc-ico">' + em('🗺️') + '</span>';
        title = 'เลือกภูมิภาคของคุณ'; sub = 'ขั้นตอนที่ 1 จาก 3 · พื้นที่ที่เลือกจะแสดงข่าวและชุมชนใกล้คุณ';
      } else {
        var T = LTHEME[L.r];
        bg = 'linear-gradient(135deg,' + T.from + ',' + T.to + ')';
        lead = '<button class="loc-back" data-a="back" aria-label="ย้อนกลับ">←</button>';
        if (st === 2) { title = '🗺️ เลือกจังหวัด · ' + R.n; sub = 'ขั้นตอนที่ 2 จาก 3 · ' + R.pc + ' จังหวัด · ' + R.dc + ' อำเภอ'; }
        else {
          var pv = th(L.r).list[L.p], bk = L.p === 'bkk';
          title = '🗺️ เลือกอำเภอ · ' + pv.n; sub = 'ขั้นตอนที่ 3 จาก 3 · ' + pv.c + (bk ? ' เขต' : ' อำเภอ') + ' · ' + R.n;
        }
      }
      return '<div class="d-hd loc-hd" style="background:' + bg + '"><div class="row">' + lead +
        '<div class="tt"><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></div>' +
        (st === 1 ? '<button class="loc-x" data-a="close" aria-label="ปิด">✕</button>' : '') + '</div>' +
        '<div class="loc-steps"><i class="on"></i><i' + (st > 1 ? ' class="on"' : '') + '></i><i' + (st > 2 ? ' class="on"' : '') + '></i></div></div>';
    },

    /* ---- ขั้น 1: 4 ภาค ---- */
    s1map: function () {
      var sel = L.r, defs = ORDER.map(function (id) { return grad('g-' + id, REG[id].c1, REG[id].c2); }).join('');
      var areas = ORDER.map(function (id) { return { id: id, d: GEO.regions[id].d }; });
      var faces = areas.map(function (a) { return { id: a.id, d: a.d, t: REG[a.id].n, fill: 'url(#g-' + a.id + ')', op: sel && sel !== a.id ? 0.55 : 1, stroke: '#fff', sw: 2.5 }; });
      // ชื่อภาคอยู่นอกแผนที่ + เส้นประไปจุดกลางภาค (จุดของภาคที่ลอยขึ้นตาม)
      var top = ORDER.map(function (id) {
        var lb = RLAB[id], lp = GEO.regions[id].lp, dk = REG[id].c1, on = id === sel;
        return '<g class="rl" data-a="pick" data-id="' + id + '">' +
          '<line x1="' + lb.ax + '" y1="' + (lb.y - 6) + '" x2="' + lp[0] + '" y2="' + (lp[1] - (on ? LIFT : 0)) + '" stroke="' + dk + '" stroke-width="1.2" stroke-dasharray="4 4" stroke-opacity=".7"/>' +
          '<circle class="' + (on ? 'dotup' + (L.anim ? '' : ' up') : '') + '" cx="' + lp[0] + '" cy="' + lp[1] + '" r="4.5" fill="' + dk + '" stroke="#fff" stroke-width="1.5"/>' +
          '<rect x="' + (lb.a === 'start' ? lb.x - 4 : lb.x - 100 * RLBL + 4) + '" y="' + (lb.y - 34 * RLBL) + '" width="' + 100 * RLBL + '" height="' + 62 * RLBL + '" fill="transparent"/>' +
          '<text x="' + lb.x + '" y="' + lb.y + '" font-size="' + ((on ? 27 : 22) * RLBL).toFixed(1) + '" font-weight="700" fill="' + dk + '" text-anchor="' + lb.a + '">' + REG[id].short + '</text>' +
          '<text x="' + lb.x + '" y="' + (lb.y + 20 * RLBL) + '" font-size="' + (12 * RLBL).toFixed(1) + '" fill="' + dk + '" fill-opacity=".65" text-anchor="' + lb.a + '">' + REG[id].icon + ' ' + REG[id].pc + ' จังหวัด</text></g>';
      }).join('');
      return map3d({ vb: '-95 0 490 552', areas: areas, faces: faces, dark: function (id) { return REG[id].c2; }, sel: sel, selFill: sel ? 'url(#g-' + sel + ')' : 'none',
        lines: sel ? GEO.ov[sel] : null, lw: 1.3, defs: defs, top: top });
    },
    s1sheet: function () {
      var idx = L.r ? ORDER.indexOf(L.r) : 0;
      var cards = ORDER.map(function (id, i) {
        var R = REG[id];
        return miniCard({ id: id, act: i !== idx ? 'pickc' : null, dim: L.r && L.r !== id, c1: R.c1, c2: R.c2, h: 9, k: R.icon + ' ภูมิภาคที่เลือก', t: R.n, l3: R.pc + ' จังหวัด · ' + R.dc + ' อำเภอ', map: thMini(id, 6.2), mw: 6.2 * 300 / 552 });
      });
      var dots = '<div class="loc-dots">' + ORDER.map(function (id) {
        return '<button data-a="pickc" data-id="' + id + '" aria-label="' + REG[id].n + '"' + (id === L.r ? ' class="on" style="background:' + REG[id].c1 + '"' : '') + '></button>';
      }).join('') + '</div>';
      var cta = L.r ? '<button class="loc-cta" data-a="confirm" style="background:linear-gradient(135deg,#2f6bff,#0b2a7a)">เลือก' + REG[L.r].n + ' ›</button>'
        : '<div class="loc-cta dis">เลือกภูมิภาค</div>';
      return strip(cards, idx) + dots + cta;
    },

    /* ---- ขั้น 2: จังหวัดในภาค ---- */
    s2map: function () {
      var P = th(L.r), T = LTHEME[L.r], R = REG[L.r], sel = L.p && P.list[L.p] ? L.p : null, z = L.zoom, fs = 8 * LBL / z;
      var ids = Object.keys(P.list), areas = ids.map(function (id) { return { id: id, d: P.list[id].d }; });
      var faces = areas.map(function (a) { return { id: a.id, d: a.d, t: P.list[a.id].n, fill: T.light, stroke: '#fff', sw: 1.3 }; });
      var under = ids.filter(function (id) { return id !== sel; }).map(function (id) {
        var e = P.list[id];
        if (e.l[2] < e.n.length * fs * 0.58) return '';
        return '<text class="lt" data-a="pick" data-id="' + id + '" x="' + e.l[0] + '" y="' + (e.l[1] + fs * 0.35).toFixed(1) + '" font-size="' + fs.toFixed(2) + '" font-weight="700" fill="' + T.dark + '" text-anchor="middle">' + esc(e.n) + '</text>';
      }).join('');
      var lines = sel && L.pm && L.pm.id === sel ? L.pm.m.ov : null;
      return map3d({ vb: zvb(P.h), areas: areas, faces: faces, dark: function () { return R.c2; }, sel: sel, selFill: 'url(#g-sel)',
        lines: lines, lw: 1.2, defs: grad('g-sel', R.c1, R.c2), under: under, selLabel: sel ? pill(P.list[sel].l[0], P.list[sel].l[1], P.list[sel].n, T.dark) : '' });
    },
    s2sheet: function () {
      var P = th(L.r), T = LTHEME[L.r], R = REG[L.r], ids = Object.keys(P.list), sel = L.p && P.list[L.p] ? L.p : null;
      if (!sel) return '<div class="lc-empty" style="background:' + T.bg + '">แตะจังหวัดบนแผนที่เพื่อเลือก</div><div class="loc-cta dis">เลือกจังหวัด</div>';
      var idx = ids.indexOf(sel), mh = 6.2, mw = mh * 300 / P.h;
      var cards = ids.map(function (id, i) {
        var e = P.list[id], near = Math.abs(i - idx) <= 1;
        return miniCard({ id: id, act: i !== idx ? 'pickc' : null, dim: id !== sel, c1: R.c1, c2: R.c2, h: 10.3, k: R.icon + ' จังหวัดที่เลือก', t: e.n,
          l3: e.c + (id === 'bkk' ? ' เขต' : ' อำเภอ') + ' · ' + R.n, l4: e.s ? e.s + ' …' : '', mw: mw,
          map: near ? '<svg viewBox="' + P.vb + '" style="height:' + mh + 'em;width:' + mw.toFixed(2) + 'em">' + ids.map(function (k) {
            return '<path d="' + P.list[k].d + '" fill="' + (k === id ? '#f5d27a' : 'rgba(255,255,255,.15)') + '" stroke="#fff" stroke-width="2"/>';
          }).join('') + '</svg>' : '' });
      });
      return strip(cards, idx) + '<p class="loc-pos">' + (idx + 1) + ' / ' + ids.length + '</p>' +
        '<button class="loc-cta" data-a="confirm" style="background:linear-gradient(135deg,' + T.from + ',' + T.to + ')">เลือก' + esc(P.list[sel].n) + ' ›</button>';
    },

    /* ---- ขั้น 3: อำเภอในจังหวัด ---- */
    s3map: function () {
      var M = L.dm, T = LTHEME[L.r], R = REG[L.r], sel = L.d && M.d[L.d] ? L.d : null, z = L.zoom, fs = 7 * LBL / z;
      var ids = Object.keys(M.d), areas = ids.map(function (id) { return { id: id, d: M.d[id].d }; });
      var faces = areas.map(function (a) { return { id: a.id, d: a.d, t: dFull(M.d[a.id].n), fill: T.light, stroke: '#fff', sw: 1 }; });
      var under = ids.filter(function (id) { return id !== sel; }).map(function (id) {
        var e = M.d[id], sh = dShown(e.n);
        if (e.l[2] < sh.length * fs * 0.58) return '';
        return '<text class="lt" data-a="pick" data-id="' + id + '" x="' + e.l[0] + '" y="' + (e.l[1] + fs * 0.35).toFixed(1) + '" font-size="' + fs.toFixed(2) + '" font-weight="700" fill="' + T.dark + '" text-anchor="middle">' + esc(sh) + '</text>';
      }).join('');
      return map3d({ vb: zvb(M.h), areas: areas, faces: faces, dark: function () { return R.c2; }, sel: sel, selFill: 'url(#d-sel)',
        defs: grad('d-sel', R.c1, R.c2), under: under, selLabel: sel ? pill(M.d[sel].l[0], M.d[sel].l[1], dShown(M.d[sel].n), T.dark) : '' });
    },
    s3sheet: function () {
      var T = LTHEME[L.r], R = REG[L.r], M = L.dm, pv = th(L.r).list[L.p];
      var sel = M && L.d && M.d[L.d] ? L.d : null;
      if (!sel) return '<div class="lc-empty" style="background:' + T.bg + '">แตะอำเภอบนแผนที่ หรือใช้ตำแหน่งปัจจุบัน</div><div class="loc-cta dis">เลือกอำเภอก่อน</div>';
      var ids = Object.keys(M.d), idx = ids.indexOf(sel), mh = 6.2, mw = mh * 300 / M.h;
      var cards = ids.map(function (id, i) {
        var near = Math.abs(i - idx) <= 1;
        return miniCard({ id: id, act: i !== idx ? 'pickc' : null, dim: id !== sel, c1: R.c1, c2: R.c2, h: 10.3, k: R.icon + ' อำเภอที่เลือก', t: dFull(M.d[id].n),
          l3: (L.p === 'bkk' ? '' : 'จ.') + pv.n + ' · ห้องแชทอำเภอพร้อมใช้', mw: mw,
          map: near ? '<svg viewBox="' + M.vb + '" style="height:' + mh + 'em;width:' + mw.toFixed(2) + 'em">' + ids.map(function (k) {
            return '<path d="' + M.d[k].d + '" fill="' + (k === id ? '#f5d27a' : 'rgba(255,255,255,.15)') + '" stroke="#fff" stroke-width="1.2"/>';
          }).join('') + '</svg>' : '' });
      });
      return strip(cards, idx) + '<p class="loc-pos">' + (idx + 1) + ' / ' + ids.length + '</p>' +
        '<button class="loc-cta" data-a="confirm" style="background:linear-gradient(135deg,' + T.from + ',' + T.to + ')">เลือก' + esc(dFull(M.d[sel].n)) + ' ›</button>';
    },

    // หลังวาด: ตัวที่เพิ่งเลือก "ลอยขึ้น" (transition 240ms) แล้วเส้นแบ่งย่อยค่อย ๆ ขึ้น
    after: function (host) {
      var self = this;
      L.anim = false;
      var g = host.querySelectorAll('.m3-sel, .dotup'), sel = host.querySelector('.m3-sel');
      var needRv = sel && !sel.classList.contains('rv') && sel.querySelector('.ln');
      if (needRv) L.rvKey = sel.getAttribute('data-k');
      if (g.length) {
        g[0].getBoundingClientRect();
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          Array.prototype.forEach.call(g, function (x) { x.classList.add('up'); });
          if (needRv) sel.classList.add('rv');
        }); });
      }
      // ซูมแล้วลากเลื่อนแผนที่ได้ (แบบแอป) · ไม่ซูม = ปัดสไลด์ได้ตามปกติ
      var mp = host.querySelector('.loc-map.zoomed');
      if (mp) {
        var svg = mp.querySelector('svg.m3');
        mp.addEventListener('pointerdown', function (e) {
          if (e.target.closest('.loc-zoom')) return;
          var sx = e.clientX, sy = e.clientY, moved = false, h = L.step === 2 ? th(L.r).h : L.dm.h;
          var vb = svg.viewBox.baseVal, ppu = Math.min(svg.clientWidth / vb.width, svg.clientHeight / vb.height);
          var cx0 = L.cx == null ? 150 : L.cx, cy0 = L.cy == null ? h / 2 : L.cy;
          // เริ่มจากกึ่งกลางที่มองเห็นจริง (กล้องถูกบีบไม่ให้ออกนอกแผนที่)
          cx0 = vb.x + vb.width / 2; cy0 = vb.y + vb.height / 2;
          function mv(ev) {
            var dx = ev.clientX - sx, dy = ev.clientY - sy;
            if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
            moved = true;
            L.cx = lclamp(cx0 - dx / ppu, vb.width / 2, 300 - vb.width / 2); L.cy = lclamp(cy0 - dy / ppu, vb.height / 2, h - vb.height / 2);
            svg.setAttribute('viewBox', zvb(h));
          }
          function upf() {
            window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', upf); window.removeEventListener('pointercancel', upf);
            if (moved) { self._noclick = Date.now(); }
          }
          window.addEventListener('pointermove', mv); window.addEventListener('pointerup', upf); window.addEventListener('pointercancel', upf);
        });
      }
    },
    loadProv: function (host, pid, thenStep3) {
      dmap(pid).then(function (m) {
        if (L.p !== pid) return;
        L.pm = { id: pid, m: m };
        if (thenStep3) { L.dm = m; if (!m.d[L.d]) L.d = null; L.anim = !!L.d; }
        else if (L.step === 2) L.anim = false;
        render('loc');
      }).catch(function () { toast(host, 'โหลดแผนที่อำเภอไม่สำเร็จ'); });
    },
    select: function (host, id, toggle) {
      var st = L.step, cur = st === 1 ? L.r : st === 2 ? L.p : L.d;
      var nv = toggle && cur === id ? null : id;
      if (nv === cur) return;
      if (st === 1) L.r = nv; else if (st === 2) L.p = nv; else L.d = nv;
      L.anim = !!nv; L.rvKey = null;
      // ซูมอยู่ → เลื่อนกล้องไปหาพื้นที่ที่เลือก
      if (nv && st > 1 && L.zoom > 1) { var e = st === 2 ? th(L.r).list[nv] : L.dm.d[nv]; L.cx = e.l[0]; L.cy = e.l[1]; }
      render('loc');
      if (st === 2 && nv && !(L.pm && L.pm.id === nv)) this.loadProv(host, nv, false);
    },
    on: function (a, el, host) {
      if (this._noclick && Date.now() - this._noclick < 350) return;
      if (a === 'close') return toast(host, 'ตัวอย่าง — ในแอปปุ่มนี้ปิดหน้าเปลี่ยนพื้นที่');
      if (!GEO) return;
      var st = L.step;
      if (a === 'me') {
        if (st === 1) {
          L.p = 'cm'; L.d = 'cm_mueang'; this.select(host, 'north');
          return toast(host, 'ตัวอย่าง — พบตำแหน่งของคุณในภาคเหนือ');
        }
        if (st === 2) {
          if (L.r === 'north') { this.select(host, 'cm'); return toast(host, 'ตัวอย่าง — พบตำแหน่งของคุณ: เชียงใหม่'); }
          return toast(host, 'ตัวอย่าง — ตำแหน่งของคุณอยู่ที่ เชียงใหม่ (ภาคเหนือ)');
        }
        if (L.p === 'cm' && L.dm) { this.select(host, 'cm_mueang'); return toast(host, 'ตัวอย่าง — พบตำแหน่งของคุณ: เมืองเชียงใหม่'); }
        return toast(host, 'ตัวอย่าง — ไม่พบอำเภออัตโนมัติ เลือกอำเภอเองได้เลย');
      }
      if (a === 'pick') return this.select(host, el.getAttribute('data-id'), true);
      if (a === 'pickc') return this.select(host, el.getAttribute('data-id'), false);
      if (a === 'zin' || a === 'zout') {
        var h = st === 2 ? th(L.r).h : (L.dm && L.dm.h);
        if (!h) return;
        L.zoom = lclamp(a === 'zin' ? L.zoom * 1.5 : L.zoom / 1.5, 1, 5);
        if (L.zoom < 1.01) { L.zoom = 1; L.cx = L.cy = null; }
        else if (a === 'zin' && L.cx == null) {
          var e = st === 2 ? (L.p && th(L.r).list[L.p]) : (L.d && L.dm.d[L.d]);
          if (e) { L.cx = e.l[0]; L.cy = e.l[1]; }
        }
        return render('loc');
      }
      if (a === 'back') { L.step--; L.zoom = 1; L.cx = L.cy = null; L.anim = false; return render('loc'); }
      if (a === 'confirm') {
        L.zoom = 1; L.cx = L.cy = null; L.anim = false;
        if (st === 1) {
          L.step = 2;
          if (!th(L.r).list[L.p]) { L.p = null; L.d = null; }
          else { L.anim = true; if (!(L.pm && L.pm.id === L.p)) this.loadProv(host, L.p, false); }
          return render('loc');
        }
        if (st === 2) {
          L.step = 3;
          if (L.pm && L.pm.id === L.p) L.dm = L.pm.m; else { L.dm = null; this.loadProv(host, L.p, true); }
          if (L.dm && !L.dm.d[L.d]) L.d = null;
          if (L.dm && L.d) L.anim = true;
          return render('loc');
        }
        // ขั้น 3 → ส่งค่าไปหน้าหลัก แผนที่ และโปรไฟล์
        var pv = th(L.r).list[L.p];
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
  var M = { km: 3, cat: null, group: 'daily', touched: false, fabSeen: false, mode: 'daily', src: 'siam', full: false, zoom: 1,
    // หมวดที่ผู้ใช้เลือกตามลำดับ (categoryOrder / tourismCategoryOrder ของแอป) · co = แผ่น "จัดลำดับหมวดหมู่" ที่เปิดอยู่
    ord: { daily: ['gas', 'toilet', 'food', 'drinks', 'parking', 'atm', 'market', 'convenience', 'cafe', 'pharmacy', 'hospital'],
      travel: ['temple', 'beach', 'viewpoint', 'nature', 'walkingstreet', 'camping'] }, co: null };
  // ชื่อบนวงกลมแบบแอป: ชีวิตประจำวัน = SHORT_LABEL (CategoryChips.tsx) · ท่องเที่ยว = nameTh (แผ่นจัดลำดับ) / ข้อความก่อน " / " (แถบชิป)
  var COL = { toilet: 'ห้องน้ำ', food: 'อาหาร', gas: 'ปั๊ม', atm: 'ATM', parking: 'จอดรถ', transit: 'รถเมล์', market: 'ตลาดสด', convenience: 'สะดวกซื้อ',
    mechanic: 'ซ่อมรถ', car_rental: 'รถเช่า', hospital: 'รพ.', pharmacy: 'ร้านยา', dental: 'ทันตกรรม', fitness: 'ออกกำลังกาย', cafe: 'คาเฟ่', drinks: 'เครื่องดื่ม' };
  function chipLabel(k, full) { return isTravel(k) ? (full ? NAMETH[k] : NAMETH[k].split(' / ')[0]) : COL[k]; }
  // หมวดที่ "ทั้งหมด" แสดง: ชีวิตประจำวัน = หมวดที่เลือกทั้ง 2 กลุ่ม (dailySlugs + tourismSlugs) · ท่องเที่ยว = หมวดท่องเที่ยวที่เลือก
  function shownCats() { return M.mode === 'travel' ? M.ord.travel : M.ord.daily.concat(M.ord.travel); }
  // หมุดตามโหมด: ชีวิตประจำวัน "ทั้งหมด" แสดงทั้ง 2 กลุ่ม (เหมือนแอป) · ท่องเที่ยว แสดงเฉพาะหมวดท่องเที่ยว · หมวดที่ไม่ได้เลือกไม่โหลด
  function mList(all) {
    var cats = shownCats();
    var mp = PLACES.filter(function (p) { return (M.mode === 'daily' || isTravel(p.k)) && (p.k === M.cat || cats.indexOf(p.k) >= 0); });
    return all ? mp : mp.filter(function (p) { return p.km <= M.km && (!M.cat || p.k === M.cat); });
  }
  var RATES = [4.6, 5.0, 4.7, 4.2, 4.8, 4.9, 4.5, 4.3, 4.6, 5.0, 4.9, 4.7, 4.1, 4.8, 4.4, 4.0, 4.7, 5.0, 4.9, 4.6];
  // แถวการ์ด NearbyRecommendCard (ในแอปเลื่อนแนวนอน → เดโมแสดง 2 ใบเต็ม + ใบที่ 3 โผล่ขอบ แตะเพื่อเลื่อน)
  function cardRow(key, items, empty) {
    if (!items.length) return '<div class="mt-empty">' + (empty || 'ยังไม่มีสถานที่ในหมวดนี้ใกล้คุณ') + '</div>';
    var idx = Math.max(0, Math.min(M[key] || 0, items.length - 2)); M[key] = idx;
    return '<div class="rrow"><div class="rtrack" style="transform:translateX(calc(' + (-idx) + ' * (var(--rw) + var(--rg))))">' + items.map(function (p, i) {
      var peek = i === idx + 2;
      return '<button class="rc' + (peek ? ' peek' : '') + '" data-a="' + (peek ? 'rnext' : 'pin') + '" data-row="' + key + '" data-i="' + PLACES.indexOf(p) + '"' + (peek ? ' aria-label="เลื่อนไปการ์ดถัดไป"' : '') + '>' +
        '<span class="im">' + placePic(p, i) + '</span><b>' + esc(p.n) + '</b><small><em>★ ' + rateOf(p).toFixed(1) + '</em> ' + fmtKm(p.km) + '</small></button>';
    }).join('') + '</div></div>';
  }
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
      var hint = '<div class="mt-hint"><span>แสดง ' + shownCats().length + ' หมวดที่คุณเลือก · <button data-a="cats" style="color:' + C + '">ปรับ ›</button></span>' +
        (tr ? '' : '<span class="mt-leg"><span style="--c:#15803d"><i></i>ชีวิตประจำวัน</span><span style="--c:#185FA5"><i></i>ท่องเที่ยว</span></span>') + '</div>';
      var rads = [1, 2, 3, 5, 10].map(function (k) { return '<button data-a="km" data-k="' + k + '"' + (M.km === k ? ' class="on"' : '') + ' style="--c:' + C + '">' + k + ' กม.</button>'; }).join('');
      // ชิปวงกลม 1 แถว (ไม่เลื่อนแนวนอน) = 4 หมวดแรกตามลำดับที่เลือก + "เพิ่มเติม" (เปิดแผ่นจัดลำดับ)
      var base = M.ord[tr ? 'travel' : 'daily'].slice(0, 4);
      if (M.cat && base.indexOf(M.cat) < 0) base = base.slice(0, 3).concat([M.cat]);
      var chips = [''].concat(base).map(function (k) {
        var on = (M.cat || '') === k;
        return '<button class="cc' + (on ? ' on' : '') + '" style="--c:' + C + '" data-a="chip" data-k="' + k + '"><span class="ci">' + (k ? catIcon(k) : ic('globe')) + '</span>' +
          '<span class="cl">' + (k ? chipLabel(k) : 'ทั้งหมด') + '</span></button>';
      }).join('') + '<button class="cc" data-a="cats"><span class="ci more">' + ic('plus') + '</span><span class="cl">เพิ่มเติม</span></button>';
      var rec = cardRow('rec', list.slice().sort(function (a, b) { return a.km - b.km; }).slice(0, 6));
      var pop = cardRow('pop', list.slice().sort(function (a, b) { return rateOf(b) - rateOf(a) || a.km - b.km; }).slice(0, 6), 'ยังไม่มีสถานที่ยอดนิยมในระยะนี้');
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
        '<div class="mt-sec"><b class="big">' + (tr ? 'สถานที่ท่องเที่ยวใกล้คุณ' : 'แนะนำใกล้คุณ') + '</b></div>' + rec +
        '<div class="mt-sec"><b class="big">🏆 สถานที่ยอดนิยมใกล้คุณ</b></div>' + pop + '</div></div>' +
        '<button class="apf mt-fab" data-a="add" aria-label="ปักหมุดสถานที่ใหม่"><span class="orb"' + (tr ? ' style="border-color:rgba(46,139,255,.45)"' : '') + '></span>' +
        '<span class="core' + (M.fabSeen ? '' : ' d-pulse') + '"' + (tr ? ' style="background:linear-gradient(135deg,#37C0FF,#1F6BFF)"' : '') + '>' + ic('pin-plus') + '</span></button>' +
        navBar(3) +
        '<div class="mp-full' + (M.full ? ' on' : '') + '" role="dialog" aria-label="แผนที่เต็มจอ">' + (M.full ? this.fullHtml() : '') + '</div>' +
        SHEET + '<div class="d-form' + (F.open ? ' on' : '') + '" role="dialog" aria-label="เพิ่มสถานที่ใหม่">' + (F.open ? this.form() : '') + '</div>' +
        '<div class="co-w' + (M.co ? ' on' : '') + '" data-a="co-x">' + (M.co ? this.coSheet() : '') + '</div>' + TOAST + '</div>';
    },
    // ── แผ่น "จัดลำดับหมวดหมู่" (CategoryOrderPopup.tsx) · แตะวงกลม = เลือก/ยกเลิก · เลขบนวง = ลำดับที่แสดงบนแผนที่
    coSheet: function () {
      var tr = M.co.g === 'travel', ac = tr ? '#1a56db' : '#10b981', dk = tr ? '#185FA5' : '#0f6a3d', abg = tr ? '#e8f0fe' : '#dcfce7';
      var sel = M.co.sel, keys = tr ? TRAVEL : DAILY;
      var grid = keys.map(function (k) {
        var r = sel.indexOf(k), on = r >= 0;
        return '<button class="co-c' + (on ? ' on' : '') + '" data-a="co-t" data-k="' + k + '" aria-pressed="' + on + '">' +
          '<span class="ci">' + catIcon(k) + (on ? '<i class="bd">' + (r + 1) + '</i>' : '') + '</span><span class="cl">' + esc(chipLabel(k, true)) + '</span></button>';
      }).join('');
      return '<div class="co-sh" role="dialog" aria-label="จัดลำดับหมวดหมู่" style="--ac:' + ac + ';--abg:' + abg + '">' +
        '<div class="fhd co-hd" style="background:linear-gradient(135deg,' + ac + ',' + dk + ')"><span class="hdl"></span>' +
        '<span class="fic">' + ic('reorder') + '</span><div class="tt"><b>จัดลำดับหมวดหมู่</b><small>เลือกหมวดที่ตรงกับชีวิตประจำวันของคุณ</small></div>' +
        '<button class="co-rq" data-a="co-req">' + ic('plus') + 'ขอหมวดใหม่</button>' +
        '<button class="fbtn" data-a="co-x" aria-label="ปิด">' + ic('x') + '</button>' +
        '<svg class="wv" viewBox="0 0 100 13" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13 L0 0 Q 50 24 100 0 L100 13 Z" fill="#fff"/></svg></div>' +
        '<div class="co-note" style="background:' + (tr ? '#eef3ff' : '#ecfdf5') + '"><div class="tp"><b>🌐 "ทั้งหมด" จะแสดงเฉพาะหมวดที่คุณเลือก</b><em>เลือกแล้ว ' + sel.length + ' หมวด</em></div>' +
        '<p>' + (tr ? 'เลือกเฉพาะสิ่งที่ใช้บ่อยหรือสนใจ เช่น วัด จุดชมวิว คาเฟ่ แผนที่ของคุณจะได้ไม่รก ตัวเลขบนวงกลมคือลำดับที่แสดงบนแผนที่'
          : 'เลือกเฉพาะสิ่งที่ใช้บ่อยหรือสนใจ เช่น ร้านอาหาร คาเฟ่ ที่ออกกำลังกาย แผนที่ของคุณจะได้ไม่รก ตัวเลขบนวงกลมคือลำดับที่แสดงบนแผนที่') + '</p></div>' +
        '<div class="co-grid">' + grid + '</div>' +
        '<div class="co-ft">' + (sel.length ? '' : '<div class="mn">เลือกอย่างน้อย 1 หมวด</div>') +
        '<button class="co-save' + (sel.length ? '' : ' off') + '" data-a="co-save" style="background:linear-gradient(135deg,' + ac + ',' + dk + ')">บันทึก</button></div></div>';
    },
    coRender: function (host) {
      var w = host.querySelector('.co-w'); if (!w) return;
      var g = w.querySelector('.co-grid'), top = g ? g.scrollTop : 0;
      w.innerHTML = this.coSheet();
      var g2 = w.querySelector('.co-grid'); if (g2) g2.scrollTop = top;
    },
    coClose: function (host, then) {
      var w = host.querySelector('.co-w'); if (w) w.classList.remove('on');
      M.co = null; updateLock();
      clearTimeout(this._coT);
      this._coT = setTimeout(function () { if (!M.co && w) w.innerHTML = ''; if (then) then(); }, 260);
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
      // ── แผ่นจัดลำดับหมวดหมู่ (ปุ่ม "ปรับ ›" · "เลือกหมวดหมู่ ›" · ปุ่มเลือกหมวดในแผนที่เต็มจอ · ชิป "เพิ่มเติม")
      if (a === 'cats') {
        var cg = M.mode === 'travel' ? 'travel' : 'daily';
        clearTimeout(this._coT); M.co = { g: cg, sel: M.ord[cg].slice() };
        var cw = host.querySelector('.co-w'); cw.innerHTML = this.coSheet();
        requestAnimationFrame(function () { requestAnimationFrame(function () { cw.classList.add('on'); updateLock(); }); });
        return;
      }
      if (a === 'co-t') {
        if (!M.co) return;
        var ck = el.getAttribute('data-k'), ci = M.co.sel.indexOf(ck);
        if (ci >= 0) M.co.sel.splice(ci, 1); else M.co.sel.push(ck);
        return this.coRender(host);
      }
      if (a === 'co-req') return toast(host, 'ในแอปส่งคำขอหมวดใหม่ได้');
      if (a === 'co-x') { if (M.co) this.coClose(host); return; }
      if (a === 'co-save') {
        if (!M.co || !M.co.sel.length) return;
        M.ord[M.co.g] = M.co.sel.slice();
        if (M.cat && shownCats().indexOf(M.cat) < 0) M.cat = null;
        M.rec = M.pop = 0;
        this.coClose(host, function () { render('map', true); toast(host, 'บันทึกแล้ว (ตัวอย่าง)'); });
        return;
      }
      if (a === 'pin') { M.touched = true; var pl = PLACES[+el.getAttribute('data-i')]; render('map'); return sheet(host, this.placeSheet(pl)); }
      if (a === 'shclose') return sheet(host, null);
      if (a === 'close' || a === 'go') return go(a === 'go' ? +el.getAttribute('data-i') : 2);
      if (a === 'plus') return toast(host, 'ในแอปจะเปิดเมนู "สร้างอะไรดีวันนี้?"');
      if (a === 'mode') { M.mode = el.getAttribute('data-v'); M.group = M.mode === 'travel' ? 'travel' : 'daily'; M.cat = null; M.zoom = 1; return render('map', true); }
      if (a === 'src') { var sv = el.getAttribute('data-v'); if (sv === 'google') return toast(host, 'ในแอปค้นหมุด Google ได้ (ใช้คะแนน)'); M.src = sv; return render('map', true); }
      if (a === 'chip') { M.cat = el.getAttribute('data-k') || null; M.rec = M.pop = 0; return render('map', true); }
      if (a === 'rnext') { var rk = el.getAttribute('data-row'); M[rk] = (M[rk] || 0) + 1; return render('map', true); }
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
        if (shownCats().indexOf(np.k) < 0) M.cat = np.k; // หมวดที่ไม่ได้เลือกไว้ → เปิดหมวดนั้นให้เห็นหมุดใหม่
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
  var A = { f: null, otherD: null, added: [], sc: 'p', save: {}, full: false };
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
      { t: 'fire', ti: 'ไฟไหม้หญ้าข้างทางเลี่ยงเมือง ควันหนาเห็นได้จากถนนใหญ่', d: S.dn, at: '5 วัน', x: -28, y: -8, by: ['elephant', 'ช้าง 3568'], ph: 11, km: 13.1 },
      { t: 'accident', ti: 'รถชนกัน 2 คัน แยกไฟแดงกลางเมือง', d: S.dn, at: '12 นาที', x: 20, y: -4, by: ['dog', 'สุนัข 1313'], ph: 4, km: 1.2 },
      { t: 'flood', ti: 'น้ำท่วมขังทางลอดหน้าตลาด รถเล็กผ่านไม่ได้', d: S.dn, at: '40 นาที', x: -6, y: 12, by: ['cat', 'แมว 2047'], ph: 6, km: 0.8 },
      { t: 'road', ti: 'ปิดซ่อมถนนเลนซ้าย ถึง 18:00', d: o[1], at: '3 ชม.', x: 32, y: 18, by: ['owl', 'นกฮูก 5521'], ph: 2, km: 4.6 },
      { t: 'accident', ti: 'รถจักรยานยนต์ล้ม ทางโค้งขึ้นดอย', d: o[2], at: '2 ชม.', x: -34, y: 27, by: ['parrot', 'นกแก้ว 9482'], ph: 1, km: 9.3 },
      { t: 'flood', ti: 'น้ำเอ่อล้นตลิ่ง ซอย 5', d: o[0], at: '4 ชม.', x: 12, y: 28, by: ['elephant', 'ช้าง 3568'], ph: 3, km: 6.0 },
      { t: 'blackout', ti: 'ไฟดับทั้งซอย ตั้งแต่ 2 ทุ่ม (ต่างจังหวัด)', d: 'หาดใหญ่', far: true, at: '1 วัน', x: 38, y: -24, by: ['cat', 'แมว 4410'], ph: 2, km: 812 }
    ]);
  }
  // ขอบเขตตามแท็บ (AlertScreen SCOPES): อำเภอฉัน = อำเภอที่เลือก · จังหวัด = ทั้งจังหวัด · ประเทศ = ทั้งหมด
  function scoped(all) {
    return (all || incidents()).filter(function (x) { return A.sc === 'c' || (A.sc === 'p' ? !x.far : x.d === S.dn && !x.far); });
  }
  function scopeLoc() { return A.sc === 'c' ? 'ทั่วประเทศไทย' : A.sc === 'p' ? (S.bkk ? S.pn : 'จังหวัด' + S.pn) : (S.bkk ? 'เขต' : 'อำเภอ') + S.dn; }
  // ภาพวาดแทนรูปเหตุการณ์ (ไล่สีตามประเภท + คลื่น + ไอคอนประเภท)
  function incPic(x, i) {
    var T = INC[x.t], a = ['33', '55', '44', '66'][i % 4], b = ['88', 'aa', '77', '99'][i % 4];
    return '<span class="ph" style="background:linear-gradient(' + (135 + i * 30) + 'deg,' + T.c + a + ',' + T.c + b + ')">' +
      '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q25 22 50 28 T100 26 V40 H0z" fill="#fff" opacity=".35"/><path d="M0 34 Q30 30 60 35 T100 33 V40 H0z" fill="#fff" opacity=".5"/></svg>' +
      '<i>' + em(T.e) + '</i></span>';
  }
  // การ์ดโพสต์แจ้งเหตุ (PostCard แบบ alert + PostImageGallery + PlaceInfoRow)
  function alertCard(x, i, saveKey) {
    var T = INC[x.t], saved = A.save[saveKey || i], g = '', thumbs = Math.min(3, x.ph - 1);
    for (var k = 1; k <= thumbs; k++) g += '<span class="th">' + incPic(x, k) + (k === thumbs && x.ph > 4 ? '<b>+' + (x.ph - 4) + '</b>' : '') + '</span>';
    var ago = x.at === 'เมื่อสักครู่' ? x.at : x.at + 'ที่แล้ว';
    return '<div class="ac' + (x.isNew ? ' new' : '') + '"><div class="ac-h">' + av(x.by[0]) + '<b>' + x.by[1] + '</b>' +
      '<button class="ib' + (saved ? ' on' : '') + '" data-a="asave" data-i="' + (saveKey || i) + '" aria-label="' + (saved ? 'ยกเลิกบันทึกโพสต์นี้' : 'บันทึกโพสต์นี้') + '">' + ic('bookmark', saved ? 'f' : '') + '</button>' +
      '<button class="ib" data-a="amore" aria-label="เมนู">' + ic('dots') + '</button></div>' +
      '<div class="ac-t">' + esc(x.ti) + '</div>' +
      '<div class="ac-gal"><span class="main">' + incPic(x, 0) + (x.ph > 1 ? '<span class="ct">' + ic('images') + '1/' + x.ph + '</span>' : '') + '</span>' +
      (thumbs > 0 ? '<span class="thr">' + g + '</span>' : '') + '</div>' +
      '<div class="ac-info"><span class="c"><i style="background:#DBEAFE;color:#2563EB">' + ic('navc') + '</i><b>' + fmtKm(x.km) + '</b></span>' +
      '<span class="c"><i style="background:#e8f0fe;color:#1a56db">' + ic('clock') + '</i><b>' + ago + '</b></span>' +
      '<span class="c"><i style="background:' + T.c + '33">' + em(T.e) + '</i><b>' + T.n + '</b></span>' +
      '<button class="c map" data-a="amap" data-i="' + i + '" aria-label="ดูแผนที่ของเหตุการณ์นี้"><i>' + ic('map') + '</i><span class="pill">ดูแผนที่ ›</span></button></div></div>';
  }
  SC.alert = {
    // ── หน้าแท็บแจ้งเหตุ (AlertScreen)
    html: function () {
      var all = incidents(), list = scoped(all).filter(function (x) { return !A.f || x.t === A.f; });
      var scopes = [['d', 'อำเภอฉัน'], ['p', 'จังหวัด'], ['c', 'ประเทศ']].map(function (s) {
        return '<button data-a="sc" data-k="' + s[0] + '"' + (A.sc === s[0] ? ' class="on"' : '') + '>' + s[1] + '</button>';
      }).join('');
      var chips = [['', '🔔', 'ทั้งหมด']].concat(ALL_TYPES.map(function (k) { return [k, INC[k].e, INC[k].n]; })).map(function (c) {
        return '<button class="fc2' + ((A.f || '') === c[0] ? ' on' : '') + '" data-a="f" data-k="' + c[0] + '">' + em(c[1]) + c[2] + '</button>';
      }).join('');
      var feed = list.map(function (x) { return alertCard(x, all.indexOf(x)); }).join('') ||
        '<div class="at-empty"><span>🎉</span>' + (A.sc === 'd' ? 'ไม่มีเหตุการณ์ในอำเภอของคุณ' : A.sc === 'p' ? 'ไม่มีเหตุการณ์ในจังหวัดของคุณ' : 'ไม่มีเหตุการณ์ทั่วประเทศในขณะนี้') + '</div>';
      all.forEach(function (x) { x.isNew = false; });
      return '<div class="dm d-alert2">' +
        '<div class="at-hd"><div class="row"><div class="tt"><b>🚨 แจ้งเหตุ</b><small>📍 ' + esc(scopeLoc()) + '</small></div>' +
        '<button class="sq" data-a="tel" aria-label="เบอร์ฉุกเฉิน">' + em('📞') + '</button>' +
        '<button class="sq" data-a="openmap" aria-label="แผนที่แจ้งเหตุ">' + ic('pinmap') + '</button>' +
        '<button class="rep' + (RF.seen ? '' : ' d-pulse') + '" data-a="report">＋ แจ้งเหตุ</button></div>' +
        '<div class="at-scope">' + scopes + '</div>' +
        '<svg class="wv" viewBox="0 0 100 13" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13 L0 0 Q 50 24 100 0 L100 13 Z" fill="#fff"/></svg></div>' +
        '<div class="at-filter">' + hsRow('at', chips) + '</div>' +
        '<div class="d-scroll at-body"><div class="at-feed">' + feed + '</div></div>' +
        navBar(4) +
        '<div class="ovl al-full' + (A.full ? ' on' : '') + '" role="dialog" aria-label="แผนที่เหตุการณ์">' + (A.full ? this.fullHtml() : '') + '</div>' +
        SHEET + '<div class="d-form' + (RF.open ? ' on' : '') + '" role="dialog" aria-label="แจ้งเหตุในพื้นที่">' + (RF.open ? this.form() : '') + '</div>' + TOAST + '</div>';
    },
    // ── แผนที่เหตุการณ์ (IncidentMapModal) เป็นแผ่นทับ
    fullHtml: function () {
      var all = incidents(), sc = scoped(all), list = sc.filter(function (x) { return !A.f || x.t === A.f; });
      var chips = [[null, 'ทั้งหมด', '']].concat(['flood', 'fire', 'accident', 'road'].map(function (k) { return [k, INC[k].n, INC[k].e]; })).map(function (c) {
        return '<button class="chip' + (A.f === c[0] ? ' on' : '') + '" data-a="f" data-k="' + (c[0] || '') + '">' + (c[2] ? em(c[2]) : '') + c[1] + '</button>';
      }).join('');
      var types = ALL_TYPES.filter(function (k) { return sc.some(function (x) { return x.t === k; }); });
      var counts = types.map(function (k) { return '<span>' + em(INC[k].e) + '<b>' + sc.filter(function (x) { return x.t === k; }).length + '</b></span>'; }).join('');
      var pins = all.map(function (x, i) {
        var T = INC[x.t], fill = (x.t === 'fire' || x.t === 'accident') ? '#dc2626' : '#f97316', vis = list.indexOf(x) >= 0;
        return '<button class="d-ipin' + (vis ? '' : ' hid') + (x.fresh ? ' new' : '') + '" data-a="inc" data-i="' + i + '" style="left:calc(50% + ' + x.x + 'cqw);top:calc(50% + ' + x.y + 'cqw)" aria-label="' + esc(x.ti) + '">' +
          '<svg viewBox="0 0 30 38"><path d="M15 37C15 37 2 23 2 14a13 13 0 0 1 26 0c0 9-13 23-13 23z" fill="' + fill + '" stroke="#fff" stroke-width="2"/></svg>' +
          '<span class="em">' + em(T.e) + '</span></button>';
      }).join('');
      var items = list.slice(0, 5).map(function (x) {
        var T = INC[x.t];
        return '<button class="al-item" data-a="inc" data-i="' + all.indexOf(x) + '" style="--c:' + T.c + '"><span class="ti">' + em(T.e) + '</span>' +
          '<span class="tx"><b>' + esc(x.ti) + '</b><small>' + T.n + ' · ' + (S.bkk ? 'เขต' : 'อ.') + esc(x.d) + ' · ' + x.at + '</small></span>' + ic('chev-r') + '</button>';
      }).join('') || '<div class="loc-empty" style="height:5em">ยังไม่มีเหตุการณ์ประเภทนี้ในตัวอย่าง</div>';
      all.forEach(function (x) { x.fresh = false; });
      return '<div class="al-hd"><div class="tt"><b>แผนที่เหตุการณ์</b><small>' + ic('pin') + esc(scopeLoc()) + '</small></div>' +
        '<button class="hb" data-a="aclose" aria-label="ปิดแผนที่">' + ic('x') + '</button>' +
        '<svg class="wv" viewBox="0 0 100 13" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13 L0 0 Q 50 24 100 0 L100 13 Z" fill="#fff"/></svg></div>' +
        '<div class="al-top">' + hsRow('al', chips) + '<div class="al-counts">' + counts + '</div></div>' +
        '<div class="d-scroll"><div class="al-map d-mapc">' + cityMap(true) + pins + '</div>' +
        '<div class="al-list"><h4>เหตุการณ์ล่าสุด</h4>' + items + '</div></div>';
    },
    openFull: function (host, blinkIdx) {
      A.full = true; var fb = host.querySelector('.al-full'); fb.innerHTML = this.fullHtml();
      requestAnimationFrame(function () {
        fb.classList.add('on'); updateLock(); hsInit(fb);
        if (blinkIdx != null && !reduce) setTimeout(function () { var pin = fb.querySelector('.d-ipin[data-i="' + blinkIdx + '"]'); if (pin) pin.classList.add('blink'); }, 350);
      });
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
      var metro = ['bkk', 'non', 'spk'].indexOf(S.p) >= 0;
      var byType = [['🌊', '1784', 'ภัยพิบัติ / น้ำท่วม'], ['💡', metro ? '1130' : '1129', metro ? 'การไฟฟ้านครหลวง' : 'การไฟฟ้าส่วนภูมิภาค'],
        ['🚰', metro ? '1125' : '1662', metro ? 'การประปานครหลวง' : 'การประปาส่วนภูมิภาค'], ['🚧', '1586', 'กรมทางหลวง'], ['🧑', '1300', 'แจ้งคนหาย (ศูนย์ประชาบดี)'], ['🧳', '1155', 'ตำรวจท่องเที่ยว']];
      return '<h4>📞 เบอร์ฉุกเฉิน & วิธีแจ้งเหตุ</h4>' +
        '<div class="tel big">' + em('🚓') + '<div><small>ตำรวจ · เหตุด่วนเหตุร้าย</small><b>191</b></div></div>' +
        '<div class="tel2"><div class="tel">' + em('🚒') + '<div><b>199</b><small>ดับเพลิง / กู้ภัย</small></div></div><div class="tel">' + em('🚑') + '<div><b>1669</b><small>การแพทย์ฉุกเฉิน</small></div></div></div>' +
        '<div class="tel-l">เบอร์ตามประเภทเหตุ</div>' + byType.map(function (r) { return '<div class="tel-r">' + em(r[0]) + '<span>' + r[2] + '</span><b>' + r[1] + '</b></div>'; }).join('') +
        '<p class="tel-how"><b>วิธีแจ้งเหตุ: </b>① เลือกประเภท  ② เขียนรายละเอียด  ③ แนบรูป  ④ ตรวจตำแหน่ง</p>' +
        '<div class="al-warn">' + ic('alert') + '<span>แอปนี้ช่วยกระจายข่าวในชุมชน ไม่ใช่สายด่วนฉุกเฉิน</span></div>' +
        '<button class="d-btn p" style="width:100%;background:linear-gradient(135deg,#d32f2f,#8e0e14)" data-a="shclose">เข้าใจแล้ว</button>';
    },
    on: function (a, el, host) {
      if (a === 'f') { var rw = el.closest('.hs'); HSREV = rw && rw.getAttribute('data-hs'); A.f = el.getAttribute('data-k') || null; return render('alert', true); }
      if (a === 'sc') { A.sc = el.getAttribute('data-k'); return render('alert', true); }
      if (a === 'openmap') return this.openFull(host);
      if (a === 'amap') return this.openFull(host, +el.getAttribute('data-i'));
      if (a === 'aclose') { A.full = false; host.querySelector('.al-full').classList.remove('on'); return updateLock(); }
      if (a === 'asave') { var sk = el.getAttribute('data-i'); A.save[sk] = !A.save[sk]; return render('alert', true); }
      if (a === 'go') return go(+el.getAttribute('data-i'));
      var amsg = { amore: 'ในแอปมีเมนู บันทึก / รายงาน', plus: 'ในแอปจะเปิดเมนู "สร้างอะไรดีวันนี้?"' }[a];
      if (amsg) return toast(host, amsg);
      if (a === 'inc') return sheet(host, this.detail(+el.getAttribute('data-i')));
      if (a === 'shclose') return sheet(host, null);
      if (a === 'tel') return sheet(host, this.telSheet());
      if (a === 'onmap') {
        sheet(host, null);
        if (!A.full) return this.openFull(host, +el.getAttribute('data-i'));
        var i = el.getAttribute('data-i'), sc2 = host.querySelector('.al-full .d-scroll'), pin = host.querySelector('.al-full .d-ipin[data-i="' + i + '"]');
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
        A.added.unshift({ t: RF.type, ti: RF.detail, d: S.dn, at: 'เมื่อสักครู่', x: -16, y: 2, isNew: true, fresh: true, by: ['elephant', 'ช้าง 3568'], ph: Math.max(1, RF.photos.length), km: 0.1 });
        A.f = null; RF.open = false; rReset();
        host.querySelector('.d-form').classList.remove('on'); updateLock();
        setTimeout(function () { render('alert'); var bd = host.querySelector('.at-body'); if (bd) bd.scrollTop = 0; toast(host, 'ตัวอย่าง — ในแอปจะแจ้งเตือนคนในพื้นที่'); }, 260);
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

  /* ---------- 6) โปรไฟล์ (ProfileScreen · IdentityCard · BagCard · CardBagSwitch · ProfileTabBar · SiamMapTab) ---------- */
  var P = { view: 'card', tab: 'siam', siamSub: 'data', incSub: 'data', chip: null, checked: false, pts: 2043, inc: 815, exp: 178 };
  // หมุดของฉัน (ชื่อสมมติ) · r/rc = คะแนน/จำนวนรีวิว · op = เปิดอยู่ · ph = จำนวนรูป (ป้าย 🖼 N)
  var MYPINS = [
    { k: 'gas', n: 'ปั๊มน้ำมันหน้าหมู่บ้าน', i: 0, r: 5.0, rc: 1, op: true, ph: 15 },
    { k: 'food', n: 'ข้าวซอยบ้านสวนฟ้า', i: 1, r: 4.8, rc: 6, op: true, ph: 9 },
    { k: 'temple', n: 'วัดป่าดอยหมอก', i: 2, r: 5.0, rc: 3, op: false, ph: 12 },
    { k: 'atm', n: 'ตู้ ATM หน้าตลาด', i: 3, r: 5.0, rc: 1, op: true, ph: 4 },
    { k: 'cafe', n: 'คาเฟ่ใบเตยหอม', i: 4, r: 4.9, rc: 8, op: false, ph: 15 },
    { k: 'viewpoint', n: 'จุดชมวิวสันเขื่อน', i: 5, r: 5.0, rc: 2, op: true, ph: 7 }
  ];
  // สีชิปตอนเลือก = ROOM_META.color · ลำดับชิป = CHIP_PRIORITY ของ SiamMapTab แล้วหมวดที่เหลือต่อท้าย
  var PIN_COLOR = { gas: '#ea580c', food: '#dc2626', temple: '#ca8a04', atm: '#0d9488', cafe: '#92400e', viewpoint: '#9333ea' };
  var CHIP_PRIORITY = ['toilet', 'gas', 'food', 'cafe', 'hospital', 'viewpoint', 'temple', 'nature'];
  // กติกาคะแนน (PointsWalletModal: EARN_GUIDE / SPEND_GUIDE)
  var EARN = [
    ['สมัครสมาชิกใหม่', 100, ''], ['เช็กอินรายวัน', 1, 'สามารถกดรับคะแนนได้วันละ 1 ครั้ง'],
    ['ได้รับหัวใจจากเนื้อหา', 0.4, 'ใช้ได้กับโพสต์ที่ไม่ใช่แจ้งเหตุ (โพสต์ทั่วไป + ข่าวชุมชน) • ส่วนต่าง 0.1 ถูกเผา บันทึกเข้ายอดกองทุนภาคของผู้กด (ถ้ามีภาค)'],
    ['เขียนรีวิวสถานที่', 0.5, 'รีวิวหมุดของคนอื่นที่เคยนำทาง (ครั้งเดียวต่อสถานที่ · เจ้าของหมุดเป็นผู้จ่าย ถ้ามีคะแนนพอ) หรือรีวิวตอนเพิ่มสถานที่ใหม่'],
    ['หมุดของคุณถูกใช้นำทาง', 0.8, 'ส่วนต่าง 0.2 ถูกเผา บันทึกเข้ายอดกองทุนภาคของผู้นำทาง (ถ้ามีภาค) · cooldown 24 ชม.'],
    ['เพิ่มสถานที่ใหม่', 40, 'หัก 5 คะแนน เข้ากองทุนภาคที่สถานที่ตั้งอยู่']
  ];
  var SPEND = [
    ['กดหัวใจให้คนอื่น', -0.5, 'ใช้ได้กับโพสต์ที่ไม่ใช่แจ้งเหตุ (โพสต์ทั่วไป + ข่าวชุมชน) • เจ้าของเนื้อหาได้รับ 0.4 คะแนน'],
    ['สร้างโพสต์', -10, 'ทุกโพสต์ที่ไม่ใช่แจ้งเหตุ (โพสต์ทั่วไป + ข่าวชุมชน)'], ['คอมเมนต์', -1, 'ทุกโพสต์ที่ไม่ใช่แจ้งเหตุ (โพสต์ทั่วไป + ข่าวชุมชน)'],
    ['อัปโหลดรูป (ต่อรูป)', -10, 'ทุกโพสต์ที่ไม่ใช่แจ้งเหตุ (โพสต์ทั่วไป + ข่าวชุมชน)'],
    ['นำทางหมุดคนอื่น', -1, 'เจ้าของหมุดได้รับ 0.8 คะแนน • ส่วนต่าง 0.2 ถูกเผา บันทึกเข้ายอดกองทุนภาคของผู้นำทาง (ถ้ามีภาค) · cooldown 24 ชม.'],
    ['ลบสถานที่ที่เพิ่มไว้', -40, 'หักคืน 40 ที่ได้ตอนเพิ่มสถานที่ และคืน 5 ที่เคยจ่ายเข้ากองทุนภาค (ถ้ามี) • ยอดกลับเท่าก่อนเพิ่มสถานที่']
  ];
  var HISTORY = [['เพิ่มสถานที่ใหม่', 40, '2 วันที่แล้ว'], ['สร้างโพสต์', -10, '3 วันที่แล้ว'], ['เช็กอินรายวัน', 1, '3 วันที่แล้ว'], ['หมุดของคุณถูกใช้นำทาง', 0.8, '4 วันที่แล้ว'], ['คอมเมนต์', -1, '5 วันที่แล้ว']];
  function fmtAmt(n) { return (n < 0 ? '−' : '+') + (Number.isInteger(n) ? Math.abs(n) : Math.abs(n).toFixed(1)); }
  function pinPic(p) { return p.k === 'temple' || p.k === 'food' ? scene(p.k, p.i) : drawnPic(p.i, catIcon(p.k)); }
  SC.prof = {
    html: function () {
      var R = REG[S.r];
      var tabs = [['general', 'msg', 'โพสต์ทั่วไป'], ['poll', 'chart', 'โพล'], ['alert', 'alert', 'แจ้งเหตุ'], ['siam', 'map', 'แผนที่']].map(function (t) {
        return '<button data-a="ptab" data-t="' + t[0] + '"' + (P.tab === t[0] ? ' class="on"' : '') + '>' + ic(t[1]) + t[2] + '</button>';
      }).join('');
      return '<div class="dm d-prof2">' +
        '<div class="pr-hd"><b>โปรไฟล์</b><button data-a="edit">' + ic('pencil') + 'แก้ไข</button></div>' +
        '<div class="d-scroll pr-body"><div class="pr-top">' + (P.view === 'card' ? this.card() : this.bag()) +
        '<div class="pr-sw"><button data-a="view" data-v="card"' + (P.view === 'card' ? ' class="on" style="background:linear-gradient(135deg,' + R.c1 + ',' + R.c2 + ')"' : '') + '>🪪 นามบัตร</button>' +
        '<button data-a="view" data-v="bag"' + (P.view === 'bag' ? ' class="on bag"' : '') + '>👜 กระเป๋า</button></div>' +
        '<div class="pr-tabs">' + tabs + '</div>' + this.tabBody() + '</div></div>' +
        navBar(5) + SHEET + TOAST + '</div>';
    },
    // นามบัตร (IdentityCard + IdentityStatsBar)
    card: function () {
      var R = REG[S.r], th = '';
      if (GEO) th = '<svg class="th" viewBox="' + GEO.vb + '" aria-hidden="true">' + ORDER.map(function (id) {
        return '<path d="' + GEO.regions[id].d + '" fill="' + (id === S.r ? '#f5d27a' : 'rgba(255,255,255,.22)') + '" stroke="rgba(255,255,255,.55)" stroke-width="2"/>';
      }).join('') + '</svg>';
      var stats = [['1,240', 'คะแนน', '#b45309', 'gobag'], ['18', 'โพสต์', '#1a56db', 'general'], ['4', 'โพล', '#6d28d9', 'poll'], ['6', 'แจ้งเหตุ', '#d32f2f', 'alert'], ['30', 'หมุด', '#0f6a3d', 'siam']];
      stats[0][0] = P.pts.toLocaleString('en-US');
      return '<div class="idb"><div class="idc2" style="background:linear-gradient(135deg,' + R.c1 + ',' + R.c2 + ')">' + pattern('idp2') + '<span class="fr"></span>' + th +
        '<div class="ct"><div class="rg">' + em(R.icon) + ' ' + R.full + '</div><i class="gl"></i>' +
        '<div class="me"><span class="ring">' + '<img src="' + BASE + 'avatars/elephant.png" alt=""></span><div><b>ช้าง 3568</b><small>ระดับ 6 · คนในพื้นที่</small></div></div>' +
        '<div class="tb"><div><span>ชุมชน</span><b>' + esc(S.dn) + '</b></div><div><span>จังหวัด</span><b>' + esc(S.pn) + '</b></div><div><span>เข้าร่วม</span><b>มี.ค. 2569</b></div></div>' +
        '<div class="xp"><i style="width:72%"></i></div><div class="xpt">EXP 130 / 160</div></div></div>' +
        '<div class="isb">' + stats.map(function (s) {
          return '<button data-a="stat" data-k="' + s[3] + '"><b style="color:' + s[2] + '">' + s[0] + '</b><small>' + s[1] + '</small></button>';
        }).join('') + '</div></div>';
    },
    // กระเป๋า (BagCard)
    bag: function () {
      var slots = ''; for (var k = 0; k < 8; k++) slots += '<span class="sl">' + ic('inbox') + '</span>';
      return '<div class="bg2">' + pattern('bgp2') + '<span class="st"></span><div class="ct">' +
        '<div class="tt">👜 กระเป๋าของฉัน</div>' +
        '<div class="coin" role="button" data-a="ledger" data-t="history"><div class="ctop"><div><small>ช่องเหรียญ</small><b>🪙 ' + P.pts.toLocaleString('en-US') + ' คะแนน</b></div>' +
        (P.checked ? '<span class="ck">✓ เช็กอินแล้ว</span>' : '<button class="ck btn d-pulse" data-a="checkin">🎁 เช็กอิน +1</button>') + '</div>' +
        '<div class="cbot"><span style="color:#86efac">▲ รับ ' + P.inc.toLocaleString('en-US') + '</span><span style="color:#fca5a5">▼ ใช้ ' + P.exp.toLocaleString('en-US') + '</span>' +
        '<span class="la">ล่าสุด: ' + (P.checked ? 'เช็กอินรายวัน +1' : 'เพิ่มสถานที่ใหม่ +40') + '</span></div></div>' +
        '<div class="lr"><span>ช่องไอเท็ม</span><span>ใช้ 0 / 20 ช่อง</span></div><div class="gr">' + slots + '</div>' +
        '<div class="sc2"><button data-a="ledger" data-t="history">📜 ประวัติ</button><button data-a="ledger" data-t="rules">📖 กติกาคะแนน</button>' +
        '<button class="soon" data-a="shop">🛍️ Siam Shop<em>เร็ว ๆ นี้</em></button></div></div></div>';
    },
    // สมุดคะแนน (PointsLedgerSheet) — ไม่มีข้อความแลกเงิน/สินค้า
    ledger: function (tab) {
      var row = function (r, rule) {
        return '<div class="lg-row"><div><b>' + r[0] + '</b><small>' + (rule ? r[2] : r[2]) + '</small></div><em style="color:' + (r[1] < 0 ? '#ef4444' : '#10b981') + '">' + fmtAmt(r[1]) + '</em></div>';
      };
      var hist = (P.checked ? [['เช็กอินรายวัน', 1, 'เมื่อสักครู่']] : []).concat(HISTORY);
      var body = tab === 'rules'
        ? '<div class="lg-gh" style="color:#10b981">ได้รับคะแนน</div>' + EARN.map(function (r) { return row(r, true); }).join('') +
          '<div class="lg-gh" style="color:#ef4444">ใช้คะแนน</div>' + SPEND.map(function (r) { return row(r, true); }).join('') +
          '<p class="lg-note">คะแนนหมุนเวียนในชุมชน — มีส่วนร่วมเพื่อรับคะแนน ใช้คะแนนเพื่อโพสต์/โปรโมท</p>'
        : hist.map(function (r) { return row(r); }).join('');
      return '<div class="lg-hd">' + pattern('lgp') + '<b>🪙 สมุดคะแนน</b><div class="bal"><strong>' + P.pts.toLocaleString('en-US') + '</strong><small>คะแนนคงเหลือ</small></div>' +
        '<div class="sum"><span style="color:#86efac">▲ รายรับ ' + P.inc.toLocaleString('en-US') + '</span><span style="color:#fca5a5">▼ รายจ่าย ' + P.exp.toLocaleString('en-US') + '</span></div></div>' +
        '<div class="lg-tabs"><button data-a="ledger" data-t="history"' + (tab !== 'rules' ? ' class="on"' : '') + '>📜 ประวัติ</button>' +
        '<button data-a="ledger" data-t="rules"' + (tab === 'rules' ? ' class="on"' : '') + '>📖 กติกาคะแนน</button></div><div class="lg-body">' + body + '</div>';
    },
    seg: function (key, val) {
      return '<div class="pr-seg">' + [['data', 'ข้อมูล'], ['map', 'แผนที่']].map(function (s) {
        return '<button data-a="' + key + '" data-v="' + s[0] + '"' + (val === s[0] ? ' class="on"' : '') + '>' + s[1] + '</button>';
      }).join('') + '</div>';
    },
    tabBody: function () {
      if (P.tab === 'general') return '<div class="pr-feed">' + SC.home.generalCard('pf1', 'elephant', 'ช้าง 3568', '2 วันที่แล้ว', 'แนะนำร้านซ่อมรถใกล้ตลาด บริการดี ราคาไม่แพง', 12, 3, drawnPic(1, em('🔧')), '<span class="gp-chip" style="--c:#1a56db">💬 โพสต์ทั่วไป</span>', '') +
        SC.home.generalCard('pf2', 'elephant', 'ช้าง 3568', '1 สัปดาห์ที่แล้ว', 'ขอบคุณทุกคนที่มาช่วยเก็บขยะริมคลองเมื่อวันอาทิตย์', 27, 8, '', '<span class="gp-chip" style="--c:#1a56db">💬 โพสต์ทั่วไป</span>', '') + '</div>';
      if (P.tab === 'poll') return '<div class="pr-feed">' + this.myPoll('ควรมีไฟส่องทางในซอยเพิ่มไหม', 82, 214, '3 วันที่แล้ว') + this.myPoll('ตลาดเช้าย้ายไปลานจอดรถ ดีไหม', 57, 96, '2 สัปดาห์ที่แล้ว') + '</div>';
      if (P.tab === 'alert') {
        var allI = incidents(), mine = allI.filter(function (x) { return x.by[1] === 'ช้าง 3568'; }).slice(0, 2);
        return this.seg('incsub', P.incSub) + (P.incSub === 'data'
          ? '<div class="pr-feed">' + mine.map(function (x, i) { return alertCard(x, allI.indexOf(x), 'pr' + i); }).join('') + '</div>'
          : '<div class="pr-map d-mapc">' + cityMap(true) + mine.map(function (x, i) {
            var T = INC[x.t];
            return '<span class="d-ipin" style="left:calc(50% + ' + x.x + 'cqw);top:calc(50% + ' + (x.y * .7) + 'cqw)"><svg viewBox="0 0 30 38"><path d="M15 37C15 37 2 23 2 14a13 13 0 0 1 26 0c0 9-13 23-13 23z" fill="#dc2626" stroke="#fff" stroke-width="2"/></svg><span class="em">' + em(T.e) + '</span></span>';
          }).join('') + '</div>');
      }
      // แท็บแผนที่ (SiamMapTab): ข้อมูล = ชิปหมวด + การ์ดหมุด 2 คอลัมน์ · แผนที่ = PlacesMapSummaryCard + แผนที่หมุดของฉัน
      if (P.siamSub === 'map') {
        return this.seg('siamsub', P.siamSub) +
          '<div class="ms"><b class="ms-t">🗺️ แผนที่สถานที่ของฉัน</b><div class="ms-st"><span style="background:#eef3ff"><b style="color:#1a56db">30</b>สถานที่</span>' +
          '<span style="background:#e8f8ee"><b style="color:#0f6a3d">7</b>หมวดหมู่</span><span style="background:#fff6dd"><b style="color:#b45309">3</b>อำเภอ</span></div>' +
          '<div class="ms-l">หมวดที่ปักมากที่สุด</div><div class="ms-c"><span>' + em('🍜') + ' ร้านอาหาร 9</span><span>' + em('☕') + ' 6</span><span>' + em('🏯') + ' 4</span><span>+4</span></div>' +
          '<button class="ms-b" data-a="pmap">🗺️ เปิดแผนที่ของฉัน ›</button></div>' +
          '<div class="pr-map d-mapc">' + cityMap(true) + MYPINS.map(function (p, i) {
            var xy = pos([0.6, 1.4, 1.7, 1.6, 2.4, 2.6][i], [40, 75, 228, 165, 320, 112][i]);
            return '<span class="d-pin" style="--pc:' + (isTravel(p.k) ? '#185FA5' : '#15803d') + ';left:calc(50% + ' + xy[0].toFixed(1) + 'cqw);top:calc(50% + ' + (xy[1] * .7).toFixed(1) + 'cqw)"><span class="tl"></span><span class="hd">' + catIcon(p.k) + '</span></span>';
          }).join('') + '<span class="d-you" style="left:50%;top:50%"></span></div>';
      }
      var keys = MYPINS.map(function (x) { return x.k; }).filter(function (k, i, a) { return a.indexOf(k) === i; }).sort(function (a, b) {
        var ia = CHIP_PRIORITY.indexOf(a), ib = CHIP_PRIORITY.indexOf(b);
        return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
      });
      var chips = '<button class="pm-chip all' + (!P.chip ? ' on' : '') + '" data-a="pchip" data-k="">ทั้งหมด</button>' + keys.map(function (k) {
        var on = P.chip === k;
        return '<button class="pm-chip' + (on ? ' on' : '') + '"' + (on ? ' style="background:' + PIN_COLOR[k] + ';border-color:' + PIN_COLOR[k] + '"' : '') + ' data-a="pchip" data-k="' + (on ? '' : k) + '">' + catIcon(k) + ' ' + CAT[k][1] + '</button>';
      }).join('');
      var cards = MYPINS.filter(function (x) { return !P.chip || x.k === P.chip; }).map(function (x) {
        return '<div class="pgc" role="button" data-a="pc"><div class="cv">' + pinPic(x) +
          '<span class="bd" style="background:' + (isTravel(x.k) ? '#1a56db' : '#10b981') + '">' + catIcon(x.k) + ' ' + CAT[x.k][1] + '</span>' +
          '<button class="mn" data-a="more" aria-label="เมนู">' + ic('dots') + '</button><span class="pn">' + em('🖼') + ' ' + x.ph + '</span></div>' +
          '<div class="bo"><b>' + esc(x.n) + '</b><div class="mr"><span class="rt"><i>⭐</i> ' + x.r.toFixed(1) + ' <small>(' + x.rc + ')</small></span><span class="dt">·</span>' +
          '<span class="st" style="color:' + (x.op ? '#16a34a' : '#dc2626') + '">● ' + (x.op ? 'เปิดอยู่' : 'ปิดอยู่') + '</span></div>' +
          '<div class="lo">📍 ' + esc(dLabel()) + '</div>' +
          '<div class="qr"><span>ข้อมูลครบ</span><em>7/7 🏆</em></div><div class="qb"><i></i></div></div></div>';
      }).join('');
      return this.seg('siamsub', P.siamSub) + hsRow('pm', chips, 'pm-hs') + '<div class="pm-grid">' + cards + '</div>';
    },
    myPoll: function (q, py, votes, ago) {
      var ny = Math.round(votes * py / 100);
      return '<div class="pc-card"><div class="pc-row" style="margin-top:0">' + av('elephant') + '<div class="mt"><b>ช้าง 3568</b><small>📍 ' + esc(S.dn) + ' · ' + ago + '</small></div>' +
        '<span class="pc-chip">' + ic('chart') + 'โพลชุมชน</span><button class="ib" data-a="more" aria-label="เมนู">' + ic('dots') + '</button></div>' +
        '<div class="pc-q" style="font-weight:800">' + esc(q) + '</div><div class="pb">' +
        '<div class="pb-row y"><i style="width:' + py + '%"></i><span class="lb">✓ ใช่</span><span class="nm">' + py + '% · ' + ny + '</span></div>' +
        '<div class="pb-row n"><i style="width:' + (100 - py) + '%"></i><span class="lb">✕ ไม่ใช่</span><span class="nm">' + (100 - py) + '% · ' + (votes - ny) + '</span></div>' +
        '<div class="pb-foot"><span class="pot">🏆 100/100</span><span class="vt">🗳️ ' + votes + ' โหวต</span><button data-a="share">' + ic('share') + 'แชร์</button></div></div></div>';
    },
    on: function (a, el, host) {
      var v = el.getAttribute('data-v'), k = el.getAttribute('data-k');
      if (a === 'view') { P.view = v; return render('prof', true); }
      if (a === 'ptab') { P.tab = el.getAttribute('data-t'); return render('prof', true); }
      if (a === 'stat') { if (k === 'gobag') P.view = 'bag'; else P.tab = k; return render('prof', true); }
      if (a === 'siamsub') { P.siamSub = v; return render('prof', true); }
      if (a === 'incsub') { P.incSub = v; return render('prof', true); }
      if (a === 'pchip') { P.chip = k || null; var pr = el.closest('.hs'); HSREV = pr && pr.getAttribute('data-hs'); return render('prof', true); }
      if (a === 'pmap') return toast(host, 'ในแอปจะเปิดแผนที่หมุดของฉันแบบเต็มจอ');
      if (a === 'checkin') { P.checked = true; P.pts += 1; P.inc += 1; render('prof', true); return toast(host, 'เช็กอินแล้ววันนี้ · +1 คะแนน'); }
      if (a === 'ledger') { var lt = el.getAttribute('data-t'); if (host.querySelector('.d-shw.on')) { host.querySelector('.d-sh').innerHTML = '<div class="d-handle"></div>' + this.ledger(lt); return; } return sheet(host, this.ledger(lt)); }
      if (a === 'shclose') return sheet(host, null);
      if (a === 'shop') return toast(host, 'เร็ว ๆ นี้');
      if (a === 'asave') { var sk = el.getAttribute('data-i'); A.save[sk] = !A.save[sk]; return render('prof', true); }
      if (a === 'save') { var id = el.getAttribute('data-id'); H.save[id] = !H.save[id]; return render('prof', true); }
      if (a === 'pvote') { var pid = el.getAttribute('data-id'); H.vote[pid] = H.vote[pid] === v ? null : v; return render('prof', true); }
      if (a === 'amap') { go(4); setTimeout(function () { if (HOSTS.alert) SC.alert.openFull(HOSTS.alert, +el.getAttribute('data-i')); }, 450); return; }
      if (a === 'go') return go(+el.getAttribute('data-i'));
      var msg = { edit: 'ในแอปเปลี่ยนรูปสัตว์และพื้นที่ได้', pc: 'ในแอปจะเปิดหมุดนี้บนแผนที่', plus: 'ในแอปจะเปิดเมนู "สร้างอะไรดีวันนี้?"', more: 'ในแอปมีเมนู แก้ไข / ลบ', amore: 'ในแอปมีเมนู แก้ไข / ลบ', comment: 'ในแอปจะเปิดคอมเมนต์', share: 'ในแอปจะเปิดเมนูแชร์' }[a];
      if (msg) toast(host, msg);
    },
    init: function () { geo().then(function () { if (P.view === 'card') render('prof', true); }); }
  };

  /* =====================================================================
     สร้าง / วาดใหม่ / ส่งต่อ state
     ===================================================================== */
  /* ---------- แถวชิปเลื่อนแนวนอนแบบแอป (FlatList horizontal) ----------
     แถวเดียวไม่ห่อ · ลากนิ้ว/ล้อเมาส์/ลากเมาส์ได้ · data-no-swipe = สไลด์มือถือไม่ขยับตาม (index.html ข้ามเหตุการณ์ที่เริ่มในนี้)
     overscroll-behavior-x: contain กันการปัดต่อไปยังสไลด์เมื่อเลื่อนสุดขอบ · จำตำแหน่งเลื่อนไว้ข้ามการวาดใหม่ */
  var HSPOS = {};
  function hsRow(key, inner, cls) {
    return '<div class="hs-w' + (cls ? ' ' + cls : '') + '"><div class="hs" data-no-swipe data-hs="' + key + '">' + inner + '</div></div>';
  }
  function hsFade(row) {
    var w = row.parentNode; if (!w || !w.classList) return;
    w.classList.toggle('end', row.scrollLeft + row.clientWidth >= row.scrollWidth - 2);
  }
  // ระยะห่างชิปปรับเล็กน้อย (ไม่เกินช่วงที่กำหนด) ให้ชิปใบสุดท้ายที่ล้นขอบ "โผล่ครึ่งใบ" บอกว่ามีต่อ
  function hsFit(row) {
    var kids = row.children, W = row.clientWidth; if (!W || kids.length < 2) return;
    var cs = getComputedStyle(row), pad = parseFloat(cs.paddingLeft) || 0, fs = parseFloat(cs.fontSize) || 12;
    var g0 = parseFloat(cs.getPropertyValue('--hs-gap')) * fs || 8, lo = g0 * 0.6, hi = g0 * 1.5, ws = [];
    for (var i = 0; i < kids.length; i++) ws.push(kids[i].getBoundingClientRect().width);
    var best = null;
    for (var c = 1; c < ws.length; c++) {
      var sum = 0; for (var j = 0; j < c; j++) sum += ws[j];
      var g = (W - ws[c] / 2 - pad - sum) / c;
      if (g >= lo && g <= hi && (best == null || Math.abs(g - g0) < Math.abs(best - g0))) best = g;
    }
    if (best != null) row.style.gap = best.toFixed(1) + 'px';
  }
  // ชิปที่เลือกเลื่อนเข้ามาให้เห็นทั้งใบ (เลื่อนเฉพาะแถว ไม่แตะสไลด์/หน้าเว็บ)
  function hsReveal(row, smooth) {
    var on = row.querySelector('.on'); if (!on) return;
    var r = row.getBoundingClientRect(), c = on.getBoundingClientRect(), pad = 12, d = 0;
    if (c.left < r.left + pad) d = c.left - r.left - pad;
    else if (c.right > r.right - pad) d = c.right - r.right + pad;
    if (d) row.scrollTo({ left: row.scrollLeft + d, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }
  function hsInit(root, revealKey) {
    Array.prototype.forEach.call(root.querySelectorAll('.hs[data-hs]'), function (row) {
      var k = row.getAttribute('data-hs');
      hsFit(row);
      if (HSPOS[k] != null) row.scrollLeft = HSPOS[k];
      if (k === revealKey) hsReveal(row, true);
      hsFade(row);
    });
  }
  // จับเหตุการณ์ครั้งเดียวที่ document (แถวถูกสร้างใหม่ทุกครั้งที่วาด)
  document.addEventListener('scroll', function (e) {
    var row = e.target; if (!row.classList || !row.classList.contains('hs')) return;
    HSPOS[row.getAttribute('data-hs')] = row.scrollLeft; hsFade(row);
  }, true);
  // ล้อเมาส์แนวตั้งบนแถว = เลื่อนแถวแนวนอน (ถ้ายังเลื่อนได้ · สุดแล้วปล่อยให้หน้าเว็บเลื่อนตามปกติ)
  document.addEventListener('wheel', function (e) {
    var row = e.target.closest && e.target.closest('.hs'); if (!row) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // ปัดแนวนอนบน trackpad = เลื่อนแถวเองอยู่แล้ว
    var max = row.scrollWidth - row.clientWidth, d = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    if ((d > 0 && row.scrollLeft >= max - 1) || (d < 0 && row.scrollLeft <= 0)) return;
    e.preventDefault(); row.scrollLeft += d;
  }, { passive: false });
  // ลากด้วยเมาส์ (นิ้วใช้การเลื่อนของเบราว์เซอร์เอง) · ลากแล้วไม่นับเป็นการแตะชิป
  var hsDrag = null, hsNoClick = 0;
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    var row = e.target.closest && e.target.closest('.hs'); if (!row) return;
    hsDrag = { row: row, x: e.clientX, sl: row.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', function (e) {
    if (!hsDrag) return;
    var dx = e.clientX - hsDrag.x;
    if (!hsDrag.moved && Math.abs(dx) < 5) return;
    if (!hsDrag.moved) { hsDrag.moved = true; hsDrag.row.style.scrollSnapType = 'none'; hsDrag.row.classList.add('drag'); }
    hsDrag.row.scrollLeft = hsDrag.sl - dx;
  });
  function hsEnd() {
    if (!hsDrag) return;
    if (hsDrag.moved) { hsNoClick = Date.now(); hsDrag.row.style.scrollSnapType = ''; hsDrag.row.classList.remove('drag'); }
    hsDrag = null;
  }
  window.addEventListener('pointerup', hsEnd); window.addEventListener('pointercancel', hsEnd);
  document.addEventListener('click', function (e) {
    if (Date.now() - hsNoClick < 300 && e.target.closest && e.target.closest('.hs')) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  var HOSTS = {}, built = {}, HSREV = null;
  var NAME = { login: 'login', location: 'loc', home: 'home', map: 'map', alert: 'alert', profile: 'prof' };
  function render(name, keepScroll) {
    var host = HOSTS[name]; if (!host || !built[name]) return;
    var sc = host.querySelector('.d-scroll'), top = sc ? sc.scrollTop : 0, toastMsg = host.querySelector('.d-toast.on');
    host.innerHTML = SC[name].html();
    if (keepScroll) { var s2 = host.querySelector('.d-scroll'); if (s2) s2.scrollTop = top; }
    hsInit(host, HSREV); HSREV = null;
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
    hsInit(host);
    if (SC[name].after) SC[name].after(host);
    host.addEventListener('click', function (e) {
      var el = e.target.closest('[data-a]');
      if (!el || !host.contains(el)) return;
      var a = el.getAttribute('data-a');
      // แตะพื้นหลังแผ่นล่าง = ปิด · แตะในแผ่นไม่ปิด
      if ((el.classList.contains('d-shw') || el.classList.contains('pv-ov') || el.classList.contains('co-w')) && e.target !== el) return;
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
      if (name === 'map' && M.co) { M.co = null; var cw = h.querySelector('.co-w.on'); if (cw) cw.classList.remove('on'); }
      if (name === 'alert' && A.full) { A.full = false; var af = h.querySelector('.al-full.on'); if (af) af.classList.remove('on'); }
      if (f) { f.classList.remove('on'); if (name === 'map') { F.open = false; F.picker = false; } if (name === 'alert') RF.open = false; }
    });
    updateLock();
  });
  document.addEventListener('siamdemo:go', function (e) {
    var h = hosts[e.detail]; if (h) build(h);
  });
})();
