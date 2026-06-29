"use client";

import { useState } from "react";
import Link from "next/link";

export function AlbumActions({
  publicationId,
  privacyLevel,
  shareToken,
}: {
  publicationId: string;
  privacyLevel: string;
  shareToken: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copyShareLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/share/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {privacyLevel === "link" && shareToken && (
        <button
          onClick={copyShareLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent)]/30 px-4 py-2 text-sm font-medium text-[var(--accent)] transition-all hover:bg-[var(--accent)]/5 active:translate-y-[1px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
      )}
      <Link
        href={`/album/${publicationId}/edit`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/20 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/5 active:translate-y-[1px]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </Link>
    </div>
  );
}
