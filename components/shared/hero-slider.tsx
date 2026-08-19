"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/lib/constants/media";

interface HeroSliderProps {
  slides: HeroSlide[];
  intervalMs?: number;
  className?: string;
  /** Overlay content (headline, copy, CTAs) rendered once above every slide. */
  children?: React.ReactNode;
}

export function HeroSlider({ slides, intervalMs = 6000, className, children }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1 || reducedMotionRef.current) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, intervalMs]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="SKAFF ACADEMY highlights"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Static navy overlay for text readability — applied once, not per-slide. */}
      <div className="absolute inset-0 bg-navy/80" aria-hidden="true" />

      <div className="relative z-10">{children}</div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute top-1/2 left-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:left-5"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute top-1/2 right-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-5"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "size-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                  index === activeIndex ? "w-5 bg-white" : "bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
