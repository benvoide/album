import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AlbumLogo } from "@/components/AlbumLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--accent-warm)]/50 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-10">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)]">
          <AlbumLogo className="h-7 w-auto" />
        </Link>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
              >
                Albums
              </Link>
              <Link
                href="/new"
                className="flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:translate-y-[1px]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
                New album
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-[var(--primary-muted)] transition-colors hover:text-[var(--primary)]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:translate-y-[1px]"
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
