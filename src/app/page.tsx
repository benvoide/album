import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumLogo } from "@/components/AlbumLogo";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="flex justify-center">
            <AlbumLogo className="h-12 w-auto text-[var(--primary)]" />
          </div>
          <p className="mt-4 text-lg text-[var(--foreground)]">
            Your private photo album. Keep your memories safe and share them
            when you want.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white transition-colors hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-[var(--primary)]/30 px-6 py-3 font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: publications } = await supabase
    .from("publications")
    .select("id, title, privacy_level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          My albums
        </h1>
        <p className="mt-1 text-[var(--primary-muted)]">
          Your photo collections. Create one to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/new"
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/40 bg-[var(--accent-warm)]/10 transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--accent-warm)]/20"
        >
          <span className="text-4xl text-[var(--primary)]">+</span>
          <span className="font-medium text-[var(--primary)]">New album</span>
        </Link>

        {publications?.map((pub) => (
          <AlbumCard key={pub.id} publication={pub} userId={user.id} />
        ))}
      </div>

      {(!publications || publications.length === 0) && (
        <p className="mt-8 text-center text-[var(--primary-muted)]">
          No albums yet. Create your first one above.
        </p>
      )}
    </main>
  );
}

async function AlbumCard({
  publication,
  userId,
}: {
  publication: { id: string; title: string; privacy_level: string; created_at: string };
  userId: string;
}) {
  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("publication_id", publication.id)
    .order("order_index")
    .limit(1);

  const coverPath = photos?.[0]?.storage_path;
  let coverUrl: string | null = null;

  if (coverPath) {
    const { data } = await supabase.storage
      .from("photos")
      .createSignedUrl(coverPath, 3600);
    coverUrl = data?.signedUrl ?? null;
  }

  return (
    <Link
      href={`/album/${publication.id}`}
      className="group overflow-hidden rounded-xl border border-[var(--accent-warm)]/30 bg-white shadow-sm transition-all hover:shadow-md dark:bg-[var(--primary)]/5"
    >
      <div className="aspect-[4/3] bg-[var(--accent-warm)]/20">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-[var(--primary-muted)]">
            📷
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-bold text-[var(--foreground)]">{publication.title}</h2>
        <p className="mt-1 text-xs text-[var(--primary-muted)] capitalize">
          {publication.privacy_level}
        </p>
      </div>
    </Link>
  );
}
