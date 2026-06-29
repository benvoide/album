import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumActions } from "./AlbumActions";
import { AlbumGallery } from "./AlbumGallery";

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

  const photoList = photos?.map((p) => ({
    id: p.id,
    url: signedUrls[p.id] || "",
    caption: p.caption,
  })) || [];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-10">
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back to albums
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              {publication.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--primary-muted)]">
              <span className="capitalize">{publication.privacy_level}</span>
              {photoList.length > 0 && (
                <>
                  <span className="text-[var(--accent-warm)]">·</span>
                  <span>{photoList.length} photo{photoList.length !== 1 ? "s" : ""}</span>
                </>
              )}
            </div>
          </div>

          <AlbumActions
            publicationId={publication.id}
            privacyLevel={publication.privacy_level}
            shareToken={publication.share_token}
          />
        </div>
      </div>

      <AlbumGallery photos={photoList} albumId={id} />
    </main>
  );
}
