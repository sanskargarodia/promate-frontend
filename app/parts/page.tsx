import Link from "next/link";

import { fetchParts, formatPrice, type PartCard } from "@/lib/api";

type Props = {
  searchParams: { q?: string; type?: string };
};

export default async function PartsPage({ searchParams }: Props) {
  const applianceType =
    searchParams.type === "dishwasher" || searchParams.type === "refrigerator"
      ? searchParams.type
      : undefined;

  let parts: PartCard[] = [];
  let error: string | null = null;
  try {
    parts = await fetchParts(searchParams.q, applianceType);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load catalog";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-partselect-teal">
            {applianceType
              ? `${applianceType.charAt(0).toUpperCase()}${applianceType.slice(1)} Parts`
              : "Browse Parts"}
          </h1>
          {searchParams.q && (
            <p className="mt-1 text-sm text-partselect-gray-600">Results for “{searchParams.q}”</p>
          )}
        </div>
        <form className="flex gap-2" action="/parts" method="get">
          {applianceType && <input type="hidden" name="type" value={applianceType} />}
          <input
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Search parts…"
            className="rounded-md border border-partselect-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-partselect-teal px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}. Is the backend running at {process.env.NEXT_PUBLIC_API_BASE_URL ?? "localhost:8000"}?
        </p>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => (
          <li key={part.ps_number}>
            <Link
              href={`/parts/${part.ps_number}`}
              className="block rounded-xl border border-partselect-gray-200 bg-white p-4 shadow-sm hover:border-partselect-teal"
            >
              {part.image_urls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={part.image_urls[0]}
                  alt=""
                  className="mb-3 h-32 w-full object-contain"
                />
              )}
              <p className="text-xs font-semibold text-partselect-teal">{part.ps_number}</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium">{part.name}</p>
              <p className="mt-2 text-sm text-partselect-gray-600">{formatPrice(part.price_cents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
