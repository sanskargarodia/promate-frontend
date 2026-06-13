"use client";

import type { MouseEvent } from "react";

import { formatPrice, partSelectUrl, type PartCard } from "@/lib/api";

import { ProductDetailContent } from "./ProductDetailContent";

type Props = {
  part: PartCard;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (part: PartCard) => void;
  onToggleExpand: (psNumber: string) => void;
  showReasonOnTile?: boolean;
};

export function ProductCardTile({
  part,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  showReasonOnTile = false,
}: Props) {
  const externalUrl = partSelectUrl(part);

  const handleClick = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      onSelect(part);
    } else {
      onToggleExpand(part.ps_number);
    }
  };

  const handleExternalClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-3 rounded-2xl bg-white/90 p-3 text-left shadow-sm transition hover:shadow-md ${
          isSelected
            ? "ring-2 ring-partselect-brand-teal/40 ring-offset-1"
            : "ring-1 ring-partselect-gray-100 hover:ring-partselect-brand-teal/20"
        }`}
      >
        {part.image_urls[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={part.image_urls[0]}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl bg-partselect-gray-50 object-contain p-1"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-partselect-brand-teal">
            {part.ps_number}
          </p>
          <p className="truncate text-sm font-medium text-partselect-gray-900">
            {part.name}
          </p>
          <p className="mt-0.5 text-xs text-partselect-gray-600">
            {formatPrice(part.price_cents)}
            {part.in_stock != null &&
              ` · ${part.in_stock ? "In stock" : "Out of stock"}`}
          </p>
          {showReasonOnTile && part.recommendation_reason && (
            <p className="mt-1 line-clamp-2 text-xs text-partselect-gray-500">
              {part.recommendation_reason}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleExternalClick}
              aria-label={`View ${part.ps_number} on PartSelect.com`}
              className="grid h-8 w-8 place-items-center rounded-full text-partselect-gray-500 transition hover:bg-partselect-orange/10 hover:text-partselect-orange"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-partselect-gray-400 transition md:hidden ${isExpanded ? "rotate-90" : ""}`}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </button>

      <div
        className={`grid transition-all duration-200 ease-out md:hidden ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 rounded-2xl bg-partselect-gray-50/80 px-4 pb-4">
            <ProductDetailContent part={part} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
