type Props = {
  videoId: string;
  title?: string;
};

export function YouTubeEmbed({ videoId, title = "Installation video" }: Props) {
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-partselect-gray-200 bg-black shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
