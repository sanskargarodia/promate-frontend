"use client";

import { formatPrice, partSelectUrl, type PartCard } from "@/lib/api";

type Props = {
  part: PartCard;
  compact?: boolean;
};

export function ProductDetailContent({ part, compact = false }: Props) {
  const imageUrl = part.image_urls[0];
  const externalUrl = partSelectUrl(part);
  const isRecommended = part.card_role === "recommended";

  return (
    <div className={`flex flex-col gap-4 ${compact ? "pt-3" : ""}`}>
      {imageUrl && (
        <div className="rounded-2xl bg-partselect-gray-50/80 p-4 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={part.name}
            className={`mx-auto w-full object-contain ${compact ? "max-h-32" : "max-h-44"}`}
          />
        </div>
      )}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-partselect-brand-teal">
          {part.ps_number}
        </p>
        <h3
          className={`mt-1 font-semibold leading-snug text-partselect-gray-900 ${compact ? "text-sm" : "text-base"}`}
        >
          {part.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <p
            className={`font-bold tracking-tight text-partselect-gray-900 ${compact ? "text-lg" : "text-2xl"}`}
          >
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
          className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-partselect-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-partselect-orange-dark"
        >
          View on PartSelect.com
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </a>
      ) : null}

      {isRecommended && part.recommendation_reason && compact && (
        <p className="text-xs leading-relaxed text-partselect-gray-600">
          {part.recommendation_reason}
        </p>
      )}
    </div>
  );
}
