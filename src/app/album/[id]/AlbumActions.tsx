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
          className="flex items-center gap-2 rounded-lg bg-[var(--primary-muted)]/20 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-muted)]/30"
        >
          {copied ? "Copied!" : "Copy share link"}
        </button>
      )}
      <Link
        href={`/album/${publicationId}/edit`}
        className="rounded-lg border border-[var(--primary)]/30 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5"
      >
        Edit album
      </Link>
    </div>
  );
}
