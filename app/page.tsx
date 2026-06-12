import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl bg-gradient-to-br from-partselect-teal to-partselect-teal-dark px-8 py-14 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-partselect-green-light">
          ProMate AI Assistant
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Expert help for refrigerator &amp; dishwasher parts
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Find the right part, check compatibility, get install guides, and troubleshoot
          symptoms — all scoped to PartSelect refrigerator and dishwasher catalog.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/parts?type=refrigerator"
            className="rounded-md bg-partselect-green px-6 py-3 text-sm font-semibold text-white shadow hover:bg-partselect-green-dark focus:outline-none focus:ring-2 focus:ring-partselect-green-light focus:ring-offset-2"
          >
            Browse Refrigerator Parts
          </Link>
          <Link
            href="/parts?type=dishwasher"
            className="rounded-md border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-partselect-teal"
          >
            Browse Dishwasher Parts
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Compatibility checks",
            body: "Verify a part fits your model before you buy.",
          },
          {
            title: "Install guides",
            body: "Step-by-step instructions grounded in real part data.",
          },
          {
            title: "Troubleshooting",
            body: "Diagnose symptoms and discover candidate fixes.",
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-partselect-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-partselect-teal">{card.title}</h2>
            <p className="mt-2 text-sm text-partselect-gray-600">{card.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
