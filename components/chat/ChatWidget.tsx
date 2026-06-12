"use client";

import { FormEvent, useCallback, useRef, useState } from "react";

import { streamChat, type ChatMessage, type PartCard } from "@/lib/api";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      let assistant = "";
      const cards: PartCard[] = [];

      try {
        for await (const event of streamChat(text.trim(), threadId)) {
          if (event.type === "session" && event.thread_id) {
            setThreadId(event.thread_id);
          }
          if (event.type === "token" && event.content) {
            assistant += event.content;
          }
          if (event.type === "product_card" && event.part) {
            cards.push(event.part);
          }
        }
        setMessages((m) => [
          ...m,
          { role: "assistant", content: assistant || "…", parts: cards },
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
          className="fixed bottom-24 right-6 z-50 flex h-[min(32rem,70vh)] w-[min(24rem,92vw)] flex-col overflow-hidden rounded-xl border border-partselect-gray-200 bg-white shadow-2xl"
        >
          <header className="border-b border-partselect-gray-200 bg-partselect-teal px-4 py-3 text-white">
            <p className="font-semibold">ProMate Assistant</p>
            <p className="text-xs text-white/80">Refrigerator &amp; dishwasher parts</p>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && (
              <p className="text-sm text-partselect-gray-600">
                Ask about a part, compatibility, installation, or troubleshooting.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-8 bg-partselect-teal text-white"
                    : "mr-8 bg-partselect-gray-50 text-partselect-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.parts?.map((p) => (
                  <a
                    key={p.ps_number}
                    href={`/parts/${p.ps_number}`}
                    className="mt-2 block rounded border border-partselect-gray-200 bg-white p-2 text-xs hover:border-partselect-teal"
                  >
                    <span className="font-semibold text-partselect-teal">{p.ps_number}</span>
                    <span className="text-partselect-gray-600"> — {p.name}</span>
                  </a>
                ))}
              </div>
            ))}
            {loading && <p className="text-sm text-partselect-gray-500">Thinking…</p>}
          </div>

          <form onSubmit={onSubmit} className="border-t border-partselect-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a part…"
                className="flex-1 rounded-md border border-partselect-gray-200 px-3 py-2 text-sm focus:border-partselect-teal focus:outline-none focus:ring-1 focus:ring-partselect-teal"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-partselect-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
