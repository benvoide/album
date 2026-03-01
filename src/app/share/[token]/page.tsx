import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .select("id, title, user_id")
    .eq("share_token", token)
    .eq("privacy_level", "link")
    .single();

  if (pubError || !publication) {
    notFound();
  }

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption, order_index")
    .eq("publication_id", publication.id)
    .order("order_index");

  const signedUrls: Record<string, string> = {};
  if (photos) {
    for (const photo of photos) {
      const { data } = await admin.storage
        .from("photos")
        .createSignedUrl(photo.storage_path, 3600);
      if (data?.signedUrl) {
        signedUrls[photo.id] = data.signedUrl;
      }
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {publication.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--primary-muted)]">
          Shared album from Album
        </p>
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
        <p className="text-center text-[var(--primary-muted)]">
          This album has no photos yet.
        </p>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Create your own album →
        </Link>
      </div>
    </main>
  );
}
