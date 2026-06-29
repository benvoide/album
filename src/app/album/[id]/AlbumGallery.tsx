"use client";

import { useState } from "react";
import Link from "next/link";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
};

export function AlbumGallery({ photos, albumId }: { photos: Photo[]; albumId: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/30 bg-[var(--accent-warm)]/10 p-16 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--primary-muted)]/40">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div>
          <p className="text-[var(--primary-muted)]">No photos in this album yet.</p>
          <Link
            href={`/album/${albumId}/add`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:translate-y-[1px]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
            Add photos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PhotoGrid
        photos={photos}
        onPhotoClick={(i) => setLightboxIndex(i)}
      />

      <div className="mt-8">
        <Link
          href={`/album/${albumId}/add`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/20 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/5 active:translate-y-[1px]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
          Add more photos
        </Link>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i! > 0 ? i! - 1 : photos.length - 1))}
          onNext={() => setLightboxIndex((i) => (i! < photos.length - 1 ? i! + 1 : 0))}
        />
      )}
    </>
  );
}