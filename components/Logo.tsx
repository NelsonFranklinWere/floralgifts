import React from "react";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${className}`}>
      <Image
        src="/images/logo/FloralLogo.jpg"
        alt="Floral Whispers Gifts"
        width={48}
        height={48}
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain flex-shrink-0"
        priority
      />
      <span className="font-[var(--font-dancing)] text-black text-sm sm:text-base md:text-lg font-semibold leading-none whitespace-nowrap">
        Floral Whispers Gifts
      </span>
    </div>
  );
}
