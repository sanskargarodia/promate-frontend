"use client";

import { type PartCard } from "@/lib/api";

import { ProductDetailContent } from "./ProductDetailContent";

type Props = {
  part: PartCard;
  onClose: () => void;
};

export function ProductDetailPanel({ part, onClose }: Props) {
  const isRecommended = part.card_role === "recommended";

  return (
    <aside className="panel-slide-in hidden w-80 shrink-0 flex-col border-l border-partselect-gray-100 bg-white/80 shadow-[-4px_0_24px_rgba(0,0,0,0.04)] backdrop-blur-md md:flex">
      <div className="shrink-0 bg-partselect-brand-teal px-5 py-1.5 text-center text-[10px] font-medium tracking-wide text-white">
        Here to help since 1999
      </div>

      <div className="shrink-0 border-b border-partselect-gray-100 bg-white/90 px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-partselect-brand-teal">
              {part.ps_number}
            </p>
            <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-partselect-gray-900">
              {part.name}
            </h2>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                isRecommended
                  ? "bg-partselect-orange/12 text-partselect-orange-dark"
                  : "bg-partselect-brand-teal/10 text-partselect-brand-teal"
              }`}
            >
              {isRecommended ? "Companion part" : "Suggested part"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close part details"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-partselect-gray-600 transition hover:bg-partselect-gray-100 hover:text-partselect-gray-900"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {part.recommendation_reason && (
          <p className="mt-3 text-xs leading-relaxed text-partselect-gray-600">
            {part.recommendation_reason}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto scrollbar-soft p-5">
        <ProductDetailContent part={part} />
      </div>
    </aside>
  );
}
