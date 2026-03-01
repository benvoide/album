import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumActions } from "./AlbumActions";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (pubError || !publication) {
    notFound();
  }

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption, order_index")
    .eq("publication_id", id)
    .order("order_index");

  const signedUrls: Record<string, string> = {};
  if (photos) {
    for (const photo of photos) {
      const { data } = await supabase.storage
        .from("photos")
        .createSignedUrl(photo.storage_path, 3600);
      if (data?.signedUrl) {
        signedUrls[photo.id] = data.signedUrl;
      }
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--primary-muted)] hover:text-[var(--primary)]"
          >
            ← Back to albums
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {publication.title}
          </h1>
          <p className="mt-1 text-sm capitalize text-[var(--primary-muted)]">
            {publication.privacy_level}
          </p>
        </div>

        <AlbumActions
          publicationId={publication.id}
          privacyLevel={publication.privacy_level}
          shareToken={publication.share_token}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos?.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-xl border border-[var(--accent-warm)]/30 bg-white shadow-sm dark:bg-[var(--primary)]/5"
          >
            <div className="aspect-square bg-[var(--accent-warm)]/20">
              {signedUrls[photo.id] ? (
                <img
                  src={signedUrls[photo.id]}
                  alt={photo.caption || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-[var(--primary-muted)]">
                  📷
                </div>
              )}
            </div>
            {photo.caption && (
              <p className="p-3 text-sm text-[var(--foreground)]">
                {photo.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {(!photos || photos.length === 0) && (
        <div className="rounded-xl border-2 border-dashed border-[var(--primary-muted)]/40 bg-[var(--accent-warm)]/10 p-12 text-center">
          <p className="text-[var(--primary-muted)]">No photos in this album yet.</p>
          <Link
            href={`/album/${id}/add`}
            className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 font-bold text-white hover:opacity-90"
          >
            Add photos
          </Link>
        </div>
      )}

      {photos && photos.length > 0 && (
        <div className="mt-8">
          <Link
            href={`/album/${id}/add`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--primary)]/30 px-4 py-2 font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5"
          >
            + Add more photos
          </Link>
        </div>
      )}
    </main>
  );
}
