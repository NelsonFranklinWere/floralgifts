import React from "react";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/logo/FloralLogo.jpg"
      alt="Floral Whispers & Gifts"
      width={200}
      height={100}
      className={className}
      priority
    />
  );
}

