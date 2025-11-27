"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "Floral Whispers Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "",
    category: "",
    tags: "",
    readTime: 5,
    featured: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Convert date to ISO string format
      const publishedAtISO = formData.publishedAt 
        ? new Date(formData.publishedAt).toISOString()
        : new Date().toISOString();

      const payload = {
        ...formData,
        publishedAt: publishedAtISO,
        tags: tagsArray,
        readTime: parseInt(String(formData.readTime)),
      };

      if (editingPost) {
        await axios.put(`/api/admin/blogs/${editingPost.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/admin/blogs", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      alert(error.response?.data?.message || "Failed to save blog post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publishedAt: post.published_at.split("T")[0],
      image: post.image,
      category: post.category,
      tags: post.tags.join(", "),
      readTime: post.read_time,
      featured: post.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete blog post");
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      author: "Floral Whispers Team",
      publishedAt: new Date().toISOString().split("T")[0],
      image: "",
      category: "",
      tags: "",
      readTime: 5,
      featured: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green">
                ← Back to Dashboard
              </Link>
              <h1 className="font-heading font-bold text-xl text-brand-gray-900">Manage Blog Posts</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingPost(null);
                resetForm();
              }}
              className="btn-primary"
            >
              + New Post
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="font-heading font-bold text-xl mb-4">
              {editingPost ? "Edit Blog Post" : "New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="input-field"
                    placeholder="blog-post-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Delivery, Gift Ideas, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows={3}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Content * (Markdown supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={15}
                  className="input-field font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="input-field"
                  placeholder="/images/products/flowers/BouquetFlowers1.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                  placeholder="nairobi, flowers, delivery"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-brand-gray-900">
                  Featured Post
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingPost ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-brand-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 overflow-hidden rounded-md">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-brand-gray-900">{post.title}</div>
                      <div className="text-sm text-brand-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-brand-gray-100 text-brand-gray-800 rounded">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">
                      {format(new Date(post.published_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.featured ? (
                        <span className="px-2 py-1 text-xs font-medium bg-brand-red text-white rounded">
                          Featured
                        </span>
                      ) : (
                        <span className="text-brand-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-brand-green hover:text-brand-green/80"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleEdit(post)}
                          className="text-brand-green hover:text-brand-green/80"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          className="text-brand-red hover:text-brand-red/80"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

