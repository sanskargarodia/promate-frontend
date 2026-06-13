"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  formatPrice,
  streamChat,
  type ChatMessage,
  type PartCard,
  type PurchaseHandoffEvent,
} from "@/lib/api";

import { AgentActivityIndicator } from "./AgentActivityIndicator";
import { ChatMessageContent } from "./ChatMessageContent";
import { PartSelectLogo, ProMateAvatar } from "./PartSelectLogo";
import { ProductCardTile } from "./ProductCardTile";
import { ProductDetailPanel } from "./ProductDetailPanel";

const DEFAULT_ACTIVITY = "Thinking…";

const SUGGESTED_PROMPTS = [
  {
    title: "Diagnose an issue",
    body: "My ice maker stopped working — what part might I need?",
    icon: "wrench",
  },
  {
    title: "Check compatibility",
    body: "Will PS11752778 fit model WDT780SAEM1?",
    icon: "check",
  },
  {
    title: "Get install help",
    body: "How can I install part PS11752778?",
    icon: "book",
  },
  {
    title: "Learn about a part",
    body: "Tell me about part PS11752778",
    icon: "search",
  },
  {
    title: "Track an order",
    body: "What is the status of order ORD-DEMO-001?",
    icon: "package",
  },
] as const;

function pickPrimaryPart(parts: PartCard[]): PartCard | undefined {
  return parts.find((p) => p.card_role !== "recommended") ?? parts[0];
}

function PromptIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6Z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
          <path d="M3 7.5V16.5L12 21l9-4.5V7.5" />
          <path d="M12 12v9" />
        </svg>
      );
    default:
      return null;
  }
}

