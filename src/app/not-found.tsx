import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-[var(--primary)]">404</h1>
      <p className="mt-2 text-[var(--primary-muted)]">
        This page or album could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[var(--primary)] px-4 py-2 font-bold text-white hover:opacity-90"
      >
        Go home
      </Link>
    </main>
  );
}
