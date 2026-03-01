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
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl border border-[var(--accent-warm)]/30 bg-white p-6 shadow-sm dark:bg-[var(--primary)]/5"
    >
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Select photos
        </label>
        <div className="mt-2">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/40 bg-[var(--accent-warm)]/10 p-8 transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--accent-warm)]/20">
            <span className="text-2xl text-[var(--primary)]">📷</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              Choose files
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-[var(--accent-warm)]/20 px-3 py-2 text-sm"
                >
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-[var(--accent-rose)] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--accent-rose)]">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="rounded-lg bg-[var(--primary)] px-4 py-2.5 font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add photos"}
        </button>
        <Link
          href={`/album/${publicationId}`}
          className="rounded-lg border border-[var(--primary)]/30 px-4 py-2.5 font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
