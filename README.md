# Claude Workshop — Landing Page & Course Registration

เว็บไซต์ Landing Page + ระบบลงทะเบียนคอร์สสำหรับ:

1. **Vibe Coding (เขียนโค้ดด้วยความรู้สึก)** by Claude Code
2. **ระบบงานอัตโนมัติ ด้วย Claude Cowork**

ดีไซน์แนว Modern editorial / brutalist (TBWA-inspired) โทนครีม-ดำ-แอ็กเซนต์เหลือง
ภาษาไทยทั้งหมด รองรับ Desktop / Tablet / Mobile

---

## เทคสแตก

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- ฟอนต์: Archivo Black + IBM Plex Sans Thai + JetBrains Mono

**Backend**
- Express + TypeScript (รันด้วย tsx)
- **SQLite (better-sqlite3)** — ฐานข้อมูลไฟล์เดียว
- ทำงานเป็น Service เดียวกับ frontend

**Storage**
- **Railway Volume** — persistent disk mount ที่ `/data`
- ไฟล์ DB เก็บที่ `/data/registrations.db`
- ข้อมูลคงอยู่ข้าม deploys, restarts, redeploys

---

## โครงสร้างโปรเจกต์

```
.
├── index.html
├── vite.config.ts          # vite + proxy /api → :3000 (dev)
├── railway.json            # build/start config
├── nixpacks.toml           # native build deps for better-sqlite3
├── .env.example
├── tsconfig.{app,server,node}.json
├── server/
│   ├── index.ts            # Express app + API endpoints
│   └── db.ts               # SQLite + auto-create schema
├── data/                   # local dev DB (gitignored)
│   └── registrations.db
└── src/
    ├── App.tsx
    ├── data/courses.ts     # ข้อมูลคอร์ส (แก้ที่นี่)
    └── components/
        ├── Navbar.tsx
        ├── Hero.tsx
        ├── Marquee.tsx
        ├── Courses.tsx
        ├── ExampleWork.tsx
        ├── WhyJoin.tsx
        ├── RegistrationForm.tsx   # POST /api/register
        ├── FAQ.tsx
        ├── Footer.tsx
        └── SuccessModal.tsx
```

---

## รัน local development

### 1. ติดตั้ง

```bash
npm install
```

### 2. ตั้งค่า env

```bash
cp .env.example .env
```

ใน local ปล่อย `DATA_DIR` ว่างก็ได้ — ระบบจะใช้ `./data/` อัตโนมัติ

### 3. รัน frontend + backend พร้อมกัน

```bash
npm run dev
```

- Frontend: http://localhost:5173 (Vite)
- Backend:  http://localhost:3000 (Express + SQLite)
- Vite proxy `/api/*` → backend อัตโนมัติ

> รันแยกกันได้ด้วย `npm run dev:web` กับ `npm run dev:api`

### 4. Build + start production แบบ local

```bash
npm run build
npm start
```

Express จะ serve `dist/` + API ในพอร์ตเดียวกัน (default 3000)

---

## Deploy ขึ้น Railway (ใช้ Volume)

### ขั้นที่ 1: สร้างโปรเจกต์

1. เข้า [railway.com](https://railway.com) → **New Project**
2. **Deploy from GitHub repo** → เลือก `RegisterClaude`
3. รอ build ครั้งแรกเสร็จ (Nixpacks จะ install Python + gcc เพื่อ compile better-sqlite3)

### ขั้นที่ 2: เพิ่ม Volume

ใน service ที่เพิ่ง deploy ไปที่:

1. **Settings** → **Volumes** → **+ New Volume**
2. **Mount Path**: `/data`
3. **Size**: 1 GB ก็พอ (ขยายภายหลังได้)
4. **Attach** เข้ากับ service

### ขั้นที่ 3: ตั้ง env vars

ที่ tab **Variables** เพิ่ม:

| Key | Value |
|---|---|
| `DATA_DIR` | `/data` |
| `ADMIN_TOKEN` | สุ่มยาว ๆ เช่น `openssl rand -hex 32` |
| `NODE_ENV` | `production` |

> `PORT` Railway ใส่ให้เอง

### ขั้นที่ 4: Generate domain

**Settings** → **Networking** → **Generate Domain** → ได้ URL เช่น
`claude-workshop-production.up.railway.app`

ครั้งแรกที่ deploy server จะสร้างไฟล์ `/data/registrations.db` พร้อมตาราง `registrations` ให้อัตโนมัติ

### ขั้นที่ 5: ทดสอบ

```bash
# health check (ควรขึ้นจำนวน registrations)
curl https://YOUR-APP.up.railway.app/api/health

# ส่งใบสมัครจริงผ่านเว็บ จากนั้น:
curl https://YOUR-APP.up.railway.app/api/registrations \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

---

## ทำไมใช้ Volume + SQLite

| | SQLite + Volume | PostgreSQL plugin |
|---|---|---|
| Setup | 1 service | 2 services |
| Cost | $0 plugin (volume only) | $5/mo plugin |
| Latency | in-process (<1ms) | network round-trip |
| Backup | snapshot volume / curl `/api/registrations` | built-in |
| Scale | 1 service เท่านั้น | scale ได้ |

เหมาะกับ workshop registration ที่ traffic ไม่สูง อยากเก็บข้อมูลถาวรแบบประหยัด

---

## API Endpoints

### `POST /api/register`

```json
{
  "fullName": "สมชาย ใจดี",
  "phone": "0812345678",
  "email": "you@email.com",
  "company": "Acme",
  "position": "Developer",
  "courseId": "vibe-coding",
  "batchId": "vibe-2",
  "expectation": "..."
}
```

→ `201 { ok: true, id, createdAt }`
→ `400 { ok: false, errors: { email: "invalid", ... } }`

### `GET /api/registrations` (admin)

Header: `x-admin-token: <ADMIN_TOKEN>`
→ คืน 500 records ล่าสุด

### `GET /api/health`

→ `{ ok: true, time, registrations: <count> }`

---

## Database schema

```sql
CREATE TABLE registrations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  position    TEXT,
  course_id   TEXT NOT NULL,
  batch_id    TEXT NOT NULL,
  expectation TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

`server/db.ts` รัน `CREATE TABLE IF NOT EXISTS` ตอนบูตเสมอ — ปลอดภัยกับการ deploy ซ้ำ

---

## ดู / backup ข้อมูล

**ผ่าน API:**
```bash
curl https://YOUR-APP.up.railway.app/api/registrations \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  | jq > backup-$(date +%F).json
```

**ผ่าน Railway shell** (ถ้ามี):
```bash
sqlite3 /data/registrations.db "SELECT * FROM registrations;"
```

---

## การแก้ไขข้อมูลคอร์ส

แก้ที่ `src/data/courses.ts` ที่เดียว — frontend จะอัปเดตตาม
ถ้าเพิ่มคอร์สใหม่ อย่าลืมเพิ่ม mapping ใน `server/index.ts` ตัวแปร `COURSE_BATCHES` ด้วย
(server validate batch กับ course เพื่อกัน input ที่ไม่ตรงกัน)
