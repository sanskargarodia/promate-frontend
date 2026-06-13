"use client";

type Props = {
  message: string;
};

export function AgentActivityIndicator({ message }: Props) {
  return (
    <div className="flex items-start gap-3 msg-in" role="status" aria-live="polite" aria-label={message}>
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-partselect-teal to-partselect-teal-dark text-[11px] font-bold text-white shadow-sm ring-1 ring-white/30"
        aria-hidden
      >
        PS
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-partselect-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-teal" />
        </div>
        <span className="text-xs font-medium text-partselect-gray-600">{message}</span>
      </div>
    </div>
  );
}
