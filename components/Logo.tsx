import React from "react";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/images/logo/FloralLogo.jpg"
        alt="Floral Whispers Gifts"
        width={60}
        height={60}
        className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0"
        priority
        unoptimized={true}
      />
      <span className="font-[var(--font-dancing)] text-black text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
        Floral Whispers Gifts
      </span>
    </div>
  );
}

