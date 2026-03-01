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

      {error && (
        <p className="text-sm text-[var(--accent-rose)]">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-4 py-2.5 font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
        <Link
          href={`/album/${publication.id}`}
          className="rounded-lg border border-[var(--primary)]/30 px-4 py-2.5 font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
