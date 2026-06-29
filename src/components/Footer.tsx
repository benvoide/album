import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--accent-warm)]/50 bg-[var(--background)] py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-[var(--primary)]">
            Album
          </span>
        </div>
        <div className="flex gap-8 text-sm text-[var(--primary-muted)]">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <Link href="/login" className="transition-colors hover:text-[var(--primary)]">
            Sign in
          </Link>
        </div>
        <p className="text-sm text-[var(--primary-muted)]">
          Your private photo album.
        </p>
      </div>
    </footer>
  );
}
