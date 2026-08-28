import { useYouTubeLoop } from "@/hooks/useYouTubeLoop";
import { formatDuration } from "@/lib/clip-utils";
import type { Clip } from "@/types/clip";
import { ActionRail } from "./ActionRail";
import { Quote } from "lucide-react";

interface Props {
  clip: Clip;
  active: boolean;
  muted: boolean;
  mounted: boolean;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onRequestUnmute: () => void;
}

function Player({
  clip,
  active,
  muted,
}: {
  clip: Clip;
  active: boolean;
  muted: boolean;
}) {
  const { hostRef } = useYouTubeLoop({
    youtubeId: clip.youtubeId,
    startSeconds: clip.startSeconds,
    endSeconds: clip.endSeconds,
    active,
    muted,
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="yt-stage">
        <div ref={hostRef} className="pointer-events-none size-full" />
      </div>
    </div>
  );

}

export function VideoSlide({
  clip,
  active,
  muted,
  mounted,
  bookmarked,
  onToggleBookmark,
  onRequestUnmute,
}: Props) {
  return (
    <section className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-background">
      {mounted ? (
        <Player clip={clip} active={active} muted={muted} />
      ) : (
        <div className="absolute inset-0 bg-secondary" />
      )}

      <button
        aria-label="Toggle sound"
        onClick={onRequestUnmute}
        className="absolute inset-0 z-10 cursor-default"
      />

      <div className="slide-scrim pointer-events-none absolute inset-0 z-10" />

      <ActionRail clip={clip} bookmarked={bookmarked} onToggleBookmark={onToggleBookmark} />

      <div className="absolute right-0 bottom-0 left-0 z-20 px-4 pb-10">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-accent uppercase">
          <span>{clip.category}</span>
          <span className="text-muted-foreground">
            · {formatDuration(clip.endSeconds - clip.startSeconds)}
          </span>
        </div>
        <h2 className="mt-2 text-lg leading-tight font-bold text-foreground">{clip.speaker}</h2>
        <p className="text-sm text-muted-foreground">
          {clip.speakerTitle ? `${clip.speakerTitle} · ` : ""}
          {clip.title}
        </p>
        <div className="quote-card mt-3">
          <Quote className="size-4 shrink-0 text-accent" />
          <p className="text-[13px] leading-snug font-medium text-foreground">{clip.keyTakeaway}</p>
        </div>
      </div>
    </section>
  );
}
