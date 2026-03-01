"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PrivacyLevel } from "@/types/database";

export function NewAlbumForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>("private");
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
          className="mt-1 w-full rounded-lg border border-[var(--primary-muted)]/30 bg-white px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] dark:bg-[var(--primary)]/5"
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
              },
              {
                value: "link" as const,
                label: "Shareable link",
                desc: "Anyone with the link can view.",
              },
              {
                value: "public" as const,
                label: "Public",
                desc: "Visible to everyone.",
              },
            ]
          ).map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--primary-muted)]/30 p-3 transition-colors has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--accent-warm)]/10"
            >
              <input
                type="radio"
                name="privacy"
                value={opt.value}
                checked={privacyLevel === opt.value}
                onChange={() => setPrivacyLevel(opt.value)}
                className="mt-1"
              />
              <div>
                <span className="font-medium">{opt.label}</span>
                <p className="text-sm text-[var(--primary-muted)]">{opt.desc}</p>
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
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/40 bg-[var(--accent-warm)]/10 p-8 transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--accent-warm)]/20">
            <span className="text-2xl text-[var(--primary)]">📷</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              Select photos
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
                  <span className="truncate max-w-[120px]">{file.name}</span>
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create album"}
      </button>
    </form>
  );
}
