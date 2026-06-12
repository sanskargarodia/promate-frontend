"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";

import { streamChat, type ChatMessage, type PartCard } from "@/lib/api";

import { ChatMessageContent } from "./ChatMessageContent";
import { ProductSidebar } from "./ProductSidebar";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const activePart = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.parts?.[0]) {
        return msg.parts[0];
      }
    }
    return undefined;
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      let assistant = "";
      const cards: PartCard[] = [];
      const seenPs = new Set<string>();

      const pushCard = (part: PartCard) => {
        if (seenPs.has(part.ps_number)) return;
        seenPs.add(part.ps_number);
        cards.push(part);
      };

      try {
        for await (const event of streamChat(text.trim(), threadId)) {
          if (event.type === "session" && event.thread_id) {
            setThreadId(event.thread_id);
          }
          if (event.type === "token" && event.content) {
            assistant += event.content;
          }
          if (event.type === "error" && event.content) {
            assistant = event.content;
          }
          if (event.type === "product_card" && event.part) {
            pushCard(event.part);
          }
        }
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: assistant || "No response from the assistant. Please try again.",
            parts: cards.length > 0 ? cards : undefined,
          },
        ]);
      } catch (err) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: err instanceof Error ? err.message : "Something went wrong.",
          },
        ]);
      } finally {
        setLoading(false);
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      }
    },
    [loading, threadId],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-partselect-teal text-sm font-bold text-white shadow-lg hover:bg-partselect-teal-dark focus:outline-none focus:ring-2 focus:ring-partselect-green"
        aria-expanded={open}
        aria-controls="promate-chat-panel"
      >
        {open ? "✕" : "Chat"}
      </button>

      {open && (
        <div
          id="promate-chat-panel"
          role="dialog"
          aria-label="ProMate parts assistant"
          className="fixed bottom-24 right-6 z-50 flex h-[min(44rem,88vh)] w-[min(44rem,96vw)] flex-col overflow-hidden rounded-xl border border-partselect-gray-200 bg-white shadow-2xl"
        >
          <header className="border-b border-partselect-gray-200 bg-partselect-teal px-5 py-3.5 text-white">
            <p className="text-base font-semibold">ProMate Assistant</p>
            <p className="text-xs text-white/80">Refrigerator &amp; dishwasher parts</p>
          </header>

          <div className="flex min-h-0 flex-1">
            {activePart && <ProductSidebar part={activePart} />}

            <div className="flex min-w-0 flex-1 flex-col">
              <div
                ref={listRef}
                className="flex-1 space-y-4 overflow-y-auto p-4"
                aria-live="polite"
              >
                {messages.length === 0 && (
                  <p className="text-sm text-partselect-gray-600">
                    Ask about a part, compatibility, installation, or troubleshooting.
                  </p>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "ml-6 bg-partselect-teal text-white"
                        : "mr-4 bg-partselect-gray-50 text-partselect-gray-800"
                    }`}
                  >
                    <ChatMessageContent content={msg.content} variant={msg.role} />
                    {msg.parts?.slice(1).map((p) => (
                      <a
                        key={p.ps_number}
                        href={`/parts/${p.ps_number}`}
                        className="mt-3 flex gap-3 rounded-lg border border-partselect-gray-200 bg-white p-2 text-xs hover:border-partselect-teal"
                      >
                        {p.image_urls[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_urls[0]}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded object-contain"
                          />
                        )}
                        <span>
                          <span className="block font-semibold text-partselect-teal">
                            {p.ps_number}
                          </span>
                          <span className="text-partselect-gray-600">{p.name}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                ))}
                {loading && (
                  <p className="text-sm text-partselect-gray-500">PartSelect Assistant is typing…</p>
                )}
              </div>

              <form onSubmit={onSubmit} className="border-t border-partselect-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about parts, compatibility, or installation…"
                    className="flex-1 rounded-lg border border-partselect-gray-200 px-4 py-2.5 text-sm focus:border-partselect-teal focus:outline-none focus:ring-1 focus:ring-partselect-teal"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-lg bg-partselect-green px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
