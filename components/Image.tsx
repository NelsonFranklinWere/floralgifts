"use client";

import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

export default function Image({ src, alt, ...props }: ImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="bg-brand-gray-100 flex items-center justify-center aspect-square rounded-lg">
        <span className="text-brand-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt || "Product image"}
      onError={() => setError(true)}
      {...props}
    />
  );
}

