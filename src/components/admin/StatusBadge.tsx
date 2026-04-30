import Badge from '../ui/Badge';
import { STATUS_LABEL, type RegistrationStatus } from '../../types';

const TONE: Record<RegistrationStatus, 'gray' | 'blue' | 'green' | 'red'> = {
  new: 'gray',
  contacted: 'blue',
  confirmed: 'green',
  cancelled: 'red',
};

export default function StatusBadge({
  status,
  size = 'md',
}: {
  status: RegistrationStatus;
  size?: 'sm' | 'md';
}) {
  return (
    <Badge tone={TONE[status]} size={size}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </Badge>
  );
}
