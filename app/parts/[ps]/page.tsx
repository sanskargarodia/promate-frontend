import Link from "next/link";
import { notFound } from "next/navigation";

import { CompatibilityLookup } from "@/components/parts/CompatibilityLookup";
import { fetchPart, formatPrice, partSelectUrl } from "@/lib/api";

type Props = { params: { ps: string } };

export default async function PartDetailPage({ params }: Props) {
  let part;
  try {
    part = await fetchPart(params.ps);
  } catch {
    notFound();
  }

  const externalUrl = partSelectUrl(part);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/parts" className="text-sm text-partselect-teal hover:underline">
        ← Back to parts
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {part.image_urls[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={part.image_urls[0]}
            alt={part.name}
            className="rounded-lg border border-partselect-gray-200 bg-white p-4 object-contain"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-partselect-teal">{part.ps_number}</p>
          <h1 className="mt-1 text-2xl font-bold">{part.name}</h1>
          <p className="mt-2 text-2xl font-bold text-partselect-green">
            {formatPrice(part.price_cents)}
          </p>
          <p className="mt-1 text-sm text-partselect-gray-600">
            {part.in_stock ? "In stock" : "Out of stock"} · {part.appliance_type}
          </p>
          {part.brand && (
            <p className="mt-1 text-sm text-partselect-gray-600">Brand: {part.brand}</p>
          )}
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-partselect-green px-6 py-3 text-sm font-semibold text-white hover:bg-partselect-green-dark"
            >
              Order on PartSelect.com →
            </a>
          ) : null}
        </div>
      </div>

      <CompatibilityLookup psNumber={part.ps_number} />
    </div>
  );
}
