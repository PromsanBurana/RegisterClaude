import { STATUS_LABEL, type RegistrationStatus } from '../../types';

const styles: Record<RegistrationStatus, string> = {
  new: 'bg-sun text-ink border-ink',
  contacted: 'bg-electric text-paper border-electric',
  confirmed: 'bg-ink text-sun border-ink',
  cancelled: 'bg-paper text-ink/50 border-ink/30 line-through',
};

export default function StatusBadge({
  status,
  size = 'md',
}: {
  status: RegistrationStatus;
  size?: 'sm' | 'md';
}) {
  const sizeClass =
    size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-[0.15em] border-2 whitespace-nowrap ${sizeClass} ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
