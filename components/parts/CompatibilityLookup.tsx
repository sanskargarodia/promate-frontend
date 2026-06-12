"use client";

import { FormEvent, useState } from "react";

import { checkCompatibility, type CompatibilityResult } from "@/lib/api";

type Props = {
  psNumber: string;
};

export function CompatibilityLookup({ psNumber }: Props) {
  const [modelNumber, setModelNumber] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const model = modelNumber.trim().toUpperCase();
    if (!model) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const compat = await checkCompatibility(psNumber, model);
      setResult(compat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compatibility check failed");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass =
    result?.compatible === true
      ? "border-green-200 bg-green-50 text-green-800"
      : result?.compatible === false
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <section className="mt-8 rounded-xl border border-partselect-gray-200 bg-partselect-gray-50 p-5">
      <h2 className="text-lg font-semibold text-partselect-teal">Compatibility lookup</h2>
      <p className="mt-1 text-sm text-partselect-gray-600">
        Enter your appliance model number to verify this part fits.
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={modelNumber}
          onChange={(e) => setModelNumber(e.target.value)}
          placeholder="e.g. WDT780SAEM1"
          className="min-w-[12rem] flex-1 rounded-md border border-partselect-gray-200 px-3 py-2 text-sm uppercase focus:border-partselect-teal focus:outline-none focus:ring-1 focus:ring-partselect-teal"
        />
        <button
          type="submit"
          disabled={loading || !modelNumber.trim()}
          className="rounded-md bg-partselect-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check compatibility"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className={`mt-3 rounded-md border p-3 text-sm ${badgeClass}`}>
          <p className="font-semibold">{result.message}</p>
          <p className="mt-1 text-xs opacity-80">
            {result.ps_number} · Model {result.model_number}
          </p>
        </div>
      )}
    </section>
  );
}
