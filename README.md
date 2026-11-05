# Siam Chat — เว็บไซต์หน้าแรก

เว็บ: https://eskimooo1234-maker.github.io/siamchat/

## แก้ข้อความ / ลิงก์

เปิด `index.html` แล้วดูส่วน `<script>` ด้านบนสุด (ใต้ `<link href="https://fonts...">`)

- `LINKS` — ลิงก์ Facebook / TikTok / LINE · ใส่ลิงก์แล้วปุ่มจะขึ้นเอง · เว้น `''` = ซ่อน
- `DOWNLOAD` — ส่วน "เริ่มใช้ 3 ขั้น" (id="install"): ข้อความขั้นที่ 1–3, ลิงก์ และหมายเหตุ
  (`groupUrl` = ลิงก์กลุ่ม Google Group · `playUrl` = ลิงก์ทดสอบ · `storeUrl` = หน้าแอปใน Play Store)

ข้อความอื่น ๆ (หัวข้อ, การ์ด) แก้ตรงในเนื้อ HTML ได้เลย

## ภาพหน้าจอแอป

วางไฟล์ชื่อ `assets/screen-1.png` (แนวตั้ง สัดส่วนประมาณ 9:19) แล้วภาพจะขึ้นในกรอบมือถือแทนภาพจำลองเอง

## ไฟล์

- `index.html` — ทั้งหน้า (CSS อยู่ในไฟล์)
- `assets/logo-64.png`, `logo-128.png` — โลโก้
- `assets/favicon-32.png`, `apple-touch-icon.png` — ไอคอนแท็บ/หน้าจอโฮม
- `assets/og.png` — ภาพตอนแชร์ลิงก์ (1200×630)
- `assets/districts.json` — รายชื่อ 77 จังหวัด / 928 อำเภอ-เขต (ชื่อไทย + จังหวัดเท่านั้น) สำหรับช่องค้นหา
  export จาก `src/data/provinces.ts` + `src/data/districts.ts` ของแอป · ค้นในเครื่องผู้ใช้ ไม่เรียก API ไม่เก็บสิ่งที่พิมพ์
