# Claude Workshop — Landing Page + Admin Dashboard

เว็บไซต์ลงทะเบียนคอร์ส **Vibe Coding** และ **ระบบงานอัตโนมัติด้วย Claude Cowork**
พร้อม **Admin Dashboard** สำหรับดูข้อมูลผู้สมัคร เก็บใน **Railway Volume**

---

## เทคสแตก

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind + Framer Motion + React Router |
| Backend | Express + TypeScript (run via tsx) |
| Storage | JSON file บน Railway Volume — atomic write + mutex |
| Hosting | Railway (single service, Nixpacks) |

ไม่ใช้ DB engine — ข้อมูลทั้งหมดอยู่ใน `registrations.json` ไฟล์เดียว

---

## โครงสร้างโปรเจกต์

```
.
├── index.html
├── vite.config.ts          # vite + proxy /api → :3000 (dev)
├── railway.json + nixpacks.toml
├── .env.example
├── tsconfig.{app,server,node}.json
├── server/
│   ├── index.ts            # Express + 4 endpoints
│   ├── store.ts            # JSON file: read/create/updateStatus/remove + mutex
│   └── courses.ts          # course/batch whitelist + display name
└── src/
    ├── App.tsx             # router (BrowserRouter + Routes)
    ├── types.ts            # Registration / RegistrationStatus
    ├── api.ts              # getRegistrations / createRegistration / updateRegistrationStatus / deleteRegistration
    ├── data/courses.ts     # ข้อมูลคอร์ส (ใช้ใน frontend)
    ├── pages/
    │   ├── Landing.tsx     # / — landing page
    │   └── Admin.tsx       # /admin — dashboard
    └── components/
        ├── (landing)       # Navbar, Hero, Courses, ExampleWork, WhyJoin, RegistrationForm, FAQ, Footer, SuccessModal
        └── admin/
            ├── AdminHeader.tsx
            ├── StatsCards.tsx
            ├── Filters.tsx
            ├── RegistrationsTable.tsx
            ├── DetailModal.tsx
            ├── ConfirmDialog.tsx
            └── StatusBadge.tsx
```

---

## รัน local development

### 1. ติดตั้ง

```bash
npm install
cp .env.example .env
```

ใน local ปล่อย `REGISTRATION_DATA_PATH` ว่างก็ได้ — fallback จะใช้ `./data/registrations.json`

### 2. รัน frontend + backend พร้อมกัน

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3000
- Vite proxy `/api/*` → backend
- เปิด http://localhost:5173/admin เพื่อใช้ dashboard

> รันแยกกันได้ด้วย `npm run dev:web` และ `npm run dev:api`

### 3. Production build แบบ local

```bash
npm run build
npm start
```

Express จะ serve `dist/` + API ในพอร์ตเดียวกัน

---

## Deploy ขึ้น Railway

### ขั้นที่ 1: สร้างโปรเจกต์ + เปิด volume

1. [Railway](https://railway.com) → **New Project** → **Deploy from GitHub** → เลือก repo
2. รอ build ครั้งแรกจบ
3. ที่ service → **Settings** → **Volumes** → **+ New Volume**
   - **Mount Path**: `/data`
   - **Size**: 1 GB

### ขั้นที่ 2: ตั้ง environment variables

Settings → **Variables**:

| Key | Value |
|---|---|
| `REGISTRATION_DATA_PATH` | `/data/registrations.json` |
| `NODE_ENV` | `production` |

> `PORT` Railway ตั้งให้เอง

### ขั้นที่ 3: Generate domain

Settings → **Networking** → **Generate Domain** → ได้ URL เช่น
`claude-register-production.up.railway.app`

ครั้งแรกที่ deploy server จะสร้าง `/data/registrations.json` ให้อัตโนมัติเป็น `[]`

### ขั้นที่ 4: ทดสอบ

- Landing: `https://YOUR-APP.up.railway.app/`
- Admin: `https://YOUR-APP.up.railway.app/admin`
- Health: `https://YOUR-APP.up.railway.app/api/health`

---

## API Endpoints

ทั้งหมด JSON, ไม่มี auth (เปิด public ตอนนี้ — ดูส่วน Security ด้านล่าง)

### `GET /api/registrations`
อ่านทุก registration จากไฟล์ → `Registration[]`

### `POST /api/registrations`
สร้างใหม่ — body:
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
Server เพิ่ม `id` (UUID), `createdAt`, `status: "new"`, `courseName`, `batchName`
→ `201 Registration` หรือ `400 { ok: false, errors: { email: "invalid" } }`

### `PATCH /api/registrations/:id/status`
body: `{ "status": "new" | "contacted" | "confirmed" | "cancelled" }`
→ `200 Registration` / `400 invalid_status` / `404 not_found`

### `DELETE /api/registrations/:id`
→ `200 { ok: true }` / `404 not_found`

### `GET /api/health`
→ `{ ok: true, time, registrations, storePath }`

---

## Storage details

### File handling
- ถ้า directory ไม่มี → สร้างให้
- ถ้าไฟล์ไม่มี → สร้างเป็น `[]`
- เขียนแบบ atomic: เขียน `.tmp` แล้ว `rename` ทับ (กัน corruption ถ้า process ตายระหว่างเขียน)
- ใช้ in-memory queue (`Promise` chain) serialize ทุก op — ไม่มี race condition
- Pretty JSON (`JSON.stringify(rows, null, 2)`)

### Corruption recovery
ถ้าเปิดไฟล์แล้ว parse ไม่ได้:
- backup ไฟล์เดิมเป็น `registrations.corrupt.<ISO_TIMESTAMP>.json`
- เขียน `registrations.json` ใหม่เป็น `[]`
- log error
- API ยังตอบกลับได้ปกติ (เห็นเป็น array ว่าง)

### Backup
```bash
# ผ่าน API (ผลลัพธ์ตาม filter ปัจจุบัน — กดปุ่ม Export CSV ใน /admin)
curl https://YOUR-APP.up.railway.app/api/registrations > backup-$(date +%F).json

# ผ่าน Railway shell ถ้าเปิดได้
cat /data/registrations.json
```

---

## Admin Dashboard (`/admin`)

- 5 stat cards: total / vibe / cowork / today / top batch
- ค้นหาจาก ชื่อ / เบอร์ / อีเมล / บริษัท
- Filter ตามคอร์ส, รุ่น, สถานะ + ปุ่ม Clear
- Table รวม view detail modal, change status dropdown, delete (พร้อม confirm)
- Export CSV (ตาม filter, UTF-8 BOM รองรับ Excel ภาษาไทย)
- Loading / error / empty / no-match states ครบ
- ปุ่ม Refresh ดึงข้อมูลใหม่จาก `GET /api/registrations`

---

## Security Notice

หน้า `/admin` เปิด public ตอนนี้ — **ห้ามใช้กับข้อมูลจริงโดยไม่เพิ่ม auth ก่อน**

แนะนำให้เพิ่มก่อนใช้งานจริง:
- HTTP Basic Auth middleware ที่ Express
- หรือ JWT + Login page
- หรือ Cloudflare Access / Railway Edge IP allowlist
- Role-based access control (admin / viewer)

ในหน้าจอ admin มี banner แจ้งเรื่องนี้ไว้แล้ว

---

## การแก้ไขข้อมูลคอร์ส

1. แก้ที่ `src/data/courses.ts` (frontend)
2. แก้ที่ `server/courses.ts` (backend whitelist + display name)

ทั้ง 2 ไฟล์ต้องสอดคล้องกัน — server validate `courseId`/`batchId` ก่อน insert
