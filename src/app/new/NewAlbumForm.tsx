"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PrivacyLevel } from "@/types/database";

export function NewAlbumForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>("private");
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
      const { data: pub, error: pubError } = await supabase
        .from("publications")
        .insert({
          user_id: userId,
          title: title || "Untitled",
          privacy_level: privacyLevel,
          share_token:
            privacyLevel === "link"
              ? crypto.randomUUID()
              : null,
        })
        .select("id")
        .single();

      if (pubError) throw pubError;
      if (!pub) throw new Error("Failed to create album");

      const bucketPath = `${userId}/${pub.id}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${bucketPath}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        await supabase.from("photos").insert({
          publication_id: pub.id,
          storage_path: path,
          order_index: i,
        });
      }

      router.push(`/album/${pub.id}`);
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
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Album title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="mt-1.5 w-full rounded-lg border border-[var(--accent-warm)]/50 bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] transition-colors placeholder:text-[var(--primary-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Privacy
        </label>
        <div className="mt-2 space-y-2">
          {(
            [
              {
                value: "private" as const,
                label: "Private",
                desc: "Only you can see this album.",
                icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z",
              },
              {
                value: "link" as const,
                label: "Shareable link",
                desc: "Anyone with the link can view.",
                icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
              },
              {
                value: "public" as const,
                label: "Public",
                desc: "Visible to everyone on Album.",
                icon: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
              },
            ]
          ).map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--accent-warm)]/50 p-3.5 transition-colors has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--accent-warm)]/10"
            >
              <input
                type="radio"
                name="privacy"
                value={opt.value}
                checked={privacyLevel === opt.value}
                onChange={() => setPrivacyLevel(opt.value)}
                className="mt-1 accent-[var(--primary)]"
              />
              <div>
                <span className="text-sm font-semibold text-[var(--foreground)]">{opt.label}</span>
                <p className="mt-0.5 text-sm text-[var(--primary-muted)]">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Photos
        </label>
        <div className="mt-2">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/30 bg-[var(--accent-warm)]/10 p-10 transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--primary-muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm font-medium text-[var(--primary)]">
              Select photos to upload
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 active:translate-y-[1px]"
      >
        {loading ? "Creating album..." : "Create album"}
      </button>
    </form>
  );
}