import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { CategoryPills } from "@/components/CategoryPills";
import { VideoSlide } from "@/components/VideoSlide";
import { useActiveIndex } from "@/hooks/useIntersection";
import { seedClips } from "@/data/seedClips";
import { readBookmarks, writeBookmarks } from "@/lib/clip-utils";
import type { Category } from "@/types/clip";

export const Route = createFileRoute("/")({
  component: Feed,
  head: () => ({
    meta: [
      { title: "Scroll_Tedz — 40-second TED insights, one swipe at a time" },
      {
        name: "description",
        content:
          "A vertical snap feed of curated 30-50 second TED Talk moments. Swipe big ideas, save takeaways, jump to the full talk.",
      },
      { property: "og:title", content: "Scroll_Tedz — TED insights in 40 seconds" },
      {
        property: "og:description",
        content: "Turn scrolling downtime into micro-learning with curated TED clips.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Feed() {
  const [filter, setFilter] = useState<Category | "All" | "Saved">("All");
  const [muted, setMuted] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(readBookmarks());
  }, []);

  const clips = useMemo(() => {
    if (filter === "All") return seedClips;
    if (filter === "Saved") return seedClips.filter((c) => bookmarks.includes(c.id));
    return seedClips.filter((c) => c.category === filter);
  }, [filter, bookmarks]);

  const { containerRef, setSlideRef, activeIndex, setActiveIndex } = useActiveIndex(clips.length);

  useEffect(() => {
    setActiveIndex(0);
    containerRef.current?.scrollTo({ top: 0 });
  }, [filter, setActiveIndex, containerRef]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeBookmarks(next);
      return next;
    });
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center justify-between px-4">
          <span className="text-sm font-black tracking-[0.2em] text-accent uppercase">
            Scroll<span className="text-foreground">_Tedz</span>
          </span>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute feed" : "Mute feed"}
            className="glass-tile"
          >
            {muted ? (
              <VolumeX className="size-5 text-foreground" />
            ) : (
              <Volume2 className="size-5 text-accent" />
            )}
          </button>
        </div>
        <div className="pointer-events-auto mt-2">
          <CategoryPills value={filter} onChange={setFilter} />
        </div>
      </header>

      {clips.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
          <h1 className="text-lg font-bold text-foreground">Nothing saved yet</h1>
          <p className="text-sm text-muted-foreground">
            Tap the bookmark icon on a clip to keep it here for later.
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="no-scrollbar h-[100dvh] snap-y snap-mandatory overflow-y-scroll overscroll-y-contain"
        >
          {clips.map((clip, index) => (
            <div key={clip.id} data-index={index} ref={setSlideRef(index)}>
              <VideoSlide
                clip={clip}
                active={index === activeIndex}
                muted={muted}
                mounted={Math.abs(index - activeIndex) <= 1}
                bookmarked={bookmarks.includes(clip.id)}
                onToggleBookmark={() => toggleBookmark(clip.id)}
                onRequestUnmute={() => setMuted((m) => !m)}
              />
            </div>
          ))}
        </div>
      )}

      <h1 className="sr-only">Scroll_Tedz: swipeable TED Talk insight clips</h1>
      <Toaster position="top-center" />
    </main>
  );
}
