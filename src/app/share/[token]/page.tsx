import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PhotoGrid } from "@/components/PhotoGrid";

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

  const photoList = photos?.map((p) => ({
    id: p.id,
    url: signedUrls[p.id] || "",
    caption: p.caption,
  })) || [];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {publication.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--primary-muted)]">
          Shared album
        </p>
      </div>

      {photoList.length > 0 ? (
        <PhotoGrid photos={photoList} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[var(--primary-muted)]/30 bg-[var(--accent-warm)]/10 p-16 text-center">
          <p className="text-[var(--primary-muted)]">This album has no photos yet.</p>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
        >
          Create your own album
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 3l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </main>
  );
}