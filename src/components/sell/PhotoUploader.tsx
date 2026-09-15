'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface PhotoUploaderProps {
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({ onPhotosChange, maxPhotos = 10 }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image`);
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5MB`);
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/temp/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('equipment-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('equipment-photos')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newPhotos = [...photos, ...uploadedUrls];
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
      toast.success(`${files.length} photo(s) uploaded`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload photos');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = async (url: string) => {
    try {
      // Extract filename from URL
      const urlParts = url.split('/');
      const fileName = urlParts.slice(-3).join('/'); // user_id/temp/filename

      // Delete from storage
      await supabase.storage
        .from('equipment-photos')
        .remove([fileName]);

      const newPhotos = photos.filter((p) => p !== url);
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
      toast.success('Photo removed');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove photo');
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-sm p-8 text-center cursor-pointer hover:border-[var(--orange)] transition-colors"
        style={{ borderColor: 'var(--line)' }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <UploadCloud size={40} className="mx-auto mb-3" style={{ color: 'var(--steel-light)' }} />
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
          {uploading ? 'Uploading...' : 'Click to upload photos'}
        </p>
        <p className="text-xs" style={{ color: 'var(--slate)' }}>
          JPG, PNG or WebP (max 5MB each, up to {maxPhotos} photos)
        </p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {photos.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-sm border border-[var(--line)]"
              />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}