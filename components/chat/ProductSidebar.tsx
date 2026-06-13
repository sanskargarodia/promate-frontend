"use client";

import { formatPrice, partSelectUrl, type PartCard } from "@/lib/api";

type Props = {
  part: PartCard;
};

export function ProductSidebar({ part }: Props) {
  const imageUrl = part.image_urls[0];
  const externalUrl = partSelectUrl(part);

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-partselect-gray-200 bg-white/60 backdrop-blur md:flex">
      <div className="flex items-center gap-2 border-b border-partselect-gray-200 bg-white/80 px-5 py-4">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-partselect-teal/10 text-partselect-teal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7 12 3 4 7l8 4 8-4Z" />
            <path d="m4 7 8 4v10" />
            <path d="m20 7-8 4" />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-partselect-gray-900">Active part</h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-soft p-5">
        {imageUrl && (
          <div className="rounded-xl border border-partselect-gray-200 bg-white p-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={part.name}
              className="mx-auto max-h-44 w-full object-contain"
            />
          </div>
        )}

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-partselect-teal">
            {part.ps_number}
          </p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-partselect-gray-900">
            {part.name}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-partselect-gray-900">
              {formatPrice(part.price_cents)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                part.in_stock
                  ? "bg-partselect-green/12 text-partselect-green-dark"
                  : "bg-partselect-gray-100 text-partselect-gray-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  part.in_stock ? "bg-partselect-green" : "bg-partselect-gray-600"
                }`}
              />
              {part.in_stock ? "In stock" : "Out of stock"}
            </span>
            {part.brand && (
              <span className="inline-flex items-center rounded-full bg-partselect-gray-100 px-2.5 py-1 text-[11px] font-semibold text-partselect-gray-700">
                {part.brand}
              </span>
            )}
            {part.appliance_type && (
              <span className="inline-flex items-center rounded-full bg-partselect-gray-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-partselect-gray-700">
                {part.appliance_type}
              </span>
            )}
          </div>
        </div>

        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-partselect-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-partselect-green-dark"
          >
            View on PartSelect.com
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        ) : null}
      </div>
    </aside>
  );
}
