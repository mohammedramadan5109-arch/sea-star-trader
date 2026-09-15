interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="border-b border-[var(--line)] pb-6 mb-6 last:border-0">
      <h3 className="text-lg font-bold mb-1 text-[var(--navy)]">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--slate)] mb-4">{description}</p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}