export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        The Evolution of Todo
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Phase II: Full-Stack Web Application
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/auth"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Sign In
        </a>
        <a
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100"
        >
          Dashboard
        </a>
      </div>
    </main>
  );
}
