"use client";

import { ProMateAvatar } from "./PartSelectLogo";

type Props = {
  message: string;
};

export function AgentActivityIndicator({ message }: Props) {
  return (
    <div
      className="flex items-start gap-3 msg-in"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <ProMateAvatar size={36} />
      <div className="flex items-center gap-3 rounded-3xl rounded-tl-lg bg-white/95 px-4 py-3 shadow-sm ring-1 ring-partselect-gray-100">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-brand-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-brand-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-partselect-brand-teal" />
        </div>
        <span className="text-xs font-medium text-partselect-gray-600">
          {message}
        </span>
      </div>
    </div>
  );
}
