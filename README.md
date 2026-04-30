# Claude Workshop — Landing Page & Course Registration

เว็บไซต์ Landing Page + ระบบลงทะเบียนคอร์สสำหรับ:

1. **Vibe Coding (เขียนโค้ดด้วยความรู้สึก)** by Claude Code
2. **ระบบงานอัตโนมัติ ด้วย Claude Cowork**

ดีไซน์แนว Modern editorial / brutalist (TBWA-inspired) โทนครีม-ดำ-แอ็กเซนต์เหลือง
รองรับ Desktop / Tablet / Mobile ภาษาไทยทั้งหมด

---

## เทคสแตก

**Frontend**
- React 18 + TypeScript
- Vite (dev / build)
- Tailwind CSS
- Framer Motion (animation)
- ฟอนต์: Archivo Black + IBM Plex Sans Thai + JetBrains Mono

**Backend**
- Express + TypeScript (รันด้วย tsx)
- PostgreSQL (pg)
- ทำงานเป็น Service เดียวกับ frontend ใน production (Express serve `dist/`)

**Deploy**
- Railway (Nixpacks)
- PostgreSQL plugin บน Railway

---

## โครงสร้างโปรเจกต์

```
.
├── index.html
├── vite.config.ts          # vite + proxy /api → :3000 (dev)
├── railway.json            # Railway build/start config
├── .env.example            # template env vars
├── tsconfig.{app,server,node}.json
├── server/
│   ├── index.ts            # Express app + API endpoints
│   └── db.ts               # PostgreSQL pool + schema init
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
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

## วิธีรันโปรเจกต์ (local development)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

ก็อปปี้ `.env.example` เป็น `.env`:

```bash
cp .env.example .env
```

แก้ค่าใน `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/claude_workshop
ADMIN_TOKEN=your-long-random-token
PORT=3000
NODE_ENV=development
```

> ถ้ายังไม่มี Postgres ในเครื่อง ใช้ Docker ก็ได้:
> `docker run -d -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=claude_workshop -p 5432:5432 postgres:16`

### 3. รัน dev server (frontend + backend พร้อมกัน)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3000
- Vite proxy `/api/*` → backend อัตโนมัติ

> รันแยกกันได้ด้วย `npm run dev:web` กับ `npm run dev:api`

### 4. Build production

```bash
npm run build
npm start
```

Server จะ serve `dist/` + API endpoint บนพอร์ตเดียวกัน

---

## Deploy ขึ้น Railway

### ขั้นที่ 1: สร้างโปรเจกต์และเพิ่ม PostgreSQL

1. เข้า [railway.com](https://railway.com) → New Project → **Deploy from GitHub repo** → เลือก `RegisterClaude`
2. ใน project นั้น คลิก **+ New** → **Database** → **PostgreSQL**
3. Railway จะตั้งค่า `DATABASE_URL` ให้อัตโนมัติ

### ขั้นที่ 2: เชื่อม env vars เข้า service

ใน service ของ web app ไปที่ tab **Variables** ตั้งค่า:

| Key | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (อ้างอิงจาก plugin) |
| `ADMIN_TOKEN` | สุ่มยาว ๆ — ใช้ดู registrations |
| `NODE_ENV` | `production` |

> `PORT` Railway ใส่ให้เอง ไม่ต้องตั้ง

### ขั้นที่ 3: Generate Domain

ใน service tab **Settings** → **Networking** → **Generate Domain**
จะได้ URL เช่น `claude-workshop-production.up.railway.app`

ครั้งแรกที่ deploy server จะสร้างตาราง `registrations` ให้อัตโนมัติ

---

## API Endpoints

### `POST /api/register`

ส่งใบสมัคร — body JSON:

```json
{
  "fullName": "สมชาย ใจดี",
  "phone": "0812345678",
  "email": "you@email.com",
  "company": "Acme Co.",
  "position": "Developer",
  "courseId": "vibe-coding",
  "batchId": "vibe-2",
  "expectation": "..."
}
```

Response 201:

```json
{ "ok": true, "id": 1, "createdAt": "2025-05-01T..." }
```

Response 400 (validation):

```json
{ "ok": false, "errors": { "email": "invalid" } }
```

### `GET /api/registrations` (admin)

Header `x-admin-token: <ADMIN_TOKEN>` — ส่งกลับรายการสมัครล่าสุด 500 records

### `GET /api/health`

Health check ใช้กับ Railway/uptime monitor

---

## Database schema

```sql
CREATE TABLE registrations (
  id          SERIAL PRIMARY KEY,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  position    TEXT,
  course_id   TEXT NOT NULL,
  batch_id    TEXT NOT NULL,
  expectation TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Server เรียก `initSchema()` ตอนบูต — ใช้ `CREATE TABLE IF NOT EXISTS` ปลอดภัยกับการ deploy ซ้ำ

---

## ดู registrations ที่สมัครมา

```bash
curl https://your-app.up.railway.app/api/registrations \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

หรือเข้า Railway PostgreSQL plugin → tab **Data** → ตาราง `registrations`

---

## การแก้ไขข้อมูลคอร์ส

แก้ที่ `src/data/courses.ts` ที่เดียว — ทั้งหน้าเว็บ + validation backend จะอัปเดตตาม

ถ้าเพิ่มคอร์สใหม่ อย่าลืมเพิ่ม mapping ใน `server/index.ts` ตัวแปร `COURSE_BATCHES`

---

## Tips

- **เปลี่ยนสี theme**: `tailwind.config.js` → `colors.cream` / `colors.sun`
- **เปลี่ยนฟอนต์**: `index.html` (Google Fonts) + `tailwind.config.js`
- **CORS / Domain**: ถ้า frontend ขึ้น domain แยก ให้แก้ `cors()` ใน `server/index.ts` ระบุ origin
