import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewAlbumForm } from "./NewAlbumForm";

export default async function NewAlbumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back to albums
      </Link>
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          New album
        </h1>
        <p className="mt-1.5 text-[var(--primary-muted)]">
          Create a new photo album.
        </p>
      </div>

      <NewAlbumForm userId={user.id} />
    </main>
  );
}