export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export type PartCard = {
  ps_number: string;
  name: string;
  brand?: string | null;
  appliance_type: string;
  price_cents?: number | null;
  in_stock: boolean;
  image_urls: string[];
  source_url?: string | null;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  parts?: PartCard[];
  purchaseHandoff?: PurchaseHandoffEvent;
};

export type PurchaseHandoffEvent = {
  type: "purchase_handoff";
  allowed?: boolean;
  ps_number?: string;
  source_url?: string;
  price_cents?: number | null;
  in_stock?: boolean | null;
  reason?: string;
};

type ChatEvent = {
  type: string;
  content?: string;
  thread_id?: string;
  part?: PartCard;
  allowed?: boolean;
  ps_number?: string;
  source_url?: string;
  price_cents?: number | null;
  in_stock?: boolean | null;
  reason?: string;
};

export function partSelectUrl(part: PartCard): string {
  return part.source_url ?? "";
}

export async function fetchParts(
  q?: string,
  applianceType?: "refrigerator" | "dishwasher",
  limit = 24,
): Promise<PartCard[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (applianceType) params.set("appliance_type", applianceType);
  params.set("limit", String(limit));
  const res = await fetch(`${API_BASE}/api/v1/parts?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load parts (${res.status})`);
  return res.json();
}

export async function fetchPart(psNumber: string): Promise<PartCard> {
  const res = await fetch(`${API_BASE}/api/v1/parts/${encodeURIComponent(psNumber)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Part not found");
  return res.json();
}

export function formatPrice(cents?: number | null): string {
  if (cents == null) return "Price unavailable";
  return `$${(cents / 100).toFixed(2)}`;
}

export type CompatibilityResult = {
  ps_number: string;
  model_number: string;
  compatible: boolean | null;
  part_name?: string | null;
  message: string;
};

export async function checkCompatibility(
  psNumber: string,
  modelNumber: string,
): Promise<CompatibilityResult> {
  const res = await fetch(
    `${API_BASE}/api/v1/parts/${encodeURIComponent(psNumber)}/compatibility/${encodeURIComponent(modelNumber)}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Compatibility check failed (${res.status})`);
  return res.json();
}

export async function* streamChat(
  message: string,
  threadId?: string,
): AsyncGenerator<ChatEvent> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Chat failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseEventLines = (block: string): ChatEvent | null => {
    for (const rawLine of block.split("\n")) {
      const line = rawLine.replace(/\r$/, "").trim();
      if (line.startsWith("data:")) {
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try {
          return JSON.parse(payload) as ChatEvent;
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const event = parseEventLines(block);
      if (event) yield event;
    }
  }

  if (buffer.trim()) {
    const event = parseEventLines(buffer);
    if (event) yield event;
  }
}
