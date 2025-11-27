import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getBlogPost, getBlogPosts } from "@/lib/blogData";
import { markdownToHtml } from "@/lib/markdown";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Floral Whispers Gifts Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      siteName: "Floral Whispers Gifts",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_KE",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${baseUrl}${post.image}`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Floral Whispers Gifts",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo/FloralLogo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <article className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-brand-gray-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-brand-gray-600">
              <Link href="/" className="hover:text-brand-green transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-brand-green transition-colors">
                Blog
              </Link>
              <span>/</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4 md:mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-brand-gray-600 mb-8">
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </time>
          </div>

          {/* Article Image */}
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-brand-gray-100 mb-8 md:mb-12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-brand-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline prose-strong:text-brand-gray-900 prose-strong:font-semibold prose-ul:text-brand-gray-700 prose-ol:text-brand-gray-700 prose-li:text-brand-gray-700 prose-li:mb-2 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-6 prose-ol:ml-6"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-brand-gray-200">
              <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-4">
                Explore more
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-brand-gray-100 hover:bg-brand-green hover:text-white text-brand-gray-700 text-sm rounded-md transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-brand-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-brand-green font-medium hover:gap-2 transition-all group"
            >
              <svg
                className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
