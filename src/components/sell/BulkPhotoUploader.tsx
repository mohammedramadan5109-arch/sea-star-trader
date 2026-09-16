// src/components/sell/BulkPhotoUploader.tsx

'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface BulkPhotoUploaderProps {
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export function BulkPhotoUploader({ 
  onPhotosChange, 
  maxPhotos = 100 
}: BulkPhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const supabase = createClient();

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `equipment/${fileName}`;

    const { data, error } = await supabase.storage
      .from('equipment-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('equipment-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 10MB per image)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`);
          continue;
        }

        const url = await uploadToSupabase(file);
        uploadedUrls.push(url);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const newPhotos = [...photos, ...uploadedUrls];
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
      
      toast.success(`${uploadedUrls.length} photos uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload some photos');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
          Equipment Photos * ({photos.length}/{maxPhotos})
        </label>
        
        <div 
          className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-orange-600 transition-colors"
          style={{ borderColor: 'var(--line)' }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || photos.length >= maxPhotos}
            className="hidden"
            id="photo-upload"
          />
          
          <label 
            htmlFor="photo-upload" 
            className="cursor-pointer"
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin mb-4" style={{ color: 'var(--orange)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${uploadProgress}%`,
                      backgroundColor: 'var(--orange)'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--slate)' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-xs" style={{ color: 'var(--slate)' }}>
                  PNG, JPG, JPEG (max 10MB each, up to {maxPhotos} photos)
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--orange)' }}>
                  You can select multiple files at once
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--navy)' }}>
            Uploaded Photos ({photos.length})
          </p>
          
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {photos.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <img 
                  src={url} 
                  alt={`Equipment photo ${index + 1}`}
                  className="w-full h-full object-cover rounded border"
                  style={{ borderColor: 'var(--line)' }}
                />
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Photo number */}
                <div 
                  className="absolute bottom-1 left-1 px-2 py-0.5 text-xs font-bold rounded"
                  style={{ 
                    backgroundColor: 'var(--navy)',
                    color: 'var(--paper)'
                  }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Reorder hint */}
          <p className="text-xs mt-2" style={{ color: 'var(--slate)' }}>
            💡 The first photo will be used as the main thumbnail
          </p>
        </div>
      )}
    </div>
  );
}