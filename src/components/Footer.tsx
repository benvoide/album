import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--primary)]/10 bg-white py-10 dark:bg-[var(--background)]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-10">
        <div className="flex items-center gap-2 opacity-70">
          <span className="text-xl font-bold tracking-tight text-[var(--primary)]">
            Album
          </span>
        </div>
        <div className="flex gap-8 text-xs font-medium text-[var(--primary-muted)]">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-[var(--primary)]"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-[var(--primary-muted)]">
          Your private photo album.
        </p>
      </div>
    </footer>
  );
}
