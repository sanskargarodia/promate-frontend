"use client";

import { formatPrice, partSelectUrl, type PartCard } from "@/lib/api";

type Props = {
  part: PartCard;
};

export function ProductSidebar({ part }: Props) {
  const imageUrl = part.image_urls[0];
  const externalUrl = partSelectUrl(part);

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-partselect-gray-200 bg-partselect-gray-50 md:flex">
      <div className="bg-amber-400 px-3 py-2.5 text-sm font-bold text-partselect-gray-900">
        Product Information
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={part.name}
            className="mx-auto max-h-36 w-full rounded-lg border border-partselect-gray-200 bg-white object-contain p-2"
          />
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-partselect-teal">
            {part.ps_number}
          </p>
          <h3 className="mt-1 text-sm font-bold leading-snug text-partselect-gray-900">
            {part.name}
          </h3>
          <p className="mt-2 text-lg font-bold text-partselect-green">
            {formatPrice(part.price_cents)}
          </p>
          <p className="mt-1 text-xs text-partselect-gray-600">
            {part.in_stock ? "In stock" : "Out of stock"}
            {part.brand ? ` · ${part.brand}` : ""}
          </p>
        </div>

        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-partselect-green px-3 py-2 text-center text-xs font-bold text-white hover:bg-partselect-green-dark"
          >
            View on PartSelect.com
          </a>
        ) : null}
      </div>
    </aside>
  );
}
