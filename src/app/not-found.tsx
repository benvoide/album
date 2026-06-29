import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold tracking-tight text-[var(--primary)]">
        404
      </h1>
      <p className="mt-3 text-[var(--primary-muted)]">
        This page or album could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:translate-y-[1px]"
      >
        Go home
      </Link>
    </main>
  );
}