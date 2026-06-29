import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumLogo } from "@/components/AlbumLogo";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/LandingSections";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
    );
  }

  const { data: publications } = await supabase
    .from("publications")
    .select("id, title, privacy_level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          My albums
        </h1>
        <p className="mt-1.5 text-[var(--primary-muted)]">
          {publications?.length || 0} collection
          {publications?.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/new"
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--primary-muted)]/20 bg-[var(--primary)]/5 transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/10"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--primary-muted)]">
            <path d="M14 5v18M5 14h18" />
          </svg>
          <span className="text-sm font-semibold text-[var(--primary-muted)]">
            New album
          </span>
        </Link>

        {publications?.map((pub) => (
          <AlbumCard key={pub.id} publication={pub} userId={user.id} />
        ))}
      </div>

      {(!publications || publications.length === 0) && (
        <div className="mt-16 text-center">
          <p className="text-[var(--primary-muted)]">
            No albums yet. Create your first one to get started.
          </p>
        </div>
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
    .select("storage_path, id")
    .eq("publication_id", publication.id)
    .order("order_index")
    .limit(4);

  const coverPath = photos?.[0]?.storage_path;
  let coverUrl: string | null = null;

  if (coverPath) {
    const { data } = await supabase.storage
      .from("photos")
      .createSignedUrl(coverPath, 3600);
    coverUrl = data?.signedUrl ?? null;
  }

  const photoCount = photos?.length || 0;

  return (
    <Link
      href={`/album/${publication.id}`}
      className="group overflow-hidden rounded-2xl border border-[var(--accent-warm)]/40 bg-[var(--background)] shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-[4/3] bg-[var(--accent-warm)]/10">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--primary-muted)]/30">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {publication.title}
        </h2>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-[var(--primary-muted)]">
          <span className="capitalize">{publication.privacy_level}</span>
          {photoCount > 0 && (
            <>
              <span className="text-[var(--primary)]">-</span>
              <span>
                {photoCount} photo{photoCount !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}