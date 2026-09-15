import { Check, X } from 'lucide-react';
import Link from 'next/link';

interface ProfileField {
  label: string;
  completed: boolean;
  href?: string;
}

interface ProfileCompletionCardProps {
  fields: ProfileField[];
}

export function ProfileCompletionCard({ fields }: ProfileCompletionCardProps) {
  const completedCount = fields.filter((f) => f.completed).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  return (
    <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--navy)' }}>
        Profile Completion
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
        Complete your profile to unlock all features
      </p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            {completedCount} of {fields.length} completed
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--orange)' }}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--orange)] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between py-2 border-b border-[var(--line)] last:border-0"
          >
            <div className="flex items-center gap-2">
              {field.completed ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <X size={16} className="text-gray-400" />
              )}
              <span className="text-sm" style={{ color: 'var(--navy)' }}>
                {field.label}
              </span>
            </div>
            {!field.completed && field.href && (
              <Link href={field.href} className="text-xs font-semibold text-[var(--orange)] hover:underline">
                Complete
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}