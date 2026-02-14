"use client";

import { useRef, useEffect } from "react";

export default function ProductSlideshow({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const viewH = window.innerHeight;

      // How far the track top has scrolled past the viewport bottom
      const entered = viewH - rect.top;
      const totalTravel = viewH + rect.height;
      const progress = Math.max(0, Math.min(1, entered / totalTravel));

      // Scroll the inner container horizontally based on scroll progress
      const inner = track.firstElementChild as HTMLElement;
      if (!inner) return;
      const maxScroll = inner.scrollWidth - track.clientWidth;
      inner.style.transform = `translateX(-${progress * maxScroll}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mt-8 pb-20">
      <div
        ref={trackRef}
        className="relative overflow-hidden"
      >
        <div className="flex gap-4 px-10 transition-transform duration-100 ease-out will-change-transform sm:px-12 md:px-14 lg:px-20">
          {images.map((src, i) => (
            <div
              key={i}
              className="h-[50vh] min-h-[320px] w-[70vw] flex-shrink-0 overflow-hidden bg-surface sm:w-[45vw] md:w-[35vw]"
            >
              <img
                src={src}
                alt={`${name} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
