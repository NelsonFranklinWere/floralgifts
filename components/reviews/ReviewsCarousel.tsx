"use client";

import { useRef, useState, useEffect } from "react";
import type { Review } from "@/lib/reviews";
import ReviewCard from "./ReviewCard";

type Props = {
  reviews: Review[];
  durationMs?: number;
};

export default function ReviewsCarousel({ reviews, durationMs = 40000 }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [styleReady, setStyleReady] = useState(false);

  const duplicated = [...reviews, ...reviews];

  useEffect(() => {
    // Avoid mismatch between SSR and client
    setStyleReady(true);
  }, []);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => !touching && setPaused(false);

  let resumeTimeout: NodeJS.Timeout | null = null;

  const clearResumeTimeout = () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
  };

  const handleTouchStart = () => {
    setTouching(true);
    setPaused(true);
    clearResumeTimeout();
  };

  const handleTouchEnd = () => {
    setTouching(false);
    clearResumeTimeout();
    resumeTimeout = setTimeout(() => {
      setPaused(false);
    }, 3000);
  };

  const animationDurationSec = durationMs / 1000;

  return (
    <section className="bg-[#FAF7F2]">
      {styleReady && (
        <style jsx global>{`
          @keyframes reviews-scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      )}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 py-3"
          style={
            styleReady
              ? {
                  width: "max-content",
                  animationName: "reviews-scroll-left",
                  animationDuration: `${animationDurationSec}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationPlayState: paused ? "paused" : "running",
                }
              : undefined
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {duplicated.map((review, index) => (
            <ReviewCard
              key={`${review.id}-${index}`}
              review={review}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

