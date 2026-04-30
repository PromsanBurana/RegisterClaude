# Claude Workshop — Landing Page & Course Registration

เว็บไซต์ Landing Page + ระบบลงทะเบียนคอร์สสำหรับ:

1. **Vibe Coding (เขียนโค้ดด้วยความรู้สึก)** by Claude Code
2. **ระบบงานอัตโนมัติ ด้วย Claude Cowork**

ดีไซน์แนว Modern / Premium / Glassmorphism พร้อม animation จาก Framer Motion
รองรับ Desktop / Tablet / Mobile แบบเต็มรูปแบบ ภาษาไทยทั้งหมด

---

## เทคโนโลยีที่ใช้

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Framer Motion** (animation)
- ฟอนต์ไทย: **Prompt** จาก Google Fonts

---

## วิธีรันโปรเจกต์

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. รัน dev server

```bash
npm run dev
```

เปิดเว็บไซต์ได้ที่ http://localhost:5173

### 3. Build production

```bash
npm run build
npm run preview
```

---

## โครงสร้างโปรเจกต์

```
Register Course/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx              # entry point
    ├── App.tsx               # ประกอบหน้าเว็บทั้งหมด
    ├── index.css             # global styles + tailwind
    ├── data/
    │   └── courses.ts        # ข้อมูลคอร์ส (แก้ที่นี่ที่เดียว)
    └── components/
        ├── Navbar.tsx        # nav bar แบบ sticky + mobile menu
        ├── Hero.tsx          # hero section พร้อม floating orbs
        ├── Courses.tsx       # การ์ดคอร์ส 2 ใบ พร้อม hover effect
        ├── ExampleWork.tsx   # ผลงานรุ่น 1 + browser mockup
        ├── WhyJoin.tsx       # เหตุผล 6 ข้อ ในรูปแบบ icon cards
        ├── RegistrationForm.tsx  # ฟอร์มลงทะเบียน + validation
        ├── FAQ.tsx           # คำถามที่พบบ่อย แบบ accordion
        ├── Footer.tsx        # footer
        └── SuccessModal.tsx  # modal แจ้งสำเร็จ
```

---

## การแก้ไขข้อมูลคอร์ส

เปิดไฟล์ `src/data/courses.ts` เพื่อแก้ไข:

- ชื่อคอร์ส, คำอธิบาย, highlights
- รอบเรียน (เพิ่ม/ลบ batch)
- กลุ่มเป้าหมาย
- ลิงก์ตัวอย่างผลงาน

ทุกส่วนของเว็บที่อ้างอิงข้อมูลคอร์สจะอัปเดตอัตโนมัติ

---

## การต่อ Backend ภายหลัง

เปิดไฟล์ `src/components/RegistrationForm.tsx` ฟังก์ชัน `handleSubmit`
มีจุดให้ต่อ API ตามคอมเมนต์:

```ts
// Placeholder for future API integration
// await fetch('/api/register', { method: 'POST', body: JSON.stringify(data) })
```

โครงสร้างข้อมูล `RegistrationData`:

```ts
type RegistrationData = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  courseId: string;     // 'vibe-coding' | 'cowork-automation'
  batchId: string;      // 'vibe-2', 'vibe-3', 'cowork-1', 'cowork-2'
  expectation: string;
};
```

---

## Features

- ✨ Glassmorphism + gradient background แบบหลายเลเยอร์
- 🎯 Sticky navigation พร้อม mobile menu
- 🌊 Smooth scroll ระหว่าง section
- 🪄 Animation ตอน scroll เข้ามา (fade-in, slide-in)
- 💎 Hover effects บน card / button
- 🪂 Floating orbs ใน hero section
- ✅ Form validation พร้อม error message
- 🔄 Dropdown รุ่นเรียนเปลี่ยนตามคอร์สที่เลือก
- 🎉 Success modal แบบ animated checkmark
- 📱 Responsive ทุกขนาดหน้าจอ

---

## Tips การปรับแต่ง

- **เปลี่ยนสี theme**: แก้ใน `tailwind.config.js` ที่ `colors.brand`
- **เปลี่ยนฟอนต์**: แก้ใน `index.html` (Google Fonts) และ `tailwind.config.js`
- **เพิ่ม FAQ**: แก้ใน `src/components/FAQ.tsx` array `faqs`
- **เปลี่ยน contact**: แก้ใน `src/components/Footer.tsx`
