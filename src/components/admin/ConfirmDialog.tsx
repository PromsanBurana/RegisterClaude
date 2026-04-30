import Modal from '../ui/Modal';
import Button from '../ui/Button';

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal open={open} onClose={onCancel} size="sm" showClose={false}>
      <div className="px-6 py-6">
        <h3 className="text-lg font-semibold tracking-tight text-fg">
          {title}
        </h3>
        <p className="mt-2 text-sm text-fg-secondary leading-relaxed">
          {message}
        </p>
        <div className="mt-6 flex gap-2.5 justify-end">
          <Button variant="secondary" size="md" onClick={onCancel}>
            ยกเลิก
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
