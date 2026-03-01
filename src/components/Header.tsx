import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumLogo } from "@/components/AlbumLogo";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--primary)]/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--primary)]"
        >
          <AlbumLogo className="h-7 w-auto" />
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/new"
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90"
              >
                New album
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-[var(--primary-muted)] hover:text-[var(--primary)]"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--primary-muted)] hover:text-[var(--primary)]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
