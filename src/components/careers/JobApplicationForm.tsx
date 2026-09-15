// src/components/careers/JobApplicationForm.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    coverLetter: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Wire to your backend/Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Application submitted successfully! We\'ll be in touch soon.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedIn: '',
        coverLetter: '',
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
            First Name *
          </label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
            style={{
              border: `1px solid var(--line)`,
              backgroundColor: 'var(--paper)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
            Last Name *
          </label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Smith"
            style={{
              border: `1px solid var(--line)`,
              backgroundColor: 'var(--paper)',
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          Email Address *
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john.smith@example.com"
          style={{
            border: `1px solid var(--line)`,
            backgroundColor: 'var(--paper)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          Phone Number *
        </label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="+1 234 567 8900"
          style={{
            border: `1px solid var(--line)`,
            backgroundColor: 'var(--paper)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          LinkedIn Profile
        </label>
        <Input
          type="url"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
          style={{
            border: `1px solid var(--line)`,
            backgroundColor: 'var(--paper)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          Cover Letter *
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Tell us why you're interested in this role and what makes you a great fit..."
          className="w-full px-4 py-3 focus:outline-none"
          style={{
            border: `1px solid var(--line)`,
            backgroundColor: 'var(--paper)',
            color: 'var(--ink)',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          Resume/CV *
        </label>
        <div 
          className="p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          style={{
            border: `2px dashed var(--line)`,
            backgroundColor: 'var(--off-white)',
          }}
        >
          <Upload className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--slate)' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
            Click to upload or drag and drop
          </p>
          <p className="text-xs" style={{ color: 'var(--slate)' }}>
            PDF, DOC, or DOCX (max 5MB)
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full md:w-auto px-12 py-4 text-lg"
          style={{
            backgroundColor: 'var(--orange)',
            color: 'var(--paper)',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>

      <p className="text-sm" style={{ color: 'var(--slate)' }}>
        By submitting this application, you agree to our privacy policy and terms of service.
      </p>
    </form>
  );
}