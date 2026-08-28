import { Bookmark, Share2, Youtube } from "lucide-react";
import type { Clip } from "@/types/clip";
import { copyToClipboard, formatCount, fullTalkUrl } from "@/lib/clip-utils";
import { toast } from "sonner";

interface Props {
  clip: Clip;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export function ActionRail({ clip, bookmarked, onToggleBookmark }: Props) {
  const url = fullTalkUrl(clip);

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: clip.title, text: clip.keyTakeaway, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    const ok = await copyToClipboard(url);
    toast(ok ? "Link copied" : "Could not copy link");
  };

  return (
    <div className="pointer-events-auto absolute right-3 bottom-44 z-20 flex flex-col items-center gap-5">
      <button
        onClick={onToggleBookmark}
        aria-label={bookmarked ? "Remove bookmark" : "Save clip"}
        className="flex flex-col items-center gap-1"
      >
        <span className="glass-tile">
          <Bookmark
            className={`size-5 ${bookmarked ? "fill-accent text-accent" : "text-foreground"}`}
          />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {formatCount(clip.savedCount + (bookmarked ? 1 : 0))}
        </span>
      </button>

      <button onClick={share} aria-label="Share clip" className="flex flex-col items-center gap-1">
        <span className="glass-tile">
          <Share2 className="size-5 text-foreground" />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">Share</span>
      </button>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch the full talk"
        className="flex flex-col items-center gap-1"
      >
        <span className="glass-tile glass-tile-accent">
          <Youtube className="size-5 text-primary-foreground" />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">Full talk</span>
      </a>
    </div>
  );
}
