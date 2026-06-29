type Photo = {
  id: string;
  url: string;
  caption: string | null;
};

export function PhotoGrid({ photos, onPhotoClick }: { photos: Photo[]; onPhotoClick?: (index: number) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {photos.map((photo, i) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick?.(i)}
          className="group relative overflow-hidden rounded-xl border border-[var(--accent-warm)]/40 bg-[var(--accent-warm)]/10 shadow-sm transition-all hover:shadow-md"
        >
          <div className="aspect-square">
            <img
              src={photo.url}
              alt={photo.caption || ""}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
          </div>
          {photo.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-sm text-white">{photo.caption}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}