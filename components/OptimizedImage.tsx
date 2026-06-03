"use client";

import Image, { type ImageProps } from "next/image";
import {
  getOptimizedProductImageUrl,
  shouldBypassNextImageOptimizer,
  type ProductImageVariant,
} from "@/lib/product-image-url";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string;
  variant?: ProductImageVariant;
  fit?: "contain" | "cover";
};

function mergeFitClass(
  className: string | undefined,
  fill?: boolean,
  fit: "contain" | "cover" = "contain"
): string | undefined {
  if (
    !fill ||
    className?.includes("object-") ||
    className?.includes("img-frame-fit")
  ) {
    return className;
  }
  const fitClass = fit === "cover" ? "object-cover object-center" : "img-frame-fit";
  return className ? `${fitClass} ${className}` : fitClass;
}

/** Next/Image with Supabase CDN resizing — no double optimization on the app server. */
export default function OptimizedImage({
  src,
  variant = "card",
  fit = "cover",
  unoptimized,
  className,
  fill,
  decoding = "async",
  ...props
}: OptimizedImageProps) {
  if (!src) return null;

  const isLocal = src.startsWith("/");
  const resolved = isLocal ? src : getOptimizedProductImageUrl(src, variant);
  const bypass = unoptimized ?? (!isLocal && shouldBypassNextImageOptimizer(resolved));

  return (
    <Image
      src={resolved}
      unoptimized={bypass}
      className={mergeFitClass(className, fill, fit)}
      fill={fill}
      decoding={decoding}
      {...props}
    />
  );
}
