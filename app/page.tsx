import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl bg-gradient-to-br from-partselect-teal to-partselect-teal-dark px-8 py-14 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-partselect-green-light">
          ProMate assistant demo
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Conversational bridge to the right PartSelect part
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          This is a demo host for the ProMate chat agent — not a full storefront. Browse the
          catalog for context, then use the chat widget to diagnose issues, verify compatibility,
          get install guidance, and receive a grounded handoff to order on PartSelect.com.
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
            title: "Purchase handoff",
            body: "When you are ready to order, the agent links you to PartSelect.com with grounded price and stock.",
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

      <section className="mt-12 rounded-xl border border-partselect-gray-200 bg-partselect-gray-50 p-6">
        <h2 className="text-lg font-semibold text-partselect-teal">Try these demo prompts</h2>
        <ul className="mt-4 space-y-2 text-sm text-partselect-gray-700">
          <li>My dishwasher won&apos;t drain — what part might I need?</li>
          <li>Will PS11752778 fit model WDT780SAEM1?</li>
          <li>How can I install part PS11752778?</li>
          <li>I&apos;m ready to buy PS11752778</li>
          <li>What is the status of order ORD-DEMO-001?</li>
        </ul>
        <p className="mt-4 text-xs text-partselect-gray-500">
          Open the chat widget (bottom-right) to start a conversation.
        </p>
      </section>
    </div>
  );
}
