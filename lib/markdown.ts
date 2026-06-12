export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

/** Turn bare image / YouTube URLs into markdown the renderer can embed. */
export function preprocessAssistantMarkdown(content: string): string {
  let text = content;

  text = text.replace(
    /(?<!\]\()(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s<>"']+)(?!\))/gi,
    (url) => `[Watch installation video](${url})`,
  );

  text = text.replace(
    /(?<!\]\()(https?:\/\/[^\s<>"']+\.(?:png|jpe?g|webp|gif)(?:\?[^\s<>"']*)?)(?!\))/gi,
    (url) => `![Part image](${url})`,
  );

  return text;
}
