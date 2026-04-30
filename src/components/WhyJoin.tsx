import { motion } from 'framer-motion';
import SectionTitle from './ui/SectionTitle';

const reasons = [
  { n: '01', title: 'เร็วขึ้น 10x', desc: 'ใช้ AI ช่วยร่นเวลา จากชั่วโมงเป็นนาที' },
  { n: '02', title: 'ทำงานจริงได้', desc: 'Hands-on workshop ออกจากคลาสได้ผลงานจริง' },
  { n: '03', title: 'ไม่ต้องเริ่มจากศูนย์', desc: 'มี template และเทคนิคให้ใช้ได้ทันที' },
  { n: '04', title: 'AI อย่างเป็นระบบ', desc: 'เข้าใจ workflow ที่ถูกต้อง ไม่ใช่ prompt มั่ว' },
  { n: '05', title: 'กลุ่มเล็ก คุยตัวต่อตัว', desc: 'ปรึกษาได้ทุกประเด็น ผู้สอนดูแลทุกคน' },
  { n: '06', title: 'ต่อยอดได้ไม่สิ้นสุด', desc: 'นำเทคนิคไปสร้างระบบของตัวเองต่อได้' },
];

export default function WhyJoin() {
  return (
    <section id="why" className="relative bg-sun border-b-3 border-ink">
      <div className="container-narrow section-padding py-20 md:py-28">
        <SectionTitle
          number="03"
          eyebrow="Why Join"
          title={<>No Theory.<br />Only Output.</>}
          subtitle="เราโฟกัสที่ผลลัพธ์จริง — คุณจะออกจากคลาสพร้อมผลงานและทักษะที่ใช้ได้ทันที"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-3 border-ink bg-ink">
          {reasons.map((r, idx) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className={`group relative p-6 md:p-8 bg-paper hover:bg-ink hover:text-sun transition-colors duration-300 ${getBorders(idx)}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display leading-none tracking-tight text-6xl md:text-7xl">
                  {r.n}
                </span>
                <span className="font-display text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl md:text-3xl uppercase tracking-tight leading-tight">
                {r.title}
              </h3>
              <p className="mt-3 text-sm md:text-base font-medium leading-snug max-w-xs opacity-80">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getBorders(idx: number) {
  // Build a precise border map for the 3-col / 2-col grid (6 items)
  // sm = 2 cols (rows: [0,1], [2,3], [4,5])
  // lg = 3 cols (rows: [0,1,2], [3,4,5])
  const cls: string[] = [];
  // Bottom borders for non-final rows
  if (idx < 4) cls.push('sm:border-b-3');
  if (idx < 3) cls.push('lg:border-b-3');
  // Right borders for non-rightmost columns
  if (idx % 2 === 0) cls.push('sm:border-r-3');
  if (idx % 3 !== 2) cls.push('lg:border-r-3');
  cls.push('border-ink', 'border-b-3 last:border-b-0');
  return cls.join(' ');
}
