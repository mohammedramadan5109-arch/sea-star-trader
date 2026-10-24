import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

/** Card wrapper shared by every service request form. */
export function ServiceFormCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-lg border p-6 sm:p-8 animate-fade-in-up"
      style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
    >
      {children}
    </div>
  );
}

/** Shown after a successful submit, with a reset back to a fresh form. */
export function ServiceSuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <CheckCircle2 size={44} className="mx-auto mb-4" style={{ color: 'var(--orange)' }} />
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
        We received your request
      </h3>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--slate)' }}>
        Our team will contact you within 1 business day. You can also track
        this request from your dashboard.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-semibold"
        style={{ color: 'var(--orange)' }}
      >
        Submit another request
      </button>
    </div>
  );
}

/** Inline error state under the submit button. */
export function ServiceFormError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600 font-medium" role="alert">
      {message}
    </p>
  );
}
