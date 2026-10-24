import Link from 'next/link';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import type { ReactNode } from 'react';

interface RequestFormSectionProps {
  /** Current path (with query string) so login returns here. */
  requestPath: string;
  /** Human service name, e.g. "shipping quote". */
  serviceTitle: string;
  signedIn: boolean;
  children: ReactNode;
}

/**
 * Wraps the request form on every service page. The page content stays
 * public — only the submission is gated: signed-out visitors get a
 * sign-in panel pointing at /login?redirect=…, signed-in users see the
 * form with their contact details pre-filled.
 */
export function RequestFormSection({
  requestPath,
  serviceTitle,
  signedIn,
  children,
}: RequestFormSectionProps) {
  const loginHref = `/login?redirect=${encodeURIComponent(requestPath)}`;

  return (
    <section id="request-form" className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
          Send a request
        </p>
        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
          Get your {serviceTitle} started
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--slate)' }}>
          Fill in the details below — our team replies within 1 business day.
        </p>
      </div>

      {signedIn ? (
        children
      ) : (
        <div
          className="rounded-lg border p-10 text-center animate-fade-in-up"
          style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
        >
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(245, 179, 36, 0.15)' }}
          >
            <Lock size={22} style={{ color: 'var(--orange)' }} />
          </span>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Members only
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--slate)' }}>
            Sign in to request your {serviceTitle}. Your contact details are
            pre-filled and you can track the request from your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={loginHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg btn-3d"
              style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
            >
              <LogIn size={16} />
              Sign in to request
            </Link>
            <Link
              href={`/register?redirect=${encodeURIComponent(requestPath)}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border transition-transform duration-150 active:scale-[0.97]"
              style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
            >
              <UserPlus size={16} />
              Create account
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
