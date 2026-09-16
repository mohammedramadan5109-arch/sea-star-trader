// src/app/(marketing)/sell/page.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BulkPhotoUploader } from '@/components/sell/BulkPhotoUploader';
import { FormField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_STRUCTURE } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const sellEquipmentSchema = z.object({
  equipment_type: z.string().min(1, 'Equipment type is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Year is required').max(4, 'Year must be 4 digits'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Needs Repair'], {
    errorMap: () => ({ message: 'Please select a condition' })
  }),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  asking_price: z.string().optional(),
});

type SellEquipmentFormData = z.infer<typeof sellEquipmentSchema>;

export default function SellPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SellEquipmentFormData>({
    resolver: zodResolver(sellEquipmentSchema),
  });

  const categoryValue = watch('category');

  const onSubmit = async (data: SellEquipmentFormData) => {
    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Form data:', data);
    console.log('Photos count:', photos.length);

    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        toast.error('You must be logged in to sell equipment');
        router.push('/login');
        return;
      }

      const askingPrice = data.asking_price ? parseFloat(data.asking_price) : null;

      const insertData = {
        user_id: user.id,
        equipment_type: data.equipment_type,
        category: data.category,
        subcategory: data.subcategory || null,
        make: data.make,
        model: data.model,
        year: data.year,
        condition: data.condition,
        location: data.location,
        description: data.description || null,
        asking_price: askingPrice,
        photos: photos,
        status: 'pending',
      };

      console.log('Inserting data:', insertData);

      const { data: listing, error } = await supabase
        .from('listings')
        .insert(insertData)
        .select()
        .single();

      console.log('Insert result:', { listing, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Success! Listing created:', listing.id);
      toast.success('Equipment submitted for review! We will contact you within 24 hours.');
      
      window.location.href = '/my-listings';
    } catch (error: any) {
      console.error('=== SUBMISSION ERROR ===', error);
      toast.error(error.message || 'Failed to submit equipment');
    } finally {
      setLoading(false);
    }
  };

  const categoryName = Object.keys(CATEGORY_SLUGS).find(
    (key) => CATEGORY_SLUGS[key] === categoryValue
  );
  const subcategories = categoryName ? CATEGORY_STRUCTURE[categoryName] : [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
        Sell Your Equipment
      </h1>
      <p className="text-lg mb-8" style={{ color: 'var(--slate)' }}>
        Fill out the form below and we will get back to you with a valuation and listing plan.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormSection
          title="Equipment Details"
          description="Tell us about the equipment you are selling"
        >
          <FormField label="Equipment Type" error={errors.equipment_type?.message} required>
            <Input
              {...register('equipment_type')}
              placeholder="e.g. Excavator, Bulldozer, Crane"
              error={errors.equipment_type?.message}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" error={errors.category?.message} required>
              <Select {...register('category')} error={errors.category?.message}>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={CATEGORY_SLUGS[cat]}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormField>

            {subcategories.length > 0 && (
              <FormField label="Subcategory" error={errors.subcategory?.message}>
                <Select {...register('subcategory')}>
                  <option value="">Select subcategory (optional)</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={slugify(sub)}>
                      {sub}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Make" error={errors.make?.message} required>
              <Input
                {...register('make')}
                placeholder="e.g. Caterpillar, Komatsu"
                error={errors.make?.message}
              />
            </FormField>

            <FormField label="Model" error={errors.model?.message} required>
              <Input
                {...register('model')}
                placeholder="e.g. 320 GC"
                error={errors.model?.message}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Year" error={errors.year?.message} required>
              <Input
                {...register('year')}
                placeholder="e.g. 2019"
                maxLength={4}
                error={errors.year?.message}
              />
            </FormField>

            <FormField label="Condition" error={errors.condition?.message} required>
              <Select {...register('condition')} error={errors.condition?.message}>
                <option value="">Select condition</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Repair">Needs Repair</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Description" error={errors.description?.message}>
            <Textarea
              {...register('description')}
              placeholder="Describe the equipment, any special features, maintenance history, etc."
              rows={5}
              error={errors.description?.message}
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Location & Pricing"
          description="Where is the equipment located and what is your asking price?"
        >
          <FormField label="Location" error={errors.location?.message} required>
            <Input
              {...register('location')}
              placeholder="City, State/Province, Country"
              error={errors.location?.message}
            />
          </FormField>

          <FormField label="Asking Price (USD)" error={errors.asking_price?.message}>
            <Input
              {...register('asking_price')}
              type="number"
              placeholder="e.g. 125000"
              error={errors.asking_price?.message}
            />
          </FormField>
        </FormSection>

        {/* UPDATED: Bulk Photo Upload Section */}
        <FormSection
          title="Equipment Photos"
          description="Upload 70-100 high-quality photos of your equipment from all angles"
        >
          <BulkPhotoUploader 
            onPhotosChange={setPhotos}
            maxPhotos={100}
          />
          
          {photos.length === 0 && (
            <p className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
              ⚠️ At least one photo is required
            </p>
          )}
          
          {photos.length > 0 && photos.length < 70 && (
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              📸 {photos.length} photos uploaded. Consider uploading 70-100 photos for best results.
            </p>
          )}
          
          {photos.length >= 70 && (
            <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
              ✓ {photos.length} photos uploaded - Excellent! This will help buyers see every detail.
            </p>
          )}
        </FormSection>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={loading || photos.length === 0} 
            className="flex-1"
            style={{
              backgroundColor: 'var(--orange)',
              color: 'var(--paper)'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Equipment for Review'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            style={{
              border: `2px solid var(--navy)`,
              color: 'var(--navy)'
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}