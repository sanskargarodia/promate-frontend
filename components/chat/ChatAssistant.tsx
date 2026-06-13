"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  formatPrice,
  partSelectUrl,
  streamChat,
  type ChatMessage,
  type PartCard,
  type PurchaseHandoffEvent,
} from "@/lib/api";

import { AgentActivityIndicator } from "./AgentActivityIndicator";
import { ChatMessageContent } from "./ChatMessageContent";
import { ProductSidebar } from "./ProductSidebar";

const DEFAULT_ACTIVITY = "Thinking…";

const SUGGESTED_PROMPTS = [
  "My ice maker stopped working — what part might I need?",
  "Will PS11752778 fit model WDT780SAEM1?",
  "How can I install part PS11752778?",
  "Tell me about part PS11752778",
  "What is the status of order ORD-DEMO-001?",
];

function PurchaseHandoffBanner({ handoff }: { handoff: PurchaseHandoffEvent }) {
  if (!handoff.allowed || !handoff.ps_number || !handoff.source_url)
    return null;

  return (
    <div className="mt-3 rounded-lg border border-partselect-green bg-white p-3">
      <p className="text-xs font-semibold text-partselect-teal">
        Ready to order
      </p>
      <p className="mt-1 text-sm text-partselect-gray-800">
        {handoff.ps_number}
        {handoff.price_cents != null &&
          ` · ${formatPrice(handoff.price_cents)}`}
        {handoff.in_stock != null &&
          (handoff.in_stock ? " · In stock" : " · Out of stock")}
      </p>
      <a
        href={handoff.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block rounded-md bg-partselect-green px-3 py-2 text-xs font-bold text-white hover:bg-partselect-green-dark"
      >
        Order on PartSelect.com
      </a>
    </div>
  );
}

function PartCardLink({ part }: { part: PartCard }) {
  const href = partSelectUrl(part);

  if (!href) {
    return (
      <div className="mt-3 flex gap-3 rounded-lg border border-partselect-gray-200 bg-white p-2 text-xs">
        {part.image_urls[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={part.image_urls[0]}
            alt=""
            className="h-14 w-14 shrink-0 rounded object-contain"
          />
        )}
        <span>
          <span className="block font-semibold text-partselect-teal">
            {part.ps_number}
          </span>
          <span className="text-partselect-gray-600">{part.name}</span>
          {part.recommendation_reason && (
            <span className="mt-1 block text-partselect-gray-500">
              {part.recommendation_reason}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex gap-3 rounded-lg border border-partselect-gray-200 bg-white p-2 text-xs hover:border-partselect-teal"
    >
      {part.image_urls[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={part.image_urls[0]}
          alt=""
          className="h-14 w-14 shrink-0 rounded object-contain"
        />
      )}
      <span>
        <span className="block font-semibold text-partselect-teal">
          {part.ps_number}
        </span>
        <span className="text-partselect-gray-600">{part.name}</span>
        {part.recommendation_reason && (
          <span className="mt-1 block text-partselect-gray-500">
            {part.recommendation_reason}
          </span>
        )}
      </span>
    </a>
  );
}

function SuggestedPrompts({
  prompts,
  onSelect,
  disabled,
  className = "",
}: {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  if (prompts.length === 0) return null;

  return (
    <div className={`mt-3 flex flex-wrap gap-2 ${className}`}>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-lg border border-partselect-gray-200 bg-white px-3 py-2 text-left text-xs text-partselect-gray-700 transition hover:border-partselect-teal hover:bg-partselect-gray-50 disabled:opacity-50 sm:text-sm"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-partselect-teal text-lg font-bold text-white shadow-md">
        PS
      </div>
      <h1 className="text-2xl font-semibold text-partselect-gray-900 sm:text-3xl">
        How can I help you today?
      </h1>
      <p className="mt-2 max-w-md text-sm text-partselect-gray-600 sm:text-base">
        Find the right PartSelect part — compatibility, installation,
        troubleshooting, and ordering on PartSelect.com.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect(prompt)}
            className="rounded-xl border border-partselect-gray-200 bg-white px-4 py-3 text-left text-sm text-partselect-gray-700 transition hover:border-partselect-teal hover:bg-partselect-gray-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [activityMessage, setActivityMessage] = useState(DEFAULT_ACTIVITY);
  const listRef = useRef<HTMLDivElement>(null);

  const activePart = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.parts?.length) {
        return (
          msg.parts.find((p) => p.card_role !== "recommended") ?? msg.parts[0]
        );
      }
    }
    return undefined;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);
      setActivityMessage(DEFAULT_ACTIVITY);

      let assistant = "";
      const cards: PartCard[] = [];
      let handoff: PurchaseHandoffEvent | undefined;
      let suggestions: string[] = [];
      const seenPs = new Set<string>();

      const pushCard = (
        part: PartCard,
        cardRole: PartCard["card_role"] = "primary",
      ) => {
        if (seenPs.has(part.ps_number)) return;
        seenPs.add(part.ps_number);
        cards.push({ ...part, card_role: cardRole });
      };

      try {
        for await (const event of streamChat(text.trim(), threadId)) {
          if (event.type === "session" && event.thread_id) {
            setThreadId(event.thread_id);
          }
          if (event.type === "status" && event.message) {
            setActivityMessage(event.message);
          }
          if (event.type === "purchase_handoff" && event.allowed) {
            handoff = {
              type: "purchase_handoff",
              allowed: event.allowed,
              ps_number: event.ps_number,
              source_url: event.source_url,
              price_cents: event.price_cents,
              in_stock: event.in_stock,
              reason: event.reason,
            };
          }
          if (event.type === "token" && event.content) {
            assistant += event.content;
          }
          if (event.type === "error" && event.content) {
            assistant = event.content;
          }
          if (event.type === "product_card" && event.part) {
            pushCard(event.part, event.card_role ?? "primary");
          }
          if (event.type === "suggestions" && event.prompts?.length) {
            suggestions = event.prompts;
          }
        }
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              assistant || "No response from the assistant. Please try again.",
            parts: cards.length > 0 ? cards : undefined,
            purchaseHandoff: handoff,
            suggestions: suggestions.length > 0 ? suggestions : undefined,
          },
        ]);
      } catch (err) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              err instanceof Error ? err.message : "Something went wrong.",
          },
        ]);
      } finally {
        setLoading(false);
        setActivityMessage(DEFAULT_ACTIVITY);
      }
    },
    [loading, threadId],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const startNewChat = () => {
    if (loading) return;
    setMessages([]);
    setThreadId(undefined);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-partselect-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-partselect-teal text-sm font-bold text-white"
            aria-hidden
          >
            PS
          </span>
          <div>
            <p className="text-base font-semibold text-partselect-teal">
              ProMate Assistant
            </p>
            <p className="text-xs text-partselect-gray-600">
              Your PartSelect parts expert
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={startNewChat}
            disabled={loading}
            className="rounded-lg border border-partselect-gray-200 px-3 py-1.5 text-sm font-medium text-partselect-gray-700 hover:bg-partselect-gray-50 disabled:opacity-50"
          >
            New chat
          </button>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        {activePart && <ProductSidebar part={activePart} />}

        <div className="flex min-w-0 flex-1 flex-col">
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <EmptyState onSelect={(prompt) => void send(prompt)} />
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6 sm:px-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "ml-8 bg-partselect-teal text-white sm:ml-16"
                        : "mr-8 bg-partselect-gray-50 text-partselect-gray-800 sm:mr-16"
                    }`}
                  >
                    <ChatMessageContent
                      content={msg.content}
                      variant={msg.role}
                    />
                    {msg.purchaseHandoff && (
                      <PurchaseHandoffBanner handoff={msg.purchaseHandoff} />
                    )}
                    {(() => {
                      const recommended =
                        msg.parts?.filter(
                          (p) => p.card_role === "recommended",
                        ) ?? [];
                      if (recommended.length === 0) return null;
                      return (
                        <div className="mt-4 border-t border-partselect-gray-200 pt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-partselect-teal">
                            You may also need
                          </p>
                          <p className="mt-1 mb-2 text-xs text-partselect-gray-600">
                            Companion parts from this answer that may also be
                            required for the repair or install.
                          </p>
                          {recommended.map((p) => (
                            <PartCardLink key={p.ps_number} part={p} />
                          ))}
                        </div>
                      );
                    })()}
                    {msg.role === "assistant" &&
                      msg.suggestions &&
                      msg.suggestions.length > 0 && (
                        <div className="mt-4 border-t border-partselect-gray-200 pt-3">
                          <p className="text-xs font-semibold text-partselect-gray-600">
                            Suggested follow-ups
                          </p>
                          <SuggestedPrompts
                            prompts={msg.suggestions}
                            onSelect={(prompt) => void send(prompt)}
                            disabled={loading}
                          />
                        </div>
                      )}
                  </div>
                ))}
                {loading && (
                  <div className="mr-8 sm:mr-16">
                    <AgentActivityIndicator message={activityMessage} />
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-partselect-gray-200 bg-white px-4 py-4 sm:px-6"
          >
            <div className="mx-auto flex max-w-3xl gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message ProMate Assistant…"
                className="flex-1 rounded-xl border border-partselect-gray-200 px-4 py-3 text-sm focus:border-partselect-teal focus:outline-none focus:ring-1 focus:ring-partselect-teal"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-partselect-green px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-partselect-gray-500">
              Grounded in PartSelect catalog data. Purchase handoffs link to
              PartSelect.com.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
