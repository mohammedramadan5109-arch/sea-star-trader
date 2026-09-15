import { notFound } from 'next/navigation';
import { SERVICE_SLUGS } from '@/lib/constants/services';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const serviceName = Object.keys(SERVICE_SLUGS).find(
    (key) => SERVICE_SLUGS[key] === slug
  );

  if (!serviceName) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
        {serviceName}
      </h1>
      <p className="text-lg" style={{ color: 'var(--slate)' }}>
        Detailed information about {serviceName.toLowerCase()} will be displayed here.
      </p>
    </div>
  );
}