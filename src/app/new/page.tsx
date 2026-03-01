import { redirect } from "next/navigation";
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
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          New album
        </h1>
        <p className="mt-1 text-[var(--primary-muted)]">
          Create a new photo album. Choose your privacy level.
        </p>
      </div>

      <NewAlbumForm userId={user.id} />
    </main>
  );
}
