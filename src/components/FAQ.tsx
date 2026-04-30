import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './Courses';

const faqs = [
  {
    q: 'ต้องเขียนโค้ดเป็นไหม?',
    a: 'ไม่จำเป็น คอร์ส Vibe Coding ออกแบบมาให้คนที่ไม่มีพื้นฐานก็สามารถสร้างผลงานจริงด้วย Claude Code ได้ ส่วน Claude Cowork เน้นการออกแบบ workflow ไม่ต้องเขียนโค้ดเลย',
  },
  {
    q: 'ใช้เวลาเรียนกี่ชั่วโมง?',
    a: 'แต่ละรุ่นเรียน 2 ชั่วโมง 30 นาที (09.30 - 12.00 น.) เป็นเวิร์กช็อปแบบเข้มข้น ลงมือทำพร้อมกันตลอดคลาส',
  },
  {
    q: 'เรียนจบแล้วได้อะไร?',
    a: 'ผลงานจริงที่สร้างเสร็จในคลาส, ทักษะการใช้ AI ทำงานอย่างเป็นระบบ, template และเทคนิคที่นำกลับไปใช้ต่อยอดในงานของคุณได้ทันที',
  },
  {
    q: 'เหมาะกับใคร?',
    a: 'Developer, Designer, Project Manager, Business Owner, Operations หรือใครก็ตามที่อยากใช้ AI ช่วยทำงานให้เร็วขึ้นและมีประสิทธิภาพมากขึ้น',
  },
  {
    q: 'ต้องเตรียมอะไรบ้าง?',
    a: 'โน้ตบุ๊กของตัวเองมา 1 เครื่อง พร้อมต่ออินเทอร์เน็ตได้ ทีมงานจะส่งรายละเอียดเพิ่มเติมและลิงก์เข้าคลาสให้หลังยืนยันการลงทะเบียน',
  },
  {
    q: 'เรียนออนไลน์หรือออนไซต์?',
    a: 'ออนไลน์ผ่าน Video Conference เพื่อให้สามารถเข้าร่วมได้จากทุกที่ ทีมงานจะส่งลิงก์ก่อนวันเรียน',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-cream border-b-3 border-ink">
      <div className="container-narrow section-padding py-20 md:py-28">
        <SectionHeader
          number="05"
          eyebrow="FAQ"
          title="Got Questions? Same."
        />

        <div className="mt-14 border-t-3 border-ink">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`border-b-3 border-ink ${
                  isOpen ? 'bg-paper' : 'bg-transparent'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full px-2 md:px-6 py-6 md:py-8 flex items-center gap-6 text-left group"
                >
                  <span className="font-mono text-sm md:text-base font-bold w-12 flex-shrink-0">
                    /0{i + 1}
                  </span>
                  <span className="flex-1 font-display text-2xl md:text-4xl uppercase tracking-tight leading-tight">
                    {f.q}
                  </span>
                  <span
                    className={`flex-shrink-0 h-12 w-12 md:h-14 md:w-14 border-3 border-ink flex items-center justify-center transition-all ${
                      isOpen ? 'bg-ink text-sun rotate-45' : 'bg-paper'
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 md:px-6 pb-8 pl-[3.5rem] md:pl-[4.5rem] text-base md:text-lg font-medium leading-relaxed max-w-3xl">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