function PurchaseHandoffBanner({ handoff }: { handoff: PurchaseHandoffEvent }) {
  if (!handoff.allowed || !handoff.ps_number || !handoff.source_url)
    return null;

  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-partselect-orange/8 to-white shadow-sm ring-1 ring-partselect-orange/20">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-partselect-orange-dark">
            Ready to order
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-partselect-gray-900">
            {handoff.ps_number}
            {handoff.price_cents != null && (
              <span className="ml-2 font-bold text-partselect-gray-900">
                {formatPrice(handoff.price_cents)}
              </span>
            )}
            {handoff.in_stock != null && (
              <span
                className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  handoff.in_stock
                    ? "bg-partselect-green/15 text-partselect-green-dark"
                    : "bg-partselect-gray-100 text-partselect-gray-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    handoff.in_stock
                      ? "bg-partselect-green"
                      : "bg-partselect-gray-600"
                  }`}
                />
                {handoff.in_stock ? "In stock" : "Out of stock"}
              </span>
            )}
          </p>
        </div>
        <a
          href={handoff.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-partselect-orange px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-partselect-orange-dark"
        >
          Order on PartSelect
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function SuggestedPrompts({
  prompts,
  onSelect,
  disabled,
}: {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}) {
  if (prompts.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full bg-partselect-gray-50 px-3.5 py-1.5 text-left text-xs text-partselect-gray-700 shadow-sm ring-1 ring-partselect-gray-100 transition hover:bg-white hover:ring-partselect-brand-teal/30 disabled:opacity-50 sm:text-sm"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <PartSelectLogo height={48} className="mb-4" />
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-partselect-gray-900 sm:text-4xl">
        How can I help you today?
      </h1>
      <p className="mt-3 max-w-xl text-balance text-sm text-partselect-gray-600 sm:text-base">
        ProMate is your PartSelect parts expert — compatibility, installation,
        troubleshooting, and ordering on PartSelect.com.
      </p>
      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.body}
            type="button"
            onClick={() => onSelect(prompt.body)}
            className="group flex items-start gap-3 rounded-3xl bg-white/80 p-4 text-left shadow-sm ring-1 ring-partselect-gray-100 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-partselect-brand-teal/25"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-partselect-brand-teal/10 text-partselect-brand-teal transition group-hover:bg-partselect-brand-teal group-hover:text-white">
              <PromptIcon name={prompt.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-partselect-gray-900">
                {prompt.title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-partselect-gray-600">
                {prompt.body}
              </span>
            </span>
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
  const [selectedPart, setSelectedPart] = useState<PartCard | null>(null);
  const [mobileExpandedPs, setMobileExpandedPs] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, selectedPart, mobileExpandedPs, scrollToBottom]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);
      setActivityMessage(DEFAULT_ACTIVITY);
      setMobileExpandedPs(null);

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

        const primary = cards.length > 0 ? pickPrimaryPart(cards) : undefined;
        if (primary) {
          setSelectedPart(primary);
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
        requestAnimationFrame(() => textareaRef.current?.focus());
      }
    },
    [loading, threadId],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const startNewChat = () => {
    if (loading) return;
    setMessages([]);
    setThreadId(undefined);
    setInput("");
    setSelectedPart(null);
    setMobileExpandedPs(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleSelectPart = useCallback((part: PartCard) => {
    setSelectedPart(part);
  }, []);

  const handleToggleExpand = useCallback((psNumber: string) => {
    setMobileExpandedPs((prev) => (prev === psNumber ? null : psNumber));
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <PartSelectLogo height={32} className="hidden shrink-0 sm:block" />
            <PartSelectLogo height={28} className="shrink-0 sm:hidden" />
            <div className="min-w-0 border-l border-partselect-gray-100 pl-3">
              <p className="truncate text-sm font-semibold text-partselect-gray-900 sm:text-base">
                ProMate
              </p>
              <p className="flex items-center gap-1.5 truncate text-xs text-partselect-gray-600">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-partselect-green opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-partselect-green" />
                </span>
                Online · PartSelect parts expert
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startNewChat}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-white px-3 py-1.5 text-xs font-medium text-partselect-gray-700 shadow-sm ring-1 ring-partselect-gray-100 transition hover:ring-partselect-brand-teal/30 hover:text-partselect-brand-teal disabled:opacity-50"
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
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              New chat
            </button>
          )}
        </div>
        <div className="bg-partselect-brand-teal px-5 py-1 text-center text-[10px] font-medium tracking-wide text-white sm:px-7">
          Here to help since 1999
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto scrollbar-soft"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <EmptyState onSelect={(prompt) => void send(prompt)} />
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 sm:px-6">
                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  const primaryParts =
                    msg.parts?.filter((p) => p.card_role !== "recommended") ??
                    [];
                  const recommended =
                    msg.parts?.filter((p) => p.card_role === "recommended") ??
                    [];

                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 msg-in ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {isUser ? (
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-partselect-gray-100 text-[10px] font-bold text-partselect-gray-700 shadow-sm ring-1 ring-partselect-gray-100"
                          aria-hidden
                        >
                          You
                        </div>
                      ) : (
                        <ProMateAvatar size={36} />
                      )}
                      <div
                        className={`min-w-0 max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
                          isUser
                            ? "rounded-tr-lg bg-gradient-to-br from-partselect-brand-teal to-partselect-brand-teal-dark text-white"
                            : "rounded-tl-lg bg-white/95 text-partselect-gray-900 ring-1 ring-partselect-gray-100"
                        }`}
                      >
                        <ChatMessageContent
                          content={msg.content}
                          variant={msg.role}
                        />

                        {primaryParts.length > 0 && (
                          <div className="mt-4 rounded-2xl bg-partselect-gray-50/60 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-partselect-brand-teal">
                              {primaryParts.length > 1
                                ? "Suggested parts"
                                : "Suggested part"}
                            </p>
                            <p className="mt-0.5 mb-1 text-xs text-partselect-gray-600">
                              Tap a part to view details
                              <span className="hidden md:inline">
                                {" "}
                                in the panel on the right
                              </span>
                              .
                            </p>
                            {primaryParts.map((p) => (
                              <ProductCardTile
                                key={p.ps_number}
                                part={p}
                                isSelected={
                                  selectedPart?.ps_number === p.ps_number
                                }
                                isExpanded={mobileExpandedPs === p.ps_number}
                                onSelect={handleSelectPart}
                                onToggleExpand={handleToggleExpand}
                              />
                            ))}
                          </div>
                        )}

                        {msg.purchaseHandoff && (
                          <PurchaseHandoffBanner
                            handoff={msg.purchaseHandoff}
                          />
                        )}
                        {recommended.length > 0 && (
                          <div className="mt-4 rounded-2xl bg-partselect-gray-50/60 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-partselect-brand-teal">
                              You may also need
                            </p>
                            <p className="mt-0.5 mb-1 text-xs text-partselect-gray-600">
                              Companion parts that may also be required for the
                              repair or install.
                            </p>
                            {recommended.map((p) => (
                              <ProductCardTile
                                key={p.ps_number}
                                part={p}
                                isSelected={
                                  selectedPart?.ps_number === p.ps_number
                                }
                                isExpanded={mobileExpandedPs === p.ps_number}
                                onSelect={handleSelectPart}
                                onToggleExpand={handleToggleExpand}
                                showReasonOnTile
                              />
                            ))}
                          </div>
                        )}
                        {msg.role === "assistant" &&
                          msg.suggestions &&
                          msg.suggestions.length > 0 && (
                            <div className="mt-4 rounded-2xl bg-partselect-gray-50/40 p-3">
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
                    </div>
                  );
                })}
                {loading && (
                  <AgentActivityIndicator message={activityMessage} />
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="shrink-0 bg-white/70 px-4 py-4 backdrop-blur-md sm:px-6"
          >
            <div className="mx-auto w-full max-w-3xl">
              <div className="group relative flex items-end gap-2 rounded-3xl bg-white p-2 shadow-sm ring-1 ring-partselect-gray-100 transition focus-within:ring-2 focus-within:ring-partselect-brand-teal/20">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Message ProMate…  (Shift + Enter for newline)"
                  className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-partselect-gray-900 placeholder:text-partselect-gray-500 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-partselect-orange text-white shadow-sm transition hover:bg-partselect-orange-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-partselect-gray-200 disabled:text-partselect-gray-600 disabled:opacity-80"
                >
                  {loading ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 5 7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-partselect-gray-500">
                Grounded in PartSelect catalog data. Purchase handoffs link to
                PartSelect.com.
              </p>
            </div>
          </form>
        </div>

        {selectedPart && (
          <ProductDetailPanel
            part={selectedPart}
            onClose={() => setSelectedPart(null)}
          />
        )}
      </div>
    </div>
  );
}
