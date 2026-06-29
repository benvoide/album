"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AddPhotosForm({
  publicationId,
  userId,
  currentCount,
}: {
  publicationId: string;
  userId: string;
  currentCount: number;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bucketPath = `${userId}/${publicationId}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${bucketPath}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        await supabase.from("photos").insert({
          publication_id: publicationId,
          storage_path: path,
          order_index: currentCount + i,
        });
      }

      router.push(`/album/${publicationId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-8 rounded-xl border border-[var(--accent-warm)]/40 bg-[var(--background)] p-8 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Select photos
        </label>
        <div className="mt-2">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/30 bg-[var(--accent-warm)]/10 p-10 transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--primary-muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm font-medium text-[var(--primary)]">
              Choose photos to upload
            </span>
            <span className="text-xs text-[var(--primary-muted)]">
              {files.length > 0 ? `${files.length} selected` : "JPG, PNG, WebP"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
              {previews.map((src, i) => (
                <div key={i} className="group relative">
                  <img
                    src={src}
                    alt=""
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 active:translate-y-[1px]"
        >
          {loading ? "Uploading..." : "Add photos"}
        </button>
        <Link
          href={`/album/${publicationId}`}
          className="rounded-lg border border-[var(--primary)]/20 px-5 py-2.5 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/5 active:translate-y-[1px]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}