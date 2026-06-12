export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

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
  message?: string;
  thread_id?: string;
  part?: PartCard;
  allowed?: boolean;
  ps_number?: string;
  source_url?: string;
  price_cents?: number | null;
  in_stock?: boolean | null;
  reason?: string;
};

export type AgentStatusEvent = {
  type: "status";
  message: string;
};

export function partSelectUrl(part: PartCard): string {
  return part.source_url ?? "";
}

export function formatPrice(cents?: number | null): string {
  if (cents == null) return "Price unavailable";
  return `$${(cents / 100).toFixed(2)}`;
}

export async function* streamChat(
  message: string,
  threadId?: string,
): AsyncGenerator<ChatEvent> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
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
