import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-partselect-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-md bg-partselect-teal text-sm font-bold text-white"
            aria-hidden
          >
            PS
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight text-partselect-teal">PartSelect</p>
            <p className="text-xs text-partselect-gray-600">ProMate assistant demo</p>
          </div>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/parts?type=refrigerator" className="hidden font-medium text-partselect-teal sm:inline">
            Refrigerator Parts
          </Link>
          <Link href="/parts?type=dishwasher" className="hidden font-medium text-partselect-teal sm:inline">
            Dishwasher Parts
          </Link>
          <Link
            href="/parts"
            className="rounded-md bg-partselect-teal px-3 py-2 text-sm font-semibold text-white hover:bg-partselect-teal-dark"
          >
            Browse catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
