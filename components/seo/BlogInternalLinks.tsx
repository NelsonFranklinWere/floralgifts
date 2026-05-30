import Link from "next/link";
import type { BlogPost } from "@/lib/blogData";
import { getBlogInternalLinks, linkHref } from "@/lib/seo/blog-recommendations";

interface BlogInternalLinksProps {
  post: BlogPost;
}

/**
 * Injects contextual internal product/collection links into informational blog posts.
 * 100% editorial — recommends relevant shop pages based on post tags & title.
 */
export default function BlogInternalLinks({ post }: BlogInternalLinksProps) {
  const links = getBlogInternalLinks(post);
  if (links.length === 0) return null;

  return (
    <aside
      className="mt-10 md:mt-12 rounded-xl border border-brand-gray-200 bg-brand-gray-50 p-6 md:p-8"
      aria-label="Recommended products"
    >
      <h2 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-4">
        Shop related gifts
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.slug + link.name}>
            <Link
              href={linkHref(link)}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-white border border-brand-gray-200 px-4 py-3 hover:border-brand-red hover:shadow-sm transition-all"
            >
              <span className="font-medium text-brand-gray-900 group-hover:text-brand-red transition-colors">
                {link.name}
              </span>
              <span className="text-sm text-brand-gray-500">{link.reason} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
