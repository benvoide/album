import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditAlbumForm } from "./EditAlbumForm";

export default async function EditAlbumPage({
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
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !publication) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Edit album
        </h1>
        <p className="mt-1 text-[var(--primary-muted)]">
          Change title or privacy settings.
        </p>
      </div>

      <EditAlbumForm publication={publication} />
    </main>
  );
}
