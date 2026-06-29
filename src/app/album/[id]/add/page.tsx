import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddPhotosForm } from "./AddPhotosForm";

export default async function AddPhotosPage({
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

  const { data: publication, error } = await supabase
    .from("publications")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !publication) {
    notFound();
  }

  const { count } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("publication_id", id);

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-10">
      <Link
        href={`/album/${id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back to album
      </Link>
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Add photos
        </h1>
        <p className="mt-1.5 text-[var(--primary-muted)]">
          {count ?? 0} photo{count !== 1 ? "s" : ""} in this album.
        </p>
      </div>

      <AddPhotosForm
        publicationId={publication.id}
        userId={user.id}
        currentCount={count ?? 0}
      />
    </main>
  );
}