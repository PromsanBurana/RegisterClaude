export type RegistrationStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'cancelled';

export type Registration = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  expectation: string;
  status: RegistrationStatus;
};

export type RegistrationInput = Omit<
  Registration,
  'id' | 'createdAt' | 'status' | 'courseName' | 'batchName'
>;

export const STATUS_ORDER: RegistrationStatus[] = [
  'new',
  'contacted',
  'confirmed',
  'cancelled',
];

export const STATUS_LABEL: Record<RegistrationStatus, string> = {
  new: 'ลงทะเบียนใหม่',
  contacted: 'ติดต่อแล้ว',
  confirmed: 'ยืนยันแล้ว',
  cancelled: 'ยกเลิก',
};
