import { redirect, notFound } from "next/navigation";
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
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Add photos to {publication.title}
        </h1>
        <p className="mt-1 text-[var(--primary-muted)]">
          {count ?? 0} photos in this album.
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
