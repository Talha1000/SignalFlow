import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to SignalFlow</h1>
      <p className="mb-6">Your AI‑powered sales enablement platform.</p>
      <Link
        href="/app/dashboard"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
