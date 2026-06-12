"use client";

type Props = {
  message: string;
};

export function AgentActivityIndicator({ message }: Props) {
  return (
    <div
      className="mr-4 flex items-center gap-2.5 rounded-xl bg-partselect-gray-50 px-4 py-3"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-partselect-teal opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-partselect-teal" />
      </span>
      <p className="text-sm text-partselect-gray-600">
        <span className="font-medium text-partselect-teal">
          PartSelect Assistant
        </span>
        {" · "}
        {message}
      </p>
    </div>
  );
}
