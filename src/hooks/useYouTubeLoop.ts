import { useEffect, useRef } from "react";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  getCurrentTime: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

function loadYouTubeApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

interface Options {
  youtubeId: string;
  startSeconds: number;
  endSeconds: number;
  active: boolean;
  muted: boolean;
}

/**
 * Mounts a YouTube player into a container and keeps playback looping
 * strictly between startSeconds and endSeconds.
 */
export function useYouTubeLoop({
  youtubeId,
  startSeconds,
  endSeconds,
  active,
  muted,
}: Options) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let disposed = false;
    let interval: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi()
      .then((YT) => {
        if (disposed || !hostRef.current) return;
        const player: YTPlayer = new YT.Player(hostRef.current, {
          videoId: youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            start: startSeconds,
          },
          events: {
            onReady: () => {
              readyRef.current = true;
              player.mute();
              player.seekTo(startSeconds, true);
            },
          },
        });
        playerRef.current = player;

        interval = setInterval(() => {
          if (!readyRef.current || !playerRef.current) return;
          try {
            const t = playerRef.current.getCurrentTime();
            if (t >= endSeconds - 0.15 || t < startSeconds - 1) {
              playerRef.current.seekTo(startSeconds, true);
            }
          } catch {
            /* player not ready */
          }
        }, 250);
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      if (interval) clearInterval(interval);
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      readyRef.current = false;
    };
  }, [youtubeId, startSeconds, endSeconds]);

  useEffect(() => {
    const tick = setInterval(() => {
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      try {
        if (active) {
          if (muted) player.mute();
          else {
            player.unMute();
            player.setVolume(100);
          }
          player.playVideo();
        } else {
          player.pauseVideo();
          player.seekTo(startSeconds, true);
        }
      } catch {
        /* noop */
      }
      clearInterval(tick);
    }, 60);
    return () => clearInterval(tick);
  }, [active, muted, startSeconds]);

  return { hostRef };
}
