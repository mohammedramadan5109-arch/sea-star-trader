'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      // TODO: Send to your backend/email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent! We will get back to you soon.');
      setSubmitted(true);
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
        Contact Us
      </h1>
      <p className="text-lg mb-8" style={{ color: 'var(--slate)' }}>
        Have questions? Our team is here to help.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>Phone</h3>
          <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>Americas:</p>
          <a href="tel:+18005550134" className="text-[var(--orange)] font-semibold">+1 (800) 555-0134</a>
          <p className="text-sm mt-3 mb-2" style={{ color: 'var(--slate)' }}>Europe:</p>
          <a href="tel:+31105550177" className="text-[var(--orange)] font-semibold">+31 10 555 0177</a>
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>Email</h3>
          <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>General inquiries:</p>
          <a href="mailto:info@seastartrader.com" className="text-[var(--orange)] font-semibold">info@seastartrader.com</a>
          <p className="text-sm mt-3 mb-2" style={{ color: 'var(--slate)' }}>Support:</p>
          <a href="mailto:support@seastartrader.com" className="text-[var(--orange)] font-semibold">support@seastartrader.com</a>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 rounded-sm border border-[var(--line)] text-center" style={{ backgroundColor: 'var(--off-white)' }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Message Sent!</h3>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>We will get back to you within 24 hours.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-semibold"
            style={{ color: 'var(--orange)' }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" error={errors.name?.message} required>
              <Input {...register('name')} placeholder="Your full name" error={errors.name?.message} />
            </FormField>

            <FormField label="Email" error={errors.email?.message} required>
              <Input {...register('email')} type="email" placeholder="you@company.com" error={errors.email?.message} />
            </FormField>
          </div>

          <FormField label="Phone Number" error={errors.phone?.message}>
            <Input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" error={errors.phone?.message} />
          </FormField>

          <FormField label="Subject" error={errors.subject?.message} required>
            <Input {...register('subject')} placeholder="What can we help you with?" error={errors.subject?.message} />
          </FormField>

          <FormField label="Message" error={errors.message?.message} required>
            <Textarea {...register('message')} rows={6} placeholder="Tell us more about your inquiry..." error={errors.message?.message} />
          </FormField>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  );
}