"use client";

import { useRef, useState, useEffect } from "react";
import type { Review } from "@/lib/reviews";
import ReviewCard from "./ReviewCard";

type Props = {
  reviews: Review[];
  /** Full loop duration in ms — higher = slower, smoother scroll */
  durationMs?: number;
};

export default function ReviewsCarousel({ reviews, durationMs = 55000 }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Two identical halves so -50% translate loops seamlessly (right → left)
  const duplicated = [...reviews, ...reviews];

  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  const pause = () => setPaused(true);

  const scheduleResume = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 2500);
  };

  const animationDurationSec = durationMs / 1000;

  return (
    <div className="overflow-hidden" aria-label="Google reviews carousel">
      <div
        ref={trackRef}
        className={`reviews-marquee-track py-3 pl-4${paused ? " reviews-marquee-paused" : ""}`}
        style={{ animationDuration: `${animationDurationSec}s` }}
        onMouseEnter={pause}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onFocus={pause}
        onBlur={() => setPaused(false)}
      >
        {duplicated.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}
