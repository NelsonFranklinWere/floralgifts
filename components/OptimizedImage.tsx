"use client";

import type { CSSProperties, ImgHTMLAttributes } from "react";
import {
  getOptimizedProductImageUrl,
  type ProductImageVariant,
} from "@/lib/product-image-url";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  variant?: ProductImageVariant;
  fit?: "contain" | "cover";
  fill?: boolean;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  quality?: number;
  placeholder?: "blur";
  blurDataURL?: string;
};

function mergeFitClass(
  className: string | undefined,
  fill?: boolean,
  fit: "contain" | "cover" = "cover"
): string {
  const fitClass = fit === "cover" ? "object-cover object-center" : "img-frame-fit";
  if (!fill) return className ? `${fitClass} ${className}` : fitClass;
  if (className?.includes("object-") || className?.includes("img-frame-fit")) {
    return className;
  }
  return className ? `${fitClass} ${className}` : fitClass;
}

/** Native <img> + Supabase CDN WebP — no Next.js image optimizer (zero server CPU). */
export default function OptimizedImage({
  src,
  variant = "card",
  fit = "cover",
  className,
  fill,
  priority,
  fetchPriority,
  decoding = "async",
  style,
  alt = "",
  ...props
}: OptimizedImageProps) {
  if (!src) return null;

  const resolved = src.startsWith("/") ? src : getOptimizedProductImageUrl(src, variant);
  const classes = mergeFitClass(className, fill, fit);

  const imgStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : (style ?? {});

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={classes}
      style={imgStyle}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      decoding={decoding}
      {...props}
    />
  );
}
