"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

import { extractYouTubeId, preprocessAssistantMarkdown } from "@/lib/markdown";

import { YouTubeEmbed } from "./YouTubeEmbed";

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href) {
      const videoId = extractYouTubeId(href);
      if (videoId) {
        return <YouTubeEmbed videoId={videoId} />;
      }
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-partselect-teal underline decoration-partselect-teal/30 underline-offset-2 transition hover:decoration-partselect-teal"
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? "Part image"}
      className="my-3 max-h-64 w-full rounded-xl border border-partselect-gray-200 bg-white object-contain p-2 shadow-sm"
      loading="lazy"
    />
  ),
  p: ({ children }) => (
    <p className="mb-2.5 leading-relaxed last:mb-0">{children}</p>
  ),
  ol: ({ children }) => (
    <ol className="mb-2.5 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-partselect-teal">
      {children}
    </ol>
  ),
  ul: ({ children }) => (
    <ul className="mb-2.5 list-disc space-y-1.5 pl-5 marker:text-partselect-teal">
      {children}
    </ul>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-partselect-gray-900">{children}</strong>
  ),
  h1: ({ children }) => (
    <h3 className="mb-2 mt-1 text-base font-semibold text-partselect-gray-900">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 mt-1 text-base font-semibold text-partselect-gray-900">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mb-2 mt-1 text-sm font-semibold text-partselect-gray-900">{children}</h4>
  ),
  hr: () => <hr className="my-3 border-partselect-gray-200" />,
  code: ({ children }) => (
    <code className="rounded-md bg-partselect-gray-100 px-1.5 py-0.5 text-[0.8em] font-medium text-partselect-gray-900">
      {children}
    </code>
  ),
};

type Props = {
  content: string;
  variant?: "user" | "assistant";
};

export function ChatMessageContent({ content, variant = "assistant" }: Props) {
  if (variant === "user") {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>;
  }

  const markdown = preprocessAssistantMarkdown(content);

  return (
    <div className="chat-markdown text-[0.92rem] leading-relaxed text-partselect-gray-900">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
