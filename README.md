# Siam Chat — เว็บไซต์หน้าแรก

เว็บ: https://eskimooo1234-maker.github.io/siamchat/

## แก้ข้อความ / ลิงก์

เปิด `index.html` แล้วดูส่วน `<script>` ด้านบนสุด (ใต้ `<link href="https://fonts...">`)

- `LINKS` — ลิงก์ Facebook / TikTok / LINE · ใส่ลิงก์แล้วปุ่มจะขึ้นเอง · เว้น `''` = ซ่อน
- `DOWNLOAD` — อีเมลติดต่อ, ข้อความขั้นที่ 1–2, ลิงก์ Google Play, หมายเหตุ
  (เปลี่ยนเป็น Google Group ได้ที่ `step1`, `step1Btn` และ `playUrl`)

ข้อความอื่น ๆ (หัวข้อ, การ์ด) แก้ตรงในเนื้อ HTML ได้เลย

## ภาพหน้าจอแอป

วางไฟล์ชื่อ `assets/screen-1.png` (แนวตั้ง สัดส่วนประมาณ 9:19) แล้วภาพจะขึ้นในกรอบมือถือแทนภาพจำลองเอง

## ไฟล์

- `index.html` — ทั้งหน้า (CSS อยู่ในไฟล์)
- `assets/logo-64.png`, `logo-128.png` — โลโก้
- `assets/favicon-32.png`, `apple-touch-icon.png` — ไอคอนแท็บ/หน้าจอโฮม
- `assets/og.png` — ภาพตอนแชร์ลิงก์ (1200×630)
