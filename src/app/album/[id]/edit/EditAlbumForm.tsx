"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { PrivacyLevel } from "@/types/database";

export function EditAlbumForm({
  publication,
}: {
  publication: { id: string; title: string; privacy_level: PrivacyLevel };
}) {
  const [title, setTitle] = useState(publication.title);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(
    publication.privacy_level
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updates: {
        title: string;
        privacy_level: PrivacyLevel;
        share_token?: string | null;
      } = {
        title: title || "Untitled",
        privacy_level: privacyLevel,
      };

      if (privacyLevel === "link") {
        const { data: existing } = await supabase
          .from("publications")
          .select("share_token")
          .eq("id", publication.id)
          .single();

        updates.share_token = existing?.share_token ?? crypto.randomUUID();
      } else {
        updates.share_token = null;
      }

      const { error: updateError } = await supabase
        .from("publications")
        .update(updates)
        .eq("id", publication.id);

      if (updateError) throw updateError;

      router.push(`/album/${publication.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 active:translate-y-[1px]"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
        <Link
          href={`/album/${publication.id}`}
          className="rounded-lg border border-[var(--primary)]/20 px-5 py-2.5 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/5 active:translate-y-[1px]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}