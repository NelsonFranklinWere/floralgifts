import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blogData";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block ${featured ? "md:col-span-2" : ""}`}
    >
      <article className="card h-full overflow-hidden hover:shadow-cardHover transition-all duration-300">
        <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden`}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            loading="lazy"
            quality={85}
          />
          {post.featured && (
            <div className="absolute top-4 left-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-brand-gray-900">
            {post.category}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-brand-gray-600 mb-3">
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </time>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
          <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-3 group-hover:text-brand-green transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-brand-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-brand-gray-100 text-brand-gray-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center text-brand-green font-medium group-hover:gap-2 transition-all">
            Read more
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
          </div>
        </div>
      </article>
    </Link>
  );
}

