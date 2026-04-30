import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

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
    <Section id="faq" tone="bg">
      <Container size="lg">
        <SectionHeader
          align="center"
          eyebrow="FAQ"
          title="Got questions?"
          description="คำถามที่พบบ่อย — หากยังไม่มีคำตอบ ติดต่อทีมงานได้เลย"
        />

        <div className="mt-12 sm:mt-14 rounded-2xl border border-line bg-surface divide-y divide-line">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="px-5 sm:px-7"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full py-5 sm:py-6 flex items-center gap-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 text-base sm:text-lg font-medium text-fg group-hover:text-fg transition-colors">
                    {f.q}
                  </span>
                  <span
                    className={`flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all ${
                      isOpen
                        ? 'bg-accent text-white border-accent rotate-45'
                        : 'text-fg-secondary group-hover:border-line-strong group-hover:text-fg'
                    }`}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
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
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-12 text-sm sm:text-base text-fg-secondary leading-relaxed">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
