import { useEffect, useRef, useState } from "react";

/**
 * Tracks which slide inside a scroll container is currently active.
 */
export function useActiveIndex(count: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset["index"]);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root, threshold: [0.6] },
    );

    slideRefs.current.slice(0, count).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setSlideRef = (index: number) => (el: HTMLElement | null) => {
    slideRefs.current[index] = el;
  };

  return { containerRef, setSlideRef, activeIndex, setActiveIndex };
}
