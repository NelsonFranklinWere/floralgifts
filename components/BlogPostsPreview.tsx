import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/blogData";
import { format } from "date-fns";

export default async function BlogPostsPreview() {
  const posts = await getBlogPosts();
  const latestPosts = posts.slice(0, 3);

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {latestPosts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="card overflow-hidden group hover:shadow-cardHover transition-all duration-300"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              quality={85}
            />
          </div>
          <div className="p-6">
            <div className="text-xs text-brand-gray-500 mb-2">
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </div>
            <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-brand-gray-600 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <span className="text-brand-green font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

