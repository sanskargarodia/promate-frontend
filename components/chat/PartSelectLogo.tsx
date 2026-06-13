"use client";

import Image from "next/image";

type LogoProps = {
  className?: string;
  height?: number;
};

export function PartSelectLogo({ className = "", height = 36 }: LogoProps) {
  return (
    <Image
      src="/partselect-logo.png"
      alt="PartSelect"
      width={Math.round(height * 3.2)}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      priority
    />
  );
}

/** Compact house-"P" mark for ProMate avatars (matches PartSelect logo icon). */
export function ProMateAvatar({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-partselect-orange font-bold text-white shadow-sm ring-1 ring-white/40 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      P
    </span>
  );
}
