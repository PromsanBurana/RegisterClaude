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
| `USERS_DATA_PATH` | `/data/users.json` |
| `SESSION_SECRET` | `<openssl rand -hex 32>` |
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

ทั้งหมด JSON. Admin endpoints ต้องส่ง session cookie (ได้จาก `/api/auth/login`)

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | public | body `{ username, password }` → set cookie + return user |
| `POST` | `/api/auth/logout` | any | clear cookie |
| `GET`  | `/api/auth/me`     | session | คืนข้อมูล user ปัจจุบัน หรือ 401 |

### Registrations

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | **public** | form submission |
| `GET`  | `/api/registrations` | **admin** | list ทั้งหมด |
| `PATCH`| `/api/registrations/:id/status` | **admin** | เปลี่ยนสถานะ |
| `DELETE`| `/api/registrations/:id` | **admin** | ลบ |
| `GET`  | `/api/health` | public | health + count |

POST body shape:
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
→ `201 Registration` / `400 { ok: false, errors: { email: "invalid" } }`

PATCH status:
```json
{ "status": "new" | "contacted" | "confirmed" | "cancelled" }
```

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

## Authentication & RBAC

ระบบ login + role-based access control เปิดใช้งานแล้ว

### Default account

| field | value |
|---|---|
| username | `admin` |
| password | `admin` |
| role | `admin` |

⚠️ **เปลี่ยน password ทันทีหลังเข้าใช้ครั้งแรก** (ดูส่วน "เปลี่ยน password" ด้านล่าง)

### Implementation

- **Password hashing**: scrypt + random 16-byte salt, format `scrypt$<saltHex>$<hashHex>`
- **Sessions**: HMAC-SHA256 signed cookie (`auth`), httpOnly + sameSite=lax + secure (prod)
- **TTL**: 7 วัน
- **Role enforcement**: middleware `requireAuth` + `requireRole('admin')` ที่ Express
- **User store**: ไฟล์ JSON แยก `/data/users.json` (atomic write + corruption recovery เหมือน registrations)
- ครั้งแรกที่บูต ถ้าไม่มี user เลย → seed `admin/admin` อัตโนมัติ

### env vars เกี่ยวข้อง

| Key | Default | Notes |
|---|---|---|
| `SESSION_SECRET` | random per-process | ต้องตั้งใน production มิฉะนั้นทุก deploy จะ logout ผู้ใช้ |
| `USERS_DATA_PATH` | `<DATA_DIR>/users.json` | ไฟล์เก็บ users |

Generate secret:
```bash
openssl rand -hex 32
```

### Frontend flow

- เข้า `/admin` ที่ยังไม่ login → redirect ไป `/admin/login` พร้อมจำ "from" path
- Login สำเร็จ → redirect กลับไปยัง path เดิม
- Logout → clear cookie + กลับไป `/admin/login`
- AuthProvider เรียก `GET /api/auth/me` ตอน mount เพื่อ restore session

### เปลี่ยน password ของ admin

ทำได้ 2 วิธี:

1. **แก้ไฟล์ `users.json` ตรง ๆ** (ผ่าน Railway shell)
   ```bash
   # gen hash ใหม่
   node -e "import('./server/passwords.js').then(m => console.log(m.hashPassword('NEW_PASSWORD')))"
   # paste ลงใน passwordHash ของ user
   ```

2. **ลบไฟล์ `users.json`** → server จะ seed `admin/admin` ใหม่
   (ใช้ตอน lock-out เท่านั้น)

> สามารถพัฒนา UI สำหรับเปลี่ยนรหัสผ่าน/เพิ่ม user ได้ในอนาคต — base API พร้อม

### ข้อควรปรับเพิ่มก่อน production จริง

- เปลี่ยน password เริ่มต้น
- ตั้ง `SESSION_SECRET` ที่แข็งแรง (32+ chars random)
- เพิ่ม rate-limit บน `/api/auth/login` (express-rate-limit)
- พิจารณาใช้ HTTPS เท่านั้น (Railway ให้ default)
- เพิ่ม CSRF protection ถ้ามี cross-origin request

---

## การแก้ไขข้อมูลคอร์ส

1. แก้ที่ `src/data/courses.ts` (frontend)
2. แก้ที่ `server/courses.ts` (backend whitelist + display name)

ทั้ง 2 ไฟล์ต้องสอดคล้องกัน — server validate `courseId`/`batchId` ก่อน insert
