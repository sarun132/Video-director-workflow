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
