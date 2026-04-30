import { useEffect, useMemo, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { courses, findCourseById } from '../data/courses';
import { createRegistration, ApiError } from '../api';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';
import { Input, Textarea, Select, FormField } from './ui/Input';
import MeshBackdrop from './ui/MeshBackdrop';
import ChapterMarker from './landing/ChapterMarker';

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
    const [touched, setTouched] = useState<Partial<Record<keyof RegistrationData, boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
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

    const validateField = <K extends keyof RegistrationData>(
      key: K,
      value: RegistrationData[K],
      sourceData: RegistrationData = data,
    ): string | undefined => {
      const v = String(value).trim();
      switch (key) {
        case 'fullName':
          if (!v) return 'กรุณากรอกชื่อ-นามสกุล';
          return;
        case 'phone':
          if (!v) return 'กรุณากรอกเบอร์โทร';
          if (!/^[0-9\-+\s()]{8,}$/.test(v)) return 'รูปแบบเบอร์โทรไม่ถูกต้อง';
          return;
        case 'email':
          if (!v) return 'กรุณากรอกอีเมล';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'รูปแบบอีเมลไม่ถูกต้อง';
          return;
        case 'courseId':
          if (!v) return 'กรุณาเลือกคอร์ส';
          return;
        case 'batchId':
          if (!v) return 'กรุณาเลือกรอบเรียน';
          return;
        default:
          return;
      }
      // sourceData is currently unused but kept for future cross-field rules.
      void sourceData;
    };

    const update = <K extends keyof RegistrationData>(
      key: K,
      value: RegistrationData[K],
    ) => {
      setData((d) => {
        const next = { ...d, [key]: value };
        // Re-validate touched fields in realtime so the user sees feedback as they type
        if (touched[key] || submitAttempted) {
          setErrors((e) => ({ ...e, [key]: validateField(key, value, next) }));
        } else {
          setErrors((e) => ({ ...e, [key]: undefined }));
        }
        return next;
      });
    };

    const handleBlur = <K extends keyof RegistrationData>(key: K) => {
      setTouched((t) => ({ ...t, [key]: true }));
      setErrors((e) => ({ ...e, [key]: validateField(key, data[key]) }));
    };

    const validate = (): boolean => {
      const next: Errors = {};
      (Object.keys(data) as (keyof RegistrationData)[]).forEach((k) => {
        const err = validateField(k, data[k]);
        if (err) next[k] = err;
      });
      setErrors(next);
      return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitAttempted(true);
      if (!validate()) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        await createRegistration(data);
        onSuccess(data);
        setData(initialData);
        setErrors({});
        setTouched({});
        setSubmitAttempted(false);
      } catch (err) {
        if (err instanceof ApiError && err.fieldErrors) {
          const mapped: Errors = {};
          for (const k of Object.keys(err.fieldErrors) as (keyof RegistrationData)[]) {
            mapped[k] = 'ข้อมูลไม่ถูกต้อง';
          }
          setErrors(mapped);
        } else {
          console.error(err);
          setSubmitError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
        }
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Section id="register" ref={ref} tone="bg" className="overflow-hidden">
        <MeshBackdrop intensity="subtle" />
        <Container size="lg" className="relative">
          <div className="flex justify-center mb-6">
            <ChapterMarker number="04" label="Final scene · Apply" />
          </div>
          <SectionHeader
            align="center"
            eyebrow="Apply"
            title={
              <>
                Get in.
                <br />
                <span className="text-gradient-cool">Get building.</span>
              </>
            }
            description="กรอกแบบฟอร์มเพื่อสมัคร ทีมงานจะติดต่อกลับเพื่อยืนยันที่นั่งภายใน 24 ชั่วโมง"
            className="mx-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-14 rounded-3xl border border-line bg-surface shadow-card p-6 sm:p-9"
          >
            <form
              onSubmit={handleSubmit}
              className="grid sm:grid-cols-2 gap-x-5 gap-y-6"
            >
              <FormField label="ชื่อ-นามสกุล" required error={errors.fullName} full>
                <Input
                  type="text"
                  placeholder="สมชาย ใจดี"
                  value={data.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
              </FormField>

              <FormField label="เบอร์โทร" required error={errors.phone}>
                <Input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
              </FormField>

              <FormField label="อีเมล" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
              </FormField>

              <FormField label="บริษัท / หน่วยงาน">
                <Input
                  type="text"
                  placeholder="ชื่อบริษัท (optional)"
                  value={data.company}
                  onChange={(e) => update('company', e.target.value)}
                />
              </FormField>

              <FormField label="ตำแหน่ง">
                <Input
                  type="text"
                  placeholder="เช่น Developer / PM"
                  value={data.position}
                  onChange={(e) => update('position', e.target.value)}
                />
              </FormField>

              <FormField label="เลือกคอร์ส" required error={errors.courseId} full>
                <Select
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
                </Select>
              </FormField>

              <FormField label="เลือกรอบเรียน" required error={errors.batchId} full>
                <Select
                  value={data.batchId}
                  onChange={(e) => update('batchId', e.target.value)}
                  disabled={!selectedCourse}
                >
                  <option value="">
                    {selectedCourse ? '— กรุณาเลือกรอบเรียน —' : 'โปรดเลือกคอร์สก่อน'}
                  </option>
                  {selectedCourse?.batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label} • {b.date} • {b.time}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="ความคาดหวัง" full>
                <Textarea
                  placeholder="คุณอยากได้อะไรจากคอร์สนี้... (optional)"
                  value={data.expectation}
                  onChange={(e) => update('expectation', e.target.value)}
                />
              </FormField>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sm:col-span-2 rounded-xl border border-status-red/30 bg-status-red/8 px-4 py-3 text-sm text-status-red"
                >
                  {submitError}
                </motion.div>
              )}

              <div className="sm:col-span-2 mt-3 pt-6 border-t border-line flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <p className="text-xs text-fg-muted">
                  การกดส่งคือยืนยันให้เราติดต่อกลับเพื่อยืนยันที่นั่ง
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="group"
                >
                  {submitting ? (
                    <>
                      <Spinner />
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      ส่งใบสมัคร
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </Container>
      </Section>
    );
  },
);

RegistrationForm.displayName = 'RegistrationForm';
export default RegistrationForm;

function Spinner() {
  return (
    <span className="h-4 w-4 inline-block rounded-full border-2 border-white/40 border-t-white animate-spin" />
  );
}
