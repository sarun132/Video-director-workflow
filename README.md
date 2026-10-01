# Video-director-workflow

## Random Account Generator

`account_generator.py` สุ่มข้อมูลออกมาเป็น JSON:

```json
{
  "email": "j72rk6w9x1p5@gmail.com",
  "password": "X*XE1Bb5-?L%%)jN",
  "random": "wkxcddzkvw,lcppqwhivk"
}
```

- `email` — `{emailname}@gmail.com` (ชื่อ 12 ตัว a-z/0-9)
- `password` — 16 ตัว มี lowercase + uppercase + ตัวเลข + อักษรพิเศษ ครบทุกชนิดแน่นอน
- `random` — `{a-z 10 ตัว},{a-z 10 ตัว}`

ใช้ `secrets` (cryptographically secure) ในการสุ่ม

### รันผ่าน command line

```bash
python account_generator.py        # 1 รายการ
python account_generator.py -n 5   # 5 รายการ (JSON array)
```

### ใช้เป็น module

```python
import account_generator as g
g.generate_record()   # dict
g.generate_json(5)    # JSON string
```

### Web UI (GitHub Pages)

`index.html` รัน `account_generator.py` ในเบราว์เซอร์ผ่าน [Pyodide](https://pyodide.org) —
ไม่ต้องมี server. Workflow `.github/workflows/pages.yml` deploy ขึ้น GitHub Pages ทุกครั้งที่ push เข้า `main`.

ตั้งค่าครั้งแรก: **Settings → Pages → Build and deployment → Source: GitHub Actions**

ทดสอบบนเครื่อง: `python -m http.server` แล้วเปิด http://localhost:8000

## CAPTCHA Notifier (Chrome extension)

โฟลเดอร์ `captcha-notifier/` เป็น extension ที่คอยดูหน้าเว็บแล้วเด้งแจ้งเตือนบน desktop เมื่อมี reCAPTCHA / hCaptcha ให้แก้
คลิกที่แจ้งเตือนแล้วจะสลับไปที่แท็บนั้นให้ทันที (ตัว extension ไม่ได้แก้ CAPTCHA ให้)

- แจ้งเตือนเมื่อมีหน้าต่างโจทย์ (เลือกรูป) โผล่ขึ้นมา และเมื่อมีกล่อง "I'm not a robot" ที่ยังไม่ได้กด (ปิดได้ใน popup)
- แจ้งเตือนค้างบนจอจนกว่าจะคลิกหรือปิด และหายเองเมื่อแก้ CAPTCHA เสร็จ
- ไอคอนของ extension ขึ้น badge `!` ที่แท็บที่มี CAPTCHA

ติดตั้ง: `chrome://extensions` → เปิด **Developer mode** → **Load unpacked** → เลือกโฟลเดอร์ `captcha-notifier`
แล้วกด **ทดสอบแจ้งเตือน** ใน popup ถ้าไม่เด้ง ให้เช็กว่า OS อนุญาตให้ Chrome แจ้งเตือนได้
(Windows: Settings → System → Notifications, macOS: System Settings → Notifications → Google Chrome)
