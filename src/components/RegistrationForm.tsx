import { useEffect, useMemo, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { courses, findCourseById } from '../data/courses';
import { SectionHeader } from './Courses';

export type RegistrationData = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  courseId: string;
  batchId: string;
  expectation: string;
};

const initialData: RegistrationData = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  position: '',
  courseId: '',
  batchId: '',
  expectation: '',
};

type Errors = Partial<Record<keyof RegistrationData, string>>;

type Props = {
  selectedCourseId: string | null;
  onSuccess: (data: RegistrationData) => void;
};

const RegistrationForm = forwardRef<HTMLElement, Props>(
  ({ selectedCourseId, onSuccess }, ref) => {
    const [data, setData] = useState<RegistrationData>(initialData);
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
      if (selectedCourseId && selectedCourseId !== data.courseId) {
        setData((d) => ({ ...d, courseId: selectedCourseId, batchId: '' }));
      }
    }, [selectedCourseId]); // eslint-disable-line react-hooks/exhaustive-deps

    const selectedCourse = useMemo(
      () => findCourseById(data.courseId),
      [data.courseId],
    );

    const update = <K extends keyof RegistrationData>(
      key: K,
      value: RegistrationData[K],
    ) => {
      setData((d) => ({ ...d, [key]: value }));
      setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validate = (): boolean => {
      const next: Errors = {};
      if (!data.fullName.trim()) next.fullName = 'กรุณากรอกชื่อ-นามสกุล';
      if (!data.phone.trim()) next.phone = 'กรุณากรอกเบอร์โทร';
      else if (!/^[0-9\-+\s()]{8,}$/.test(data.phone))
        next.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง';
      if (!data.email.trim()) next.email = 'กรุณากรอกอีเมล';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        next.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      if (!data.courseId) next.courseId = 'กรุณาเลือกคอร์ส';
      if (!data.batchId) next.batchId = 'กรุณาเลือกรอบเรียน';
      setErrors(next);
      return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.ok) {
          if (json?.errors) {
            const mapped: Errors = {};
            for (const k of Object.keys(json.errors) as (keyof RegistrationData)[]) {
              mapped[k] = 'ข้อมูลไม่ถูกต้อง';
            }
            setErrors(mapped);
          } else {
            setSubmitError('ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          }
          return;
        }

        onSuccess(data);
        setData(initialData);
        setErrors({});
      } catch (err) {
        console.error(err);
        setSubmitError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <section
        id="register"
        ref={ref}
        className="relative bg-paper border-b-3 border-ink"
      >
        <div className="container-narrow section-padding py-20 md:py-28">
          <SectionHeader
            number="04"
            eyebrow="Apply Now"
            title="Get In. Get Building."
            subtitle="กรอกแบบฟอร์มเพื่อสมัคร ทีมงานจะติดต่อกลับเพื่อยืนยันที่นั่งภายใน 24 ชม."
          />

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid lg:grid-cols-12 gap-0 border-3 border-ink"
          >
            <div className="lg:col-span-4 bg-ink text-cream p-6 md:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.25em] mb-6">
                / Form 04
              </p>
              <h3 className="font-display text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight">
                Apply.
                <br />
                We Reply.
                <br />
                You Build.
              </h3>
              <div className="mt-10 space-y-4 text-sm font-medium">
                <div className="flex items-start gap-3">
                  <span className="font-display text-xl">→</span>
                  <span>กรอกฟอร์มให้ครบ ใช้เวลาไม่ถึง 2 นาที</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-display text-xl">→</span>
                  <span>ทีมงานติดต่อกลับใน 24 ชม. เพื่อยืนยันที่นั่ง</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-display text-xl">→</span>
                  <span>ชำระเงินแล้วรอวันเรียน</span>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t-3 border-cream">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                  / Status
                </p>
                <p className="mt-2 flex items-center gap-2 font-bold uppercase">
                  <span className="h-2 w-2 rounded-full bg-sun animate-blink" />
                  Now Enrolling
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 bg-cream p-6 md:p-10">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
                <Field label="ชื่อ-นามสกุล" required error={errors.fullName} full>
                  <input
                    type="text"
                    className="input-bw"
                    placeholder="สมชาย ใจดี"
                    value={data.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                  />
                </Field>

                <Field label="เบอร์โทร" required error={errors.phone}>
                  <input
                    type="tel"
                    className="input-bw"
                    placeholder="08X-XXX-XXXX"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </Field>

                <Field label="อีเมล" required error={errors.email}>
                  <input
                    type="email"
                    className="input-bw"
                    placeholder="you@email.com"
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </Field>

                <Field label="บริษัท / หน่วยงาน">
                  <input
                    type="text"
                    className="input-bw"
                    placeholder="ชื่อบริษัท"
                    value={data.company}
                    onChange={(e) => update('company', e.target.value)}
                  />
                </Field>

                <Field label="ตำแหน่ง">
                  <input
                    type="text"
                    className="input-bw"
                    placeholder="Developer / PM / ฯลฯ"
                    value={data.position}
                    onChange={(e) => update('position', e.target.value)}
                  />
                </Field>

                <Field label="เลือกคอร์ส" required error={errors.courseId} full>
                  <select
                    className="input-bw appearance-none cursor-pointer"
                    value={data.courseId}
                    onChange={(e) => {
                      update('courseId', e.target.value);
                      update('batchId', '');
                    }}
                  >
                    <option value="">— กรุณาเลือกคอร์ส —</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="เลือกรอบเรียน" required error={errors.batchId} full>
                  <select
                    className="input-bw appearance-none cursor-pointer disabled:opacity-40"
                    value={data.batchId}
                    onChange={(e) => update('batchId', e.target.value)}
                    disabled={!selectedCourse}
                  >
                    <option value="">
                      {selectedCourse
                        ? '— กรุณาเลือกรอบเรียน —'
                        : 'โปรดเลือกคอร์สก่อน'}
                    </option>
                    {selectedCourse?.batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label} • {b.date} • {b.time}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="ความคาดหวัง" full>
                  <textarea
                    className="input-bw min-h-[100px] resize-y"
                    placeholder="คุณอยากได้อะไรจากคอร์สนี้..."
                    value={data.expectation}
                    onChange={(e) => update('expectation', e.target.value)}
                  />
                </Field>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-3 border-signal bg-signal/10 px-4 py-3 text-sm font-bold text-signal"
                >
                  ↳ {submitError}
                </motion.div>
              )}

              <div className="mt-10 pt-6 border-t-3 border-ink flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <p className="text-xs font-mono uppercase tracking-widest opacity-60">
                  / กดส่งคือยืนยันให้ติดต่อกลับ
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-ink group disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-sun/40 border-t-sun animate-spin" />
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      ส่งใบสมัคร
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    );
  },
);

RegistrationForm.displayName = 'RegistrationForm';
export default RegistrationForm;

function Field({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label-bw">
        {label}
        {required && <span className="text-signal ml-1">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs font-bold text-signal uppercase tracking-wide"
        >
          ↳ {error}
        </motion.p>
      )}
    </div>
  );
}
