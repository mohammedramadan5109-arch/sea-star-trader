'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (!isLightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div
        className="h-96 flex items-center justify-center rounded-lg border"
        style={{ backgroundColor: 'var(--listing-surface)', borderColor: 'var(--listing-border)' }}
      >
        <span style={{ color: 'var(--listing-text-muted)' }}>No images available</span>
      </div>
    );
  }

  const visibleThumbs = images.slice(0, 5);
  const extraCount = images.length - 5;

  return (
    <div className="space-y-3">
      <div
        className="relative h-96 w-full rounded-lg overflow-hidden border group"
        style={{ borderColor: 'var(--listing-border)' }}
      >
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 w-full h-full cursor-zoom-in"
          aria-label="Open full-size image"
        >
          <Image src={images[currentIndex]} alt={`${alt} - Image ${currentIndex + 1}`} fill className="object-cover" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 text-white text-xs font-medium"
        >
          <Images size={14} />
          View all photos ({images.length})
        </button>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {visibleThumbs.map((image, index) => {
            const isLastVisible = index === 4 && extraCount > 0;
            return (
              <button
                key={index}
                onClick={() => (isLastVisible ? setIsLightboxOpen(true) : setCurrentIndex(index))}
                className={`relative h-16 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex && !isLastVisible
                    ? 'border-[var(--listing-accent)]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                    +{extraCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <div className="relative z-0 w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}